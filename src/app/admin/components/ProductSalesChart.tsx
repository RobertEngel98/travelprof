"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface DataPoint {
  name: string;
  sales: number;
  revenue: number;
}

export default function ProductSalesChart({ data }: { data: DataPoint[] }) {
  return (
    <div className="admin-chart-card">
      <div className="admin-chart-title">Verkäufe nach Produkt</div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            tick={{ fill: "#78716c", fontSize: 10 }}
            tickLine={false}
            axisLine={{ stroke: "#292524" }}
            interval={0}
            angle={-20}
            textAnchor="end"
            height={60}
          />
          <YAxis
            tick={{ fill: "#78716c", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{ background: "#1c1917", border: "1px solid #292524", borderRadius: "0.5rem", color: "#e7e5e4" }}
            formatter={(value: number | undefined) => [value ?? 0, "Verkäufe"]}
            labelStyle={{ color: "#78716c" }}
          />
          <Bar dataKey="sales" fill="#e8720c" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
