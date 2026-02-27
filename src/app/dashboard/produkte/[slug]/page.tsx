import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import fs from "fs";
import path from "path";
import ProductReader from "./ProductReader";

// Legacy fallback for file-based content
const PRODUCT_FILES: Record<string, { file: string; title: string }> = {
  ebook: { file: "top-10-buchungs-hacks-ebook.md", title: "Top 10 Buchungs-Hacks E-Book" },
  kreditkarten: { file: "kreditkarten-vergleich-2026.md", title: "Kreditkarten-Vergleich 2026" },
  crashkurs: { file: "meilen-crashkurs-curriculum.md", title: "Meilen-Crashkurs" },
  masterplan: { file: "lounge-upgrade-masterplan.md", title: "Lounge & Upgrade Masterplan" },
};

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

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

  // Try to get product from DB
  const admin = getSupabaseAdmin();
  const { data: dbProduct } = await admin
    .from("products")
    .select("name, content_markdown, content_file")
    .eq("id", slug)
    .single();

  let content = "";
  let title = "";

  if (dbProduct?.content_markdown) {
    // Content from database (preferred)
    content = dbProduct.content_markdown;
    title = dbProduct.name;
  } else {
    // Fallback: read from file (legacy or content_file reference)
    const fileName = dbProduct?.content_file ?? PRODUCT_FILES[slug]?.file;
    title = dbProduct?.name ?? PRODUCT_FILES[slug]?.title ?? slug;

    if (fileName) {
      try {
        content = fs.readFileSync(
          path.join(process.cwd(), "produkte", fileName),
          "utf-8"
        );
      } catch {
        content = "# Inhalt nicht verfügbar\n\nDer Produktinhalt konnte nicht geladen werden.";
      }
    } else {
      redirect("/dashboard/produkte");
    }
  }

  return <ProductReader content={content} title={title} />;
}
