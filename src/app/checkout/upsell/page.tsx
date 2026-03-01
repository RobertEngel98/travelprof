import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { UPSELL_MAP, PRODUCT_NAMES } from "@/lib/upsell-config";
import UpsellClient from "./UpsellClient";

interface Props {
  searchParams: Promise<{ session_id?: string; product?: string }>;
}

export default async function UpsellPage({ searchParams }: Props) {
  const params = await searchParams;
  const { session_id, product } = params;

  // Validate session_id and product
  if (!session_id || !product) {
    redirect("/dashboard");
  }

  // Verify the Stripe session is actually paid
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status !== "paid") {
      redirect("/dashboard");
    }
  } catch {
    redirect("/dashboard");
  }

  // Get upsell config for this product
  const upsellEntry = UPSELL_MAP[product];
  if (!upsellEntry) {
    redirect("/dashboard?checkout=success");
  }

  const purchasedName = PRODUCT_NAMES[product] || product;

  return (
    <UpsellClient
      purchasedProductName={purchasedName}
      upsell={upsellEntry.upsell}
      downsell={upsellEntry.downsell}
    />
  );
}
