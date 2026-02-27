import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { ADMIN_EMAIL } from "@/lib/admin";
import { CMS_DEFAULTS } from "@/lib/cms";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("cms_sections")
    .select("id, data, updated_at");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Merge with defaults for the response
  const sections: Record<string, { data: unknown; updated_at: string | null }> = {};
  for (const [key, defaults] of Object.entries(CMS_DEFAULTS)) {
    const row = data?.find(r => r.id === key);
    const dbData = row?.data as Record<string, unknown> | null;
    const hasData = dbData && Object.keys(dbData).length > 0;
    sections[key] = {
      data: hasData ? { ...defaults as object, ...dbData } : defaults,
      updated_at: row?.updated_at ?? null,
    };
  }

  return NextResponse.json({ sections });
}
