"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Übersicht", icon: "🏠" },
  { href: "/dashboard/produkte", label: "Produkte", icon: "📦" },
  { href: "/dashboard/analyse", label: "Analysen", icon: "📊" },
  { href: "/dashboard/einstellungen", label: "Einstellungen", icon: "⚙️" },
];

interface DashboardShellProps {
  user: { id: string; email: string };
  profile: {
    full_name: string | null;
    subscription_status: string;
    subscription_plan: string | null;
  } | null;
  children: React.ReactNode;
}

export default function DashboardShell({ user, profile, children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "success") {
      setShowCheckoutSuccess(true);
      window.history.replaceState({}, "", pathname);
      const timer = setTimeout(() => setShowCheckoutSuccess(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  const displayName = profile?.full_name || user.email.split("@")[0];
  const isVip = profile?.subscription_status === "active" || profile?.subscription_status === "trial";

  return (
    <div className="page" data-dashboard-shell>
      <header>
        <div className="container">
          <nav className="nav" style={{ justifyContent: "space-between" }}>
            <Link href="/" className="nav-brand" style={{ textDecoration: "none" }}>
              <div className="nav-brand-mark">TP</div>
              <div className="nav-brand-text">
                <div className="nav-brand-name">traveling.prof</div>
                <div className="nav-brand-tag">Dashboard</div>
              </div>
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ fontSize: "0.88rem", color: "var(--text-sub)" }}>
                {displayName}
                {isVip && (
                  <span style={{
                    marginLeft: "0.5rem",
                    background: "linear-gradient(135deg, var(--accent), #d4a853)",
                    color: "#fff",
                    padding: "0.15rem 0.5rem",
                    borderRadius: "0.375rem",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                  }}>
                    VIP
                  </span>
                )}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  background: "none",
                  border: "1px solid var(--border-soft)",
                  borderRadius: "0.5rem",
                  padding: "0.4rem 0.75rem",
                  fontSize: "0.82rem",
                  color: "var(--muted)",
                  cursor: "pointer",
                }}
              >
                Abmelden
              </button>
            </div>
          </nav>
        </div>
      </header>

      <div className="dash-layout container">
        {/* Sidebar (Desktop) */}
        <aside className="dash-sidebar" data-sidebar>
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.65rem 0.875rem",
                    borderRadius: "0.625rem",
                    fontSize: "0.9rem",
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "var(--text-main)" : "var(--text-sub)",
                    background: isActive ? "var(--bg-warm)" : "transparent",
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {showCheckoutSuccess && (
            <div style={{
              background: "rgba(34,197,94,0.08)",
              border: "1px solid rgba(34,197,94,0.3)",
              borderRadius: "0.75rem",
              padding: "1rem 1.25rem",
              marginBottom: "1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "1.25rem" }}>✅</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#22c55e" }}>Zahlung erfolgreich!</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-sub)" }}>Dein Kauf wurde abgeschlossen. Viel Spaß mit deinem Produkt!</div>
                </div>
              </div>
              <button onClick={() => setShowCheckoutSuccess(false)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "1.2rem" }}>×</button>
            </div>
          )}
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="dash-mobile-nav" data-mobile-nav>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`dash-mobile-nav-item ${isActive ? "active" : ""}`}
            >
              <span style={{ fontSize: "1.25rem" }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
