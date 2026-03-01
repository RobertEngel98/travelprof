"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Product {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  price: number;
  price_display: string;
}

interface Purchase {
  id: string;
  product_id: string;
  product_name: string;
  amount: number;
  created_at: string;
}

export default function ProduktePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function load() {
      // Fetch active products from DB and user purchases in parallel
      const [productsRes, purchasesRes] = await Promise.all([
        supabase.from("products").select("id, name, description, icon, price, price_display").eq("active", true).order("sort_order"),
        supabase.from("purchases").select("*").order("created_at", { ascending: false }),
      ]);
      setProducts(productsRes.data ?? []);
      setPurchases(purchasesRes.data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  async function handleBuy(productId: string, price: number) {
    if (price === 0) {
      // Free product: claim directly
      const res = await fetch("/api/products/claim-free", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        // Reload purchases
        const { data } = await supabase.from("purchases").select("*").order("created_at", { ascending: false });
        setPurchases(data ?? []);
      }
      return;
    }
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
  }

  const cardStyle = {
    background: "var(--bg-warm)",
    border: "1px solid var(--border-soft)",
    borderRadius: "1rem",
    padding: "1.5rem",
  };

  const ownedProducts = new Set(purchases.map((p) => p.product_id));

  // Product detail links
  function getProductLink(id: string): string {
    if (id === "analyse") return "/dashboard/analyse";
    return `/dashboard/produkte/${id}`;
  }

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>Meine Produkte</h1>
      <p style={{ color: "var(--text-sub)", marginBottom: "2rem" }}>
        Alle digitalen Produkte und Kurse im Überblick.
      </p>

      {loading ? (
        <p style={{ color: "var(--muted)" }}>Wird geladen...</p>
      ) : (
        <div className="dash-grid-2">
          {products.map((product) => {
            const owned = ownedProducts.has(product.id);
            return (
              <div key={product.id} style={{ ...cardStyle, opacity: owned ? 1 : 0.85 }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{product.icon}</div>
                <h3 style={{ fontWeight: 600, marginBottom: "0.375rem" }}>{product.name}</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-sub)", marginBottom: "1rem", lineHeight: 1.6 }}>
                  {product.description ?? ""}
                </p>
                {owned ? (
                  <button
                    onClick={() => router.push(getProductLink(product.id))}
                    className="btn btn-primary btn-sm"
                  >
                    Öffnen
                  </button>
                ) : (
                  <button
                    onClick={() => handleBuy(product.id, product.price)}
                    className="btn btn-primary btn-sm"
                  >
                    {product.price === 0 ? "Gratis freischalten" : `Kaufen – ${product.price_display} €`}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {purchases.length > 0 && (
        <div style={{ marginTop: "2.5rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "1rem" }}>Kaufhistorie</h2>
          <div className="dash-table-wrap" style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-soft)" }}>
                  <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 600 }}>Produkt</th>
                  <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 600 }}>Betrag</th>
                  <th style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 600 }}>Datum</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((p) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid var(--border-soft)" }}>
                    <td style={{ padding: "0.75rem 1rem" }}>{p.product_name}</td>
                    <td style={{ padding: "0.6rem 0.75rem", whiteSpace: "nowrap" }}>
                      {(p.amount / 100).toFixed(2).replace(".", ",")} €
                    </td>
                    <td style={{ padding: "0.6rem 0.75rem", color: "var(--muted)", whiteSpace: "nowrap" }}>
                      {new Date(p.created_at).toLocaleDateString("de-DE")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
