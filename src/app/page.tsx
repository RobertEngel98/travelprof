"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

/* ─── FAQ Component ─── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item" onClick={() => setOpen(!open)}>
      <div className="faq-q">
        {q}
        <span className="toggle">{open ? "−" : "+"}</span>
      </div>
      {open && <div className="faq-a">{a}</div>}
    </div>
  );
}

/* ─── Travel-Hack Finder (Custom GPT Placeholder) ─── */
function TravelHackFinder() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setResult("");
    // Simulate GPT response – replace with actual API call to your Custom GPT
    setTimeout(() => {
      setResult(
        `Für "${query}" empfehle ich: Nutze Meilen-Transfers über Payback → Miles & More. Buche über den Umweg-Trick (z.B. Open-Jaw), um Business Class zum halben Preis zu fliegen. Schau dir meinen Reel dazu auf Instagram an!`
      );
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="tool-section">
      <p className="section-label">Smart Travel Tool</p>
      <h2>Finde deinen Travel Hack in 10 Sekunden</h2>
      <p>Gib dein Reiseziel oder deine Frage ein – und ich zeige dir den passenden Hack.</p>
      <form onSubmit={handleSubmit}>
        <div className="tool-input-group">
          <input
            className="tool-input"
            type="text"
            placeholder="z.B. 'Business Class nach Dubai' oder 'Lounge-Zugang ohne Status'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-sm">
            🔍 Finden
          </button>
        </div>
      </form>
      <div className={`tool-result ${loading ? "loading" : ""}`}>
        {loading
          ? "⏳ Suche den besten Hack für dich..."
          : result
          ? result
          : "💡 Dein persönlicher Travel-Hack erscheint hier..."}
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const year = new Date().getFullYear();

  return (
    <div className="page">
      {/* ═══ Header ═══ */}
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
              <a href="#hacks">Travel Hacks</a>
              <a href="#about">Über mich</a>
              <a href="#erfolge">Erfolgsgeschichten</a>
              <a href="#freebies">Freebies</a>
              <a href="#kreditkarten">Kreditkarten</a>
              <a href="#community">Community</a>
              <a href="#contact">Kontakt</a>
            </div>
            <div className="nav-cta">
              <a
                href="https://www.instagram.com/traveling.prof"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
              >
                Instagram →
              </a>
            </div>
            <button
              className="nav-toggle"
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              Menü <span>{menuOpen ? "✕" : "☰"}</span>
            </button>
          </nav>
        </div>
        <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          {["#hacks", "#about", "#erfolge", "#freebies", "#kreditkarten", "#community", "#contact"].map(
            (href) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}>
                {href.replace("#", "").charAt(0).toUpperCase() + href.replace("#", "").slice(1)}
              </a>
            )
          )}
        </div>
      </header>

      <main>
        {/* ═══ Hero ═══ */}
        <section className="hero">
          <div className="container">
            <div className="hero-grid">
              <div>
                <div className="eyebrow">
                  <div className="eyebrow-dot" />
                  Mehr Reisen, weniger zahlen – mit echten Praxis-Hacks
                </div>
                <h1 className="hero-title">
                  Lerne, wie du{" "}
                  <span className="hero-highlight">smarter reist</span>: Business
                  Class, Lounges &amp; Traumhotels zum schlauen Preis.
                </h1>
                <p className="hero-text">
                  Auf <strong>@traveling.prof</strong> zeige ich dir konkrete
                  Strategien, wie du mit Buchungstricks, Meilen, Punkten &amp;
                  cleveren Travel Hacks mehr aus deinem Reisebudget herausholst –
                  ohne auf Komfort zu verzichten.
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
                  <a href="#freebies" className="btn btn-outline">
                    Gratis Travel-Hack-Update sichern
                  </a>
                </div>
                <div className="hero-meta">
                  <span>
                    🌍 <strong>Fast 30 Länder</strong> bereist
                  </span>
                  <span>✈️ Fokus: Hacks, Lounges, Upgrades</span>
                  <span>📲 Tägliche Reels &amp; Stories</span>
                </div>

                {/* ProvenExpert Badge */}
                <div style={{ marginTop: "1.25rem" }}>
                  <div className="proven-expert-badge">
                    <div>
                      <div className="proven-stars">★★★★★</div>
                      <div className="proven-text">
                        <span className="proven-score">5.0/5</span> –{" "}
                        ProvenExpert
                      </div>
                    </div>
                    <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                      Verifizierte Bewertungen
                    </span>
                  </div>
                </div>
              </div>

              {/* Hero Image (Screenshot 2 – Bild von dir) */}
              <div className="hero-image">
                <div className="hero-image-placeholder">
                  <span className="icon">✈️</span>
                  <strong>Dein Bild hier</strong>
                  <span>
                    Ersetze diesen Platzhalter mit einem Bild von dir im Urlaub oder
                    im Flieger.
                  </span>
                  <span style={{ fontSize: "0.75rem", marginTop: "0.5rem", color: "var(--accent)" }}>
                    → Datei: /public/hero.jpg
                  </span>
                </div>
                {/* Wenn Bild vorhanden: <img src="/hero.jpg" alt="traveling.prof im Flieger" /> */}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ Header Video ═══ */}
        <section style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="hero-video-section">
              {/* Ersetze mit deinem Video: <video src="/hero-video.mp4" autoPlay muted loop playsInline /> */}
              <div
                className="hero-image-placeholder"
                style={{ aspectRatio: "16/7" }}
              >
                <span className="icon">🎬</span>
                <strong>Urlaubsvideo hier einbetten</strong>
                <span>Lege dein Video als /public/hero-video.mp4 ab</span>
              </div>
              <div className="hero-video-overlay">
                <p>📍 Nächstes Abenteuer lädt...</p>
              </div>
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* ═══ Travel Hack Finder Tool ═══ */}
        <section id="tool">
          <div className="container">
            <TravelHackFinder />
          </div>
        </section>

        <hr className="section-divider" />

        {/* ═══ Was dich erwartet ═══ */}
        <section id="hacks">
          <div className="container">
            <p className="section-label">Inhalte auf meinem Kanal</p>
            <h2 className="section-title">
              Was du bei{" "}
              <span className="hero-highlight">@traveling.prof</span> lernst
            </h2>
            <p className="section-sub">
              Statt nur schöne Bilder zu posten, bekommst du bei mir vor allem
              eines: <strong>konkrete, umsetzbare Travel Hacks</strong>, mit denen
              du günstiger buchst, besser fliegst und mehr aus jedem Trip
              herausholst.
            </p>
            <div className="cards-grid">
              {[
                { icon: "✈️", title: "Meilen & Punkte verstehen", text: "Wie du mit Kreditkarten, Buchungsportalen & Alltagsausgaben Meilen und Punkte sammelst – ohne dafür mehr Geld auszugeben als vorher." },
                { icon: "🥂", title: "Lounges & Upgrades", text: "Konkrete Strategien für Lounge-Zugang, Upgrades in Business/First und bessere Flug-Deals – auch ohne Vielfliegerstatus." },
                { icon: "🏨", title: "Hotels & Hidden Deals", text: "Wie du Hotels smarter buchst, Status-Vorteile nutzt und Upgrades herausholst – plus Tricks für Late Check-out & bessere Zimmer." },
                { icon: "📲", title: "Reels voller Praxis-Beispiele", text: "Reale Buchungen, echte Routen, echte Preise: Schritt für Schritt zum Nachmachen im Reel-Format." },
              ].map((c, i) => (
                <div className="card" key={i}>
                  <div className="card-icon">{c.icon}</div>
                  <h3 className="card-title">{c.title}</h3>
                  <p className="card-text">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* ═══ Über mich ═══ */}
        <section id="about">
          <div className="container">
            <div className="split">
              <div>
                <p className="section-label">Über mich</p>
                <h2 className="section-title">
                  Vom &quot;normalen&quot; Urlauber zum smarten Traveller.
                </h2>
                <p className="section-sub">
                  Ich war in fast 30 Ländern unterwegs – von Europa über die USA
                  bis Südafrika, Costa Rica, Panama und die VAE. Irgendwann habe
                  ich gemerkt: Es macht keinen Sinn, immer nur &quot;normal&quot; zu
                  buchen, wenn es clevere Wege gibt, deutlich mehr rauszuholen.
                </p>
                <ul className="list">
                  {[
                    ["✓", "Praxis statt Theorie:", "Alles, was du bei mir lernst, setze ich selbst ein."],
                    ["✓", "Fokus auf Lifestyle & Effizienz:", "Nicht nur billiger reisen, sondern smarter."],
                    ["✓", "Humor inklusive:", "Lustige Stories aus der Flugzeugkabine & dem Flughafenalltag."],
                  ].map(([bullet, bold, text], i) => (
                    <li key={i}>
                      <div className="list-bullet">{bullet}</div>
                      <div>
                        <strong>{bold}</strong> {text}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="card">
                  <div className="card-icon">📍</div>
                  <h3 className="card-title">Meine Mission mit diesem Account</h3>
                  <p className="card-text" style={{ marginBottom: "0.6rem" }}>
                    Ich will dir zeigen, dass Luxusreisen kein &quot;nur für die
                    anderen&quot;-Ding sind. Mit den richtigen Strategien kannst du:
                  </p>
                  <ul className="list">
                    {["Mehrmals im Jahr reisen – ohne dein Konto zu sprengen.", "Flüge & Hotels schlau auswählen.", "Einen Travel-Lifestyle aufbauen, der zu deinem Alltag passt."].map(
                      (t, i) => (
                        <li key={i}>
                          <div className="list-bullet">★</div>
                          <div>{t}</div>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* ═══ Erfolgsgeschichten ═══ */}
        <section id="erfolge">
          <div className="container">
            <p className="section-label">Proof of Strategy</p>
            <h2 className="section-title">Erfolgsgeschichten aus der Community</h2>
            <p className="section-sub">
              Echte Ergebnisse von echten Menschen – so setzen Follower meine
              Strategien um.
            </p>
            <div className="testimonials-grid">
              {[
                { quote: "Dank der Meilen-Strategie von @traveling.prof habe ich Business Class nach Dubai für nur 340€ gebucht. Normalerweise hätte ich über 3.000€ bezahlt!", name: "Marco S.", detail: "Business Class nach Dubai", initials: "MS" },
                { quote: "Ich hatte null Ahnung von Meilen. Nach 3 Monaten hatte ich genug Punkte für einen Lounge-Zugang und einen Freiflug nach Mallorca für die ganze Familie.", name: "Lisa K.", detail: "Family-Trip nach Mallorca", initials: "LK" },
                { quote: "Die Hotel-Hacks sind Gold wert. Suite-Upgrade in Abu Dhabi – kostenlos. Hätte ich ohne die Tipps nie bekommen.", name: "Thomas R.", detail: "Suite-Upgrade Abu Dhabi", initials: "TR" },
              ].map((t, i) => (
                <div className="testimonial-card" key={i}>
                  <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">{t.initials}</div>
                    <div>
                      <div className="testimonial-name">{t.name}</div>
                      <div className="testimonial-detail">{t.detail}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* ═══ Freebies ═══ */}
        <section id="freebies">
          <div className="container">
            <p className="section-label">Kostenlos für dich</p>
            <h2 className="section-title">Freebies &amp; kostenlose Ressourcen</h2>
            <p className="section-sub">
              Starte sofort – mit meinen besten kostenlosen Guides, Checklisten und
              Tools.
            </p>
            <div className="freebies-grid">
              {[
                { icon: "📋", badge: "Gratis", title: "Meilen-Starter-Checkliste", text: "Die wichtigsten Schritte, um sofort mit dem Meilensammeln zu starten – kompakt auf einer Seite." },
                { icon: "🗺️", badge: "Gratis", title: "Top 10 Buchungs-Hacks PDF", text: "Meine 10 besten Buchungstricks für günstigere Flüge und bessere Hotels – sofort umsetzbar." },
                { icon: "💳", badge: "Gratis", title: "Kreditkarten-Vergleich 2025", text: "Welche Karte lohnt sich wirklich für Meilen & Punkte? Mein ehrlicher Vergleich der besten Optionen." },
              ].map((f, i) => (
                <div className="freebie-card" key={i}>
                  <div className="card-icon">{f.icon}</div>
                  <span className="freebie-badge">{f.badge}</span>
                  <h3 className="card-title">{f.title}</h3>
                  <p className="card-text">{f.text}</p>
                  <a href="#contact" className="btn btn-outline btn-sm" style={{ marginTop: "0.5rem", alignSelf: "flex-start" }}>
                    Jetzt herunterladen →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* ═══ Kreditkarten Referral ═══ */}
        <section id="kreditkarten">
          <div className="container">
            <p className="section-label">Empfehlungen</p>
            <h2 className="section-title">
              Die besten Kreditkarten &amp; Konten für Reisende
            </h2>
            <p className="section-sub">
              Diese Karten nutze ich selbst – und sie sind der Grundstein für
              smartes Meilensammeln. Über die Links erhältst du die besten
              aktuellen Angebote.
            </p>
            <div className="referral-grid">
              {[
                { icon: "💳", name: "Amex Gold Card", desc: "Perfekt zum Einstieg: Membership Rewards Punkte bei jedem Einkauf sammeln.", bonus: "Bis zu 40.000 Punkte Willkommensbonus", link: "#" },
                { icon: "💎", name: "Amex Platinum Card", desc: "Premium-Karte mit Lounge-Zugang, Reiseguthaben und Status-Vorteilen.", bonus: "Bis zu 75.000 Punkte Willkommensbonus", link: "#" },
                { icon: "🏦", name: "Miles & More Kreditkarte", desc: "Direkt Meilen sammeln bei jeder Zahlung – ideal für Lufthansa-Fans.", bonus: "Bis zu 20.000 Meilen Startbonus", link: "#" },
                { icon: "🔄", name: "Payback Amex", desc: "Kostenlose Karte zum Punkte sammeln – bei jedem Einkauf Payback-Punkte.", bonus: "Kostenlos + Startbonus", link: "#" },
              ].map((card, i) => (
                <a
                  href={card.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="referral-card"
                  key={i}
                >
                  <div className="referral-icon">{card.icon}</div>
                  <div className="referral-info">
                    <div className="referral-name">{card.name}</div>
                    <div className="referral-desc">{card.desc}</div>
                    <span className="referral-bonus">{card.bonus}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* ═══ Community Login ═══ */}
        <section id="community">
          <div className="container">
            <div className="community-section">
              <p
                className="section-label"
                style={{ color: "rgba(249,115,22,0.8)" }}
              >
                Exklusive Community
              </p>
              <h2>Werde Teil der traveling.prof Community</h2>
              <p>
                Erhalte Zugang zu exklusiven Hacks, Bonus-Content und einem
                Punktesystem mit echten Rewards. Kein Redirect – alles direkt
                hier.
              </p>
              <div className="community-features">
                {["🎯 Bonuspunkte-System", "🔒 Exklusive Deals", "💬 Direkte Hilfe", "🏆 Rewards & Challenges"].map(
                  (f, i) => (
                    <div className="community-feature" key={i}>
                      {f}
                    </div>
                  )
                )}
              </div>
              <div className="community-login-form">
                <input
                  className="community-input"
                  type="email"
                  placeholder="Deine E-Mail-Adresse"
                />
                <button className="btn btn-primary btn-sm">
                  Kostenlos beitreten →
                </button>
              </div>
              <p
                style={{
                  fontSize: "0.72rem",
                  marginTop: "0.75rem",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                Community-Login wird in Kürze aktiviert – trag dich jetzt auf die
                Warteliste ein.
              </p>
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* ═══ Community / Reels ═══ */}
        <section>
          <div className="container">
            <p className="section-label">Community &amp; Reels</p>
            <h2 className="section-title">
              Reisen ist besser, wenn wir Hacks teilen.
            </h2>
            <p className="section-sub">
              In meinen Reels und Stories nehme ich dich live mit: in Lounges, in
              Business Cabins, in verrückte Hotelzimmer und an Orte, die du
              vielleicht schon lange auf deiner Liste hast.
            </p>
            <div className="gallery-grid">
              {[
                { tag: "Reel", text: '"Eco-Preis, Business fliegen" – Beispiel-Route mit Ersparnis' },
                { tag: "Story", text: "Live-Einblicke in Airport-Lounges & Check-in-Tricks" },
                { tag: "DM", text: "Feedback & Fragen aus der Community – deine Fragen fließen in neuen Content ein." },
                { tag: "Hack", text: "Konkrete Buchungsschritte für bessere Seats & mehr Benefits." },
              ].map((g, i) => (
                <div className="gallery-item" key={i}>
                  <span className="gallery-tag">{g.tag}</span>
                  <span>{g.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ Calendly ═══ */}
        <section>
          <div className="container calendly-section">
            <p className="section-label">Termin buchen</p>
            <h2 className="section-title">Persönliches Gespräch vereinbaren</h2>
            <p className="section-sub" style={{ margin: "0 auto 1.5rem" }}>
              Du hast Fragen zu Strategien, Kooperationen oder möchtest eine
              individuelle Beratung? Buche einen Slot direkt in meinem Kalender.
            </p>
            <div className="calendly-embed">
              <span className="icon">📅</span>
              <strong>Calendly-Integration</strong>
              <span>
                Binde deinen Calendly-Link hier ein.
                <br />
                Ersetze diesen Block mit dem Calendly-Widget.
              </span>
              <a
                href="https://calendly.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
              >
                Zu Calendly →
              </a>
            </div>
          </div>
        </section>

        {/* ═══ Integrations / Zahlungen ═══ */}
        <section>
          <div className="container" style={{ textAlign: "center" }}>
            <p className="section-label">Zahlungen &amp; Integrationen</p>
            <h2 className="section-title">Sicher bezahlen &amp; verwalten</h2>
            <p className="section-sub" style={{ margin: "0 auto 1.5rem" }}>
              Für zukünftige Premium-Angebote, Coachings und digitale Produkte.
            </p>
            <div className="integrations-row">
              {["💳 Stripe", "🅿️ PayPal", "🛒 Stan Store", "📅 Calendly"].map(
                (label, i) => (
                  <div className="integration-badge" key={i}>
                    {label}
                  </div>
                )
              )}
            </div>
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--muted)",
                marginTop: "1rem",
              }}
            >
              Integrationen werden bei Bedarf aktiviert – Stripe &amp; PayPal
              Checkout, Stan Store Shop und Calendly Booking.
            </p>
          </div>
        </section>

        {/* ═══ CTA Block ═══ */}
        <section>
          <div className="container">
            <div className="cta-block">
              <h2>Bereit, deine nächste Reise smarter zu planen?</h2>
              <p>
                Folge <strong>@traveling.prof</strong> auf Instagram und hol dir
                regelmäßig neue Hacks rund um Flüge, Hotels, Lounges &amp; Co.
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
                <a href="#contact" className="btn btn-outline">
                  Fragen stellen
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <section>
          <div className="container">
            <p className="section-label">FAQ</p>
            <h2 className="section-title">
              Häufige Fragen zur Seite &amp; zum Account
            </h2>
            <div className="faq">
              {[
                { q: "Brauche ich viel Geld, um deine Travel Hacks umzusetzen?", a: "Nein. Viele Strategien basieren darauf, Ausgaben, die du ohnehin hast (Miete, Einkäufe, Versicherungen etc.), einfach smarter zu nutzen – z. B. für Meilen & Punkte." },
                { q: "Für wen ist dein Content gedacht?", a: "Für alle, die mehr reisen wollen – mit besserem Preis-Leistungs-Verhältnis. Egal ob du einmal im Jahr in den Urlaub fliegst oder regelmäßig unterwegs bist." },
                { q: "Kostet mich das Folgen auf Instagram etwas?", a: "Natürlich nicht. Mein Content auf Instagram ist kostenlos. Wenn du später tiefer einsteigen willst, kannst du irgendwann Zusatzangebote nutzen – aber musst du nicht." },
                { q: "Teilst du nur Luxus-Content?", a: "Luxus ja – aber smart. Mir geht es nicht darum, nur teure Dinge zu zeigen, sondern Wege, wie du das alles möglichst effizient und clever erreichst." },
                { q: "Wie funktioniert die Community?", a: "Die Community wird demnächst mit Login-Bereich, Bonuspunkte-System und exklusiven Inhalten direkt auf dieser Seite verfügbar sein – ohne Weiterleitung." },
              ].map((item, i) => (
                <FaqItem key={i} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        </section>

        {/* ═══ Kontakt ═══ */}
        <section id="contact">
          <div className="container">
            <p className="section-label">Kontakt</p>
            <h2 className="section-title">Lass uns connecten.</h2>
            <p className="section-sub">
              Du hast eine Frage zu einem Reel, einer Booking-Strategie oder einer
              konkreten Route? Schreib mir gern auf Instagram oder per E-Mail.
            </p>
            <div className="split">
              <div>
                <div className="card">
                  <h3 className="card-title" style={{ marginBottom: "0.4rem" }}>
                    Direkt via Instagram
                  </h3>
                  <p className="card-text" style={{ marginBottom: "0.75rem" }}>
                    Der schnellste Weg: Schreib mir einfach eine DM auf Instagram.
                  </p>
                  <a
                    href="https://www.instagram.com/traveling.prof"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                  >
                    DM auf Instagram
                  </a>
                </div>
              </div>
              <div>
                <div className="card">
                  <h3 className="card-title" style={{ marginBottom: "0.4rem" }}>
                    Oder per E-Mail
                  </h3>
                  <p className="card-text" style={{ marginBottom: "0.5rem" }}>
                    Du planst eine größere Reise, Kooperation oder hast eine
                    Business-Anfrage?
                  </p>
                  <p className="card-text">
                    <strong>
                      <a
                        href="mailto:traveling.prof@outlook.de"
                        style={{ color: "var(--accent)" }}
                      >
                        traveling.prof@outlook.de
                      </a>
                    </strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ═══ Footer ═══ */}
      <footer>
        <div className="container">
          <div className="footer-inner">
            <span>
              © {year} traveling.prof – Travel Hacks &amp; Luxusreisen.
            </span>
            <div className="footer-links">
              <a
                href="https://www.instagram.com/traveling.prof"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
              <a href="#contact">Kontakt</a>
              <Link href="/impressum">Impressum</Link>
              <Link href="/datenschutz">Datenschutz</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
