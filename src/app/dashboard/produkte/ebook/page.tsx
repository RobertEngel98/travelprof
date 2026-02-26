import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import fs from "fs";
import path from "path";
import EbookReader from "./EbookReader";

export default async function EbookPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Check if user has purchased the ebook
  const { data: purchase } = await supabase
    .from("purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", "ebook")
    .single();

  if (!purchase) {
    redirect("/dashboard/produkte");
  }

  // Read the markdown content
  const content = fs.readFileSync(
    path.join(process.cwd(), "produkte/top-10-buchungs-hacks-ebook.md"),
    "utf-8"
  );

  return <EbookReader content={content} />;
}
