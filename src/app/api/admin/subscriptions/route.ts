import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { ADMIN_EMAIL } from "@/lib/admin";
import { PLANS } from "@/lib/stripe";
import type { Subscription, Profile } from "@/types/database";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = getSupabaseAdmin();

  const [subsRes, profilesRes] = await Promise.all([
    admin.from("subscriptions").select("*").order("created_at", { ascending: false }),
    admin.from("profiles").select("user_id, email, full_name"),
  ]);

  const subscriptions = (subsRes.data ?? []) as Subscription[];
  const profiles = (profilesRes.data ?? []) as Pick<Profile, "user_id" | "email" | "full_name">[];

  const profileMap = new Map(profiles.map((p) => [p.user_id, p]));

  const enriched = subscriptions.map((s) => {
    const profile = profileMap.get(s.user_id);
    return {
      id: s.id,
      user_id: s.user_id,
      email: profile?.email ?? "—",
      name: profile?.full_name ?? "—",
      plan: s.plan,
      status: s.status,
      current_period_end: s.current_period_end,
      cancel_at_period_end: s.cancel_at_period_end,
      created_at: s.created_at,
    };
  });

  const active = subscriptions.filter((s) => s.status === "active" || s.status === "trialing");
  const canceled = subscriptions.filter((s) => s.status === "canceled");
  const monthly = active.filter((s) => s.plan === "monthly").length;
  const yearly = active.filter((s) => s.plan === "yearly").length;

  const mrr = active.reduce((sum, s) => {
    if (s.plan === "yearly") return sum + Math.round(PLANS.yearly.price / 12);
    return sum + PLANS.monthly.price;
  }, 0);

  const totalSubs = active.length + canceled.length;
  const churnRate = totalSubs > 0 ? (canceled.length / totalSubs) * 100 : 0;

  return NextResponse.json({
    subscriptions: enriched,
    kpis: {
      active: active.length,
      canceled: canceled.length,
      monthly,
      yearly,
      mrr,
      arr: mrr * 12,
      churnRate,
    },
  });
}
