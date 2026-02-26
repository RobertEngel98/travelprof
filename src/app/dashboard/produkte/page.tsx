"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PRODUCTS } from "@/lib/stripe";

const PRODUCT_DETAILS: Record<string, { icon: string; description: string; link: string }> = {
  analyse: { icon: "✈️", description: "Deine persönliche Reiseanalyse mit maßgeschneiderten Empfehlungen.", link: "/dashboard/analyse" },
  ebook: { icon: "📖", description: "10 erprobte Buchungs-Hacks für günstige Business Class Flüge.", link: "/dashboard/produkte/ebook" },
  kreditkarten: { icon: "💳", description: "Der ultimative Vergleich der besten Reise-Kreditkarten 2025.", link: "/dashboard/produkte/kreditkarten" },
  crashkurs: { icon: "🎓", description: "5-Module Video-Kurs zum Meilen sammeln und einlösen.", link: "/dashboard/produkte/crashkurs" },
  masterplan: { icon: "🛋️", description: "Dein kompletter Guide für Lounge-Zugang und Upgrades.", link: "/dashboard/produkte/masterplan" },
};

interface Purchase {
  id: string;
  product_id: string;
  product_name: string;
  amount: number;
  created_at: string;
}

export default function ProduktePage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function loadPurchases() {
      const { data } = await supabase
        .from("purchases")
        .select("*")
        .order("created_at", { ascending: false });
      setPurchases(data ?? []);
      setLoading(false);
    }
    loadPurchases();
  }, []);

  async function handleBuy(productId: string) {
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

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>Meine Produkte</h1>
      <p style={{ color: "var(--text-sub)", marginBottom: "2rem" }}>
        Alle digitalen Produkte und Kurse im Überblick.
      </p>

      {loading ? (
        <p style={{ color: "var(--muted)" }}>Wird geladen...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
          {Object.entries(PRODUCTS).map(([id, product]) => {
            const owned = ownedProducts.has(id);
            const details = PRODUCT_DETAILS[id];
            return (
              <div key={id} style={{ ...cardStyle, opacity: owned ? 1 : 0.85 }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{details?.icon ?? "📦"}</div>
                <h3 style={{ fontWeight: 600, marginBottom: "0.375rem" }}>{product.name}</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-sub)", marginBottom: "1rem", lineHeight: 1.6 }}>
                  {details?.description ?? ""}
                </p>
                {owned ? (
                  <button
                    onClick={() => router.push(details?.link ?? "/dashboard/produkte")}
                    className="btn btn-primary btn-sm"
                  >
                    Öffnen
                  </button>
                ) : (
                  <button
                    onClick={() => handleBuy(id)}
                    className="btn btn-primary btn-sm"
                  >
                    Kaufen – {product.priceDisplay} €
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
          <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
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
                    <td style={{ padding: "0.75rem 1rem" }}>
                      {PRODUCTS[p.product_id as keyof typeof PRODUCTS]?.name ?? p.product_name}
                    </td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      {(p.amount / 100).toFixed(2).replace(".", ",")} €
                    </td>
                    <td style={{ padding: "0.75rem 1rem", color: "var(--muted)" }}>
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
