"use client";

interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
}

export default function KpiCard({ label, value, sub }: KpiCardProps) {
  return (
    <div className="admin-kpi-card">
      <div className="admin-kpi-label">{label}</div>
      <div className="admin-kpi-value">{value}</div>
      {sub && <div className="admin-kpi-sub">{sub}</div>}
    </div>
  );
}
