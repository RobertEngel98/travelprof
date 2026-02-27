import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { ADMIN_EMAIL } from "@/lib/admin";
import { CMS_DEFAULTS, CMS_SECTION_IDS } from "@/lib/cms";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!CMS_SECTION_IDS.includes(id as typeof CMS_SECTION_IDS[number])) {
    return NextResponse.json({ error: "Invalid section id" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("cms_sections")
    .select("id, data, updated_at")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const defaults = CMS_DEFAULTS[id as keyof typeof CMS_DEFAULTS];
  const dbData = data?.data as Record<string, unknown> | null;
  const hasData = dbData && Object.keys(dbData).length > 0;

  return NextResponse.json({
    id,
    data: hasData ? { ...defaults as object, ...dbData } : defaults,
    updated_at: data?.updated_at ?? null,
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!CMS_SECTION_IDS.includes(id as typeof CMS_SECTION_IDS[number])) {
    return NextResponse.json({ error: "Invalid section id" }, { status: 400 });
  }

  const body = await request.json();

  const admin = getSupabaseAdmin();
  const { error } = await admin
    .from("cms_sections")
    .upsert({
      id,
      data: body,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
