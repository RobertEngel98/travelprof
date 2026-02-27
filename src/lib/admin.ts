import { createClient } from "@/lib/supabase/server";

export const ADMIN_EMAIL = "robert@talentsuite.io";

export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.email === ADMIN_EMAIL;
}

export async function requireAdmin() {
  const admin = await isAdmin();
  if (!admin) {
    throw new Error("Unauthorized");
  }
}
