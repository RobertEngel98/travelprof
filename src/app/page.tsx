"use client";

import { useState } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <div className="page">
      {/* Header / Navigation */}
      <header>
        <div className="container">
          <nav className="nav">
            <div className="nav-left">
              <div className="logo-mark">TP</div>
              <div className="logo-text">
                <span className="logo-title">traveling.prof</span>
                <span className="logo-sub">Travel Hacks • Meilen • Luxusreisen</span>
              </div>
            </div>
            <div className="nav-links">
              <a href="#about">Über mich</a>
              <a href="#hacks">Travel Hacks</a>
              <a href="#community">Community</a>
              <a href="#contact">Kontakt</a>
            </div>
            <div className="nav-cta">
              <a
                href="https://www.instagram.com/traveling.prof"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Instagram ansehen →
              </a>
            </div>
            <button
              className="nav-toggle"
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menü öffnen"
            >
              Menü <span>{menuOpen ? "✕" : "☰"}</span>
            </button>
          </nav>
          <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
            <a href="#about" onClick={() => setMenuOpen(false)}>Über mich</a>
            <a href="#hacks" onClick={() => setMenuOpen(false)}>Travel Hacks</a>
            <a href="#community" onClick={() => setMenuOpen(false)}>Community</a>
            <a href="#contact" onClick={() => setMenuOpen(false)}>Kontakt</a>
            <a
              href="https://www.instagram.com/traveling.prof"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="btn btn-primary"
              style={{ marginTop: "0.25rem", alignSelf: "flex-start" }}
            >
              Instagram ansehen →
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="hero">
          <div className="container">
            <div className="hero-grid">
              <div>
                <div className="eyebrow">
                  <div className="eyebrow-dot"></div>
                  Mehr Reisen, weniger zahlen – mit echten Praxis-Hacks
                </div>
                <h1 className="hero-title">
                  Lerne, wie du <span className="hero-highlight">smarter reist</span>:
                  Business Class, Lounges &amp; Traumhotels zum schlauen Preis.
                </h1>
                <p className="hero-text">
                  Auf <strong>@traveling.prof</strong> zeige ich dir konkrete Strategien, wie du mit
                  Buchungstricks, Meilen, Punkten &amp; cleveren Travel Hacks mehr aus deinem
                  Reisebudget herausholst – ohne auf Komfort zu verzichten.
                </p>
                <div className="hero-cta">
                  <a
                    href="https://www.instagram.com/traveling.prof"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    Zu meinem Instagram-Profil
                  </a>
                  <a href="#contact" className="btn btn-ghost">
                    Gratis Travel-Hack-Update sichern
                  </a>
                </div>
                <div className="hero-meta">
                  <span>🌍 <strong>Fast 30 Länder</strong> bereist</span>
                  <span>✈️ Fokus: Travel Hacks, Lounges, Upgrades</span>
                  <span>📲 Tägliche Reels &amp; Story-Insights</span>
                </div>
              </div>

              <div className="hero-right">
                <div className="hero-badge">
                  Travel Status: <span>Auf dem Weg in die nächste Lounge 🥂</span>
                </div>
                <div className="hero-card">
                  <div className="hero-card-header">
                    <span>Dein möglicher Reise-Alltag</span>
                    <span className="hero-card-tag">Vorher vs. Nachher</span>
                  </div>
                  <div className="hero-card-body">
                    <div className="tile">
                      <div>
                        <div className="tile-label">Vorher</div>
                        <div className="tile-value">Teure Eco-Flüge, wenig Überblick</div>
                      </div>
                      <div className="tile-pill">💸 Hohe Kosten</div>
                    </div>
                    <div className="tile">
                      <div>
                        <div className="tile-label">Nachher</div>
                        <div className="tile-value">Smart gebuchte Business-Deals</div>
                      </div>
                      <div className="tile-pill">✨ Upgrade-Möglichkeiten</div>
                    </div>
                    <div className="tile">
                      <div>
                        <div className="tile-label">Vorher</div>
                        <div className="tile-value">Kaum Lounges, Stress am Airport</div>
                      </div>
                      <div className="tile-pill">⏱️ Warten im Gate</div>
                    </div>
                    <div className="tile">
                      <div>
                        <div className="tile-label">Nachher</div>
                        <div className="tile-value">Lounge-Zugang &amp; entspannter Start</div>
                      </div>
                      <div className="tile-pill">🥂 Entspannt &amp; produktiv</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Was dich erwartet */}
        <section id="hacks">
          <div className="container">
            <p className="section-label">Inhalte auf meinem Kanal</p>
            <h2 className="section-title">
              Was du bei <span className="hero-highlight">@traveling.prof</span> lernst
            </h2>
            <p className="section-sub">
              Statt nur schöne Bilder zu posten, bekommst du bei mir vor allem eines:{" "}
              <strong>konkrete, umsetzbare Travel Hacks</strong>, mit denen du günstiger buchst,
              besser fliegst und mehr aus jedem Trip herausholst.
            </p>

            <div className="cards-grid">
              <div className="card">
                <div className="card-icon">✈️</div>
                <h3 className="card-title">Meilen &amp; Punkte verstehen</h3>
                <p className="card-text">
                  Wie du mit Kreditkarten, Buchungsportalen &amp; Alltagsausgaben Meilen und Punkte
                  sammelst – ohne dafür mehr Geld auszugeben als vorher.
                </p>
              </div>
              <div className="card">
                <div className="card-icon">🥂</div>
                <h3 className="card-title">Lounges &amp; Upgrades</h3>
                <p className="card-text">
                  Konkrete Strategien, wie du zu Lounge-Zugang, Upgrades in Business/First und
                  besseren Flug-Deals kommst – auch ohne Vielfliegerstatus.
                </p>
              </div>
              <div className="card">
                <div className="card-icon">🏨</div>
                <h3 className="card-title">Hotels &amp; Hidden Deals</h3>
                <p className="card-text">
                  Wie du Hotels smarter buchst, Status-Vorteile nutzt und Upgrades herausholst –
                  plus Tricks für Late Check-out &amp; bessere Zimmer.
                </p>
              </div>
              <div className="card">
                <div className="card-icon">📲</div>
                <h3 className="card-title">Reels voller Praxis-Beispiele</h3>
                <p className="card-text">
                  Reale Buchungen, echte Routen, echte Preise: Ich zeige dir im Reel-Format, wie du
                  die Strategien Schritt für Schritt nachmachen kannst.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Über mich / Story */}
        <section id="about">
          <div className="container">
            <div className="split">
              <div>
                <p className="section-label">Über mich</p>
                <h2 className="section-title">
                  Vom &quot;normalen&quot; Urlauber zum smarten Traveller.
                </h2>
                <p className="section-sub">
                  Ich war in fast 30 Ländern unterwegs – von Europa über die USA bis Südafrika,
                  Costa Rica, Panama und die VAE. Irgendwann habe ich gemerkt: Es macht keinen
                  Sinn, immer nur &quot;normal&quot; zu buchen, wenn es clevere Wege gibt, deutlich
                  mehr rauszuholen.
                </p>
                <ul className="list">
                  <li>
                    <div className="list-bullet">✓</div>
                    <div>
                      <strong>Praxis statt Theorie:</strong> Alles, was du bei mir lernst, setze ich
                      selbst bei meinen Reisen ein.
                    </div>
                  </li>
                  <li>
                    <div className="list-bullet">✓</div>
                    <div>
                      <strong>Fokus auf Lifestyle &amp; Effizienz:</strong> Nicht nur billiger
                      reisen, sondern smarter – mit Komfort, Zeitersparnis &amp; guten Erfahrungen.
                    </div>
                  </li>
                  <li>
                    <div className="list-bullet">✓</div>
                    <div>
                      <strong>Humor inklusive:</strong> Auf meinem Account gibt es nicht nur Zahlen,
                      sondern auch lustige Stories aus der Flugzeugkabine &amp; dem Flughafenalltag.
                    </div>
                  </li>
                </ul>
              </div>
              <div>
                <div className="card">
                  <div className="card-icon">📍</div>
                  <h3 className="card-title">Meine Mission mit diesem Account</h3>
                  <p className="card-text" style={{ marginBottom: "0.6rem" }}>
                    Ich will dir zeigen, dass Luxusreisen kein &quot;nur für die anderen&quot;-Ding
                    sind. Mit den richtigen Strategien kannst du:
                  </p>
                  <ul className="list">
                    <li>
                      <div className="list-bullet">★</div>
                      <div>mehrmals im Jahr reisen – ohne dein Konto zu sprengen.</div>
                    </li>
                    <li>
                      <div className="list-bullet">★</div>
                      <div>
                        Flüge &amp; Hotels schlau auswählen, statt nur &quot;irgendwas&quot; zu
                        buchen.
                      </div>
                    </li>
                    <li>
                      <div className="list-bullet">★</div>
                      <div>
                        dir einen Travel-Lifestyle aufbauen, der zu deinem Alltag passt.
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Community / Social Proof */}
        <section id="community">
          <div className="container">
            <p className="section-label">Community &amp; Reels</p>
            <h2 className="section-title">
              Reisen ist besser, wenn wir Hacks teilen.
            </h2>
            <p className="section-sub">
              In meinen Reels und Stories nehme ich dich live mit: in Lounges, in Business Cabins,
              in verrückte Hotelzimmer und an Orte, die du vielleicht schon lange auf deiner Liste
              hast.
            </p>

            <div className="gallery-grid">
              <div className="gallery-item">
                <span className="gallery-tag">Reel</span>
                <span>&quot;Eco-Preis, Business fliegen&quot; – Beispiel-Route mit Ersparnis</span>
              </div>
              <div className="gallery-item">
                <span className="gallery-tag">Story</span>
                <span>Live-Einblicke in Airport-Lounges &amp; Check-in-Tricks</span>
              </div>
              <div className="gallery-item">
                <span className="gallery-tag">DM</span>
                <span>
                  Feedback &amp; Fragen aus der Community – deine Fragen fließen in neuen Content
                  ein.
                </span>
              </div>
              <div className="gallery-item">
                <span className="gallery-tag">Hack</span>
                <span>Konkrete Buchungsschritte für bessere Seats &amp; mehr Benefits.</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Block */}
        <section>
          <div className="container">
            <div className="cta-block">
              <h2>Bereit, deine nächste Reise smarter zu planen?</h2>
              <p>
                Folge <strong>@traveling.prof</strong> auf Instagram und hol dir regelmäßig neue
                Hacks rund um Flüge, Hotels, Lounges &amp; Co. – kompakt erklärt, direkt zum
                Nachmachen.
              </p>
              <div className="hero-cta" style={{ justifyContent: "center" }}>
                <a
                  href="https://www.instagram.com/traveling.prof"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Jetzt auf Instagram folgen
                </a>
                <a href="#contact" className="btn btn-ghost">
                  Fragen stellen / mit mir connecten
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <div className="container">
            <p className="section-label">FAQ</p>
            <h2 className="section-title">Häufige Fragen zur Seite &amp; zum Account</h2>
            <div className="faq">
              <div className="faq-item">
                <div className="faq-q">
                  Brauche ich viel Geld, um deine Travel Hacks umzusetzen?
                </div>
                <div className="faq-a">
                  Nein. Viele Strategien basieren darauf, Ausgaben, die du ohnehin hast (Miete,
                  Einkäufe, Versicherungen etc.), einfach smarter zu nutzen – z. B. für Meilen &amp;
                  Punkte.
                </div>
              </div>
              <div className="faq-item">
                <div className="faq-q">Für wen ist dein Content gedacht?</div>
                <div className="faq-a">
                  Für alle, die mehr reisen wollen – mit besserem Preis-Leistungs-Verhältnis. Egal
                  ob du einmal im Jahr in den Urlaub fliegst oder regelmäßig unterwegs bist.
                </div>
              </div>
              <div className="faq-item">
                <div className="faq-q">
                  Kostet mich das Folgen auf Instagram etwas?
                </div>
                <div className="faq-a">
                  Natürlich nicht. Mein Content auf Instagram ist kostenlos. Wenn du später tiefer
                  einsteigen willst, kannst du irgendwann Zusatzangebote nutzen – aber musst du
                  nicht.
                </div>
              </div>
              <div className="faq-item">
                <div className="faq-q">Teilst du nur Luxus-Content?</div>
                <div className="faq-a">
                  Luxus ja – aber smart. Mir geht es nicht darum, nur teure Dinge zu zeigen, sondern
                  Wege, wie du das alles möglichst effizient und clever erreichst.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Kontakt */}
        <section id="contact">
          <div className="container">
            <p className="section-label">Kontakt</p>
            <h2 className="section-title">Lass uns connecten.</h2>
            <p className="section-sub">
              Du hast eine Frage zu einem Reel, einer Booking-Strategie oder einer konkreten Route?
              Schreib mir gern auf Instagram oder per E-Mail.
            </p>
            <div className="split">
              <div>
                <div className="card">
                  <h3 className="card-title" style={{ marginBottom: "0.4rem" }}>
                    Direkt via Instagram
                  </h3>
                  <p className="card-text" style={{ marginBottom: "0.6rem" }}>
                    Der schnellste Weg: Schreib mir einfach eine DM auf Instagram.
                  </p>
                  <a
                    href="https://www.instagram.com/traveling.prof"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    DM auf Instagram schicken
                  </a>
                </div>
              </div>
              <div>
                <div className="card">
                  <h3 className="card-title" style={{ marginBottom: "0.4rem" }}>
                    Oder per E-Mail
                  </h3>
                  <p className="card-text" style={{ marginBottom: "0.6rem" }}>
                    Du planst eine größere Reise, Kooperation oder hast eine Business-Anfrage? Dann
                    nutze gerne die E-Mail:
                  </p>
                  <p className="card-text" style={{ marginBottom: "0.8rem" }}>
                    <strong>
                      <a href="mailto:hello@traveling-prof.com">hello@traveling-prof.com</a>
                    </strong>
                  </p>
                  <p className="card-text">
                    (Später kannst du hier auch ein Formular einbinden oder einen Newsletter
                    anmelden.)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-inner">
            <span>© {currentYear} traveling.prof – Travel Hacks &amp; Luxusreisen.</span>
            <div className="footer-links">
              <a
                href="https://www.instagram.com/traveling.prof"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
              <a href="#contact">Kontakt</a>
              <a href="#">Impressum (Platzhalter)</a>
              <a href="#">Datenschutz (Platzhalter)</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
