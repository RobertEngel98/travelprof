import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendAnalyseResultEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";

  if (!rateLimit(ip).allowed) {
    return NextResponse.json(
      { error: "Zu viele Anfragen. Bitte versuche es später erneut." },
      { status: 429 }
    );
  }

  const { email, vorname, result } = (await request.json()) as {
    email?: string;
    vorname?: string;
    result?: {
      level: string;
      monthlyMiles: string;
      yearlyMiles: string;
      cards: string[];
    };
  };

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Ungültige E-Mail" }, { status: 400 });
  }

  if (!vorname || !result) {
    return NextResponse.json({ error: "Fehlende Daten" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // Save to waitlist with source "analyse"
  await supabase.from("waitlist").upsert(
    { email, source: "analyse", created_at: new Date().toISOString() },
    { onConflict: "email" }
  );

  // Fire-and-forget email
  sendAnalyseResultEmail({ email, vorname, result }).catch((err) =>
    console.error("[Email] Analyse result email failed:", err)
  );

  return NextResponse.json({ success: true });
}
