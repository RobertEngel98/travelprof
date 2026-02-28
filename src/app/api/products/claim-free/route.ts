import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Nicht eingeloggt" }, { status: 401 });
  }

  const { productId } = await request.json();
  if (!productId) {
    return NextResponse.json({ error: "productId fehlt" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();

  // Check product exists and is free
  const { data: product, error: productErr } = await admin
    .from("products")
    .select("id, name, price")
    .eq("id", productId)
    .single();

  if (productErr || !product) {
    return NextResponse.json({ error: "Produkt nicht gefunden" }, { status: 404 });
  }

  if (product.price > 0) {
    return NextResponse.json({ error: "Dieses Produkt ist nicht kostenlos" }, { status: 400 });
  }

  // Check if already claimed
  const { data: existing } = await admin
    .from("purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ already_owned: true, product: product.name });
  }

  // Create free purchase
  const { error: insertErr } = await admin
    .from("purchases")
    .insert({
      user_id: user.id,
      product_id: productId,
      product_name: product.name,
      amount: 0,
      status: "completed",
    });

  if (insertErr) {
    return NextResponse.json({ error: insertErr.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, product: product.name });
}
