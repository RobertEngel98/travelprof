/**
 * One-time migration: Load markdown files into products.content_markdown
 * Run: node scripts/migrate-product-content.mjs
 */
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env.local manually
const envPath = path.join(__dirname, "..", ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
for (const line of envContent.split(/\r?\n/)) {
  const idx = line.indexOf("=");
  if (idx > 0 && !line.startsWith("#")) {
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim();
    process.env[key] = val;
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const PRODUCT_FILES = {
  ebook: "top-10-buchungs-hacks-ebook.md",
  kreditkarten: "kreditkarten-vergleich-2026.md",
  crashkurs: "meilen-crashkurs-curriculum.md",
  masterplan: "lounge-upgrade-masterplan.md",
};

async function migrate() {
  for (const [productId, fileName] of Object.entries(PRODUCT_FILES)) {
    const filePath = path.join(__dirname, "..", "produkte", fileName);

    if (!fs.existsSync(filePath)) {
      console.log(`SKIP: ${fileName} not found`);
      continue;
    }

    const content = fs.readFileSync(filePath, "utf-8");
    console.log(`Migrating ${productId}: ${content.length} chars from ${fileName}`);

    const { error } = await supabase
      .from("products")
      .update({ content_markdown: content })
      .eq("id", productId);

    if (error) {
      console.error(`ERROR ${productId}:`, error.message);
    } else {
      console.log(`OK: ${productId}`);
    }
  }

  console.log("\nDone!");
}

migrate();
