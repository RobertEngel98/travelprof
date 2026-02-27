"use client";

import { useEffect, useState } from "react";
import KpiCard from "../components/KpiCard";
import DataTable from "../components/DataTable";

interface User {
  id: string;
  name: string;
  email: string;
  status: string;
  purchases: number;
  created_at: string;
}

export default function NutzerPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/users?search=${encodeURIComponent(search)}`)
      .then((r) => r.json())
      .then((data) => {
        setUsers(data.users);
        setTotal(data.total);
      })
      .finally(() => setLoading(false));
  }, [search]);

  const vipCount = users.filter((u) => u.status === "VIP").length;

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Nutzer</h1>
        <p className="admin-page-sub">Alle registrierten Nutzer im Überblick</p>
      </div>

      <div className="admin-kpi-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <KpiCard label="Nutzer gesamt" value={String(total)} />
        <KpiCard label="VIP-Mitglieder" value={String(vipCount)} />
        <KpiCard label="Free-Nutzer" value={String(total - vipCount)} />
      </div>

      <DataTable
        title="Nutzerliste"
        actions={
          <input
            type="text"
            className="admin-search"
            placeholder="Name oder E-Mail suchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        }
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "E-Mail" },
          {
            key: "status",
            label: "Status",
            render: (row) => (
              <span className={`admin-badge ${row.status === "VIP" ? "admin-badge-orange" : "admin-badge-gray"}`}>
                {row.status}
              </span>
            ),
          },
          { key: "purchases", label: "Käufe" },
          {
            key: "created_at",
            label: "Registriert",
            render: (row) =>
              new Date(row.created_at).toLocaleDateString("de-DE"),
          },
        ]}
        data={loading ? [] : users}
      />
    </div>
  );
}
