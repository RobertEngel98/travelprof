import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  }

  const { answers, result } = await request.json();

  if (!answers || !result) {
    return NextResponse.json({ error: "Fehlende Daten" }, { status: 400 });
  }

  const { error } = await supabase.from("analyse_results").insert({
    user_id: user.id,
    answers,
    result,
  });

  if (error) {
    console.error("[Analyse] Save failed:", error);
    return NextResponse.json({ error: "Speichern fehlgeschlagen" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
