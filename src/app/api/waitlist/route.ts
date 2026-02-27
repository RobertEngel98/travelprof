import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendWaitlistWelcome, sendLeadmagnetEmail } from "@/lib/email";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  const { email, source, name } = (await request.json()) as {
    email?: string;
    source?: string;
    name?: string;
  };

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Ungültige E-Mail" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // Try to insert into waitlist table
  const { error } = await supabase.from("waitlist").upsert(
    { email, source: source || "community", created_at: new Date().toISOString() },
    { onConflict: "email" }
  );

  if (error) {
    console.error("Waitlist insert error:", error);
    return NextResponse.json({ error: "Fehler beim Speichern" }, { status: 500 });
  }

  // Fire-and-forget email based on source
  const resolvedSource = source || "community";
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
