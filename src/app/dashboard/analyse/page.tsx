"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const QUESTION_LABELS: Record<string, string> = {
  status: "Erfahrungslevel",
  lebensphase: "Lebensphase",
  reisefrequenz: "Reisehäufigkeit",
  reiseziel: "Bevorzugte Ziele",
  budget: "Monatliche Ausgaben",
  karten: "Vorhandene Karten",
  ziel: "Hauptziel",
};

const ANSWER_LABELS: Record<string, Record<string, string>> = {
  status: { beginner: "Kompletter Neuling", intermediate: "Etwas Erfahrung", advanced: "Fortgeschritten" },
  lebensphase: { student: "Student / Azubi", employed: "Angestellt", selfemployed: "Selbständig", family: "Familie" },
  reisefrequenz: { selten: "1–2 mal/Jahr", mittel: "3–5 mal/Jahr", viel: "6+ mal/Jahr", business: "Geschäftlich oft" },
  reiseziel: { europa: "Europa", fern: "Fernreise", mix: "Beides – Mix", luxus: "Luxus-Destinationen" },
  budget: { low: "Unter 1.500 €", mid: "1.500–3.000 €", high: "3.000–5.000 €", premium: "Über 5.000 €" },
  karten: { keine: "Keine", payback: "Payback Amex", amex_mid: "Amex Gold/Green", amex_plat: "Amex Platinum" },
  ziel: { business_class: "Business Class fliegen", mehr_reisen: "Mehr & günstiger reisen", lounge: "Lounge-Zugang", alles: "Alles zusammen" },
};

interface AnalyseResult {
  id: string;
  answers: Record<string, string>;
  result: {
    level?: string;
    levelEmoji?: string;
    monthlyMiles?: string;
    yearlyMiles?: string;
    firstGoal?: string;
    cards?: { name: string; tag: string; bonus: string }[];
    sammeltipps?: { tip: string }[];
    buchungstipps?: string[];
  };
  created_at: string;
}

export default function AnalysePage() {
  const [results, setResults] = useState<AnalyseResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadResults() {
      const { data } = await supabase
        .from("analyse_results")
        .select("*")
        .order("created_at", { ascending: false });
      setResults((data ?? []) as AnalyseResult[]);
      setLoading(false);
    }
    loadResults();
  }, []);

  const cardStyle = {
    background: "var(--bg-warm)",
    border: "1px solid var(--border-soft)",
    borderRadius: "1rem",
    padding: "1.5rem",
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>Meine Analysen</h1>
          <p style={{ color: "var(--text-sub)" }}>Alle gespeicherten Reiseanalysen.</p>
        </div>
        <Link href="/analyse" className="btn btn-primary btn-sm">
          Neue Analyse
        </Link>
      </div>

      {loading ? (
        <p style={{ color: "var(--muted)" }}>Wird geladen...</p>
      ) : results.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: "center", padding: "3rem 1.5rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📊</div>
          <h3 style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Noch keine Analysen</h3>
          <p style={{ color: "var(--text-sub)", marginBottom: "1.5rem" }}>
            Starte jetzt deine erste 10-Sekunden Reiseanalyse.
          </p>
          <Link href="/analyse" className="btn btn-primary btn-sm">
            Jetzt starten
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {results.map((r) => {
            const isOpen = expanded === r.id;
            const res = r.result;
            return (
              <div key={r.id} style={cardStyle}>
                <div
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", flexWrap: "wrap", gap: "0.5rem" }}
                  onClick={() => setExpanded(isOpen ? null : r.id)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "1.5rem" }}>{res.levelEmoji || "📊"}</span>
                    <div>
                      <span style={{ fontWeight: 600 }}>{res.level || "Reiseanalyse"}</span>
                      <span style={{ marginLeft: "0.75rem", fontSize: "0.82rem", color: "var(--muted)" }}>
                        {new Date(r.created_at).toLocaleDateString("de-DE", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    {res.yearlyMiles && (
                      <span style={{ fontSize: "0.82rem", color: "var(--accent)", fontWeight: 600 }}>
                        {res.yearlyMiles} Meilen/Jahr
                      </span>
                    )}
                    <span style={{ color: "var(--muted)", fontSize: "1.2rem" }}>
                      {isOpen ? "▲" : "▼"}
                    </span>
                  </div>
                </div>

                {isOpen && (
                  <div style={{ marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border-soft)" }}>
                    {/* Meilen-Potenzial */}
                    {res.monthlyMiles && (
                      <div className="dash-grid-3" style={{ marginBottom: "1.5rem" }}>
                        <div style={{ background: "var(--bg-main)", borderRadius: "0.75rem", padding: "1rem", textAlign: "center" }}>
                          <div style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: "0.25rem" }}>Monatlich</div>
                          <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--accent)" }}>{res.monthlyMiles}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Meilen</div>
                        </div>
                        <div style={{ background: "var(--bg-main)", borderRadius: "0.75rem", padding: "1rem", textAlign: "center" }}>
                          <div style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: "0.25rem" }}>Jährlich</div>
                          <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--accent)" }}>{res.yearlyMiles}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Meilen</div>
                        </div>
                        <div style={{ background: "var(--bg-main)", borderRadius: "0.75rem", padding: "1rem", textAlign: "center" }}>
                          <div style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", marginBottom: "0.25rem" }}>Erstes Ziel</div>
                          <div style={{ fontSize: "0.85rem", fontWeight: 600, lineHeight: 1.4 }}>{res.firstGoal}</div>
                        </div>
                      </div>
                    )}

                    {/* Antworten */}
                    <h4 style={{ fontSize: "0.88rem", fontWeight: 600, marginBottom: "0.75rem", color: "var(--muted)" }}>Dein Profil</h4>
                    <div className="dash-grid-2" style={{ gap: "0.5rem", marginBottom: "1.25rem" }}>
                      {Object.entries(r.answers).map(([key, value]) => (
                        <div key={key} style={{ background: "var(--bg-main)", borderRadius: "0.5rem", padding: "0.6rem 0.875rem", fontSize: "0.85rem" }}>
                          <span style={{ color: "var(--muted)" }}>{QUESTION_LABELS[key] || key}: </span>
                          <strong>{ANSWER_LABELS[key]?.[value] || value}</strong>
                        </div>
                      ))}
                    </div>

                    {/* Empfohlene Karten */}
                    {res.cards && res.cards.length > 0 && (
                      <>
                        <h4 style={{ fontSize: "0.88rem", fontWeight: 600, marginBottom: "0.75rem", color: "var(--muted)" }}>Empfohlene Karten</h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.25rem" }}>
                          {res.cards.map((card, i) => (
                            <div key={i} style={{ background: "var(--bg-main)", borderRadius: "0.5rem", padding: "0.75rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.375rem" }}>
                              <div>
                                <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{card.name}</span>
                                <span style={{ marginLeft: "0.5rem", fontSize: "0.72rem", background: "rgba(232,114,12,0.1)", color: "var(--accent)", padding: "0.15rem 0.5rem", borderRadius: "0.25rem" }}>{card.tag}</span>
                              </div>
                              <span style={{ fontSize: "0.82rem", color: "var(--text-sub)" }}>{card.bonus}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Buchungstipps */}
                    {res.buchungstipps && res.buchungstipps.length > 0 && (
                      <>
                        <h4 style={{ fontSize: "0.88rem", fontWeight: 600, marginBottom: "0.75rem", color: "var(--muted)" }}>Buchungstipps</h4>
                        <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                          {res.buchungstipps.map((tip, i) => (
                            <li key={i} style={{ fontSize: "0.85rem", color: "var(--text-sub)", display: "flex", gap: "0.5rem" }}>
                              <span style={{ color: "#22c55e", fontWeight: 700, flexShrink: 0 }}>✓</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
