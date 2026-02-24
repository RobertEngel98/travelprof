import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung – traveling.prof",
  robots: { index: true, follow: true },
};

export default function Datenschutz() {
  return (
    <div className="page">
      <header>
        <div className="container">
          <nav className="nav">
            <Link href="/" className="nav-brand" style={{ textDecoration: "none" }}>
              <div className="nav-brand-mark">TP</div>
              <div className="nav-brand-text">
                <div className="nav-brand-name">traveling.prof</div>
                <div className="nav-brand-tag">Travel Hacks · Meilen · Luxusreisen</div>
              </div>
            </Link>
          </nav>
        </div>
      </header>
      <main>
        <section>
          <div className="container" style={{ maxWidth: 680 }}>
            <h1 className="section-title" style={{ marginBottom: "1.5rem" }}>Datenschutzerklärung</h1>

            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>1. Datenschutz auf einen Blick</h2>
            <p style={{ color: "var(--text-sub)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              Die folgenden Hinweise geben einen Überblick darüber, was mit deinen personenbezogenen Daten passiert, wenn du diese Website besuchst.
            </p>

            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>2. Verantwortliche Stelle</h2>
            <p style={{ color: "var(--text-sub)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              Robert Engel<br />Iserlohn, Nordrhein-Westfalen<br />Deutschland<br />E-Mail: traveling.prof@outlook.de
            </p>

            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>3. Hosting</h2>
            <p style={{ color: "var(--text-sub)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              Diese Website wird bei Vercel Inc. gehostet. Beim Aufruf werden technisch bedingt Informationen erfasst (IP-Adresse, Zugriffszeit, übertragene Datenmenge). Weitere Infos: vercel.com/legal/privacy-policy
            </p>

            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>4. Cookies</h2>
            <p style={{ color: "var(--text-sub)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              Diese Seite verwendet aktuell keine Tracking-Cookies. Sollten Cookies eingesetzt werden (z.B. durch Calendly, Stripe, PayPal), wirst du darüber informiert.
            </p>

            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>5. Externe Links &amp; Affiliate-Links</h2>
            <p style={{ color: "var(--text-sub)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              Diese Website enthält Links zu externen Seiten. Beim Klick gelten die Datenschutzbestimmungen der Drittanbieter. Für Affiliate-Links kann eine Provision an den Betreiber fließen.
            </p>

            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>6. Zahlungsabwicklung</h2>
            <p style={{ color: "var(--text-sub)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              Zahlungen werden über Stripe und/oder PayPal abgewickelt. Die Zahlungsdaten werden ausschließlich von diesen zertifizierten Anbietern verarbeitet. Es werden keine Kreditkartendaten auf unseren Servern gespeichert.
            </p>

            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>7. Deine Rechte</h2>
            <p style={{ color: "var(--text-sub)", marginBottom: "2rem", lineHeight: 1.7 }}>
              Du hast jederzeit das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung deiner personenbezogenen Daten. Kontakt: traveling.prof@outlook.de
            </p>

            <Link href="/" className="btn btn-secondary btn-sm">← Zurück zur Startseite</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
