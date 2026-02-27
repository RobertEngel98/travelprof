import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { Product } from "@/types/database";

export async function getProducts(): Promise<Product[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[Products] Failed to fetch:", error);
    return [];
  }
  return (data ?? []) as Product[];
}

export async function getAllProducts(): Promise<Product[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[Products] Failed to fetch:", error);
    return [];
  }
  return (data ?? []) as Product[];
}

export async function getProduct(id: string): Promise<Product | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("[Products] Failed to fetch product:", error);
    return null;
  }
  return data as Product | null;
}
