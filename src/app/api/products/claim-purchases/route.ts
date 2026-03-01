import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, PRODUCTS } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

/**
 * Claim a guest purchase after registration.
 * Verifies the Stripe session, checks payment status,
 * and creates a purchase record for the authenticated user.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
    }

    const { sessionId } = (await request.json()) as { sessionId?: string };

    if (!sessionId) {
      return NextResponse.json({ error: "Keine Session-ID" }, { status: 400 });
    }

    // Retrieve the Stripe Checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Zahlung nicht abgeschlossen" },
        { status: 400 }
      );
    }

    const productId = session.metadata?.product_id;
    if (!productId) {
      return NextResponse.json(
        { error: "Kein Produkt in Session gefunden" },
        { status: 400 }
      );
    }

    const admin = getSupabaseAdmin();

    // Check if purchase already exists (idempotency)
    const { data: existing } = await admin
      .from("purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("stripe_payment_id", session.payment_intent as string)
      .single();

    if (existing) {
      return NextResponse.json({ success: true, already_claimed: true });
    }

    // Resolve product name
    const { data: dbProduct } = await admin
      .from("products")
      .select("name")
      .eq("id", productId)
      .single();

    let productName = dbProduct?.name ?? productId;
    if (!dbProduct?.name && PRODUCTS[productId as keyof typeof PRODUCTS]) {
      productName = PRODUCTS[productId as keyof typeof PRODUCTS].name;
    }

    // Link Stripe customer to profile if not yet linked
    if (session.customer) {
      await admin
        .from("profiles")
        .update({ stripe_customer_id: session.customer as string })
        .eq("user_id", user.id)
        .is("stripe_customer_id", null);
    }

    // Create purchase record
    await admin.from("purchases").insert({
      user_id: user.id,
      product_id: productId,
      product_name: productName,
      amount: session.amount_total ?? 0,
      stripe_payment_id: session.payment_intent as string,
      status: "completed",
    });

    return NextResponse.json({ success: true, productId });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Claim Purchase] Error:", message, err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
