"use client";

import { useEffect, useState } from "react";
import KpiCard from "../components/KpiCard";
import DataTable from "../components/DataTable";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface WaitlistEntry {
  id: string;
  email: string;
  source: string;
  created_at: string;
}

interface WaitlistData {
  total: number;
  entries: WaitlistEntry[];
  chart: { week: string; count: number }[];
}

export default function WaitlistPage() {
  const [data, setData] = useState<WaitlistData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/waitlist")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  function handleExport() {
    window.open("/api/admin/waitlist/export", "_blank");
  }

  if (loading) {
    return (
      <div>
        <div className="admin-page-header">
          <h1 className="admin-page-title">Waitlist</h1>
          <p className="admin-page-sub">Wird geladen...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Count sources
  const sources: Record<string, number> = {};
  data.entries.forEach((e) => {
    sources[e.source] = (sources[e.source] ?? 0) + 1;
  });

  return (
    <div>
      <div className="admin-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 className="admin-page-title">Waitlist</h1>
          <p className="admin-page-sub">E-Mail-Adressen für Community & Leadmagnets</p>
        </div>
        <button className="admin-btn admin-btn-secondary" onClick={handleExport}>
          📥 CSV Export
        </button>
      </div>

      <div className="admin-kpi-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <KpiCard label="Gesamt" value={String(data.total)} sub="E-Mail-Adressen" />
        <KpiCard label="Quellen" value={String(Object.keys(sources).length)} sub="Verschiedene Quellen" />
        <KpiCard
          label="Letzte Woche"
          value={String(data.chart.length > 0 ? data.chart[data.chart.length - 1].count : 0)}
          sub="Neue Einträge"
        />
      </div>

      <div className="admin-chart-grid">
        <div className="admin-chart-card full">
          <div className="admin-chart-title">Waitlist-Verlauf (wöchentlich)</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.chart}>
              <XAxis dataKey="week" tick={{ fill: "#78716c", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "#292524" }} />
              <YAxis tick={{ fill: "#78716c", fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#1c1917", border: "1px solid #292524", borderRadius: "0.5rem", color: "#e7e5e4" }} />
              <Bar dataKey="count" fill="#e8720c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <DataTable
        title="Alle Einträge"
        columns={[
          { key: "email", label: "E-Mail" },
          {
            key: "source",
            label: "Quelle",
            render: (row) => (
              <span className="admin-badge admin-badge-gray">{row.source}</span>
            ),
          },
          {
            key: "created_at",
            label: "Datum",
            render: (row) =>
              new Date(row.created_at).toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }),
          },
        ]}
        data={data.entries}
      />
    </div>
  );
}
