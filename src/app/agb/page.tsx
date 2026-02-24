import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AGB – traveling.prof",
  robots: { index: true, follow: true },
};

export default function AGB() {
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
            <h1 className="section-title" style={{ marginBottom: "1.5rem" }}>Allgemeine Geschäftsbedingungen</h1>

            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>§ 1 Geltungsbereich</h2>
            <p style={{ color: "var(--text-sub)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge, die über die Website traveling.prof (nachfolgend &quot;Website&quot;) zwischen dem Anbieter und dem Kunden geschlossen werden. Abweichende AGB des Kunden werden nicht anerkannt.
            </p>

            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>§ 2 Vertragspartner</h2>
            <p style={{ color: "var(--text-sub)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              Anbieter ist Robert Engel, Iserlohn, Deutschland. Kontakt: traveling.prof@outlook.de.
            </p>

            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>§ 3 Vertragsgegenstand</h2>
            <p style={{ color: "var(--text-sub)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              Gegenstand des Vertrags ist der Erwerb digitaler Produkte (PDFs, Excel-Dateien, Video-Kurse) sowie die Buchung von Beratungsleistungen (1:1 Strategie-Calls) und Community-Mitgliedschaften, wie auf der Website beschrieben.
            </p>

            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>§ 4 Vertragsschluss</h2>
            <p style={{ color: "var(--text-sub)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              Die Darstellung der Produkte auf der Website stellt kein rechtlich bindendes Angebot dar, sondern eine Aufforderung zur Abgabe eines Angebots. Der Vertrag kommt durch die Bestellung des Kunden und die Annahme durch den Anbieter (Bestätigungsmail oder Bereitstellung des Produkts) zustande.
            </p>

            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>§ 5 Preise und Zahlung</h2>
            <p style={{ color: "var(--text-sub)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              Alle angegebenen Preise sind Endpreise inkl. gesetzlicher Umsatzsteuer (sofern zutreffend). Die Zahlung erfolgt über Stripe oder PayPal. Der Kaufpreis ist sofort bei Bestellung fällig. Es gelten die jeweiligen Nutzungsbedingungen des Zahlungsdienstleisters.
            </p>

            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>§ 6 Lieferung digitaler Inhalte</h2>
            <p style={{ color: "var(--text-sub)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              Digitale Produkte werden nach Zahlungseingang per E-Mail als Download-Link bereitgestellt oder über die jeweilige Kursplattform freigeschaltet. Der Kunde erhält ein einfaches, nicht übertragbares Nutzungsrecht für den persönlichen Gebrauch.
            </p>

            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>§ 7 Widerrufsrecht</h2>
            <p style={{ color: "var(--text-sub)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              Es gelten die gesetzlichen Widerrufsrechte. Die ausführliche Widerrufsbelehrung findest du unter{" "}
              <Link href="/widerruf" style={{ color: "var(--accent)" }}>Widerrufsbelehrung</Link>.
              Hinweis: Bei digitalen Inhalten kann das Widerrufsrecht gemäß § 356 Abs. 5 BGB vorzeitig erlöschen, wenn der Kunde der sofortigen Bereitstellung ausdrücklich zugestimmt hat.
            </p>

            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>§ 8 Gewährleistung und Haftung</h2>
            <p style={{ color: "var(--text-sub)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              Die Inhalte der Produkte wurden sorgfältig erstellt. Eine Garantie für den wirtschaftlichen Erfolg des Kunden wird nicht übernommen. Die Haftung für leichte Fahrlässigkeit wird ausgeschlossen, soweit keine wesentlichen Vertragspflichten betroffen sind. Die Haftung für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit bleibt unberührt.
            </p>

            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>§ 9 Urheberrecht</h2>
            <p style={{ color: "var(--text-sub)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              Alle Inhalte (Texte, Grafiken, Videos, Kalkulatoren) sind urheberrechtlich geschützt. Eine Weitergabe, Vervielfältigung, Veröffentlichung oder kommerzielle Nutzung ohne schriftliche Zustimmung des Anbieters ist untersagt.
            </p>

            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>§ 10 Community-Mitgliedschaft</h2>
            <p style={{ color: "var(--text-sub)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              Die VIP Community Jahresmitgliedschaft hat eine Laufzeit von 12 Monaten und verlängert sich automatisch um weitere 12 Monate, sofern nicht mindestens 30 Tage vor Ablauf gekündigt wird. Die Kündigung kann per E-Mail an traveling.prof@outlook.de erfolgen.
            </p>

            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>§ 11 Datenschutz</h2>
            <p style={{ color: "var(--text-sub)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              Informationen zur Verarbeitung personenbezogener Daten findest du in unserer{" "}
              <Link href="/datenschutz" style={{ color: "var(--accent)" }}>Datenschutzerklärung</Link>.
            </p>

            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>§ 12 Schlussbestimmungen</h2>
            <p style={{ color: "var(--text-sub)", marginBottom: "2rem", lineHeight: 1.7 }}>
              Es gilt das Recht der Bundesrepublik Deutschland. Sollten einzelne Bestimmungen unwirksam sein, bleiben die übrigen Bestimmungen hiervon unberührt. Gerichtsstand ist, soweit gesetzlich zulässig, Iserlohn.
            </p>

            <p style={{ color: "var(--muted)", fontSize: "0.78rem", marginBottom: "2rem" }}>Stand: Februar 2026</p>

            <Link href="/" className="btn btn-secondary btn-sm">← Zurück zur Startseite</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
