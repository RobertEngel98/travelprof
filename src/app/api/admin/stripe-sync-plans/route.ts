import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import { ADMIN_EMAIL } from "@/lib/admin";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripe = getStripe();

  // Search for existing product
  const existing = await stripe.products.search({
    query: `name~"traveling.prof VIP Community"`,
  });

  let productId: string;

  if (existing.data.length > 0) {
    productId = existing.data[0].id;
  } else {
    const product = await stripe.products.create({
      name: "traveling.prof VIP Community",
      description: "Exklusive Travel Hacks, Community-Zugang, monatliche Calls",
    });
    productId = product.id;
  }

  // Check/create monthly price (990 cents = 9,90€)
  let monthlyPriceId: string | null = null;
  const monthlyPrices = await stripe.prices.list({
    product: productId,
    type: "recurring",
    active: true,
  });

  const existingMonthly = monthlyPrices.data.find(
    (p) => p.recurring?.interval === "month" && p.unit_amount === 990
  );

  if (existingMonthly) {
    monthlyPriceId = existingMonthly.id;
  } else {
    const price = await stripe.prices.create({
      product: productId,
      currency: "eur",
      unit_amount: 990,
      recurring: { interval: "month" },
    });
    monthlyPriceId = price.id;
  }

  // Check/create yearly price (9900 cents = 99,00€)
  let yearlyPriceId: string | null = null;
  const existingYearly = monthlyPrices.data.find(
    (p) => p.recurring?.interval === "year" && p.unit_amount === 9900
  );

  if (existingYearly) {
    yearlyPriceId = existingYearly.id;
  } else {
    const price = await stripe.prices.create({
      product: productId,
      currency: "eur",
      unit_amount: 9900,
      recurring: { interval: "year" },
    });
    yearlyPriceId = price.id;
  }

  return NextResponse.json({
    success: true,
    productId,
    monthlyPriceId,
    yearlyPriceId,
    envVars: {
      STRIPE_VIP_MONTHLY_PRICE_ID: monthlyPriceId,
      STRIPE_VIP_YEARLY_PRICE_ID: yearlyPriceId,
    },
  });
}
