"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface AnalyseResult {
  id: string;
  answers: Record<string, unknown>;
  result: Record<string, unknown>;
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
      setResults(data ?? []);
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
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
          {results.map((r) => (
            <div key={r.id} style={cardStyle}>
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                onClick={() => setExpanded(expanded === r.id ? null : r.id)}
              >
                <div>
                  <span style={{ fontWeight: 600 }}>Reiseanalyse</span>
                  <span style={{ marginLeft: "0.75rem", fontSize: "0.82rem", color: "var(--muted)" }}>
                    {new Date(r.created_at).toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <span style={{ color: "var(--muted)", fontSize: "1.2rem" }}>
                  {expanded === r.id ? "▲" : "▼"}
                </span>
              </div>
              {expanded === r.id && (
                <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border-soft)" }}>
                  <h4 style={{ fontSize: "0.88rem", fontWeight: 600, marginBottom: "0.75rem", color: "var(--muted)" }}>Antworten</h4>
                  <pre style={{
                    background: "var(--bg-main)",
                    borderRadius: "0.5rem",
                    padding: "1rem",
                    fontSize: "0.82rem",
                    overflow: "auto",
                    whiteSpace: "pre-wrap",
                    color: "var(--text-sub)",
                  }}>
                    {JSON.stringify(r.answers, null, 2)}
                  </pre>
                  <h4 style={{ fontSize: "0.88rem", fontWeight: 600, margin: "1rem 0 0.75rem", color: "var(--muted)" }}>Ergebnis</h4>
                  <pre style={{
                    background: "var(--bg-main)",
                    borderRadius: "0.5rem",
                    padding: "1rem",
                    fontSize: "0.82rem",
                    overflow: "auto",
                    whiteSpace: "pre-wrap",
                    color: "var(--text-sub)",
                  }}>
                    {JSON.stringify(r.result, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
