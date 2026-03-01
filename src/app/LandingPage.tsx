"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CookieConsent from "./components/CookieConsent";
import { createClient } from "@/lib/supabase/client";
import type { CmsData } from "@/lib/cms";

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !consent) return;
    localStorage.setItem("leadmagnet-lead", JSON.stringify({ email, name, product, date: new Date().toISOString() }));
    fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name: name || undefined, source: `leadmagnet:${product}` }),
    }).catch(() => {});
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="leadmagnet-overlay" onClick={onClose}>
        <div className="leadmagnet-modal" onClick={e => e.stopPropagation()}>
          <button className="leadmagnet-close" onClick={onClose}>x</button>
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>✅</div>
            <h3 style={{ marginBottom: "0.5rem" }}>Geschafft!</h3>
            <p style={{ color: "var(--text-sub)", fontSize: "0.88rem", lineHeight: 1.6 }}>
              Wir haben dir eine Bestätigung an <strong>{email}</strong> gesendet.
              Prüfe auch deinen Spam-Ordner.
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
function HackFinder({ hacks }: { hacks: Record<string, string> }) {
  const [q, setQ] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

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
function Header({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const desktopLinks = [
    { href: "#produkte", label: "Produkte" },
    { href: "#kreditkarten", label: "Kreditkarten" },
    { href: "#community", label: "Community" },
    { href: "#about", label: "Über mich" },
    { href: "#kontakt", label: "Kontakt" },
  ];

  const mobileOnlyLinks = [
    { href: "#hacks", label: "Travel Hacks" },
    { href: "#erfolge", label: "Erfolge" },
    { href: "#freebies", label: "Freebies" },
  ];

  const allMobileLinks = [...desktopLinks, ...mobileOnlyLinks];

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
            {desktopLinks.map(l => <a key={l.href} href={l.href}>{l.label}</a>)}
          </div>
          <div className="nav-actions">
            <div className="nav-cta-desktop">
              {isLoggedIn ? (
                <Link href="/dashboard" className="btn btn-primary btn-sm">
                  Mein Bereich →
                </Link>
              ) : (
                <>
                  <Link href="/login" className="btn btn-secondary btn-sm">
                    Anmelden
                  </Link>
                  <Link href="/register" className="btn btn-primary btn-sm">
                    Kostenlos starten
                  </Link>
                </>
              )}
            </div>
            <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menü">
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </nav>
      </div>
      <div className={`mobile-nav ${menuOpen ? "open" : ""}`}>
        <div className="mobile-nav-auth">
          {isLoggedIn ? (
            <Link href="/dashboard" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => setMenuOpen(false)}>
              Mein Bereich →
            </Link>
          ) : (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Link href="/login" className="btn btn-secondary" style={{ flex: 1, justifyContent: "center" }} onClick={() => setMenuOpen(false)}>
                Anmelden
              </Link>
              <Link href="/register" className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={() => setMenuOpen(false)}>
                Kostenlos starten
              </Link>
            </div>
          )}
        </div>
        <div className="mobile-nav-divider" />
        {allMobileLinks.map(l => <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>)}
      </div>
    </header>
  );
}

/* ═══ LANDING PAGE ═══ */
export default function LandingPage({ cms }: { cms: CmsData }) {
  const year = new Date().getFullYear();
  const router = useRouter();
  const [leadmagnet, setLeadmagnet] = useState<string | null>(null);
  const [claimingProduct, setClaimingProduct] = useState<string | null>(null);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistStatus, setWaitlistStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [buyingProduct, setBuyingProduct] = useState<string | null>(null);

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });
  }, []);

  async function claimFreeProduct(productId: string) {
    setClaimingProduct(productId);
    try {
      const res = await fetch("/api/products/claim-free", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        router.push(`/dashboard/produkte/${productId}`);
      }
    } catch {
      // Fallback: redirect to dashboard
      router.push("/dashboard/produkte");
    } finally {
      setClaimingProduct(null);
    }
  }

  async function handleBuyProduct(productId: string) {
    setBuyingProduct(productId);
    try {
      const endpoint = isLoggedIn ? "/api/stripe/checkout" : "/api/stripe/guest-checkout";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // Fallback
      if (!isLoggedIn) {
        router.push(`/register`);
      }
    } finally {
      setBuyingProduct(null);
    }
  }

  const handleWaitlist = async (e: FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail.trim()) return;
    setWaitlistStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: waitlistEmail }),
      });
      if (res.ok) {
        setWaitlistStatus("success");
        setWaitlistEmail("");
      } else {
        setWaitlistStatus("error");
      }
    } catch {
      setWaitlistStatus("error");
    }
  };

  return (
    <div className="page">
      <ScrollTop />
      <CookieConsent />
      <Header isLoggedIn={isLoggedIn} />
      {leadmagnet && <LeadmagnetForm product={leadmagnet} onClose={() => setLeadmagnet(null)} />}

      <main>
        {/* ═══ 1. Hero ═══ */}
        <section className="hero" aria-label="Hero">
          <div className="container">
            <div className="hero-grid">
              <div>
                <div className="hero-badge">
                  <div className="hero-badge-pulse" />
                  {cms.hero.badge}
                </div>
                <h1 dangerouslySetInnerHTML={{ __html: cms.hero.title }} />
                <p className="hero-desc" dangerouslySetInnerHTML={{ __html: cms.hero.subtitle }} />
                <div className="hero-buttons">
                  {isLoggedIn ? (
                    <Link href="/dashboard" className="btn btn-primary btn-lg">
                      Zum Dashboard →
                    </Link>
                  ) : (
                    <Link href="/register" className="btn btn-primary btn-lg">
                      Kostenlos starten
                    </Link>
                  )}
                  <a href="#produkte" className="btn btn-secondary">Produkte ansehen</a>
                </div>
                <div className="hero-stats">
                  {cms.hero.stats.map((s, i) => (
                    <div className="hero-stat" key={i}>{s.emoji} <strong>{s.text}</strong></div>
                  ))}
                </div>
                <div className="proven-mini">
                  <div><div className="proven-stars">★★★★★</div></div>
                  <div className="proven-info"><strong>{cms.hero.rating_score}</strong><br />{cms.hero.rating_source}</div>
                </div>
              </div>
              <div className="hero-visual">
                <img src={cms.hero.hero_image} alt="Business Class Reisen mit traveling.prof" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 2. Social Proof Bar ═══ */}
        <div className="social-proof-strip">
          <div className="container">
            <div className="proof-row">
              <div className="proof-item"><strong>500+</strong> Follower</div>
              <div className="proof-item"><strong>30+</strong> Länder</div>
              <div className="proof-item"><strong>50.000€+</strong> gespart</div>
              <div className="proof-item"><strong>4.9/5</strong> Bewertung</div>
            </div>
          </div>
        </div>

        {/* ═══ 3. Erfolgsgeschichten ═══ */}
        <section id="erfolge" aria-label="Erfolgsgeschichten">
          <div className="container">
            <div className="section-eyebrow"><div className="section-eyebrow-dot" />{cms.testimonials.eyebrow}</div>
            <h2 className="section-title" dangerouslySetInnerHTML={{ __html: cms.testimonials.title }} />
            <p className="section-sub">{cms.testimonials.subtitle}</p>
            <div className="testimonials-row">
              {cms.testimonials.items.map((t, i) => (
                <article className="testimonial" key={i}>
                  <blockquote>&ldquo;{t.quote}&rdquo;</blockquote>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">{t.initials}</div>
                    <div className="testimonial-meta"><div className="name">{t.name}</div><div className="detail">{t.detail}</div></div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* ═══ 4. Travel Hacks ═══ */}
        <section id="hacks" aria-label="Travel Hacks">
          <div className="container">
            <div className="section-eyebrow"><div className="section-eyebrow-dot" />{cms.cards.eyebrow}</div>
            <h2 className="section-title" dangerouslySetInnerHTML={{ __html: cms.cards.title }} />
            <p className="section-sub">{cms.cards.subtitle}</p>
            <div className="cards-row">
              {cms.cards.items.map((c, i) => (
                <article className="card" key={i}>
                  <div className="card-img"><img src={c.img} alt={c.title} /></div>
                  <h3>{c.title}</h3>
                  <p>{c.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* ═══ 5. Video ═══ */}
        <section style={{ paddingTop: 0, paddingBottom: "2rem" }} aria-label="Video">
          <div className="container">
            <div className="video-banner">
              <img src="/banner.jpg" alt="Traumstrand – smarter reisen mit traveling.prof" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div className="video-overlay"><span>📍 Nächstes Abenteuer lädt...</span></div>
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* ═══ 6. Produkte (Stripe) ═══ */}
        <section id="produkte" aria-label="Produkte">
          <div className="container">
            <div className="products-section">
              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <div className="section-eyebrow"><div className="section-eyebrow-dot" />{cms.products_display.eyebrow}</div>
                <h2 className="section-title" dangerouslySetInnerHTML={{ __html: cms.products_display.title }} />
                <p className="section-sub" style={{ margin: "0.5rem auto 0", maxWidth: "32rem" }}>{cms.products_display.subtitle}</p>
              </div>
              <div className="products-grid">
                {cms.products_display.items.map((p, i) => {
                  const isPopular = p.name === "Meilen-Crashkurs (Video)";
                  return (
                    <article className={`product-card${isPopular ? " product-popular" : ""}`} key={i} data-popular={isPopular || undefined}>
                      {isPopular && <div className="popular-badge">Beliebteste Wahl</div>}
                      <div className={`product-tag ${p.cls}`}>{p.tag}</div>
                      <div className="product-price">{p.price}</div>
                      <h3>{p.name}</h3>
                      <p>{p.desc}</p>
                      {p.action === "leadmagnet" ? (
                        isLoggedIn && p.product_id ? (
                          <button
                            onClick={() => claimFreeProduct(p.product_id!)}
                            className="btn btn-sm btn-secondary"
                            disabled={claimingProduct === p.product_id}
                          >
                            {claimingProduct === p.product_id ? "Wird freigeschaltet..." : p.cta}
                          </button>
                        ) : (
                          <button onClick={() => setLeadmagnet(p.name)} className="btn btn-sm btn-secondary">{p.cta}</button>
                        )
                      ) : p.action === "termin" ? (
                        <a href="#termin" className="btn btn-sm btn-primary">{p.cta}</a>
                      ) : p.action === "vip" ? (
                        <Link href="/register" className="btn btn-sm btn-primary">{p.cta}</Link>
                      ) : (
                        <button
                          onClick={() => handleBuyProduct(p.product_id!)}
                          className="btn btn-sm btn-primary"
                          disabled={buyingProduct !== null}
                        >
                          {buyingProduct === p.product_id ? "Wird geladen..." : p.cta}
                        </button>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* ═══ 7. Hack Finder ═══ */}
        <section id="tool" aria-label="Travel Hack Finder">
          <div className="container"><HackFinder hacks={cms.hack_finder.hacks} /></div>
        </section>

        <hr className="divider" />

        {/* ═══ 8. Freebies ═══ */}
        <section id="freebies" aria-label="Freebies">
          <div className="container">
            <div className="section-eyebrow"><div className="section-eyebrow-dot" />{cms.freebies.eyebrow}</div>
            <h2 className="section-title" dangerouslySetInnerHTML={{ __html: cms.freebies.title }} />
            <p className="section-sub">{cms.freebies.subtitle}</p>
            <div className="freebies-row">
              {cms.freebies.items.map((f, i) => (
                <article className="freebie" key={i}>
                  <div className="card-emoji">{f.emoji}</div>
                  <div className="freebie-tag">Gratis</div>
                  <h3>{f.title}</h3>
                  <p>{f.description}</p>
                  <button onClick={() => setLeadmagnet(f.title)} className="btn btn-secondary btn-sm">Jetzt herunterladen →</button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* ═══ 9. Über mich ═══ */}
        <section id="about" aria-label="Über mich">
          <div className="container">
            <div className="split">
              <div>
                <div className="section-eyebrow"><div className="section-eyebrow-dot" />{cms.about.eyebrow}</div>
                <h2 className="section-title" dangerouslySetInnerHTML={{ __html: cms.about.title }} />
                <p className="section-sub">{cms.about.subtitle}</p>
                <ul className="check-list">
                  {cms.about.check_items.map((item, i) => (
                    <li key={i}><div className="check-mark">✓</div><div><strong>{item.bold}</strong> {item.text}</div></li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="about-img-wrap"><img src={cms.about.image} alt="Reisen mit traveling.prof" className="about-img" /></div>
                <article className="card" style={{ marginTop: "1rem" }}>
                  <h3>{cms.about.mission_title}</h3>
                  <p style={{ marginBottom: "0.6rem" }}>{cms.about.mission_intro}</p>
                  <ul className="check-list">
                    {cms.about.mission_items.map((t, i) => (
                      <li key={i}><div className="check-mark">★</div><div>{t}</div></li>
                    ))}
                  </ul>
                </article>
              </div>
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* ═══ 10. Kreditkarten Referral ═══ */}
        <section id="kreditkarten" aria-label="Kreditkarten Empfehlungen">
          <div className="container">
            <div className="section-eyebrow"><div className="section-eyebrow-dot" />{cms.credit_cards.eyebrow}</div>
            <h2 className="section-title" dangerouslySetInnerHTML={{ __html: cms.credit_cards.title }} />
            <p className="section-sub">{cms.credit_cards.subtitle}</p>
            <div className="referral-row">
              {cms.credit_cards.items.map((c, i) => (
                <a href={c.link} className="referral" key={i} target="_blank" rel="noopener noreferrer">
                  <div className="referral-icon">{c.emoji}</div>
                  <div className="referral-body">
                    <h3>{c.name}</h3>
                    <p>{c.description}</p>
                    <span className="referral-bonus">{c.bonus}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <hr className="divider" />

        {/* ═══ 11. Community ═══ */}
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
              {isLoggedIn ? (
                <div style={{ marginTop: "0.5rem" }}>
                  <Link href="/dashboard" className="btn btn-primary" style={{ justifyContent: "center" }}>
                    Zum Community-Bereich →
                  </Link>
                </div>
              ) : waitlistStatus === "success" ? (
                <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "0.75rem", padding: "1rem 1.5rem", marginTop: "0.5rem" }}>
                  <p style={{ color: "#22c55e", fontWeight: 600, fontSize: "0.9rem" }}>Du bist auf der Warteliste! Wir melden uns bei dir.</p>
                </div>
              ) : (
                <form className="community-form" onSubmit={handleWaitlist}>
                  <input className="community-input" type="email" placeholder="Deine E-Mail-Adresse" value={waitlistEmail} onChange={e => setWaitlistEmail(e.target.value)} required />
                  <button type="submit" className="btn btn-primary btn-sm" disabled={waitlistStatus === "loading"}>
                    {waitlistStatus === "loading" ? "Wird eingetragen..." : "Kostenlos beitreten →"}
                  </button>
                </form>
              )}
              {!isLoggedIn && waitlistStatus === "error" && <p style={{ color: "#dc2626", fontSize: "0.82rem", marginTop: "0.5rem" }}>Etwas ist schiefgelaufen. Versuche es erneut.</p>}
              {!isLoggedIn && <p className="community-hint">Bereits registriert? <Link href="/login" style={{ color: "var(--accent)" }}>Hier anmelden</Link></p>}
            </div>
          </div>
        </section>

        {/* ═══ 12. Reels ═══ */}
        <section aria-label="Reels und Content">
          <div className="container">
            <div className="section-eyebrow"><div className="section-eyebrow-dot" />{cms.gallery.eyebrow}</div>
            <h2 className="section-title" dangerouslySetInnerHTML={{ __html: cms.gallery.title }} />
            <p className="section-sub">{cms.gallery.subtitle}</p>
            <div className="gallery">
              {cms.gallery.items.map((g, i) => (
                <div className="gallery-card" key={i} style={{ backgroundImage: `url(${g.image})`, backgroundSize: "cover", backgroundPosition: "center" }}>
                  <div className="gallery-overlay" />
                  <span className="gallery-label">{g.label}</span>
                  <span className="gallery-text">{g.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 13. CTA ═══ */}
        <section aria-label="Call to Action">
          <div className="container">
            <div className="cta-banner">
              <h2>Bereit, smarter zu reisen?</h2>
              <p>{isLoggedIn ? "Entdecke deine personalisierten Travel Hacks im Dashboard." : "Erstelle dein kostenloses Konto und starte mit deinen Travel Hacks."}</p>
              <div className="hero-buttons" style={{ justifyContent: "center" }}>
                {isLoggedIn ? (
                  <Link href="/dashboard" className="btn btn-primary">
                    Zum Dashboard →
                  </Link>
                ) : (
                  <Link href="/register" className="btn btn-primary">
                    Kostenlos registrieren
                  </Link>
                )}
                <a href="https://www.instagram.com/traveling.prof" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                  Instagram folgen
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 14. FAQ ═══ */}
        <section aria-label="FAQ">
          <div className="container">
            <div className="section-eyebrow"><div className="section-eyebrow-dot" />{cms.faq.eyebrow}</div>
            <h2 className="section-title" dangerouslySetInnerHTML={{ __html: cms.faq.title }} />
            <div className="faq-list">
              {cms.faq.items.map((f, i) => <Faq key={i} q={f.question} a={f.answer} />)}
            </div>
          </div>
        </section>

        {/* ═══ 15. Calendly ═══ */}
        <section id="termin" aria-label="Termin buchen">
          <div className="container" style={{ textAlign: "center" }}>
            <div className="section-eyebrow"><div className="section-eyebrow-dot" />Termin</div>
            <h2 className="section-title">Persönliches Gespräch <em>vereinbaren</em></h2>
            <p className="section-sub" style={{ margin: "0.5rem auto 1.5rem" }}>Fragen zu Strategien, Kooperationen oder individuelle Beratung? Buche direkt einen Slot.</p>
            <div className="calendly-box">
              <iframe
                src="https://calendly.com/travelingprof/30min"
                style={{ border: "none", width: "100%", minHeight: "660px", borderRadius: "var(--r-xl)" }}
                title="Termin buchen"
              />
              <p style={{ color: "var(--muted)", fontSize: "0.72rem", marginTop: "0.75rem" }}>
                Kein passender Termin? Schreib mir direkt per{" "}
                <a href="https://www.instagram.com/traveling.prof" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>Instagram DM</a>{" "}
                oder an{" "}
                <a href="mailto:info@travelingprof.de" style={{ color: "var(--accent)" }}>info@travelingprof.de</a>.
              </p>
            </div>
          </div>
        </section>

        {/* ═══ 16. Kontakt ═══ */}
        <section id="kontakt" aria-label="Kontakt">
          <div className="container">
            <div className="section-eyebrow"><div className="section-eyebrow-dot" />{cms.contact.eyebrow}</div>
            <h2 className="section-title" dangerouslySetInnerHTML={{ __html: cms.contact.title }} />
            <p className="section-sub">{cms.contact.subtitle}</p>
            <div className="contact-grid">
              {cms.contact.items.map((c, i) => (
                <article className="contact-card" key={i}>
                  <h3>{c.title}</h3>
                  <p>{c.description}</p>
                  {c.link_type === "button" ? (
                    <a href={c.link_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">{c.link_text}</a>
                  ) : (
                    <a href={c.link_url} style={{ color: "var(--accent)", fontWeight: 600, fontSize: "0.9rem" }}>{c.link_text}</a>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ═══ Footer + Zahlungen ═══ */}
      <footer>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
            <div className="integrations">
              {["💳 Stripe", "🅿️ PayPal", "🛒 Stan Store", "📅 Calendly", "🎓 Alfima"].map((b, i) => (
                <div className="int-badge" key={i}>{b}</div>
              ))}
            </div>
          </div>
          <div className="footer-row">
            <span>© {year} traveling.prof – Travel Hacks &amp; Luxusreisen</span>
            <div className="footer-links">
              {isLoggedIn ? (
                <Link href="/dashboard">Mein Bereich</Link>
              ) : (
                <Link href="/login">Anmelden</Link>
              )}
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

      {/* ═══ Sticky Mobile CTA ═══ */}
      <div className="sticky-mobile-cta">
        <a href="#freebies" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
          Gratis-Checkliste sichern
        </a>
      </div>
    </div>
  );
}
