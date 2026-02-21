import Link from "next/link";

export const metadata = { title: "Datenschutzerklärung – traveling.prof" };

export default function Datenschutz() {
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
              Datenschutzerklärung
            </h1>

            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              1. Datenschutz auf einen Blick
            </h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was
              mit deinen personenbezogenen Daten passiert, wenn du diese Website
              besuchst. Personenbezogene Daten sind alle Daten, mit denen du
              persönlich identifiziert werden kannst.
            </p>

            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              2. Allgemeine Hinweise und Pflichtinformationen
            </h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              Die Betreiber dieser Seiten nehmen den Schutz deiner persönlichen
              Daten sehr ernst. Wir behandeln deine personenbezogenen Daten
              vertraulich und entsprechend der gesetzlichen
              Datenschutzvorschriften sowie dieser Datenschutzerklärung.
            </p>

            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              3. Verantwortliche Stelle
            </h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              [Dein Vor- und Nachname]<br />
              [Straße und Hausnummer]<br />
              [PLZ Ort]<br />
              E-Mail: traveling.prof@outlook.de
            </p>

            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              4. Hosting
            </h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              Diese Website wird bei Vercel Inc. gehostet. Vercel kann beim Aufruf
              dieser Webseiten technisch bedingt Informationen erfassen (z.B.
              IP-Adresse, Datum und Uhrzeit des Zugriffs, übertragene Datenmenge).
              Weitere Informationen findest du in der Datenschutzerklärung von
              Vercel: https://vercel.com/legal/privacy-policy
            </p>

            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              5. Cookies
            </h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              Diese Seite verwendet aktuell keine Tracking-Cookies. Sollten in
              Zukunft Cookies eingesetzt werden (z.B. durch eingebundene Dienste
              wie Calendly, Stripe, PayPal), wirst du darüber gesondert informiert.
            </p>

            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              6. Externe Links &amp; Affiliate-Links
            </h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              Diese Website enthält Links zu externen Seiten (z.B. Instagram,
              Kreditkarten-Anbieter). Beim Klick auf diese Links gelten die
              jeweiligen Datenschutzbestimmungen der Drittanbieter. Für Affiliate-
              bzw. Referral-Links kann eine Provision an den Betreiber dieser
              Seite fließen.
            </p>

            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              7. Deine Rechte
            </h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", lineHeight: 1.7 }}>
              Du hast jederzeit das Recht auf Auskunft, Berichtigung, Löschung und
              Einschränkung der Verarbeitung deiner personenbezogenen Daten. Wende
              dich dazu an: traveling.prof@outlook.de
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
