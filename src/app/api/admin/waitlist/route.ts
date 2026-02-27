import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { ADMIN_EMAIL } from "@/lib/admin";
import type { Waitlist } from "@/types/database";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = getSupabaseAdmin();
  const { data, count } = await admin
    .from("waitlist")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  const entries = (data ?? []) as Waitlist[];

  // Group by week for chart
  const weeklyData: Record<string, number> = {};
  entries.forEach((e) => {
    const d = new Date(e.created_at);
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());
    const key = weekStart.toISOString().split("T")[0];
    weeklyData[key] = (weeklyData[key] ?? 0) + 1;
  });

  const chart = Object.entries(weeklyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([week, count]) => ({
      week: new Date(week).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" }),
      count,
    }));

  return NextResponse.json({
    total: count ?? 0,
    entries: entries.map((e) => ({
      id: e.id,
      email: e.email,
      source: e.source,
      created_at: e.created_at,
    })),
    chart,
  });
}
