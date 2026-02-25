"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PLANS } from "@/lib/stripe";

export default function EinstellungenPage() {
  const [profile, setProfile] = useState<{
    full_name: string | null;
    email: string | null;
    subscription_status: string;
    subscription_plan: string | null;
  } | null>(null);
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      setProfile(data);
      setFullName(data?.full_name ?? "");
      setLoading(false);
    }
    loadProfile();
  }, []);

  async function handleSave() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from("profiles")
      .update({ full_name: fullName, updated_at: new Date().toISOString() })
      .eq("user_id", user.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleSubscribe(plan: string) {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
  }

  const cardStyle = {
    background: "var(--bg-warm)",
    border: "1px solid var(--border-soft)",
    borderRadius: "1rem",
    padding: "1.5rem",
    marginBottom: "1.5rem",
  };

  const isVip = profile?.subscription_status === "active" || profile?.subscription_status === "trial";

  if (loading) return <p style={{ color: "var(--muted)" }}>Wird geladen...</p>;

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "2rem" }}>Einstellungen</h1>

      {/* Profile */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "1rem" }}>Profil</h2>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 500, marginBottom: "0.375rem" }}>Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={{
              width: "100%",
              maxWidth: 400,
              padding: "0.65rem 1rem",
              borderRadius: "0.625rem",
              border: "1px solid var(--border-soft)",
              background: "var(--bg-main)",
              fontSize: "0.9rem",
              color: "var(--text-main)",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 500, marginBottom: "0.375rem" }}>E-Mail</label>
          <p style={{ color: "var(--text-sub)", fontSize: "0.9rem" }}>{profile?.email}</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary btn-sm"
          style={{ opacity: saving ? 0.6 : 1 }}
        >
          {saving ? "Wird gespeichert..." : saved ? "Gespeichert!" : "Speichern"}
        </button>
      </div>

      {/* Subscription */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.5rem" }}>Mitgliedschaft</h2>
        <p style={{ color: "var(--text-sub)", fontSize: "0.9rem", marginBottom: "1.25rem" }}>
          Aktueller Status:{" "}
          <strong style={{ color: isVip ? "var(--accent)" : "var(--text-main)" }}>
            {isVip ? `VIP (${profile?.subscription_plan === "yearly" ? "Jährlich" : "Monatlich"})` : "Free"}
          </strong>
        </p>

        {isVip ? (
          <a
            href="/api/stripe/portal"
            className="btn btn-secondary btn-sm"
          >
            Abo verwalten
          </a>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
            {Object.entries(PLANS).map(([key, plan]) => (
              <div
                key={key}
                style={{
                  background: "var(--bg-main)",
                  border: key === "yearly" ? "2px solid var(--accent)" : "1px solid var(--border-soft)",
                  borderRadius: "0.875rem",
                  padding: "1.25rem",
                  position: "relative",
                }}
              >
                {key === "yearly" && (
                  <span style={{
                    position: "absolute",
                    top: "-0.6rem",
                    right: "1rem",
                    background: "var(--accent)",
                    color: "#000",
                    padding: "0.15rem 0.6rem",
                    borderRadius: "0.375rem",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                  }}>
                    Spare {"savings" in plan ? plan.savings : ""}
                  </span>
                )}
                <h3 style={{ fontWeight: 600, marginBottom: "0.25rem" }}>{plan.name}</h3>
                <div style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                  {plan.priceDisplay} €
                  <span style={{ fontSize: "0.82rem", fontWeight: 400, color: "var(--muted)" }}>
                    /{key === "yearly" ? "Jahr" : "Monat"}
                  </span>
                </div>
                {"priceMonthly" in plan && (
                  <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginBottom: "0.75rem" }}>
                    = {"priceMonthly" in plan ? (plan as { priceMonthly: string }).priceMonthly : ""} €/Monat
                  </p>
                )}
                <button
                  onClick={() => handleSubscribe(key)}
                  className="btn btn-primary btn-sm"
                  style={{ width: "100%", marginTop: "0.5rem" }}
                >
                  Jetzt starten
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div style={{ ...cardStyle, borderColor: "rgba(220,38,38,0.3)" }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.5rem", color: "#dc2626" }}>Gefahrenzone</h2>
        <p style={{ color: "var(--text-sub)", fontSize: "0.88rem", marginBottom: "1rem" }}>
          Konto löschen ist unwiderruflich. Alle Daten werden gelöscht.
        </p>
        <button
          style={{
            background: "rgba(220,38,38,0.1)",
            border: "1px solid rgba(220,38,38,0.3)",
            borderRadius: "0.625rem",
            padding: "0.5rem 1rem",
            color: "#dc2626",
            fontSize: "0.85rem",
            fontWeight: 500,
            cursor: "pointer",
          }}
          onClick={() => alert("Bitte kontaktiere traveling.prof@outlook.de um dein Konto zu löschen.")}
        >
          Konto löschen
        </button>
      </div>
    </div>
  );
}
