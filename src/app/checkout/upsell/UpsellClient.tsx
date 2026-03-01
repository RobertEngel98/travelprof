"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { UpsellOffer } from "@/lib/upsell-config";

interface Props {
  purchasedProductName: string;
  upsell: UpsellOffer;
  downsell?: UpsellOffer;
}

export default function UpsellClient({
  purchasedProductName,
  upsell,
  downsell,
}: Props) {
  const router = useRouter();
  const [phase, setPhase] = useState<"upsell" | "downsell">("upsell");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(upsell.timerMinutes * 60);

  const currentOffer = phase === "upsell" ? upsell : downsell!;

  // Countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) {
      router.push("/dashboard?checkout=success&product=true");
      return;
    }
    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft, router]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const handleAccept = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/stripe/one-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: currentOffer.productId,
          amount: currentOffer.specialPrice,
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/dashboard?checkout=success&upsell=true");
        return;
      }

      if (data.requiresAuth) {
        setError(data.error);
      } else {
        setError(data.error || "Etwas ist schiefgelaufen.");
      }
    } catch {
      setError("Verbindungsfehler. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  }, [currentOffer, router]);

  const handleDecline = useCallback(() => {
    if (phase === "upsell" && downsell) {
      setPhase("downsell");
      setSecondsLeft(downsell.timerMinutes * 60);
      setError("");
    } else {
      router.push("/dashboard?checkout=success&product=true");
    }
  }, [phase, downsell, router]);

  return (
    <div className="upsell-page">
      <div className="upsell-container">
        {/* Success banner */}
        <div className="upsell-success-banner">
          <p>Dein Kauf war erfolgreich: {purchasedProductName}</p>
        </div>

        {/* Timer */}
        <div className="upsell-timer">
          Dieses Angebot endet in{" "}
          <strong>
            {minutes}:{seconds.toString().padStart(2, "0")}
          </strong>
        </div>

        {/* Offer card */}
        <div className="upsell-card">
          <div className="upsell-badge">
            {phase === "upsell" ? "Exklusives Angebot" : "Letzte Chance"}
          </div>

          <h2 className="upsell-headline">{currentOffer.headline}</h2>
          <p className="upsell-subline">{currentOffer.subline}</p>

          <ul className="upsell-bullets">
            {currentOffer.bulletPoints.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>

          <div className="upsell-price-block">
            <span className="upsell-price-original">
              {currentOffer.originalPriceDisplay}€
            </span>
            <span className="upsell-price-special">
              {currentOffer.specialPriceDisplay}
            </span>
            <span className="upsell-price-currency">€</span>
          </div>

          {error && (
            <p
              style={{
                color: "#dc2626",
                fontSize: "0.82rem",
                marginBottom: "0.75rem",
              }}
            >
              {error}
            </p>
          )}

          {loading ? (
            <div className="upsell-loading">Wird verarbeitet...</div>
          ) : (
            <button
              onClick={handleAccept}
              className="btn btn-primary upsell-accept"
            >
              {currentOffer.ctaText}
            </button>
          )}

          <button onClick={handleDecline} className="upsell-decline">
            Nein danke, weiter zum Dashboard →
          </button>
        </div>
      </div>
    </div>
  );
}
