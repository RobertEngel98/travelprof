import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      typescript: true,
    });
  }
  return _stripe;
}

// Keep backward compat export - lazy initialized
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as any)[prop];
  },
});

export const PRODUCTS = {
  analyse: {
    name: "10-Sekunden Reiseanalyse",
    price: 700,
    priceDisplay: "7,00",
    type: "one_time" as const,
  },
  ebook: {
    name: "Top 10 Buchungs-Hacks E-Book",
    price: 1900,
    priceDisplay: "19,00",
    type: "one_time" as const,
  },
  kreditkarten: {
    name: "Kreditkarten-Vergleich 2025",
    price: 900,
    priceDisplay: "9,00",
    type: "one_time" as const,
  },
  crashkurs: {
    name: "Meilen-Crashkurs",
    price: 4900,
    priceDisplay: "49,00",
    type: "one_time" as const,
  },
  masterplan: {
    name: "Lounge & Upgrade Masterplan",
    price: 2900,
    priceDisplay: "29,00",
    type: "one_time" as const,
  },
} as const;

export const PLANS = {
  monthly: {
    name: "Monatlich",
    price: 990,
    priceDisplay: "9,90",
    interval: "month" as const,
  },
  yearly: {
    name: "Jährlich",
    price: 9900,
    priceDisplay: "99,00",
    priceMonthly: "8,25",
    interval: "year" as const,
    savings: "17%",
  },
} as const;
