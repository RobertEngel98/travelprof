import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { ADMIN_EMAIL } from "@/lib/admin";
import type { Purchase, Subscription } from "@/types/database";

export async function GET() {
  // Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = getSupabaseAdmin();

  // Parallel queries
  const [profilesRes, purchasesRes, subsRes, waitlistRes] = await Promise.all([
    admin.from("profiles").select("id, created_at", { count: "exact" }),
    admin.from("purchases").select("*").eq("status", "completed"),
    admin.from("subscriptions").select("*"),
    admin.from("waitlist").select("id", { count: "exact" }),
  ]);

  const totalUsers = profilesRes.count ?? 0;
  const purchases = (purchasesRes.data ?? []) as Purchase[];
  const subscriptions = (subsRes.data ?? []) as Subscription[];
  const waitlistCount = waitlistRes.count ?? 0;

  // Total revenue from purchases
  const purchaseRevenue = purchases.reduce((sum, p) => sum + (p.amount ?? 0), 0);

  // Active subscriptions and their revenue
  const activeSubs = subscriptions.filter((s) => s.status === "active" || s.status === "trialing");
  const monthlyMrr = activeSubs.reduce((sum, s) => {
    if (s.plan === "yearly") return sum + Math.round(9900 / 12);
    return sum + 990;
  }, 0);

  // Revenue last 30 days (daily breakdown)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const revenueByDay: Record<string, number> = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
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

  // Sales by product
  const salesByProduct: Record<string, { sales: number; revenue: number }> = {};
  purchases.forEach((p) => {
    if (!salesByProduct[p.product_name]) {
      salesByProduct[p.product_name] = { sales: 0, revenue: 0 };
    }
    salesByProduct[p.product_name].sales++;
    salesByProduct[p.product_name].revenue += p.amount ?? 0;
  });

  const productChart = Object.entries(salesByProduct).map(([name, data]) => ({
    name: name.length > 20 ? name.slice(0, 18) + "…" : name,
    ...data,
  }));

  // New users per week (last 8 weeks)
  const profiles = (profilesRes.data ?? []) as { id: string; created_at: string }[];
  const weeklyUsers: Record<string, number> = {};
  for (let i = 0; i < 8; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (7 * (7 - i)));
    const weekStart = d.toISOString().split("T")[0];
    weeklyUsers[weekStart] = 0;
  }

  const weekKeys = Object.keys(weeklyUsers);
  profiles.forEach((p) => {
    const created = new Date(p.created_at);
    for (let i = weekKeys.length - 1; i >= 0; i--) {
      if (created >= new Date(weekKeys[i])) {
        weeklyUsers[weekKeys[i]]++;
        break;
      }
    }
  });

  const usersChart = weekKeys.map((week) => ({
    week: new Date(week).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" }),
    users: weeklyUsers[week],
  }));

  return NextResponse.json({
    kpis: {
      totalRevenue: purchaseRevenue,
      totalUsers,
      activeSubs: activeSubs.length,
      waitlistCount,
      mrr: monthlyMrr,
    },
    charts: {
      revenue: revenueChart,
      products: productChart,
      users: usersChart,
    },
  });
}
