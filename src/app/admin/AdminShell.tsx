"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/admin", label: "Übersicht", icon: "📊" },
  { href: "/admin/umsatz", label: "Umsatz", icon: "💰" },
  { href: "/admin/nutzer", label: "Nutzer", icon: "👥" },
  { href: "/admin/abos", label: "Abonnements", icon: "⭐" },
  { href: "/admin/waitlist", label: "Waitlist", icon: "📋" },
  { href: "/admin/produkte", label: "Produkte", icon: "📦" },
];

interface AdminShellProps {
  user: { email: string };
  children: React.ReactNode;
}

export default function AdminShell({ user, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="admin-sidebar-header">
          <Link href="/admin" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{
                width: "2rem",
                height: "2rem",
                borderRadius: "0.5rem",
                background: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.8rem",
              }}>TP</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#f5f5f4" }}>traveling.prof</div>
                <div style={{ fontSize: "0.72rem", color: "#a8a29e" }}>Admin Panel</div>
              </div>
            </div>
          </Link>
          <button
            className="admin-sidebar-close"
            onClick={() => setMobileOpen(false)}
          >
            ×
          </button>
        </div>

        <nav className="admin-nav">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`admin-nav-item ${isActive ? "active" : ""}`}
              >
                <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <Link
            href="/dashboard"
            style={{ fontSize: "0.82rem", color: "#a8a29e", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            ← Zum Dashboard
          </Link>
          <div style={{ fontSize: "0.78rem", color: "#78716c", marginTop: "0.5rem" }}>{user.email}</div>
        </div>
      </aside>

      {/* Overlay */}
      {mobileOpen && (
        <div className="admin-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main */}
      <div className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-menu-toggle"
            onClick={() => setMobileOpen(true)}
          >
            ☰
          </button>
          <div style={{ flex: 1 }} />
          <button
            onClick={handleLogout}
            style={{
              background: "none",
              border: "1px solid #3f3f46",
              borderRadius: "0.5rem",
              padding: "0.4rem 0.75rem",
              fontSize: "0.82rem",
              color: "#a8a29e",
              cursor: "pointer",
            }}
          >
            Abmelden
          </button>
        </header>
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}
