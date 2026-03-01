/* ═══ TypeScript Interfaces ═══ */

export interface HeroData {
  badge: string;
  title: string;
  subtitle: string;
  stats: { emoji: string; text: string }[];
  rating_score: string;
  rating_source: string;
  hero_image: string;
}

export interface HackFinderData {
  hacks: Record<string, string>;
}

export interface CardsData {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: { img: string; title: string; description: string }[];
}

export interface AboutData {
  eyebrow: string;
  title: string;
  subtitle: string;
  check_items: { bold: string; text: string }[];
  image: string;
  mission_title: string;
  mission_intro: string;
  mission_items: string[];
}

export interface TestimonialsData {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: { quote: string; name: string; detail: string; initials: string }[];
}

export interface ProductsDisplayData {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: { tag: string; cls: string; price: string; name: string; desc: string; cta: string; action: string; product_id?: string }[];
}

export interface FreebiesData {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: { emoji: string; title: string; description: string }[];
}

export interface CreditCardsData {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: { emoji: string; name: string; description: string; bonus: string; link: string }[];
}

export interface GalleryData {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: { label: string; text: string; image: string }[];
}

export interface FaqData {
  eyebrow: string;
  title: string;
  items: { question: string; answer: string }[];
}

export interface ContactData {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: { title: string; description: string; link_text: string; link_url: string; link_type: string }[];
}

export interface CmsData {
  hero: HeroData;
  hack_finder: HackFinderData;
  cards: CardsData;
  about: AboutData;
  testimonials: TestimonialsData;
  products_display: ProductsDisplayData;
  freebies: FreebiesData;
  credit_cards: CreditCardsData;
  gallery: GalleryData;
  faq: FaqData;
  contact: ContactData;
}

/* ═══ Default Data (extracted from hardcoded page.tsx) ═══ */

export const CMS_DEFAULTS: CmsData = {
  hero: {
    badge: "Jetzt starten – mehr Reise, weniger zahlen",
    title: 'Fliege <em>Business Class</em> zum Economy-Preis. Lerne wie.',
    subtitle: 'Auf <strong>@traveling.prof</strong> zeige ich dir Schritt für Schritt, wie du mit Meilen, Punkten &amp; cleveren Buchungstricks smarter reist – Business Class, Lounges &amp; Traumhotels, ohne dein Budget zu sprengen.',
    stats: [
      { emoji: "🌍", text: "30 Länder bereist" },
      { emoji: "✈️", text: "Fokus Business Class" },
      { emoji: "📲", text: "Tägliche Reels & Stories" },
    ],
    rating_score: "4.9 / 5",
    rating_source: "ProvenExpert · Verifiziert",
    hero_image: "/hero.jpg",
  },

  hack_finder: {
    hacks: {
      business: "Open-Jaw-Trick: Buche Hin- und Rückflug über verschiedene Städte. So bekommst du Business Class oft 40-60% günstiger. Beispiel: Frankfurt nach Bangkok via Istanbul mit Turkish Airlines für nur 800 EUR in Business!",
      dubai: "Fifth Freedom Flights: Singapore Airlines fliegt Dubai-Manchester in Business Class – oft günstiger als Emirates Direktflug. Oder nutze Emirates Meilen für die Strecke: nur 62.500 Meilen one-way in Business!",
      lounge: "Lounge-Zugang ohne Status: (1) Priority Pass über Amex Platinum (1.400+ Lounges weltweit), (2) Day Passes direkt kaufen (ab 25 EUR), (3) LoungeBuddy App für Einzelzugang. Mein Favorit: Die Turkish Airlines CIP Lounge Istanbul – die beste der Welt!",
      hotel: "Hotel-Status-Match: Viele Ketten bieten Status-Matching an. Mit Amex Platinum bekommst du Marriott Gold und Hilton Gold automatisch. Das bedeutet: Zimmer-Upgrades, spaetes Checkout und Fruehstueck inklusive!",
      meilen: "Kreditkarten-Combo für maximale Meilen: Amex Platinum (3x Punkte auf Reisen) + Payback Amex (kostenlos, Punkte bei jedem Einkauf) + Barclays (kostenlos im Ausland). So sammelst du bei JEDER Ausgabe Punkte.",
      malediven: "Malediven in Business Class für 0 EUR: Sammle 90.000 Miles and More Meilen (ca. 12 Monate mit Amex), buche Lufthansa/Swiss Business Frankfurt-Male. Meilenpreis: 0 EUR + ca. 200 EUR Steuern!",
      upgrade: "Upgrade-Hack: Buche Economy, checke 24h vor Abflug die Airline-App. Viele Airlines bieten dann Bid-Upgrades (ab 150 EUR für Business) an. Oder nutze Meilen für Last-Minute Operational Upgrades direkt am Gate.",
    },
  },

  cards: {
    eyebrow: "Inhalte",
    title: 'Was du bei <em>@traveling.prof</em> lernst',
    subtitle: "Konkrete, umsetzbare Travel Hacks statt leerer Versprechen. Jeder Hack basiert auf echten Buchungen und eigenen Erfahrungen.",
    items: [
      { img: "/card-meilen.jpg", title: "Meilen & Punkte", description: "Lerne, wie du mit Amex, Payback & Miles and More bei jedem Einkauf Meilen sammelst – ohne mehr auszugeben." },
      { img: "/card-lounge.jpg", title: "Lounges & Upgrades", description: "Strategien für Lounge-Zugang und Upgrades in Business/First – auch ohne Vielfliegerstatus." },
      { img: "/card-hotel.jpg", title: "Hotels & Hidden Deals", description: "Hotels smarter buchen, Status nutzen und kostenlose Upgrades herausholen." },
      { img: "/card-content.jpg", title: "Praxis-Reels", description: "Echte Buchungen, echte Routen, echte Preise – Schritt für Schritt zum Nachmachen." },
    ],
  },

  about: {
    eyebrow: "Über mich",
    title: 'Vom normalen Urlauber zum <em>smarten Traveller</em>',
    subtitle: "Fast 30 Länder – von Europa über die USA bis Südafrika, Costa Rica, Panama und die VAE. Irgendwann habe ich gemerkt: Es gibt clevere Wege, deutlich mehr rauszuholen.",
    check_items: [
      { bold: "Praxis statt Theorie:", text: "Alles, was du lernst, setze ich selbst ein." },
      { bold: "Fokus auf Effizienz:", text: "Nicht nur billiger, sondern smarter reisen." },
      { bold: "Echte Zahlen:", text: "Meine Amex Platinum spart mir über 6.000€ pro Jahr." },
    ],
    image: "/about.jpg",
    mission_title: "Meine Mission",
    mission_intro: 'Luxusreisen sind kein "nur für die anderen"-Ding. Mit den richtigen Strategien kannst du:',
    mission_items: [
      "Mehrmals im Jahr reisen – ohne dein Konto zu sprengen.",
      "Business Class zum Economy-Preis fliegen.",
      "Einen Travel-Lifestyle aufbauen, der zu deinem Alltag passt.",
    ],
  },

  testimonials: {
    eyebrow: "Proof of Strategy",
    title: 'Erfolgsgeschichten aus der <em>Community</em>',
    subtitle: "Echte Ergebnisse von echten Menschen.",
    items: [
      { quote: "Dank der Meilen-Strategie habe ich Business Class nach Dubai für nur 340€ gebucht. Normalerweise über 3.000€!", name: "Marco S.", detail: "Business Class Dubai", initials: "MS" },
      { quote: "Ich hatte null Ahnung von Meilen. Nach 3 Monaten: Lounge-Zugang und ein Freiflug nach Mallorca für die ganze Familie.", name: "Lisa K.", detail: "Family-Trip Mallorca", initials: "LK" },
      { quote: "Die Hotel-Hacks sind Gold wert. Suite-Upgrade in Abu Dhabi – kostenlos. Hätte ich ohne die Tipps nie bekommen.", name: "Thomas R.", detail: "Suite-Upgrade Abu Dhabi", initials: "TR" },
    ],
  },

  products_display: {
    eyebrow: "Produkte & Kurse",
    title: 'Dein Weg zum <em>smarten Traveller</em>',
    subtitle: "Von kostenlos bis Premium – für jedes Level das passende Angebot.",
    items: [
      { tag: "Kostenlos", cls: "free", price: "0 €", name: "Meilen-Starter-Checkliste", desc: "10 Schritte zum sofortigen Start mit dem Meilensammeln. PDF zum Download.", cta: "Gratis herunterladen", action: "leadmagnet", product_id: "meilen-checkliste" },
      { tag: "Kostenlos", cls: "free", price: "0 €", name: "Meilen-Quick-Check Kalkulator", desc: "Finde in 60 Sekunden heraus, wie viele Meilen du pro Jahr sammeln kannst.", cta: "Gratis herunterladen", action: "leadmagnet", product_id: "meilen-kalkulator" },
      { tag: "Kostenlos", cls: "free", price: "0 €", name: "Kreditkarten-Vergleich 2026", desc: "Ehrlicher Vergleich der besten Reise-Kreditkarten im DACH-Raum.", cta: "Gratis herunterladen", action: "leadmagnet", product_id: "kreditkarten-gratis" },
      { tag: "Starter", cls: "starter", price: "14 €", name: "Amex Platinum Lohnt-sich-Rechner", desc: "Interaktiver Excel-Rechner: Trage deine Werte ein und sieh, ob sich die Amex Platinum für dich lohnt.", cta: "Sofort freischalten", action: "buy" },
      { tag: "Starter", cls: "starter", price: "19 €", name: "Top 10 Buchungs-Hacks E-Book", desc: "Die 10 besten Buchungsstrategien für günstigere Flüge und bessere Hotels – mit Screenshots.", cta: "Sofort freischalten", action: "buy" },
      { tag: "Kurs", cls: "core", price: "39 €", name: "Meilen-Crashkurs (Video)", desc: "5-Modul Videokurs: Sammeln, Optimieren, Einlösen. Inkl. Kalkulator und Templates.", cta: "Jetzt Zugang sichern", action: "buy" },
      { tag: "Kurs", cls: "core", price: "119 €", name: "Meilen-Masterclass", desc: "12 Module, 40+ Videos, Workbooks, Community-Zugang (3 Monate) und ein 1:1 Setup-Call.", cta: "Jetzt Zugang sichern", action: "buy" },
      { tag: "Premium", cls: "premium", price: "99 €", name: "1:1 Strategie-Call (60 Min)", desc: "Persönliche Beratung zu deiner individuellen Meilen- und Reisestrategie.", cta: "Termin buchen", action: "termin" },
      { tag: "Premium", cls: "premium", price: "249 €/Jahr", name: "VIP Community Mitgliedschaft", desc: "Exklusiver Zugang, wöchentliche Deals, monatliche Live-Calls, Bonuspunkte-System.", cta: "Mitglied werden", action: "vip" },
    ],
  },

  freebies: {
    eyebrow: "Kostenlos",
    title: 'Freebies &amp; kostenlose <em>Ressourcen</em>',
    subtitle: "Starte sofort – mit meinen besten kostenlosen Guides, Checklisten und Tools.",
    items: [
      { emoji: "📋", title: "Meilen-Starter-Checkliste", description: "Die wichtigsten 10 Schritte, um sofort mit dem Meilensammeln zu starten." },
      { emoji: "🗺️", title: "Top 10 Buchungs-Hacks PDF", description: "Meine 10 besten Buchungstricks für günstigere Flüge und bessere Hotels." },
      { emoji: "💳", title: "Kreditkarten-Vergleich 2026", description: "Welche Karte lohnt sich wirklich? Mein ehrlicher Vergleich der besten Optionen." },
    ],
  },

  credit_cards: {
    eyebrow: "Empfehlungen",
    title: 'Die besten Kreditkarten für <em>Reisende in Deutschland</em>',
    subtitle: "Diese Karten nutze ich selbst – und sie sind der Grundstein für smartes Meilensammeln. Alle Karten in Deutschland beantragbar.",
    items: [
      { emoji: "💳", name: "Amex Gold Card", description: "Membership Rewards bei jedem Einkauf.", bonus: "Bis zu 40.000 Punkte Bonus", link: "#" },
      { emoji: "💎", name: "Amex Platinum Card", description: "Premium mit Lounge-Zugang & Reiseguthaben.", bonus: "Bis zu 75.000 Punkte Bonus", link: "#" },
      { emoji: "🏦", name: "Miles & More Kreditkarte", description: "Direkt Meilen bei jeder Zahlung.", bonus: "Bis zu 20.000 Meilen Bonus", link: "#" },
      { emoji: "🔄", name: "Payback Amex", description: "Kostenlos Punkte sammeln bei jedem Einkauf.", bonus: "Kostenlos + Startbonus", link: "#" },
    ],
  },

  gallery: {
    eyebrow: "Content",
    title: 'Reisen ist besser, wenn wir <em>Hacks teilen</em>',
    subtitle: "In meinen Reels und Stories nehme ich dich live mit: in Lounges, Business Cabins und an Traumziele.",
    items: [
      { label: "Reel", text: '"Eco-Preis, Business fliegen" – Beispiel-Route mit Ersparnis', image: "/gallery-1.jpg" },
      { label: "Story", text: "Live-Einblicke in Airport-Lounges und Check-in-Tricks", image: "/gallery-2.jpg" },
      { label: "DM", text: "Community-Fragen fließen direkt in neuen Content ein", image: "/gallery-3.jpg" },
      { label: "Hack", text: "Konkrete Buchungsschritte für bessere Seats und mehr Benefits", image: "/gallery-4.jpg" },
    ],
  },

  faq: {
    eyebrow: "FAQ",
    title: 'Häufig gestellte <em>Fragen</em>',
    items: [
      { question: "Brauche ich viel Geld, um deine Travel Hacks umzusetzen?", answer: "Nein. Viele Strategien basieren darauf, Ausgaben, die du ohnehin hast, einfach smarter zu nutzen – z.B. für Meilen & Punkte bei jedem Einkauf." },
      { question: "Für wen ist dein Content gedacht?", answer: "Für alle, die mehr reisen wollen – mit besserem Preis-Leistungs-Verhältnis. Egal ob du einmal im Jahr in den Urlaub fliegst oder regelmäßig unterwegs bist." },
      { question: "Kostet mich das Folgen auf Instagram etwas?", answer: "Natürlich nicht. Mein Content auf Instagram ist komplett kostenlos. Premium-Angebote sind optional." },
      { question: "Welche Produkte kann ich bei dir kaufen?", answer: "Von kostenlosen Checklisten über Excel-Kalkulatoren (ab 14€) bis hin zu Video-Kursen und 1:1 Beratung. Alles auf der Produkte-Sektion oben." },
      { question: "Wie funktioniert die Community?", answer: "Die Community wird mit Login-Bereich, Bonuspunkte-System und exklusiven Inhalten direkt auf dieser Seite verfügbar – ohne Weiterleitung zu externen Plattformen." },
    ],
  },

  contact: {
    eyebrow: "Kontakt",
    title: 'Lass uns <em>connecten</em>',
    subtitle: "Fragen zu Reels, Buchungsstrategien oder Kooperationen? Schreib mir.",
    items: [
      { title: "Via Instagram", description: "Der schnellste Weg – schreib mir einfach eine DM.", link_text: "DM auf Instagram →", link_url: "https://www.instagram.com/traveling.prof", link_type: "button" },
      { title: "Per E-Mail", description: "Kooperationen, Business-Anfragen oder größere Reiseplanung?", link_text: "info@travelingprof.de", link_url: "mailto:info@travelingprof.de", link_type: "link" },
    ],
  },
};

/* ═══ Section IDs ═══ */
export const CMS_SECTION_IDS = [
  "hero", "hack_finder", "cards", "about", "testimonials",
  "products_display", "freebies", "credit_cards", "gallery", "faq", "contact",
] as const;

export type CmsSectionId = (typeof CMS_SECTION_IDS)[number];

