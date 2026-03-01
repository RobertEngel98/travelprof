import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum – traveling.prof",
  robots: { index: true, follow: true },
};

export default function Impressum() {
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
            <h1 className="section-title" style={{ marginBottom: "1.5rem" }}>Impressum</h1>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>Angaben gemäß § 5 TMG</h2>
            <p style={{ color: "var(--text-sub)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              Robert Engel<br />Iserlohn<br />Nordrhein-Westfalen, Deutschland
            </p>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>Kontakt</h2>
            <p style={{ color: "var(--text-sub)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              E-Mail: info@travelingprof.de<br />Instagram: <a href="https://www.instagram.com/traveling.prof" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>@traveling.prof</a>
            </p>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <p style={{ color: "var(--text-sub)", marginBottom: "1.5rem", lineHeight: 1.7 }}>Robert Engel<br />Iserlohn, Deutschland</p>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>Haftungsausschluss</h2>
            <p style={{ color: "var(--text-sub)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              Die Inhalte dieser Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden.
            </p>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>Haftung für Links</h2>
            <p style={{ color: "var(--text-sub)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              Diese Website enthält Links zu externen Websites Dritter, auf deren Inhalte kein Einfluss besteht.
            </p>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>Affiliate-Hinweis</h2>
            <p style={{ color: "var(--text-sub)", marginBottom: "2rem", lineHeight: 1.7 }}>
              Einige Links auf dieser Website sind Affiliate-Links. Bei Nutzung dieser Links kann eine Provision an den Betreiber dieser Website fließen. Für den Nutzer entstehen keine Mehrkosten.
            </p>
            <Link href="/" className="btn btn-secondary btn-sm">← Zurück zur Startseite</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
