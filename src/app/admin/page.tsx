"use client";

import { useEffect, useState } from "react";
import KpiCard from "./components/KpiCard";
import RevenueChart from "./components/RevenueChart";
import ProductSalesChart from "./components/ProductSalesChart";
import UsersChart from "./components/UsersChart";

interface Stats {
  kpis: {
    totalRevenue: number;
    totalUsers: number;
    activeSubs: number;
    waitlistCount: number;
    mrr: number;
  };
  charts: {
    revenue: { date: string; revenue: number }[];
    products: { name: string; sales: number; revenue: number }[];
    users: { week: string; users: number }[];
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <div className="admin-page-header">
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-sub">Wird geladen...</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const { kpis, charts } = stats;

  function formatCents(cents: number) {
    return (cents / 100).toFixed(2).replace(".", ",") + " €";
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-sub">Übersicht aller wichtigen Kennzahlen</p>
      </div>

      <div className="admin-kpi-grid">
        <KpiCard
          label="Gesamtumsatz"
          value={formatCents(kpis.totalRevenue)}
          sub="Einmalverkäufe"
        />
        <KpiCard
          label="Nutzer gesamt"
          value={String(kpis.totalUsers)}
        />
        <KpiCard
          label="Aktive Abos"
          value={String(kpis.activeSubs)}
          sub={`MRR: ${formatCents(kpis.mrr)}`}
        />
        <KpiCard
          label="Waitlist"
          value={String(kpis.waitlistCount)}
          sub="E-Mail-Adressen"
        />
      </div>

      <div className="admin-chart-grid">
        <RevenueChart data={charts.revenue} />
        <ProductSalesChart data={charts.products} />
        <UsersChart data={charts.users} />
      </div>
    </div>
  );
}
