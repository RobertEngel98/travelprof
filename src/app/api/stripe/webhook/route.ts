import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/* eslint-disable @typescript-eslint/no-explicit-any */

function getSupabaseAdmin() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

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

  switch (event.type) {
    // One-time payment completed
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata?.user_id;
      if (!userId) break;

      // Handle subscription checkout
      if (session.subscription) {
        const sub = await stripe.subscriptions.retrieve(
          session.subscription as string
        ) as any;

        await getSupabaseAdmin().from("subscriptions").upsert({
          user_id: userId,
          stripe_subscription_id: sub.id,
          stripe_customer_id: sub.customer as string,
          status: sub.status,
          plan: (sub.metadata.plan as string) ?? "monthly",
          current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
          current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
          cancel_at_period_end: sub.cancel_at_period_end,
        }, { onConflict: "user_id" });

        await getSupabaseAdmin()
          .from("profiles")
          .update({
            subscription_status: sub.status === "trialing" ? "trial" : "active",
            subscription_plan: (sub.metadata.plan as string) ?? "monthly",
          })
          .eq("user_id", userId);
        break;
      }

      // Handle one-time product purchase
      const productId = session.metadata?.product_id;
      if (productId) {
        await getSupabaseAdmin().from("purchases").insert({
          user_id: userId,
          product_id: productId,
          product_name: productId,
          amount: session.amount_total ?? 0,
          stripe_payment_id: session.payment_intent as string,
        });
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

      await getSupabaseAdmin().from("subscriptions").upsert({
        user_id: userId,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: subscription.customer as string,
        status: subscription.status,
        plan: (subscription.metadata.plan as string) ?? "monthly",
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
      }, { onConflict: "user_id" });

      await getSupabaseAdmin()
        .from("profiles")
        .update({
          subscription_status: statusMap[subscription.status] ?? "free",
        })
        .eq("user_id", userId);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as any;
      const userId = subscription.metadata.user_id;
      if (!userId) break;

      await getSupabaseAdmin()
        .from("profiles")
        .update({ subscription_status: "free", subscription_plan: null })
        .eq("user_id", userId);

      await getSupabaseAdmin()
        .from("subscriptions")
        .update({ status: "canceled" })
        .eq("stripe_subscription_id", subscription.id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
