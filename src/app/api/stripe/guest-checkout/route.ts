import { NextResponse } from "next/server";
import { stripe, PRODUCTS } from "@/lib/stripe";
import { getProduct } from "@/lib/products";

/**
 * Guest checkout – no auth required.
 * Creates a Stripe Checkout session for non-logged-in users.
 * After payment, user is redirected to /register to create an account
 * and claim their purchase.
 */
export async function POST(request: Request) {
  try {
    const { productId } = (await request.json()) as { productId?: string };

    if (!productId) {
      return NextResponse.json({ error: "Kein Produkt angegeben" }, { status: 400 });
    }

    // Resolve product from DB or fallback
    const dbProduct = await getProduct(productId);
    const hardcoded = PRODUCTS[productId as keyof typeof PRODUCTS];

    const productName = dbProduct?.name ?? hardcoded?.name;
    const productPrice = dbProduct?.price ?? hardcoded?.price;
    const stripePriceId = dbProduct?.stripe_price_id;

    if (!productName || productPrice === undefined) {
      return NextResponse.json({ error: "Ungültiges Produkt" }, { status: 400 });
    }

    const lineItem = stripePriceId
      ? { price: stripePriceId, quantity: 1 }
      : {
          price_data: {
            currency: "eur",
            product_data: { name: productName },
            unit_amount: productPrice,
          },
          quantity: 1,
        };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [lineItem],
      metadata: {
        product_id: productId,
        source: "guest",
      },
      payment_intent_data: {
        setup_future_usage: "off_session",
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/register?from=checkout&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/#produkte`,
      locale: "de",
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Guest Checkout] Error:", message, err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
