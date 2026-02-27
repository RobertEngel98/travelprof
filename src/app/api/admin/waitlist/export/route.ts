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
  const { data } = await admin
    .from("waitlist")
    .select("*")
    .order("created_at", { ascending: false });

  const entries = (data ?? []) as Waitlist[];

  // Build CSV
  const header = "E-Mail,Quelle,Datum";
  const rows = entries.map((e) => {
    const date = new Date(e.created_at).toLocaleDateString("de-DE");
    return `"${e.email}","${e.source}","${date}"`;
  });

  const csv = [header, ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="waitlist-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
