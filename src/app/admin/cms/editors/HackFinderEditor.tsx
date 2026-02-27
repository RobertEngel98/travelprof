"use client";

import type { HackFinderData } from "@/lib/cms";

interface Props {
  data: HackFinderData;
  onChange: (data: HackFinderData) => void;
}

export default function HackFinderEditor({ data, onChange }: Props) {
  const keys = Object.keys(data.hacks);

  function updateHack(key: string, value: string) {
    onChange({ hacks: { ...data.hacks, [key]: value } });
  }

  function removeHack(key: string) {
    const next = { ...data.hacks };
    delete next[key];
    onChange({ hacks: next });
  }

  function addHack() {
    const key = prompt("Schlüsselwort (z.B. 'paris'):");
    if (!key) return;
    onChange({ hacks: { ...data.hacks, [key.toLowerCase()]: "" } });
  }

  return (
    <div>
      <p style={{ fontSize: "0.82rem", color: "#78716c", marginBottom: "1rem" }}>
        Schlüsselwörter und die zugehörigen Hack-Antworten. Wenn der Nutzer ein Schlüsselwort eingibt, wird die Antwort angezeigt.
      </p>
      {keys.map(key => (
        <div key={key} className="admin-array-item">
          <div className="admin-array-item-header">
            <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--accent)" }}>{key}</span>
            <button
              type="button"
              className="admin-btn-secondary"
              style={{ padding: "0.2rem 0.4rem", fontSize: "0.72rem", color: "#f87171" }}
              onClick={() => removeHack(key)}
            >✕</button>
          </div>
          <textarea
            className="admin-form-input"
            rows={3}
            value={data.hacks[key]}
            onChange={e => updateHack(key, e.target.value)}
          />
        </div>
      ))}
      <button
        type="button"
        className="admin-btn admin-btn-secondary"
        style={{ marginTop: "0.5rem", width: "100%" }}
        onClick={addHack}
      >+ Hack hinzufügen</button>
    </div>
  );
}
