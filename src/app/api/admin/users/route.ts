import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { ADMIN_EMAIL } from "@/lib/admin";
import type { Profile } from "@/types/database";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";

  const admin = getSupabaseAdmin();

  // Get profiles with purchase counts
  const [profilesRes, purchasesRes] = await Promise.all([
    admin.from("profiles").select("*").order("created_at", { ascending: false }),
    admin.from("purchases").select("user_id, id").eq("status", "completed"),
  ]);

  const profiles = (profilesRes.data ?? []) as Profile[];
  const purchases = (purchasesRes.data ?? []) as { user_id: string; id: string }[];

  // Count purchases per user
  const purchaseCount: Record<string, number> = {};
  purchases.forEach((p) => {
    purchaseCount[p.user_id] = (purchaseCount[p.user_id] ?? 0) + 1;
  });

  let users = profiles.map((p) => ({
    id: p.user_id,
    name: p.full_name ?? "–",
    email: p.email ?? "–",
    status: p.subscription_status === "active" || p.subscription_status === "trial" ? "VIP" : "Free",
    purchases: purchaseCount[p.user_id] ?? 0,
    created_at: p.created_at,
  }));

  // Search filter
  if (search) {
    const q = search.toLowerCase();
    users = users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({ users, total: users.length });
}
