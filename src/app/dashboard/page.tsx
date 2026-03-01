import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Profile, Purchase, AnalyseResult } from "@/types/database";
import CheckoutSuccess from "./components/CheckoutSuccess";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user!.id)
    .single();
  const profile = profileData as Profile | null;

  const { data: purchasesData } = await supabase
    .from("purchases")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(5);
  const purchases = (purchasesData ?? []) as Purchase[];

  const { data: analysesData } = await supabase
    .from("analyse_results")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(3);
  const analyses = (analysesData ?? []) as AnalyseResult[];

  const isVip = profile?.subscription_status === "active" || profile?.subscription_status === "trial";
  const purchaseCount = purchases.length;
  const analyseCount = analyses.length;

  const cardStyle = {
    background: "var(--bg-warm)",
    border: "1px solid var(--border-soft)",
    borderRadius: "1rem",
    padding: "1.5rem",
  };

  return (
    <div>
      <Suspense fallback={null}>
        <CheckoutSuccess />
      </Suspense>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
          Willkommen zurück, {profile?.full_name || "Reisender"}!
        </h1>
        {isVip && (
          <span style={{
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            color: "#000",
            fontSize: "0.7rem",
            fontWeight: 700,
            padding: "0.2rem 0.6rem",
            borderRadius: "1rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}>
            VIP
          </span>
        )}
      </div>
      <p style={{ color: "var(--text-sub)", marginBottom: "2rem" }}>
        Dein persönlicher Travel Hacking Bereich.
        {isVip && (
          <>
            {" "}
            <a href="/api/stripe/portal" style={{ color: "var(--accent)", fontSize: "0.85rem" }}>
              Abo verwalten
            </a>
          </>
        )}
      </p>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        <div style={cardStyle}>
          <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</div>
          <div style={{ fontSize: "1.25rem", fontWeight: 700, color: isVip ? "var(--accent)" : "var(--text-main)" }}>
            {isVip ? "VIP Mitglied" : "Free"}
          </div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Produkte</div>
          <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>{purchaseCount}</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Analysen</div>
          <div style={{ fontSize: "1.25rem", fontWeight: 700 }}>{analyseCount}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "1rem" }}>Schnellzugriff</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        <Link href="/analyse" style={{ ...cardStyle, textDecoration: "none", color: "inherit", display: "block" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>✈️</div>
          <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>Neue Reiseanalyse</div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-sub)" }}>Finde die perfekte Reisestrategie</div>
        </Link>
        <Link href="/dashboard/produkte" style={{ ...cardStyle, textDecoration: "none", color: "inherit", display: "block" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>📚</div>
          <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>Meine Produkte</div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-sub)" }}>Alle gekauften Guides & Kurse</div>
        </Link>
      </div>

      {/* Recent Analyses */}
      {analyses.length > 0 && (
        <>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "1rem" }}>Letzte Analysen</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {analyses.map((a) => (
              <div key={a.id} style={cardStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 500 }}>Reiseanalyse</span>
                  <span style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
                    {new Date(a.created_at).toLocaleDateString("de-DE")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!isVip && (
        <div style={{
          marginTop: "2rem",
          background: "linear-gradient(135deg, #1a1a2e, #16213e)",
          borderRadius: "1rem",
          padding: "2rem",
          color: "#fff",
        }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            Werde VIP Mitglied
          </h3>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", marginBottom: "1rem", lineHeight: 1.6 }}>
            Erhalte Zugang zur exklusiven Community, monatliche Live-Calls und die neuesten Travel Hacks vor allen anderen.
          </p>
          <Link
            href="/dashboard/einstellungen"
            style={{
              display: "inline-block",
              background: "var(--accent)",
              color: "#000",
              padding: "0.6rem 1.25rem",
              borderRadius: "0.625rem",
              fontWeight: 600,
              fontSize: "0.88rem",
              textDecoration: "none",
            }}
          >
            Jetzt upgraden
          </Link>
        </div>
      )}
    </div>
  );
}
