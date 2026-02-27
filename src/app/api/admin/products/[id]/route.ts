import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { ADMIN_EMAIL } from "@/lib/admin";
import { stripe } from "@/lib/stripe";
import type { Product } from "@/types/database";

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.email === ADMIN_EMAIL;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Produkt nicht gefunden" }, { status: 404 });
  }

  return NextResponse.json({ product: data });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const admin = getSupabaseAdmin();

  // Get current product
  const { data: currentData } = await admin
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  const current = currentData as Product | null;

  if (!current) {
    return NextResponse.json({ error: "Produkt nicht gefunden" }, { status: 404 });
  }

  // Handle price change - Stripe prices are immutable
  let stripe_price_id = current.stripe_price_id;
  let stripe_product_id = current.stripe_product_id;

  if (body.price !== undefined && body.price !== current.price) {
    try {
      // Ensure Stripe product exists
      if (!stripe_product_id) {
        const stripeProduct = await stripe.products.create({
          name: body.name ?? current.name,
          description: body.description ?? current.description ?? undefined,
          metadata: { travelprof_id: id },
        });
        stripe_product_id = stripeProduct.id;
      } else {
        // Update product name if changed
        if (body.name && body.name !== current.name) {
          await stripe.products.update(stripe_product_id, { name: body.name });
        }
      }

      // Archive old price
      if (current.stripe_price_id) {
        await stripe.prices.update(current.stripe_price_id, { active: false });
      }

      // Create new price
      const productType = body.type ?? current.type;
      const newPrice = await stripe.prices.create({
        product: stripe_product_id,
        unit_amount: body.price,
        currency: "eur",
        ...(productType === "subscription"
          ? { recurring: { interval: "month" } }
          : {}),
      });
      stripe_price_id = newPrice.id;
    } catch (err) {
      console.error("[Stripe] Price update failed:", err);
    }
  } else if (body.name && body.name !== current.name && stripe_product_id) {
    // Name change only - update Stripe product
    try {
      await stripe.products.update(stripe_product_id, { name: body.name });
    } catch (err) {
      console.error("[Stripe] Product name update failed:", err);
    }
  }

  // Build update object
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  const allowedFields = ["name", "description", "icon", "price", "price_display", "type", "content_markdown", "active", "sort_order"];
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      update[field] = body[field];
    }
  }
  if (stripe_price_id !== current.stripe_price_id) {
    update.stripe_price_id = stripe_price_id;
  }
  if (stripe_product_id !== current.stripe_product_id) {
    update.stripe_product_id = stripe_product_id;
  }

  const { data, error } = await admin
    .from("products")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ product: data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const admin = getSupabaseAdmin();

  // Soft delete: set active = false
  const { error } = await admin
    .from("products")
    .update({ active: false, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
