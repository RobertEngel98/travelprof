import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ADMIN_EMAIL } from "@/lib/admin";
import AdminShell from "./AdminShell";

export const metadata = {
  title: "Admin – traveling.prof",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect("/dashboard");
  }

  return (
    <AdminShell user={{ email: user.email ?? "" }}>
      {children}
    </AdminShell>
  );
}
