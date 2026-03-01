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

/** @deprecated Products are now managed in the `products` DB table. This is kept as fallback. */
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
    name: "Kreditkarten-Vergleich 2026",
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

// Re-export shared PLANS for backward compat
export { PLANS } from "./plans";

/** Server-side PLANS with Stripe Price IDs (requires env vars) */
export const PLANS_WITH_PRICE_IDS = {
  monthly: {
    stripePriceId: process.env.STRIPE_VIP_MONTHLY_PRICE_ID || undefined,
  },
  yearly: {
    stripePriceId: process.env.STRIPE_VIP_YEARLY_PRICE_ID || undefined,
  },
};
