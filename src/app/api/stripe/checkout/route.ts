import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, PRODUCTS, PLANS } from "@/lib/stripe";
import { getProduct } from "@/lib/products";
import type { Profile } from "@/types/database";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  const { productId, plan, successUrl, cancelUrl } = (await request.json()) as {
    productId?: string;
    plan?: string;
    successUrl?: string;
    cancelUrl?: string;
  };

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();
  const profile = data as Profile | null;

  // Get or create Stripe customer
  let customerId = profile?.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { user_id: user.id },
    });
    customerId = customer.id;
    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("user_id", user.id);
  }

  // One-time product purchase
  if (productId) {
    // Try DB first, then fallback to hardcoded
    const dbProduct = await getProduct(productId);
    const hardcoded = PRODUCTS[productId as keyof typeof PRODUCTS];

    const productName = dbProduct?.name ?? hardcoded?.name;
    const productPrice = dbProduct?.price ?? hardcoded?.price;
    const stripePriceId = dbProduct?.stripe_price_id;

    if (!productName || productPrice === undefined) {
      return NextResponse.json({ error: "Ungültiges Produkt" }, { status: 400 });
    }

    // Use stored Stripe Price ID if available, otherwise inline price_data
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
      customer: customerId,
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [lineItem],
      metadata: { user_id: user.id, product_id: productId },
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success&product=${productId}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/produkte`,
      locale: "de",
    });
    return NextResponse.json({ url: session.url });
  }

  // Subscription purchase (VIP Community)
  if (plan && (plan === "monthly" || plan === "yearly")) {
    const selectedPlan = PLANS[plan as keyof typeof PLANS];
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `traveling.prof VIP Community - ${selectedPlan.name}`,
              description: "Exklusive Travel Hacks, Community-Zugang, monatliche Calls",
            },
            unit_amount: selectedPlan.price,
            recurring: { interval: selectedPlan.interval },
          },
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: { user_id: user.id, plan },
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/einstellungen`,
      locale: "de",
    });
    return NextResponse.json({ url: session.url });
  }

  return NextResponse.json({ error: "Ungültiges Produkt" }, { status: 400 });
}
