"use client";

import { useEffect, useState } from "react";
import KpiCard from "../components/KpiCard";
import DataTable from "../components/DataTable";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Sub {
  id: string;
  user_id: string;
  email: string;
  name: string;
  plan: string;
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
}

interface AbosData {
  subscriptions: Sub[];
  kpis: {
    active: number;
    canceled: number;
    monthly: number;
    yearly: number;
    mrr: number;
    arr: number;
    churnRate: number;
  };
}

export default function AbosPage() {
  const [data, setData] = useState<AbosData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We'll compute from stats + subscriptions
    async function load() {
      const res = await fetch("/api/admin/stats");
      const stats = await res.json();

      // Fetch all subscriptions via supabase (using admin endpoint we'll adapt)
      // For now, use the stats data and build a simplified view
      setData({
        subscriptions: [],
        kpis: {
          active: stats.kpis.activeSubs,
          canceled: 0,
          monthly: 0,
          yearly: 0,
          mrr: stats.kpis.mrr,
          arr: stats.kpis.mrr * 12,
          churnRate: 0,
        },
      });
      setLoading(false);
    }
    load();
  }, []);

  function formatCents(cents: number) {
    return (cents / 100).toFixed(2).replace(".", ",") + " €";
  }

  if (loading) {
    return (
      <div>
        <div className="admin-page-header">
          <h1 className="admin-page-title">Abonnements</h1>
          <p className="admin-page-sub">Wird geladen...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;
  const { kpis } = data;

  const planBreakdown = [
    { name: "Monatlich", count: kpis.monthly },
    { name: "Jährlich", count: kpis.yearly },
  ];

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Abonnements</h1>
        <p className="admin-page-sub">VIP Community Abo-Verwaltung</p>
      </div>

      <div className="admin-kpi-grid">
        <KpiCard label="Aktive Abos" value={String(kpis.active)} sub="VIP-Mitglieder" />
        <KpiCard label="MRR" value={formatCents(kpis.mrr)} sub="Monthly Recurring Revenue" />
        <KpiCard label="ARR" value={formatCents(kpis.arr)} sub="Annual Recurring Revenue" />
        <KpiCard label="Churn-Rate" value={`${kpis.churnRate.toFixed(1)}%`} sub="Kündigungsrate" />
      </div>

      <div className="admin-chart-grid">
        <div className="admin-chart-card">
          <div className="admin-chart-title">Plan-Verteilung</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={planBreakdown}>
              <XAxis dataKey="name" tick={{ fill: "#78716c", fontSize: 12 }} tickLine={false} axisLine={{ stroke: "#292524" }} />
              <YAxis tick={{ fill: "#78716c", fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#1c1917", border: "1px solid #292524", borderRadius: "0.5rem", color: "#e7e5e4" }} />
              <Bar dataKey="count" fill="#c8a44e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="admin-chart-card">
          <div className="admin-chart-title">Status-Übersicht</div>
          <div style={{ padding: "1rem 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
              <span style={{ color: "#a8a29e", fontSize: "0.85rem" }}>Aktiv</span>
              <span className="admin-badge admin-badge-green">{kpis.active}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#a8a29e", fontSize: "0.85rem" }}>Gekündigt</span>
              <span className="admin-badge admin-badge-red">{kpis.canceled}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
