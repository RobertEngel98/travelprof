"use client";

import type { CreditCardsData } from "@/lib/cms";
import ArrayEditor from "./ArrayEditor";

interface Props {
  data: CreditCardsData;
  onChange: (data: CreditCardsData) => void;
}

export default function CreditCardsEditor({ data, onChange }: Props) {
  const update = (partial: Partial<CreditCardsData>) => onChange({ ...data, ...partial });

  return (
    <div>
      <div className="admin-form-group">
        <label className="admin-form-label">Eyebrow</label>
        <input className="admin-form-input" value={data.eyebrow} onChange={e => update({ eyebrow: e.target.value })} />
      </div>
      <div className="admin-form-group">
        <label className="admin-form-label">Titel (HTML erlaubt)</label>
        <input className="admin-form-input" value={data.title} onChange={e => update({ title: e.target.value })} />
      </div>
      <div className="admin-form-group">
        <label className="admin-form-label">Untertitel</label>
        <textarea className="admin-form-input" rows={2} value={data.subtitle} onChange={e => update({ subtitle: e.target.value })} />
      </div>
      <ArrayEditor
        label="Kreditkarten"
        items={data.items}
        onChange={items => update({ items })}
        createItem={() => ({ emoji: "💳", name: "Neue Karte", description: "", bonus: "", link: "#" })}
        renderItem={(item, _, upd) => (
          <div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Emoji</label>
                <input className="admin-form-input" value={item.emoji} onChange={e => upd({ ...item, emoji: e.target.value })} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Name</label>
                <input className="admin-form-input" value={item.name} onChange={e => upd({ ...item, name: e.target.value })} />
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Beschreibung</label>
              <input className="admin-form-input" value={item.description} onChange={e => upd({ ...item, description: e.target.value })} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Bonus</label>
              <input className="admin-form-input" value={item.bonus} onChange={e => upd({ ...item, bonus: e.target.value })} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Referral-Link</label>
              <input className="admin-form-input" value={item.link} onChange={e => upd({ ...item, link: e.target.value })} />
            </div>
          </div>
        )}
      />
    </div>
  );
}
