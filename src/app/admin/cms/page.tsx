"use client";

import { useState, useEffect } from "react";
import { CMS_SECTION_IDS, CMS_DEFAULTS } from "@/lib/cms";
import type { CmsData, CmsSectionId } from "@/lib/cms";
import HeroEditor from "./editors/HeroEditor";
import HackFinderEditor from "./editors/HackFinderEditor";
import CardsEditor from "./editors/CardsEditor";
import AboutEditor from "./editors/AboutEditor";
import TestimonialsEditor from "./editors/TestimonialsEditor";
import ProductsDisplayEditor from "./editors/ProductsDisplayEditor";
import FreebiesEditor from "./editors/FreebiesEditor";
import CreditCardsEditor from "./editors/CreditCardsEditor";
import GalleryEditor from "./editors/GalleryEditor";
import FaqEditor from "./editors/FaqEditor";
import ContactEditor from "./editors/ContactEditor";

const SECTION_LABELS: Record<CmsSectionId, string> = {
  hero: "Hero",
  hack_finder: "Hack Finder",
  cards: "Travel Hacks",
  about: "Über mich",
  testimonials: "Testimonials",
  products_display: "Produkte",
  freebies: "Freebies",
  credit_cards: "Kreditkarten",
  gallery: "Gallery",
  faq: "FAQ",
  contact: "Kontakt",
};

export default function CmsPage() {
  const [activeTab, setActiveTab] = useState<CmsSectionId>("hero");
  const [sections, setSections] = useState<CmsData>(CMS_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    fetch("/api/admin/cms")
      .then(r => r.json())
      .then(res => {
        if (res.sections) {
          const loaded = {} as Record<string, unknown>;
          for (const key of CMS_SECTION_IDS) {
            loaded[key] = res.sections[key]?.data ?? CMS_DEFAULTS[key];
          }
          setSections(loaded as unknown as CmsData);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaveStatus("idle");
    try {
      const res = await fetch(`/api/admin/cms/${activeTab}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sections[activeTab]),
      });
      if (res.ok) {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 2500);
      } else {
        setSaveStatus("error");
      }
    } catch {
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  }

  function updateSection(id: CmsSectionId, data: unknown) {
    setSections(prev => ({ ...prev, [id]: data }));
  }

  function renderEditor() {
    switch (activeTab) {
      case "hero": return <HeroEditor data={sections.hero} onChange={d => updateSection("hero", d)} />;
      case "hack_finder": return <HackFinderEditor data={sections.hack_finder} onChange={d => updateSection("hack_finder", d)} />;
      case "cards": return <CardsEditor data={sections.cards} onChange={d => updateSection("cards", d)} />;
      case "about": return <AboutEditor data={sections.about} onChange={d => updateSection("about", d)} />;
      case "testimonials": return <TestimonialsEditor data={sections.testimonials} onChange={d => updateSection("testimonials", d)} />;
      case "products_display": return <ProductsDisplayEditor data={sections.products_display} onChange={d => updateSection("products_display", d)} />;
      case "freebies": return <FreebiesEditor data={sections.freebies} onChange={d => updateSection("freebies", d)} />;
      case "credit_cards": return <CreditCardsEditor data={sections.credit_cards} onChange={d => updateSection("credit_cards", d)} />;
      case "gallery": return <GalleryEditor data={sections.gallery} onChange={d => updateSection("gallery", d)} />;
      case "faq": return <FaqEditor data={sections.faq} onChange={d => updateSection("faq", d)} />;
      case "contact": return <ContactEditor data={sections.contact} onChange={d => updateSection("contact", d)} />;
    }
  }

  if (loading) {
    return (
      <div>
        <div className="admin-page-header">
          <h1 className="admin-page-title">Webseite</h1>
          <p className="admin-page-sub">Inhalte der Landing Page verwalten</p>
        </div>
        <p style={{ color: "#78716c" }}>Lade Inhalte...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Webseite</h1>
        <p className="admin-page-sub">Alle Texte und Bilder der Landing Page bearbeiten</p>
      </div>

      <div className="admin-cms-layout">
        {/* Tab list */}
        <div className="admin-cms-tabs">
          {CMS_SECTION_IDS.map(id => (
            <button
              key={id}
              className={`admin-cms-tab ${activeTab === id ? "active" : ""}`}
              onClick={() => { setActiveTab(id); setSaveStatus("idle"); }}
            >
              {SECTION_LABELS[id]}
            </button>
          ))}
        </div>

        {/* Editor area */}
        <div className="admin-cms-editor">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fafaf9" }}>
              {SECTION_LABELS[activeTab]}
            </h2>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              {saveStatus === "success" && (
                <span style={{ fontSize: "0.82rem", color: "#4ade80" }}>Gespeichert!</span>
              )}
              {saveStatus === "error" && (
                <span style={{ fontSize: "0.82rem", color: "#f87171" }}>Fehler beim Speichern</span>
              )}
              <button
                className="admin-btn admin-btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Speichern..." : "Speichern"}
              </button>
            </div>
          </div>
          {renderEditor()}
        </div>
      </div>
    </div>
  );
}
