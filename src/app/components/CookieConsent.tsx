"use client";

import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: "rgba(28,25,23,0.97)",
        backdropFilter: "blur(12px)",
        color: "#fafaf9",
        padding: "1.25rem 1.5rem",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        animation: "slideUp 0.4s ease",
      }}
    >
      <style>{`@keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: none; opacity: 1; } }`}</style>
      <p style={{ fontSize: "0.82rem", lineHeight: 1.6, maxWidth: "38rem", margin: 0 }}>
        Diese Website verwendet technisch notwendige Cookies. Externe Dienste (Stripe, Calendly)
        setzen ggf. eigene Cookies.{" "}
        <a href="/datenschutz" style={{ color: "#e8720c", textDecoration: "underline" }}>
          Datenschutzerklärung
        </a>
      </p>
      <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
        <button
          onClick={decline}
          style={{
            padding: "0.45rem 1rem",
            borderRadius: "9999px",
            border: "1px solid rgba(255,255,255,0.15)",
            background: "transparent",
            color: "#a8a29e",
            fontSize: "0.78rem",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Nur notwendige
        </button>
        <button
          onClick={accept}
          style={{
            padding: "0.45rem 1rem",
            borderRadius: "9999px",
            border: "none",
            background: "linear-gradient(135deg, #e8720c, #f59e0b)",
            color: "#fff",
            fontSize: "0.78rem",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Alle akzeptieren
        </button>
      </div>
    </div>
  );
}
