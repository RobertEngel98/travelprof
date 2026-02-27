"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface DataPoint {
  week: string;
  users: number;
}

export default function UsersChart({ data }: { data: DataPoint[] }) {
  return (
    <div className="admin-chart-card">
      <div className="admin-chart-title">Neue Nutzer pro Woche</div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis
            dataKey="week"
            tick={{ fill: "#78716c", fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "#292524" }}
          />
          <YAxis
            tick={{ fill: "#78716c", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{ background: "#1c1917", border: "1px solid #292524", borderRadius: "0.5rem", color: "#e7e5e4" }}
            formatter={(value: number | undefined) => [value ?? 0, "Nutzer"]}
            labelStyle={{ color: "#78716c" }}
          />
          <Line type="monotone" dataKey="users" stroke="#c8a44e" strokeWidth={2} dot={{ fill: "#c8a44e", r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
