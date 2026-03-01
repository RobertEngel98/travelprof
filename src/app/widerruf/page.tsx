import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Widerrufsbelehrung – traveling.prof",
  robots: { index: true, follow: true },
};

export default function Widerruf() {
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
            <h1 className="section-title" style={{ marginBottom: "1.5rem" }}>Widerrufsbelehrung</h1>

            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>Widerrufsrecht</h2>
            <p style={{ color: "var(--text-sub)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              Du hast das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsschlusses. Um dein Widerrufsrecht auszuüben, musst du uns (Robert Engel, Iserlohn, Deutschland, E-Mail: info@travelingprof.de) mittels einer eindeutigen Erklärung (z.B. per E-Mail) über deinen Entschluss, diesen Vertrag zu widerrufen, informieren.
            </p>

            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>Folgen des Widerrufs</h2>
            <p style={{ color: "var(--text-sub)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              Wenn du diesen Vertrag widerrufst, haben wir dir alle Zahlungen, die wir von dir erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über deinen Widerruf bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das du bei der ursprünglichen Transaktion eingesetzt hast, es sei denn, mit dir wurde ausdrücklich etwas anderes vereinbart.
            </p>

            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>Besonderer Hinweis: Digitale Inhalte</h2>
            <p style={{ color: "var(--text-sub)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              Das Widerrufsrecht erlischt bei einem Vertrag über die Lieferung von nicht auf einem körperlichen Datenträger befindlichen digitalen Inhalten, wenn der Unternehmer mit der Ausführung des Vertrags begonnen hat, nachdem der Verbraucher ausdrücklich zugestimmt hat, dass der Unternehmer mit der Ausführung des Vertrags vor Ablauf der Widerrufsfrist beginnt, und der Verbraucher seine Kenntnis davon bestätigt hat, dass er durch seine Zustimmung mit Beginn der Ausführung des Vertrags sein Widerrufsrecht verliert (§ 356 Abs. 5 BGB).
            </p>
            <p style={{ color: "var(--text-sub)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              Das bedeutet: Wenn du einem sofortigen Download oder Zugang zu digitalen Inhalten (PDFs, Excel-Dateien, Video-Kurse) zustimmst, erlischt dein Widerrufsrecht mit Beginn des Downloads bzw. der Freischaltung.
            </p>

            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>Muster-Widerrufsformular</h2>
            <div style={{ background: "var(--bg-warm)", border: "1px solid var(--border-soft)", borderRadius: "0.75rem", padding: "1.25rem", marginBottom: "1.5rem" }}>
              <p style={{ color: "var(--text-sub)", lineHeight: 1.7, fontSize: "0.88rem" }}>
                An: Robert Engel, Iserlohn, Deutschland, info@travelingprof.de<br /><br />
                Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden Waren (*)/die Erbringung der folgenden Dienstleistung (*):<br /><br />
                Bestellt am (*)/erhalten am (*):<br />
                Name des/der Verbraucher(s):<br />
                Anschrift des/der Verbraucher(s):<br />
                Datum:<br />
                Unterschrift (nur bei Mitteilung auf Papier):<br /><br />
                <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>(*) Unzutreffendes streichen.</span>
              </p>
            </div>

            <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>Ausnahmen vom Widerrufsrecht</h2>
            <p style={{ color: "var(--text-sub)", marginBottom: "2rem", lineHeight: 1.7 }}>
              Das Widerrufsrecht besteht nicht bei Verträgen zur Lieferung von digitalen Inhalten, die nicht auf einem körperlichen Datenträger geliefert werden, wenn die Ausführung mit ausdrücklicher Zustimmung des Verbrauchers vor Ablauf der Widerrufsfrist begonnen hat und der Verbraucher die Kenntnis vom Verlust des Widerrufsrechts bestätigt hat.
            </p>

            <p style={{ color: "var(--muted)", fontSize: "0.78rem", marginBottom: "2rem" }}>Stand: Februar 2026</p>

            <Link href="/" className="btn btn-secondary btn-sm">← Zurück zur Startseite</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
