import Link from "next/link";

export const metadata = { title: "Impressum – traveling.prof" };

export default function Impressum() {
  return (
    <div className="page">
      <header>
        <div className="container">
          <nav className="nav">
            <Link href="/" className="nav-left" style={{ textDecoration: "none" }}>
              <div className="logo-mark">TP</div>
              <div className="logo-text">
                <span className="logo-title">traveling.prof</span>
                <span className="logo-sub">Travel Hacks • Meilen • Luxusreisen</span>
              </div>
            </Link>
          </nav>
        </div>
      </header>
      <main>
        <section>
          <div className="container" style={{ maxWidth: "680px" }}>
            <h1 className="section-title" style={{ fontSize: "1.75rem", marginBottom: "1.5rem" }}>
              Impressum
            </h1>

            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              Angaben gemäß § 5 TMG
            </h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              [Dein Vor- und Nachname]<br />
              [Straße und Hausnummer]<br />
              [PLZ Ort]<br />
              [Land]
            </p>

            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              Kontakt
            </h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              E-Mail: traveling.prof@outlook.de<br />
              Instagram: @traveling.prof
            </p>

            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
            </h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              [Dein Vor- und Nachname]<br />
              [Adresse wie oben]
            </p>

            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              Haftungsausschluss
            </h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              Die Inhalte dieser Seiten wurden mit größter Sorgfalt erstellt.
              Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann
              jedoch keine Gewähr übernommen werden.
            </p>

            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              Haftung für Links
            </h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", lineHeight: 1.7 }}>
              Diese Website enthält Links zu externen Websites Dritter, auf deren
              Inhalte kein Einfluss besteht. Für die Inhalte der verlinkten Seiten
              ist stets der jeweilige Anbieter verantwortlich.
            </p>

            <Link href="/" className="btn btn-outline btn-sm">
              ← Zurück zur Startseite
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
