import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import fs from "fs";
import path from "path";
import ProductReader from "./ProductReader";

const PRODUCT_FILES: Record<string, { file: string; title: string }> = {
  ebook: { file: "top-10-buchungs-hacks-ebook.md", title: "Top 10 Buchungs-Hacks E-Book" },
  kreditkarten: { file: "kreditkarten-vergleich-2026.md", title: "Kreditkarten-Vergleich 2026" },
  crashkurs: { file: "meilen-crashkurs-curriculum.md", title: "Meilen-Crashkurs" },
  masterplan: { file: "lounge-upgrade-masterplan.md", title: "Lounge & Upgrade Masterplan" },
};

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = PRODUCT_FILES[slug];

  if (!product) redirect("/dashboard/produkte");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Check if user has purchased this product
  const { data: purchase } = await supabase
    .from("purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", slug)
    .single();

  if (!purchase) redirect("/dashboard/produkte");

  const content = fs.readFileSync(
    path.join(process.cwd(), "produkte", product.file),
    "utf-8"
  );

  return <ProductReader content={content} title={product.title} />;
}
