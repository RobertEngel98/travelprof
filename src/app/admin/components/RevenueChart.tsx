"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface DataPoint {
  date: string;
  revenue: number;
}

export default function RevenueChart({ data }: { data: DataPoint[] }) {
  return (
    <div className="admin-chart-card full">
      <div className="admin-chart-title">Umsatz (letzte 30 Tage)</div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#e8720c" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#e8720c" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tick={{ fill: "#78716c", fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "#292524" }}
          />
          <YAxis
            tick={{ fill: "#78716c", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${(v / 100).toFixed(0)}€`}
          />
          <Tooltip
            contentStyle={{ background: "#1c1917", border: "1px solid #292524", borderRadius: "0.5rem", color: "#e7e5e4" }}
            formatter={(value: number | undefined) => [`${((value ?? 0) / 100).toFixed(2).replace(".", ",")} €`, "Umsatz"]}
            labelStyle={{ color: "#78716c" }}
          />
          <Area type="monotone" dataKey="revenue" stroke="#e8720c" fill="url(#revGrad)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
