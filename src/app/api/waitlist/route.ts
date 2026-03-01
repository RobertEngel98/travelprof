import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendWaitlistWelcome, sendLeadmagnetEmail } from "@/lib/email";
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

  const { email, source, name } = (await request.json()) as {
    email?: string;
    source?: string;
    name?: string;
  };

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Ungültige E-Mail" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const resolvedSource = source || "community";

  // Try insert first, ignore conflict (email already exists)
  const { error: insertError } = await supabase
    .from("waitlist")
    .insert({ email, source: resolvedSource, created_at: new Date().toISOString() });

  if (insertError) {
    // 23505 = unique_violation (email already exists) → not an error
    if (insertError.code === "23505") {
      console.log("[Waitlist] Email already exists:", email);
    } else {
      console.error("[Waitlist] Insert error:", insertError);
      return NextResponse.json({ error: "Fehler beim Speichern" }, { status: 500 });
    }
  }

  // Fire-and-forget email based on source
  if (resolvedSource === "community") {
    sendWaitlistWelcome({ email }).catch((err) =>
      console.error("[Email] Waitlist welcome failed:", err)
    );
  } else if (resolvedSource.startsWith("leadmagnet:")) {
    const produktName = resolvedSource.replace("leadmagnet:", "");
    sendLeadmagnetEmail({ email, name: name || undefined, productName: produktName }).catch(
      (err) => console.error("[Email] Leadmagnet email failed:", err)
    );
  }

  return NextResponse.json({ success: true });
}
