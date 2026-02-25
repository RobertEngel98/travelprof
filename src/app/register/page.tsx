"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 6) {
      setError("Passwort muss mindestens 6 Zeichen lang sein.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message === "User already registered" ? "Diese E-Mail ist bereits registriert." : error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  if (success) {
    return (
      <div className="page" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 420, padding: "0 1.5rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✉️</div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem" }}>Bestätige deine E-Mail</h1>
          <p style={{ color: "var(--text-sub)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
            Wir haben dir eine Bestätigungs-E-Mail an <strong>{email}</strong> gesendet.
            Klicke auf den Link in der E-Mail, um dein Konto zu aktivieren.
          </p>
          <Link href="/login" className="btn btn-secondary btn-sm">Zurück zum Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 420, padding: "0 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <div className="nav-brand-mark">TP</div>
            <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--text-main)" }}>traveling.prof</span>
          </Link>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>Konto erstellen</h1>
          <p style={{ color: "var(--text-sub)" }}>Starte jetzt mit deinen Travel Hacks</p>
        </div>

        <button
          onClick={handleGoogleLogin}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            padding: "0.75rem",
            borderRadius: "0.75rem",
            border: "1px solid var(--border-soft)",
            background: "var(--bg-warm)",
            cursor: "pointer",
            fontSize: "0.95rem",
            fontWeight: 500,
            color: "var(--text-main)",
          }}
        >
          <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Mit Google registrieren
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "1.5rem 0" }}>
          <div style={{ height: 1, flex: 1, background: "var(--border-soft)" }} />
          <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>oder</span>
          <div style={{ height: 1, flex: 1, background: "var(--border-soft)" }} />
        </div>

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {error && (
            <div style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: "0.75rem", padding: "0.75rem 1rem", fontSize: "0.88rem", color: "#dc2626" }}>
              {error}
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 500, marginBottom: "0.375rem" }}>Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Dein Name"
              required
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "0.75rem",
                border: "1px solid var(--border-soft)",
                background: "var(--bg-warm)",
                fontSize: "0.95rem",
                color: "var(--text-main)",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 500, marginBottom: "0.375rem" }}>E-Mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.de"
              required
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "0.75rem",
                border: "1px solid var(--border-soft)",
                background: "var(--bg-warm)",
                fontSize: "0.95rem",
                color: "var(--text-main)",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.88rem", fontWeight: 500, marginBottom: "0.375rem" }}>Passwort</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mindestens 6 Zeichen"
              required
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "0.75rem",
                border: "1px solid var(--border-soft)",
                background: "var(--bg-warm)",
                fontSize: "0.95rem",
                color: "var(--text-main)",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: "100%", padding: "0.75rem", fontSize: "1rem", opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "Wird erstellt..." : "Konto erstellen"}
          </button>
        </form>

        <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.88rem", color: "var(--muted)" }}>
          Bereits ein Konto?{" "}
          <Link href="/login" style={{ color: "var(--accent)" }}>
            Anmelden
          </Link>
        </p>
      </div>
    </div>
  );
}
