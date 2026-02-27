import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { ADMIN_EMAIL } from "@/lib/admin";
import { stripe } from "@/lib/stripe";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ products: data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id, name, description, icon, price, price_display, type, content_markdown, active, sort_order } = body;

  if (!id || !name || price === undefined) {
    return NextResponse.json({ error: "id, name und price sind Pflichtfelder" }, { status: 400 });
  }

  // Create Stripe product and price
  let stripe_product_id: string | null = null;
  let stripe_price_id: string | null = null;

  try {
    const stripeProduct = await stripe.products.create({
      name,
      description: description ?? undefined,
      metadata: { travelprof_id: id },
    });
    stripe_product_id = stripeProduct.id;

    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: price,
      currency: "eur",
      ...(type === "subscription"
        ? { recurring: { interval: "month" } }
        : {}),
    });
    stripe_price_id = stripePrice.id;
  } catch (err) {
    console.error("[Stripe] Product creation failed:", err);
  }

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("products")
    .insert({
      id,
      name,
      description: description ?? null,
      icon: icon || "📦",
      price,
      price_display: price_display || "0,00",
      type: type || "one_time",
      stripe_product_id,
      stripe_price_id,
      content_markdown: content_markdown ?? null,
      active: active ?? true,
      sort_order: sort_order ?? 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ product: data }, { status: 201 });
}
