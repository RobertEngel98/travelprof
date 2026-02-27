"use client";

import { useEffect, useState } from "react";
import KpiCard from "../components/KpiCard";
import DateRangeSelector from "../components/DateRangeSelector";
import DataTable from "../components/DataTable";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface RevenueData {
  totalRevenue: number;
  revenueChart: { date: string; revenue: number }[];
  productChart: { name: string; sales: number; revenue: number }[];
  mrr: number;
  arr: number;
  transactions: { id: string; product: string; amount: number; date: string }[];
}

export default function UmsatzPage() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/revenue?days=${days}`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [days]);

  function formatCents(cents: number) {
    return (cents / 100).toFixed(2).replace(".", ",") + " €";
  }

  return (
    <div>
      <div className="admin-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 className="admin-page-title">Umsatz</h1>
          <p className="admin-page-sub">Umsatz-Analyse und Transaktionen</p>
        </div>
        <DateRangeSelector value={days} onChange={setDays} />
      </div>

      {loading ? (
        <p style={{ color: "#78716c" }}>Wird geladen...</p>
      ) : data ? (
        <>
          <div className="admin-kpi-grid">
            <KpiCard label="Umsatz (Zeitraum)" value={formatCents(data.totalRevenue)} />
            <KpiCard label="MRR (Abos)" value={formatCents(data.mrr)} />
            <KpiCard label="ARR (hochgerechnet)" value={formatCents(data.arr)} />
            <KpiCard label="Transaktionen" value={String(data.transactions.length)} />
          </div>

          <div className="admin-chart-grid">
            <div className="admin-chart-card full">
              <div className="admin-chart-title">Umsatz-Verlauf</div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={data.revenueChart}>
                  <defs>
                    <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e8720c" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#e8720c" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" tick={{ fill: "#78716c", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "#292524" }} />
                  <YAxis tick={{ fill: "#78716c", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 100).toFixed(0)}€`} />
                  <Tooltip
                    contentStyle={{ background: "#1c1917", border: "1px solid #292524", borderRadius: "0.5rem", color: "#e7e5e4" }}
                    formatter={(value: number | undefined) => [`${((value ?? 0) / 100).toFixed(2).replace(".", ",")} €`, "Umsatz"]}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#e8720c" fill="url(#revGrad2)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="admin-chart-card full">
              <div className="admin-chart-title">Umsatz nach Produkt</div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.productChart}>
                  <XAxis dataKey="name" tick={{ fill: "#78716c", fontSize: 10 }} tickLine={false} axisLine={{ stroke: "#292524" }} />
                  <YAxis tick={{ fill: "#78716c", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 100).toFixed(0)}€`} />
                  <Tooltip
                    contentStyle={{ background: "#1c1917", border: "1px solid #292524", borderRadius: "0.5rem", color: "#e7e5e4" }}
                    formatter={(value: number | undefined) => [`${((value ?? 0) / 100).toFixed(2).replace(".", ",")} €`, "Umsatz"]}
                  />
                  <Bar dataKey="revenue" fill="#c8a44e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <DataTable
            title="Letzte Transaktionen"
            columns={[
              { key: "product", label: "Produkt" },
              {
                key: "amount",
                label: "Betrag",
                render: (row) => formatCents(row.amount),
              },
              {
                key: "date",
                label: "Datum",
                render: (row) =>
                  new Date(row.date).toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
              },
            ]}
            data={data.transactions}
          />
        </>
      ) : null}
    </div>
  );
}
