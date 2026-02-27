import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { ADMIN_EMAIL } from "@/lib/admin";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || "jpg";
  const filename = `cms-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const admin = getSupabaseAdmin();
  const { error } = await admin.storage
    .from("cms-images")
    .upload(filename, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: urlData } = admin.storage
    .from("cms-images")
    .getPublicUrl(filename);

  return NextResponse.json({ url: urlData.publicUrl });
}
