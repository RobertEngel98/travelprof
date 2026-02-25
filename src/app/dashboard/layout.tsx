import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardShell from "./DashboardShell";
import type { Profile } from "@/types/database";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();
  const profile = data as Profile | null;

  return (
    <DashboardShell
      user={{ id: user.id, email: user.email ?? "" }}
      profile={profile}
    >
      {children}
    </DashboardShell>
  );
}
