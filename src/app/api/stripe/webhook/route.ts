import { NextResponse } from "next/server";
import { stripe, PRODUCTS } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { sendPurchaseConfirmation, sendSubscriptionConfirmation } from "@/lib/email";
import { PRODUCT_NAMES } from "@/lib/upsell-config";

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();

  switch (event.type) {
    // One-time payment completed
    case "checkout.session.completed": {
      const session = event.data.object;
      let userId = session.metadata?.user_id;

      // Guest checkout: try to find user by email
      if (!userId && session.metadata?.source === "guest") {
        const customerEmail = session.customer_details?.email ?? session.customer_email;
        if (customerEmail) {
          const { data: profileByEmail } = await admin
            .from("profiles")
            .select("user_id")
            .eq("email", customerEmail)
            .single();
          if (profileByEmail?.user_id) {
            userId = profileByEmail.user_id;
          }
        }
        // If still no userId, skip – purchase will be claimed after registration
        if (!userId) break;
      }
      if (!userId) break;

      // Handle subscription checkout
      if (session.subscription) {
        const sub = await stripe.subscriptions.retrieve(
          session.subscription as string
        ) as any;

        await admin.from("subscriptions").upsert({
          user_id: userId,
          stripe_subscription_id: sub.id,
          stripe_customer_id: sub.customer as string,
          status: sub.status,
          plan: (sub.metadata.plan as string) ?? "monthly",
          current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
          current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
          cancel_at_period_end: sub.cancel_at_period_end,
        }, { onConflict: "user_id" });

        await admin
          .from("profiles")
          .update({
            subscription_status: sub.status === "trialing" ? "trial" : "active",
            subscription_plan: (sub.metadata.plan as string) ?? "monthly",
          })
          .eq("user_id", userId);

        // Send subscription confirmation email
        const subEmail = session.customer_details?.email ?? session.customer_email;
        if (subEmail) {
          const { data: subProfile } = await admin
            .from("profiles")
            .select("full_name")
            .eq("user_id", userId)
            .single();
          sendSubscriptionConfirmation({
            email: subEmail,
            plan: (sub.metadata.plan as string) ?? "monthly",
            userName: subProfile?.full_name ?? undefined,
          }).catch((err: unknown) => console.error("[Email] Failed to send subscription email:", err));
        }
        break;
      }

      // Handle one-time product purchase
      const productId = session.metadata?.product_id;
      if (productId) {
        // Skip if already purchased (prevents duplicates from webhook retries)
        const { data: existingPurchase } = await admin
          .from("purchases")
          .select("id")
          .eq("user_id", userId)
          .eq("product_id", productId)
          .maybeSingle();

        if (existingPurchase) break;

        // Try to get product name from DB, then fallback to hardcoded
        let productName = productId;
        const { data: dbProduct } = await admin
          .from("products")
          .select("name")
          .eq("id", productId)
          .single();

        if (dbProduct?.name) {
          productName = dbProduct.name;
        } else if (PRODUCTS[productId as keyof typeof PRODUCTS]) {
          productName = PRODUCTS[productId as keyof typeof PRODUCTS].name;
        } else if (PRODUCT_NAMES[productId]) {
          productName = PRODUCT_NAMES[productId];
        }

        await admin.from("purchases").insert({
          user_id: userId,
          product_id: productId,
          product_name: productName,
          amount: session.amount_total ?? 0,
          stripe_payment_id: session.payment_intent as string,
          status: "completed",
        });

        // Send purchase confirmation email
        const customerEmail = session.customer_details?.email ?? session.customer_email;
        if (customerEmail) {
          const { data: profile } = await admin
            .from("profiles")
            .select("full_name")
            .eq("user_id", userId)
            .single();
          sendPurchaseConfirmation({
            email: customerEmail,
            productId,
            userName: profile?.full_name ?? undefined,
          }).catch((err: unknown) => console.error("[Email] Failed to send:", err));
        }
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as any;
      const userId = subscription.metadata.user_id;
      if (!userId) break;

      const statusMap: Record<string, string> = {
        trialing: "trial",
        active: "active",
        canceled: "canceled",
        past_due: "past_due",
        unpaid: "canceled",
      };

      await admin.from("subscriptions").upsert({
        user_id: userId,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: subscription.customer as string,
        status: subscription.status,
        plan: (subscription.metadata.plan as string) ?? "monthly",
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
      }, { onConflict: "user_id" });

      await admin
        .from("profiles")
        .update({
          subscription_status: statusMap[subscription.status] ?? "free",
        })
        .eq("user_id", userId);
      break;
    }

    // Invoice payment failed → mark subscription as past_due
    case "invoice.payment_failed": {
      const invoice = event.data.object as any;
      const customerId = invoice.customer as string;
      if (!customerId) break;

      const { data: profile } = await admin
        .from("profiles")
        .select("user_id")
        .eq("stripe_customer_id", customerId)
        .single();

      if (profile?.user_id) {
        await admin
          .from("profiles")
          .update({ subscription_status: "past_due" })
          .eq("user_id", profile.user_id);

        await admin
          .from("subscriptions")
          .update({ status: "past_due" })
          .eq("stripe_customer_id", customerId);
      }
      break;
    }

    // Invoice paid (e.g. successful retry) → restore active status
    case "invoice.paid": {
      const invoice = event.data.object as any;
      const customerId = invoice.customer as string;
      if (!customerId || !invoice.subscription) break;

      const { data: profile } = await admin
        .from("profiles")
        .select("user_id, subscription_status")
        .eq("stripe_customer_id", customerId)
        .single();

      if (profile?.user_id && profile.subscription_status === "past_due") {
        await admin
          .from("profiles")
          .update({ subscription_status: "active" })
          .eq("user_id", profile.user_id);

        await admin
          .from("subscriptions")
          .update({ status: "active" })
          .eq("stripe_customer_id", customerId);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as any;
      const userId = subscription.metadata.user_id;
      if (!userId) break;

      await admin
        .from("profiles")
        .update({ subscription_status: "free", subscription_plan: null })
        .eq("user_id", userId);

      await admin
        .from("subscriptions")
        .update({ status: "canceled" })
        .eq("stripe_subscription_id", subscription.id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
