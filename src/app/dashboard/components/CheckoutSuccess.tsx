"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Claim guest purchase if session_id is present
    const claimSession = searchParams.get("claim_session");
    if (claimSession) {
      fetch("/api/products/claim-purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: claimSession }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setMessage(
              data.already_claimed
                ? "Dein Produkt ist bereits freigeschaltet! Du findest es unter Meine Produkte."
                : "Produkt erfolgreich freigeschaltet! Du findest es unter Meine Produkte."
            );
            setVisible(true);
          }
        })
        .catch(() => {});
      window.history.replaceState({}, "", "/dashboard");
      return;
    }

    const checkout = searchParams.get("checkout");
    if (checkout !== "success") return;

    const product = searchParams.get("product");
    const upsell = searchParams.get("upsell");
    if (upsell) {
      setMessage("Upsell erfolgreich! Alle Produkte findest du unter Meine Produkte.");
    } else if (product) {
      setMessage("Produkt erfolgreich gekauft! Du findest es unter Meine Produkte.");
    } else {
      setMessage("Kauf erfolgreich! Du findest deine Produkte unter Meine Produkte.");
    }
    setVisible(true);

    // Remove query params from URL
    window.history.replaceState({}, "", "/dashboard");

    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, [searchParams]);

  if (!visible) return null;

  return (
    <div
      style={{
        background: "#052e16",
        border: "1px solid #166534",
        borderRadius: "0.75rem",
        padding: "1rem 1.25rem",
        marginBottom: "1.5rem",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        animation: "fadeIn 0.3s ease",
      }}
    >
      <span
        style={{
          background: "#22c55e",
          color: "#fff",
          borderRadius: "50%",
          width: 28,
          height: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: "0.9rem",
          flexShrink: 0,
        }}
      >
        ✓
      </span>
      <span style={{ color: "#bbf7d0", fontSize: "0.9rem", fontWeight: 500 }}>
        {message}
      </span>
      <button
        onClick={() => setVisible(false)}
        style={{
          marginLeft: "auto",
          background: "none",
          border: "none",
          color: "#4ade80",
          cursor: "pointer",
          fontSize: "1.1rem",
          padding: 0,
          lineHeight: 1,
        }}
        aria-label="Schließen"
      >
        ×
      </button>
    </div>
  );
}
