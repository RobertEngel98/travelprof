import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { UPSELL_MAP, PRODUCT_NAMES } from "@/lib/upsell-config";
import type { Profile } from "@/types/database";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
    }

    const { productId, amount } = (await request.json()) as {
      productId: string;
      amount: number; // in cents
    };

    if (!productId || !amount) {
      return NextResponse.json({ error: "Ungültige Anfrage" }, { status: 400 });
    }

    // Verify the productId is a valid upsell/downsell target
    const isValidTarget = Object.values(UPSELL_MAP).some(
      (entry) =>
        entry.upsell.productId === productId ||
        entry.downsell?.productId === productId
    );

    if (!isValidTarget) {
      return NextResponse.json({ error: "Ungültiges Upsell-Produkt" }, { status: 400 });
    }

    // Get stripe customer ID from profile
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();
    const profile = data as Profile | null;

    if (!profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: "Kein Zahlungsprofil gefunden" },
        { status: 400 }
      );
    }

    // Get saved payment methods
    const paymentMethods = await stripe.paymentMethods.list({
      customer: profile.stripe_customer_id,
      type: "card",
    });

    if (!paymentMethods.data.length) {
      // No saved card (e.g. 100% promo code purchase) → fallback to regular checkout
      const productName = PRODUCT_NAMES[productId] || productId;
      const fallbackSession = await stripe.checkout.sessions.create({
        customer: profile.stripe_customer_id,
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [{
          price_data: {
            currency: "eur",
            product_data: { name: productName },
            unit_amount: amount,
          },
          quantity: 1,
        }],
        metadata: { user_id: user.id, product_id: productId, type: "upsell" },
        payment_intent_data: {
          setup_future_usage: "off_session",
        },
        allow_promotion_codes: true,
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success&upsell=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success&product=true`,
        locale: "de",
      });

      return NextResponse.json({ fallback: true, checkoutUrl: fallbackSession.url });
    }

    const defaultPM = paymentMethods.data[0];

    // Create one-click charge
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "eur",
      customer: profile.stripe_customer_id,
      payment_method: defaultPM.id,
      off_session: true,
      confirm: true,
      description: `Upsell: ${PRODUCT_NAMES[productId] || productId}`,
      metadata: {
        user_id: user.id,
        product_id: productId,
        type: "upsell",
      },
    });

    if (paymentIntent.status === "succeeded") {
      // Insert purchase record
      const admin = getSupabaseAdmin();
      await admin.from("purchases").insert({
        user_id: user.id,
        product_id: productId,
        product_name: PRODUCT_NAMES[productId] || productId,
        amount,
        stripe_payment_id: paymentIntent.id,
        status: "completed",
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Zahlung konnte nicht abgeschlossen werden" },
      { status: 400 }
    );
  } catch (err: unknown) {
    // Handle authentication_required error (3D Secure needed)
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code: string }).code === "authentication_required"
    ) {
      return NextResponse.json(
        {
          error:
            "Deine Bank benötigt eine zusätzliche Bestätigung. Bitte schließe den Kauf über die reguläre Checkout-Seite ab.",
          requiresAuth: true,
        },
        { status: 402 }
      );
    }

    const message = err instanceof Error ? err.message : String(err);
    console.error("[One-Click] Error:", message, err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
