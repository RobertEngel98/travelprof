import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";
import { ADMIN_EMAIL } from "@/lib/admin";
import type { Product } from "@/types/database";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = getSupabaseAdmin();
  const { data: products, error: fetchError } = await admin
    .from("products")
    .select("*")
    .order("sort_order");

  if (fetchError || !products) {
    return NextResponse.json({ error: fetchError?.message ?? "Fehler beim Laden" }, { status: 500 });
  }

  let synced = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const row of products as Product[]) {
    // Already fully synced
    if (row.stripe_product_id && row.stripe_price_id) {
      skipped++;
      continue;
    }

    try {
      let stripeProductId = row.stripe_product_id;
      let stripePriceId = row.stripe_price_id;

      // Create Stripe product if missing
      if (!stripeProductId) {
        const stripeProduct = await stripe.products.create({
          name: row.name,
          description: row.description ?? undefined,
          metadata: { travelprof_id: row.id },
        });
        stripeProductId = stripeProduct.id;
      }

      // Create Stripe price if missing
      if (!stripePriceId) {
        const newPrice = await stripe.prices.create({
          product: stripeProductId,
          unit_amount: row.price,
          currency: "eur",
          ...(row.type === "subscription"
            ? { recurring: { interval: "month" } }
            : {}),
        });
        stripePriceId = newPrice.id;
      }

      // Update DB
      const { error: updateError } = await admin
        .from("products")
        .update({
          stripe_product_id: stripeProductId,
          stripe_price_id: stripePriceId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", row.id);

      if (updateError) {
        errors.push(`${row.name}: DB-Update fehlgeschlagen — ${updateError.message}`);
      } else {
        synced++;
      }
    } catch (err) {
      errors.push(`${row.name}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return NextResponse.json({ synced, skipped, errors });
}
