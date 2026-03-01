"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  icon: string;
  price: number;
  price_display: string;
  type: string;
  active: boolean;
  sort_order: number;
  stripe_product_id: string | null;
}

export default function ProduktePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  function fetchProducts() {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((data) => setProducts(data.products ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function syncStripe() {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch("/api/admin/stripe-sync-products", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setSyncResult(`Fehler: ${data.error}`);
        return;
      }
      const parts: string[] = [];
      if (data.synced > 0) parts.push(`${data.synced} synchronisiert`);
      if (data.skipped > 0) parts.push(`${data.skipped} übersprungen`);
      if (data.errors?.length > 0) parts.push(`${data.errors.length} Fehler`);
      setSyncResult(parts.join(", ") || "Nichts zu tun");
      fetchProducts();
    } catch {
      setSyncResult("Netzwerkfehler");
    } finally {
      setSyncing(false);
    }
  }

  async function toggleActive(id: string, active: boolean) {
    await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !active } : p))
    );
  }

  return (
    <div>
      <div className="admin-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 className="admin-page-title">Produkte</h1>
          <p className="admin-page-sub">Produkte verwalten und bearbeiten</p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <button
            className="admin-btn admin-btn-secondary"
            onClick={syncStripe}
            disabled={syncing}
          >
            {syncing ? "Synchronisiere..." : "Mit Stripe synchronisieren"}
          </button>
          <Link href="/admin/produkte/neu" className="admin-btn admin-btn-primary" style={{ textDecoration: "none" }}>
            + Neues Produkt
          </Link>
        </div>
      </div>

      {syncResult && (
        <p style={{ color: syncResult.startsWith("Fehler") ? "#dc2626" : "#16a34a", marginBottom: "1rem", fontSize: "0.875rem" }}>
          {syncResult}
        </p>
      )}

      {loading ? (
        <p style={{ color: "#78716c" }}>Wird geladen...</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Icon</th>
                <th>Name</th>
                <th>Preis</th>
                <th>Typ</th>
                <th>Stripe</th>
                <th>Aktiv</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.sort_order}</td>
                  <td style={{ fontSize: "1.25rem" }}>{p.icon}</td>
                  <td style={{ fontWeight: 500 }}>{p.name}</td>
                  <td>{p.price_display} €</td>
                  <td>
                    <span className={`admin-badge ${p.type === "subscription" ? "admin-badge-orange" : "admin-badge-gray"}`}>
                      {p.type === "subscription" ? "Abo" : "Einmal"}
                    </span>
                  </td>
                  <td>
                    {p.stripe_product_id ? (
                      <span className="admin-badge admin-badge-green">Verknüpft</span>
                    ) : (
                      <span className="admin-badge admin-badge-gray">–</span>
                    )}
                  </td>
                  <td>
                    <button
                      className={`admin-toggle ${p.active ? "on" : ""}`}
                      onClick={() => toggleActive(p.id, p.active)}
                    />
                  </td>
                  <td>
                    <Link
                      href={`/admin/produkte/${p.id}`}
                      className="admin-btn admin-btn-secondary"
                      style={{ textDecoration: "none", padding: "0.35rem 0.75rem", fontSize: "0.78rem" }}
                    >
                      Bearbeiten
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
