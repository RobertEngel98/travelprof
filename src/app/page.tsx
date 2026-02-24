"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import CookieConsent from "./components/CookieConsent";

/* ─── Scroll-to-top button ─── */
function ScrollTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      className={`scroll-top ${show ? "visible" : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Nach oben scrollen"
    >
      ↑
    </button>
  );
}

/* ─── FAQ Accordion ─── */
function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? "open" : ""}`} onClick={() => setOpen(!open)}>
      <div className="faq-q">
        {q}
        <span className="faq-toggle">+</span>
      </div>
      {open && <div className="faq-a">{a}</div>}
    </div>
  );
}

/* ─── Leadmagnet Download Funnel ─── */
function LeadmagnetForm({ product, onClose }: { product: string; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [consent, setConsent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !consent) return;
    localStorage.setItem("leadmagnet-lead", JSON.stringify({ email, name, product, date: new Date().toISOString() }));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="leadmagnet-overlay" onClick={onClose}>
        <div className="leadmagnet-modal" onClick={e => e.stopPropagation()}>
          <button className="leadmagnet-close" onClick={onClose}>x</button>
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>✅</div>
            <h3 style={{ marginBottom: "0.5rem" }}>Fast geschafft!</h3>
            <p style={{ color: "var(--text-sub)", fontSize: "0.88rem", lineHeight: 1.6 }}>
              Wir haben dir eine E-Mail an <strong>{email}</strong> gesendet.
              Bitte bestätige deine E-Mail-Adresse (Double-Opt-In), um den Download-Link zu erhalten.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="leadmagnet-overlay" onClick={onClose}>
      <div className="leadmagnet-modal" onClick={e => e.stopPropagation()}>
        <button className="leadmagnet-close" onClick={onClose}>x</button>
        <h3 style={{ marginBottom: "0.25rem" }}>{product}</h3>
        <p style={{ color: "var(--text-sub)", fontSize: "0.85rem", marginBottom: "1rem" }}>
          Trag deine E-Mail ein und erhalte den kostenlosen Download.
        </p>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.6rem" }}>
          <input
            type="text"
            placeholder="Dein Vorname (optional)"
            value={name}
            onChange={e => setName(e.target.value)}
            className="tool-input"
            style={{ borderRadius: "var(--r-lg)" }}
          />
          <input
            type="email"
            required
            placeholder="Deine E-Mail-Adresse *"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="tool-input"
            style={{ borderRadius: "var(--r-lg)" }}
          />
          <label style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start", fontSize: "0.72rem", color: "var(--muted)", cursor: "pointer" }}>
            <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} style={{ marginTop: "0.15rem" }} />
            Ich stimme zu, gelegentlich E-Mails mit Travel-Hacks zu erhalten. Abmeldung jederzeit möglich. <a href="/datenschutz" style={{ color: "var(--accent)" }}>Datenschutz</a>
          </label>
          <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
            Kostenlos herunterladen
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── Travel Hack Finder ─── */
function HackFinder() {
  const [q, setQ] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const hacks: Record<string, string> = {
    business: "Open-Jaw-Trick: Buche Hin- und Rückflug über verschiedene Städte. So bekommst du Business Class oft 40-60% günstiger. Beispiel: Frankfurt nach Bangkok via Istanbul mit Turkish Airlines für nur 800 EUR in Business!",
    dubai: "Fifth Freedom Flights: Singapore Airlines fliegt Dubai-Manchester in Business Class – oft günstiger als Emirates Direktflug. Oder nutze Emirates Meilen für die Strecke: nur 62.500 Meilen one-way in Business!",
    lounge: "Lounge-Zugang ohne Status: (1) Priority Pass über Amex Platinum (1.400+ Lounges weltweit), (2) Day Passes direkt kaufen (ab 25 EUR), (3) LoungeBuddy App für Einzelzugang. Mein Favorit: Die Turkish Airlines CIP Lounge Istanbul – die beste der Welt!",
    hotel: "Hotel-Status-Match: Viele Ketten bieten Status-Matching an. Mit Amex Platinum bekommst du Marriott Gold und Hilton Gold automatisch. Das bedeutet: Zimmer-Upgrades, spaetes Checkout und Fruehstueck inklusive!",
    meilen: "Kreditkarten-Combo für maximale Meilen: Amex Platinum (3x Punkte auf Reisen) + Payback Amex (kostenlos, Punkte bei jedem Einkauf) + Barclays (kostenlos im Ausland). So sammelst du bei JEDER Ausgabe Punkte.",
    malediven: "Malediven in Business Class für 0 EUR: Sammle 90.000 Miles and More Meilen (ca. 12 Monate mit Amex), buche Lufthansa/Swiss Business Frankfurt-Male. Meilenpreis: 0 EUR + ca. 200 EUR Steuern!",
    upgrade: "Upgrade-Hack: Buche Economy, checke 24h vor Abflug die Airline-App. Viele Airlines bieten dann Bid-Upgrades (ab 150 EUR für Business) an. Oder nutze Meilen für Last-Minute Operational Upgrades direkt am Gate.",
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    setLoading(true);
    setResult("");
    setTimeout(() => {
      const lower = q.toLowerCase();
      const matched = Object.entries(hacks).find(([key]) => lower.includes(key));
      if (matched) {
        setResult(matched[1] + " – Mehr Details im Meilen-Crashkurs oder als Reel auf @traveling.prof!");
      } else {
        setResult(
          `Für "${q}" empfehle ich: Starte mit dem Meilen-Sammeln über Payback und Amex. ` +
            `Nutze den Open-Jaw-Trick für günstigere Flüge und schaue dir meine kostenlosen Guides an. ` +
            `Folge @traveling.prof auf Instagram für tägliche Travel-Hacks!`
        );
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="tool-box">
      <div className="section-eyebrow"><div className="section-eyebrow-dot" />Smart Travel Tool</div>
      <h2>Finde deinen Travel Hack in 10 Sekunden</h2>
      <p>Gib dein Reiseziel oder deine Frage ein – und ich zeige dir den passenden Hack.</p>
      <form onSubmit={submit}>
        <div className="tool-form">
          <input className="tool-input" type="text" placeholder="z.B. 'Business Class Dubai' oder 'Lounge ohne Status'" value={q} onChange={e => setQ(e.target.value)} />
          <button type="submit" className="btn btn-primary btn-sm">Finden</button>
        </div>
      </form>
      <div className={`tool-result ${loading ? "loading" : ""}`}>
        {loading ? "Suche den besten Hack für dich..." : result || "Dein persönlicher Travel-Hack erscheint hier..."}
      </div>
    </div>
  );
}

/* ─── Header with scroll detection ─── */
function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#hacks", label: "Travel Hacks" },
    { href: "#about", label: "Über mich" },
    { href: "#erfolge", label: "Erfolge" },
    { href: "#produkte", label: "Produkte" },
    { href: "#freebies", label: "Freebies" },
    { href: "#kreditkarten", label: "Kreditkarten" },
    { href: "#community", label: "Community" },
    { href: "#kontakt", label: "Kontakt" },
  ];

  return (
    <header className={scrolled ? "scrolled" : ""}>
      <div className="container">
        <nav className="nav">
          <Link href="/" className="nav-brand" style={{ textDecoration: "none" }}>
            <div className="nav-brand-mark">TP</div>
            <div className="nav-brand-text">
              <div className="nav-brand-name">traveling.prof</div>
              <div className="nav-brand-tag">Travel Hacks · Meilen · Luxusreisen</div>
            </div>
          </Link>
          <div className="nav-links">
            {links.map(l => <a key={l.href} href={l.href}>{l.label}</a>)}
          </div>
          <div className="nav-actions">
            <div className="nav-cta-desktop">
              <a href="https://www.instagram.com/traveling.prof" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                Instagram folgen →
              </a>
            </div>
            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menü">
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </nav>
      </div>
      <div className={`mobile-nav ${menuOpen ? "open" : ""}`}>
        {links.map(l => <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>)}
        <a href="https://www.instagram.com/traveling.prof" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ marginTop: "0.75rem", justifyContent: "center" }}>
          Instagram folgen →
        </a>
      </div>
    </header>
  );
}

/* ═══ PAGE ═══ */
export default function Home() {
  const year = new Date().getFullYear();
  const [leadmagnet, setLeadmagnet] = useState<string | null>(null);

  return (
    <div className="page">
      <ScrollTop />
      <CookieConsent />
      <Header />
      {leadmagnet && <LeadmagnetForm product={leadmagnet} onClose={() => setLeadmagnet(null)} />}

      <main>
        {/* ═══ Hero ═══ */}
        <section className="hero" aria-label="Hero">
          <div className="container">
            <div className="hero-grid">
              <div>
                <div className="hero-badge">
                  <div className="hero-badge-pulse" />
                  Jetzt starten – mehr Reise, weniger zahlen
                </div>
                <h1>Fliege <em>Business Class</em> zum Economy-Preis. Lerne wie.</h1>
                <p className="hero-desc">
                  Auf <strong>@traveling.prof</strong> zeige ich dir Schritt für Schritt, wie du mit Meilen, Punkten &amp; cleveren Buchungstricks smarter reist – Business Class, Lounges &amp; Traumhotels, ohne dein Budget zu sprengen.
                </p>
                <div className="hero-buttons">
                  <a href="https://www.instagram.com/traveling.prof" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
                    Kostenlos auf Instagram folgen
                  </a>
                  <a href="#produkte" className="btn btn-secondary">Produkte ansehen</a>
                </div>
                <div className="hero-stats">
                  <div className="hero-stat">🌍 <strong>30 Länder</strong> bereist</div>
                  <div className="hero-stat">✈️ Fokus <strong>Business Class</strong></div>
                  <div className="hero-stat">📲 Tägliche <strong>Reels &amp; Stories</strong></div>
                </div>
                <div className="proven-mini">
                  <div><div className="proven-stars">★★★★★</div></div>
                  <div className="proven-info"><strong>5.0 / 5</strong><br />ProvenExpert · Verifiziert</div>
                </div>
              </div>
              <div className="hero-visual">
                <img src="/hero.jpg" alt="Business Class Reisen mit traveling.prof" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </div>
          </div>
        </section>

        {/* ═══ Video ═══ */}
        <section style={{ paddingTop: 0, paddingBottom: "2rem" }} aria-label="Video">
          <div className="container">
            <div className="video-banner">
              <img src="/banner.jpg" alt="Traumstrand – smarter reisen mit traveling.prof" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div className="video-overlay"><span>📍 Nächstes Abenteuer lädt...</span></div>
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* ═══ Hack Finder ═══ */}
        <section id="tool" aria-label="Travel Hack Finder">
          <div className="container"><HackFinder /></div>
        </section>

        <hr className="divider" />

        {/* ═══ Travel Hacks ═══ */}
        <section id="hacks" aria-label="Travel Hacks">
          <div className="container">
            <div className="section-eyebrow"><div className="section-eyebrow-dot" />Inhalte</div>
            <h2 className="section-title">Was du bei <em>@traveling.prof</em> lernst</h2>
            <p className="section-sub">Konkrete, umsetzbare Travel Hacks statt leerer Versprechen. Jeder Hack basiert auf echten Buchungen und eigenen Erfahrungen.</p>
            <div className="cards-row">
              {[
                { img: "/card-meilen.jpg", h: "Meilen & Punkte", p: "Lerne, wie du mit Amex, Payback & Miles and More bei jedem Einkauf Meilen sammelst – ohne mehr auszugeben." },
                { img: "/card-lounge.jpg", h: "Lounges & Upgrades", p: "Strategien für Lounge-Zugang und Upgrades in Business/First – auch ohne Vielfliegerstatus." },
                { img: "/card-hotel.jpg", h: "Hotels & Hidden Deals", p: "Hotels smarter buchen, Status nutzen und kostenlose Upgrades herausholen." },
                { img: "/card-content.jpg", h: "Praxis-Reels", p: "Echte Buchungen, echte Routen, echte Preise – Schritt für Schritt zum Nachmachen." },
              ].map((c, i) => (
                <article className="card" key={i}>
                  <div className="card-img"><img src={c.img} alt={c.h} /></div>
                  <h3>{c.h}</h3>
                  <p>{c.p}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* ═══ Über mich ═══ */}
        <section id="about" aria-label="Über mich">
          <div className="container">
            <div className="split">
              <div>
                <div className="section-eyebrow"><div className="section-eyebrow-dot" />Über mich</div>
                <h2 className="section-title">Vom normalen Urlauber zum <em>smarten Traveller</em></h2>
                <p className="section-sub">Fast 30 Länder – von Europa über die USA bis Südafrika, Costa Rica, Panama und die VAE. Irgendwann habe ich gemerkt: Es gibt clevere Wege, deutlich mehr rauszuholen.</p>
                <ul className="check-list">
                  {[
                    ["Praxis statt Theorie:", "Alles, was du lernst, setze ich selbst ein."],
                    ["Fokus auf Effizienz:", "Nicht nur billiger, sondern smarter reisen."],
                    ["Echte Zahlen:", "Meine Amex Platinum spart mir über 6.000€ pro Jahr."],
                  ].map(([b, t], i) => (
                    <li key={i}><div className="check-mark">✓</div><div><strong>{b}</strong> {t}</div></li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="about-img-wrap"><img src="/about.jpg" alt="Reisen mit traveling.prof" className="about-img" /></div>
                <article className="card" style={{ marginTop: "1rem" }}>
                  <h3>Meine Mission</h3>
                  <p style={{ marginBottom: "0.6rem" }}>Luxusreisen sind kein &quot;nur für die anderen&quot;-Ding. Mit den richtigen Strategien kannst du:</p>
                  <ul className="check-list">
                    {["Mehrmals im Jahr reisen – ohne dein Konto zu sprengen.", "Business Class zum Economy-Preis fliegen.", "Einen Travel-Lifestyle aufbauen, der zu deinem Alltag passt."].map((t, i) => (
                      <li key={i}><div className="check-mark">★</div><div>{t}</div></li>
                    ))}
                  </ul>
                </article>
              </div>
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* ═══ Erfolgsgeschichten ═══ */}
        <section id="erfolge" aria-label="Erfolgsgeschichten">
          <div className="container">
            <div className="section-eyebrow"><div className="section-eyebrow-dot" />Proof of Strategy</div>
            <h2 className="section-title">Erfolgsgeschichten aus der <em>Community</em></h2>
            <p className="section-sub">Echte Ergebnisse von echten Menschen.</p>
            <div className="testimonials-row">
              {[
                { q: "Dank der Meilen-Strategie habe ich Business Class nach Dubai für nur 340€ gebucht. Normalerweise über 3.000€!", n: "Marco S.", d: "Business Class Dubai", i: "MS" },
                { q: "Ich hatte null Ahnung von Meilen. Nach 3 Monaten: Lounge-Zugang und ein Freiflug nach Mallorca für die ganze Familie.", n: "Lisa K.", d: "Family-Trip Mallorca", i: "LK" },
                { q: "Die Hotel-Hacks sind Gold wert. Suite-Upgrade in Abu Dhabi – kostenlos. Hätte ich ohne die Tipps nie bekommen.", n: "Thomas R.", d: "Suite-Upgrade Abu Dhabi", i: "TR" },
              ].map((t, i) => (
                <article className="testimonial" key={i}>
                  <blockquote>&ldquo;{t.q}&rdquo;</blockquote>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">{t.i}</div>
                    <div className="testimonial-meta"><div className="name">{t.n}</div><div className="detail">{t.d}</div></div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* ═══ Produkte (Alfima / Stripe) ═══ */}
        <section id="produkte" aria-label="Produkte">
          <div className="container">
            <div className="products-section">
              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <div className="section-eyebrow"><div className="section-eyebrow-dot" />Produkte &amp; Kurse</div>
                <h2 className="section-title">Dein Weg zum <em>smarten Traveller</em></h2>
                <p className="section-sub" style={{ margin: "0.5rem auto 0", maxWidth: "32rem" }}>Von kostenlos bis Premium – für jedes Level das passende Angebot.</p>
              </div>
              <div className="products-grid">
                {[
                  { tag: "Kostenlos", cls: "free", price: "0 €", name: "Meilen-Starter-Checkliste", desc: "10 Schritte zum sofortigen Start mit dem Meilensammeln. PDF zum Download.", cta: "Gratis herunterladen" },
                  { tag: "Kostenlos", cls: "free", price: "0 €", name: "Meilen-Quick-Check Kalkulator", desc: "Finde in 60 Sekunden heraus, wie viele Meilen du pro Jahr sammeln kannst.", cta: "Gratis herunterladen" },
                  { tag: "Kostenlos", cls: "free", price: "0 €", name: "Kreditkarten-Vergleich 2025", desc: "Ehrlicher Vergleich der besten Reise-Kreditkarten im DACH-Raum.", cta: "Gratis herunterladen" },
                  { tag: "Starter", cls: "starter", price: "14 €", name: "Amex Platinum Lohnt-sich-Rechner", desc: "Interaktiver Excel-Rechner: Trage deine Werte ein und sieh, ob sich die Amex Platinum für dich lohnt.", cta: "Jetzt kaufen" },
                  { tag: "Starter", cls: "starter", price: "19 €", name: "Top 10 Buchungs-Hacks E-Book", desc: "Die 10 besten Buchungsstrategien für günstigere Flüge und bessere Hotels – mit Screenshots.", cta: "Jetzt kaufen" },
                  { tag: "Kurs", cls: "core", price: "39 €", name: "Meilen-Crashkurs (Video)", desc: "5-Modul Videokurs: Sammeln, Optimieren, Einlösen. Inkl. Kalkulator und Templates.", cta: "Zum Kurs" },
                  { tag: "Kurs", cls: "core", price: "119 €", name: "Meilen-Masterclass", desc: "12 Module, 40+ Videos, Workbooks, Community-Zugang (3 Monate) und ein 1:1 Setup-Call.", cta: "Zum Kurs" },
                  { tag: "Premium", cls: "premium", price: "99 €", name: "1:1 Strategie-Call (60 Min)", desc: "Persönliche Beratung zu deiner individuellen Meilen- und Reisestrategie.", cta: "Termin buchen" },
                  { tag: "Premium", cls: "premium", price: "249 €/Jahr", name: "VIP Community Mitgliedschaft", desc: "Exklusiver Zugang, wöchentliche Deals, monatliche Live-Calls, Bonuspunkte-System.", cta: "Mitglied werden" },
                ].map((p, i) => (
                  <article className="product-card" key={i}>
                    <div className={`product-tag ${p.cls}`}>{p.tag}</div>
                    <div className="product-price">{p.price}</div>
                    <h3>{p.name}</h3>
                    <p>{p.desc}</p>
                    <a href="#kontakt" className={`btn btn-sm ${p.cls === "free" ? "btn-secondary" : "btn-primary"}`}>{p.cta}</a>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* ═══ Freebies ═══ */}
        <section id="freebies" aria-label="Freebies">
          <div className="container">
            <div className="section-eyebrow"><div className="section-eyebrow-dot" />Kostenlos</div>
            <h2 className="section-title">Freebies &amp; kostenlose <em>Ressourcen</em></h2>
            <p className="section-sub">Starte sofort – mit meinen besten kostenlosen Guides, Checklisten und Tools.</p>
            <div className="freebies-row">
              {[
                { e: "📋", h: "Meilen-Starter-Checkliste", p: "Die wichtigsten 10 Schritte, um sofort mit dem Meilensammeln zu starten." },
                { e: "🗺️", h: "Top 10 Buchungs-Hacks PDF", p: "Meine 10 besten Buchungstricks für günstigere Flüge und bessere Hotels." },
                { e: "💳", h: "Kreditkarten-Vergleich 2025", p: "Welche Karte lohnt sich wirklich? Mein ehrlicher Vergleich der besten Optionen." },
              ].map((f, i) => (
                <article className="freebie" key={i}>
                  <div className="card-emoji">{f.e}</div>
                  <div className="freebie-tag">Gratis</div>
                  <h3>{f.h}</h3>
                  <p>{f.p}</p>
                  <button onClick={() => setLeadmagnet(f.h)} className="btn btn-secondary btn-sm">Jetzt herunterladen →</button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* ═══ Kreditkarten Referral ═══ */}
        <section id="kreditkarten" aria-label="Kreditkarten Empfehlungen">
          <div className="container">
            <div className="section-eyebrow"><div className="section-eyebrow-dot" />Empfehlungen</div>
            <h2 className="section-title">Die besten Kreditkarten für <em>Reisende</em></h2>
            <p className="section-sub">Diese Karten nutze ich selbst – und sie sind der Grundstein für smartes Meilensammeln.</p>
            <div className="referral-row">
              {[
                { e: "💳", n: "Amex Gold Card", d: "Membership Rewards bei jedem Einkauf.", b: "Bis zu 40.000 Punkte Bonus" },
                { e: "💎", n: "Amex Platinum Card", d: "Premium mit Lounge-Zugang & Reiseguthaben.", b: "Bis zu 75.000 Punkte Bonus" },
                { e: "🏦", n: "Miles & More Kreditkarte", d: "Direkt Meilen bei jeder Zahlung.", b: "Bis zu 20.000 Meilen Bonus" },
                { e: "🔄", n: "Payback Amex", d: "Kostenlos Punkte sammeln bei jedem Einkauf.", b: "Kostenlos + Startbonus" },
              ].map((c, i) => (
                <a href="#" className="referral" key={i} target="_blank" rel="noopener noreferrer">
                  <div className="referral-icon">{c.e}</div>
                  <div className="referral-body">
                    <h3>{c.n}</h3>
                    <p>{c.d}</p>
                    <span className="referral-bonus">{c.b}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* ═══ Community ═══ */}
        <section id="community" aria-label="Community">
          <div className="container">
            <div className="community-dark">
              <div className="section-eyebrow">Community</div>
              <h2>Werde Teil der traveling.prof Community</h2>
              <p>Exklusive Hacks, Bonus-Content und ein Punktesystem mit echten Rewards. Alles direkt hier – kein Redirect.</p>
              <div className="community-features">
                {["🎯 Bonuspunkte", "🔒 Exklusive Deals", "💬 Direkter Support", "🏆 Challenges"].map((f, i) => (
                  <div className="community-chip" key={i}>{f}</div>
                ))}
              </div>
              <div className="community-form">
                <input className="community-input" type="email" placeholder="Deine E-Mail-Adresse" />
                <button className="btn btn-primary btn-sm">Kostenlos beitreten →</button>
              </div>
              <p className="community-hint">Community-Login wird in Kürze aktiviert – trag dich auf die Warteliste ein.</p>
            </div>
          </div>
        </section>

        {/* ═══ Reels ═══ */}
        <section aria-label="Reels und Content">
          <div className="container">
            <div className="section-eyebrow"><div className="section-eyebrow-dot" />Content</div>
            <h2 className="section-title">Reisen ist besser, wenn wir <em>Hacks teilen</em></h2>
            <p className="section-sub">In meinen Reels und Stories nehme ich dich live mit: in Lounges, Business Cabins und an Traumziele.</p>
            <div className="gallery">
              {[
                { l: "Reel", t: "\"Eco-Preis, Business fliegen\" – Beispiel-Route mit Ersparnis", img: "/gallery-1.jpg" },
                { l: "Story", t: "Live-Einblicke in Airport-Lounges und Check-in-Tricks", img: "/gallery-2.jpg" },
                { l: "DM", t: "Community-Fragen fließen direkt in neuen Content ein", img: "/gallery-3.jpg" },
                { l: "Hack", t: "Konkrete Buchungsschritte für bessere Seats und mehr Benefits", img: "/gallery-4.jpg" },
              ].map((g, i) => (
                <div className="gallery-card" key={i} style={{ backgroundImage: `url(${g.img})`, backgroundSize: "cover", backgroundPosition: "center" }}>
                  <div className="gallery-overlay" />
                  <span className="gallery-label">{g.l}</span>
                  <span className="gallery-text">{g.t}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ Calendly ═══ */}
        <section aria-label="Termin buchen">
          <div className="container" style={{ textAlign: "center" }}>
            <div className="section-eyebrow"><div className="section-eyebrow-dot" />Termin</div>
            <h2 className="section-title">Persönliches Gespräch <em>vereinbaren</em></h2>
            <p className="section-sub" style={{ margin: "0.5rem auto 1.5rem" }}>Fragen zu Strategien, Kooperationen oder individuelle Beratung? Buche direkt einen Slot.</p>
            <div className="calendly-box">
              <iframe
                src="https://calendar.app.google/QFoADWcRwwuYUoky8"
                style={{ border: "none", width: "100%", minHeight: "500px", borderRadius: "var(--r-xl)" }}
                title="Termin buchen"
              />
              <p style={{ color: "var(--muted)", fontSize: "0.72rem", marginTop: "0.75rem" }}>
                Kein passender Termin? Schreib mir direkt per{" "}
                <a href="https://www.instagram.com/traveling.prof" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>Instagram DM</a>{" "}
                oder an{" "}
                <a href="mailto:traveling.prof@outlook.de" style={{ color: "var(--accent)" }}>traveling.prof@outlook.de</a>.
              </p>
            </div>
          </div>
        </section>

        {/* ═══ Zahlungen ═══ */}
        <section aria-label="Integrationen" style={{ paddingTop: "1rem" }}>
          <div className="container" style={{ textAlign: "center" }}>
            <div className="section-eyebrow">Zahlungen</div>
            <h2 className="section-title" style={{ fontSize: "1.3rem", marginBottom: "0.75rem" }}>Sicher bezahlen &amp; verwalten</h2>
            <div className="integrations">
              {["💳 Stripe", "🅿️ PayPal", "🛒 Stan Store", "📅 Calendly", "🎓 Alfima"].map((b, i) => (
                <div className="int-badge" key={i}>{b}</div>
              ))}
            </div>
            <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.75rem" }}>Integrationen werden bei Bedarf aktiviert.</p>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section aria-label="Call to Action">
          <div className="container">
            <div className="cta-banner">
              <h2>Bereit, smarter zu reisen?</h2>
              <p>Folge <strong>@traveling.prof</strong> auf Instagram und hol dir regelmäßig neue Hacks.</p>
              <div className="hero-buttons" style={{ justifyContent: "center" }}>
                <a href="https://www.instagram.com/traveling.prof" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  Jetzt auf Instagram folgen
                </a>
                <a href="#kontakt" className="btn btn-secondary">Fragen stellen</a>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <section aria-label="FAQ">
          <div className="container">
            <div className="section-eyebrow"><div className="section-eyebrow-dot" />FAQ</div>
            <h2 className="section-title">Häufig gestellte <em>Fragen</em></h2>
            <div className="faq-list">
              {[
                { q: "Brauche ich viel Geld, um deine Travel Hacks umzusetzen?", a: "Nein. Viele Strategien basieren darauf, Ausgaben, die du ohnehin hast, einfach smarter zu nutzen – z.B. für Meilen & Punkte bei jedem Einkauf." },
                { q: "Für wen ist dein Content gedacht?", a: "Für alle, die mehr reisen wollen – mit besserem Preis-Leistungs-Verhältnis. Egal ob du einmal im Jahr in den Urlaub fliegst oder regelmäßig unterwegs bist." },
                { q: "Kostet mich das Folgen auf Instagram etwas?", a: "Natürlich nicht. Mein Content auf Instagram ist komplett kostenlos. Premium-Angebote sind optional." },
                { q: "Welche Produkte kann ich bei dir kaufen?", a: "Von kostenlosen Checklisten über Excel-Kalkulatoren (ab 14€) bis hin zu Video-Kursen und 1:1 Beratung. Alles auf der Produkte-Sektion oben." },
                { q: "Wie funktioniert die Community?", a: "Die Community wird mit Login-Bereich, Bonuspunkte-System und exklusiven Inhalten direkt auf dieser Seite verfügbar – ohne Weiterleitung zu externen Plattformen." },
              ].map((f, i) => <Faq key={i} q={f.q} a={f.a} />)}
            </div>
          </div>
        </section>

        {/* ═══ Kontakt ═══ */}
        <section id="kontakt" aria-label="Kontakt">
          <div className="container">
            <div className="section-eyebrow"><div className="section-eyebrow-dot" />Kontakt</div>
            <h2 className="section-title">Lass uns <em>connecten</em></h2>
            <p className="section-sub">Fragen zu Reels, Buchungsstrategien oder Kooperationen? Schreib mir.</p>
            <div className="contact-grid">
              <article className="contact-card">
                <h3>Via Instagram</h3>
                <p>Der schnellste Weg – schreib mir einfach eine DM.</p>
                <a href="https://www.instagram.com/traveling.prof" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">DM auf Instagram →</a>
              </article>
              <article className="contact-card">
                <h3>Per E-Mail</h3>
                <p>Kooperationen, Business-Anfragen oder größere Reiseplanung?</p>
                <a href="mailto:traveling.prof@outlook.de" style={{ color: "var(--accent)", fontWeight: 600, fontSize: "0.9rem" }}>traveling.prof@outlook.de</a>
              </article>
            </div>
          </div>
        </section>
      </main>

      {/* ═══ Footer ═══ */}
      <footer>
        <div className="container">
          <div className="footer-row">
            <span>© {year} traveling.prof – Travel Hacks &amp; Luxusreisen</span>
            <div className="footer-links">
              <a href="https://www.instagram.com/traveling.prof" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="#kontakt">Kontakt</a>
              <Link href="/impressum">Impressum</Link>
              <Link href="/datenschutz">Datenschutz</Link>
              <Link href="/agb">AGB</Link>
              <Link href="/widerruf">Widerruf</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
