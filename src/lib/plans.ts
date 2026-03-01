/**
 * VIP Community plan definitions.
 * Shared between client and server — DO NOT import stripe or other server-only modules here.
 */
export const PLANS: Record<
  "monthly" | "yearly",
  {
    name: string;
    price: number;
    priceDisplay: string;
    priceMonthly?: string;
    interval: "month" | "year";
    savings?: string;
  }
> = {
  monthly: {
    name: "Monatlich",
    price: 990,
    priceDisplay: "9,90",
    interval: "month",
  },
  yearly: {
    name: "Jährlich",
    price: 9900,
    priceDisplay: "99,00",
    priceMonthly: "8,25",
    interval: "year",
    savings: "17%",
  },
};
