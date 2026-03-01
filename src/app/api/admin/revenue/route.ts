import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { ADMIN_EMAIL } from "@/lib/admin";
import { PLANS } from "@/lib/stripe";
import type { Purchase, Subscription } from "@/types/database";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get("days") ?? "30");

  const admin = getSupabaseAdmin();

  const [purchasesRes, subsRes] = await Promise.all([
    admin.from("purchases").select("*").eq("status", "completed").order("created_at", { ascending: false }),
    admin.from("subscriptions").select("*"),
  ]);

  const allPurchases = (purchasesRes.data ?? []) as Purchase[];
  const subscriptions = (subsRes.data ?? []) as Subscription[];

  // Filter by date range
  let purchases = allPurchases;
  if (days > 0) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    purchases = allPurchases.filter((p) => new Date(p.created_at) >= cutoff);
  }

  const totalRevenue = purchases.reduce((sum, p) => sum + (p.amount ?? 0), 0);

  // Revenue by day
  const revenueByDay: Record<string, number> = {};
  const numDays = days > 0 ? days : 365;
  for (let i = 0; i < numDays; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (numDays - 1 - i));
    revenueByDay[d.toISOString().split("T")[0]] = 0;
  }

  purchases.forEach((p) => {
    const day = p.created_at.split("T")[0];
    if (revenueByDay[day] !== undefined) {
      revenueByDay[day] += p.amount ?? 0;
    }
  });

  const revenueChart = Object.entries(revenueByDay).map(([date, revenue]) => ({
    date: new Date(date).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" }),
    revenue,
  }));

  // Revenue by product
  const byProduct: Record<string, { sales: number; revenue: number }> = {};
  purchases.forEach((p) => {
    if (!byProduct[p.product_name]) {
      byProduct[p.product_name] = { sales: 0, revenue: 0 };
    }
    byProduct[p.product_name].sales++;
    byProduct[p.product_name].revenue += p.amount ?? 0;
  });

  const productChart = Object.entries(byProduct).map(([name, data]) => ({
    name: name.length > 20 ? name.slice(0, 18) + "…" : name,
    ...data,
  }));

  // MRR/ARR
  const activeSubs = subscriptions.filter((s) => s.status === "active" || s.status === "trialing");
  const mrr = activeSubs.reduce((sum, s) => {
    if (s.plan === "yearly") return sum + Math.round(PLANS.yearly.price / 12);
    return sum + PLANS.monthly.price;
  }, 0);
  const arr = mrr * 12;

  // Recent transactions
  const recent = purchases.slice(0, 20).map((p) => ({
    id: p.id,
    product: p.product_name,
    amount: p.amount,
    date: p.created_at,
  }));

  return NextResponse.json({
    totalRevenue,
    revenueChart,
    productChart,
    mrr,
    arr,
    transactions: recent,
  });
}
