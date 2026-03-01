export interface UpsellOffer {
  productId: string;
  headline: string;
  subline: string;
  bulletPoints: string[];
  specialPrice: number; // in cents
  originalPrice: number; // in cents
  specialPriceDisplay: string;
  originalPriceDisplay: string;
  ctaText: string;
  timerMinutes: number;
}

export interface UpsellEntry {
  upsell: UpsellOffer;
  downsell?: UpsellOffer;
}

/**
 * Maps purchased product ID → upsell/downsell offers.
 */
export const UPSELL_MAP: Record<string, UpsellEntry> = {
  ebook: {
    upsell: {
      productId: "crashkurs",
      headline: "Warte! Exklusives Angebot nur für dich",
      subline:
        "Du hast das E-Book gesichert – jetzt den nächsten Schritt machen mit dem Meilen-Crashkurs zum Sonderpreis!",
      bulletPoints: [
        "5 Video-Module: Sammeln, Optimieren, Einlösen",
        "Inkl. Meilen-Kalkulator & Templates",
        "Lebenslanger Zugang zu allen Updates",
        "Nur jetzt: 10€ günstiger als regulär",
      ],
      specialPrice: 2900,
      originalPrice: 3900,
      specialPriceDisplay: "29",
      originalPriceDisplay: "39",
      ctaText: "Ja, Crashkurs für 29€ sichern!",
      timerMinutes: 15,
    },
    downsell: {
      productId: "amex-rechner",
      headline: "Kein Problem – wie wäre es damit?",
      subline:
        "Der Amex Platinum Lohnt-sich-Rechner zum reduzierten Preis. Finde heraus, ob sich die Karte für dich lohnt.",
      bulletPoints: [
        "Interaktiver Excel-Rechner",
        "Sofort dein Ergebnis sehen",
        "Einmaliger Sonderpreis",
      ],
      specialPrice: 900,
      originalPrice: 1400,
      specialPriceDisplay: "9",
      originalPriceDisplay: "14",
      ctaText: "Ja, Rechner für 9€ sichern!",
      timerMinutes: 15,
    },
  },

  "amex-rechner": {
    upsell: {
      productId: "ebook",
      headline: "Exklusives Angebot: E-Book zum Sonderpreis",
      subline:
        "Du hast den Rechner – jetzt die besten Buchungs-Hacks dazu! Top 10 Buchungs-Hacks E-Book zum reduzierten Preis.",
      bulletPoints: [
        "Die 10 besten Buchungsstrategien",
        "Screenshots & Schritt-für-Schritt",
        "Sofort anwendbar",
        "5€ günstiger als regulär",
      ],
      specialPrice: 1400,
      originalPrice: 1900,
      specialPriceDisplay: "14",
      originalPriceDisplay: "19",
      ctaText: "Ja, E-Book für 14€ sichern!",
      timerMinutes: 15,
    },
  },

  crashkurs: {
    upsell: {
      productId: "masterclass",
      headline: "Upgrade zur Meilen-Masterclass",
      subline:
        "Du hast den Crashkurs – die Masterclass bringt dich aufs nächste Level. Jetzt 30€ sparen!",
      bulletPoints: [
        "12 Module, 40+ Videos",
        "Workbooks & Community-Zugang (3 Monate)",
        "1:1 Setup-Call inklusive",
        "30€ günstiger als regulär",
      ],
      specialPrice: 8900,
      originalPrice: 11900,
      specialPriceDisplay: "89",
      originalPriceDisplay: "119",
      ctaText: "Ja, Masterclass für 89€ sichern!",
      timerMinutes: 15,
    },
    downsell: {
      productId: "ebook",
      headline: "Letzte Chance: E-Book zum Mini-Preis",
      subline:
        "Die Masterclass ist nichts für dich? Kein Problem. Hol dir wenigstens das E-Book mit 5€ Rabatt.",
      bulletPoints: [
        "Top 10 Buchungs-Hacks",
        "Sofort anwendbar",
        "Einmaliger Sonderpreis",
      ],
      specialPrice: 1400,
      originalPrice: 1900,
      specialPriceDisplay: "14",
      originalPriceDisplay: "19",
      ctaText: "Ja, E-Book für 14€ sichern!",
      timerMinutes: 15,
    },
  },
};

/**
 * Product name lookup for upsell page display.
 */
export const PRODUCT_NAMES: Record<string, string> = {
  ebook: "Top 10 Buchungs-Hacks E-Book",
  analyse: "10-Sekunden Reiseanalyse",
  "amex-rechner": "Amex Platinum Lohnt-sich-Rechner",
  kreditkarten: "Kreditkarten-Vergleich 2026",
  crashkurs: "Meilen-Crashkurs",
  masterclass: "Meilen-Masterclass",
  masterplan: "Lounge & Upgrade Masterplan",
  "meilen-call": "1:1 Meilen-Call",
  "strategie-call": "1:1 Strategie-Call",
  "vip-community": "VIP-Community",
};
