"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MarkdownPreview from "./MarkdownPreview";

interface ProductData {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  price_display: string;
  type: string;
  content_markdown: string;
  active: boolean;
  sort_order: number;
}

interface ProductFormProps {
  initial?: Partial<ProductData>;
  isEdit?: boolean;
}

export default function ProductForm({ initial, isEdit }: ProductFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<ProductData>({
    id: initial?.id ?? "",
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    icon: initial?.icon ?? "📦",
    price: initial?.price ?? 0,
    price_display: initial?.price_display ?? "0,00",
    type: initial?.type ?? "one_time",
    content_markdown: initial?.content_markdown ?? "",
    active: initial?.active ?? true,
    sort_order: initial?.sort_order ?? 0,
  });

  function update(field: keyof ProductData, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // Auto-generate price_display from price in cents
  function handlePriceChange(cents: number) {
    const display = (cents / 100).toFixed(2).replace(".", ",");
    setForm((prev) => ({ ...prev, price: cents, price_display: display }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = isEdit ? `/api/admin/products/${form.id}` : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Fehler beim Speichern");
        return;
      }

      router.push("/admin/produkte");
      router.refresh();
    } catch {
      setError("Netzwerkfehler");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div style={{
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: "0.5rem",
          padding: "0.75rem 1rem",
          marginBottom: "1.5rem",
          color: "#f87171",
          fontSize: "0.85rem",
        }}>
          {error}
        </div>
      )}

      <div className="admin-form-row">
        <div className="admin-form-group">
          <label className="admin-form-label">ID / Slug</label>
          <input
            className="admin-form-input"
            value={form.id}
            onChange={(e) => update("id", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
            placeholder="z.B. mein-produkt"
            disabled={isEdit}
            required
            style={isEdit ? { opacity: 0.5 } : {}}
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Name</label>
          <input
            className="admin-form-input"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Produktname"
            required
          />
        </div>
      </div>

      <div className="admin-form-group">
        <label className="admin-form-label">Beschreibung</label>
        <input
          className="admin-form-input"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Kurze Beschreibung für die Produktkarte"
        />
      </div>

      <div className="admin-form-row">
        <div className="admin-form-group">
          <label className="admin-form-label">Icon (Emoji)</label>
          <input
            className="admin-form-input"
            value={form.icon}
            onChange={(e) => update("icon", e.target.value)}
            placeholder="📦"
            style={{ width: "80px" }}
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Preis (Cent)</label>
          <input
            className="admin-form-input"
            type="number"
            value={form.price}
            onChange={(e) => handlePriceChange(parseInt(e.target.value) || 0)}
            min={0}
            required
          />
          <div style={{ fontSize: "0.75rem", color: "#78716c", marginTop: "0.25rem" }}>
            = {form.price_display} €
          </div>
        </div>
      </div>

      <div className="admin-form-row">
        <div className="admin-form-group">
          <label className="admin-form-label">Typ</label>
          <select
            className="admin-form-select"
            value={form.type}
            onChange={(e) => update("type", e.target.value)}
          >
            <option value="one_time">Einmalkauf</option>
            <option value="subscription">Abonnement</option>
          </select>
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Sortierung</label>
          <input
            className="admin-form-input"
            type="number"
            value={form.sort_order}
            onChange={(e) => update("sort_order", parseInt(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="admin-form-group">
        <label className="admin-form-label" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span>Aktiv</span>
          <button
            type="button"
            className={`admin-toggle ${form.active ? "on" : ""}`}
            onClick={() => update("active", !form.active)}
          />
        </label>
      </div>

      <div className="admin-form-group">
        <label className="admin-form-label">Produkt-Inhalt (Markdown)</label>
        <div className="admin-md-editor">
          <textarea
            className="admin-md-textarea"
            value={form.content_markdown}
            onChange={(e) => update("content_markdown", e.target.value)}
            placeholder="# Produkttitel&#10;&#10;Dein Markdown-Inhalt hier..."
          />
          <MarkdownPreview content={form.content_markdown} />
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
        <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
          {saving ? "Speichern..." : isEdit ? "Änderungen speichern" : "Produkt erstellen"}
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-secondary"
          onClick={() => router.push("/admin/produkte")}
        >
          Abbrechen
        </button>
      </div>
    </form>
  );
}
