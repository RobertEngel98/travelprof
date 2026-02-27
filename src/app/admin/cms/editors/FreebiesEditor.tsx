"use client";

import type { FreebiesData } from "@/lib/cms";
import ArrayEditor from "./ArrayEditor";

interface Props {
  data: FreebiesData;
  onChange: (data: FreebiesData) => void;
}

export default function FreebiesEditor({ data, onChange }: Props) {
  const update = (partial: Partial<FreebiesData>) => onChange({ ...data, ...partial });

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
        <input className="admin-form-input" value={data.subtitle} onChange={e => update({ subtitle: e.target.value })} />
      </div>
      <ArrayEditor
        label="Freebies"
        items={data.items}
        onChange={items => update({ items })}
        createItem={() => ({ emoji: "📄", title: "Neues Freebie", description: "" })}
        renderItem={(item, _, upd) => (
          <div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Emoji</label>
                <input className="admin-form-input" value={item.emoji} onChange={e => upd({ ...item, emoji: e.target.value })} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Titel</label>
                <input className="admin-form-input" value={item.title} onChange={e => upd({ ...item, title: e.target.value })} />
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Beschreibung</label>
              <textarea className="admin-form-input" rows={2} value={item.description} onChange={e => upd({ ...item, description: e.target.value })} />
            </div>
          </div>
        )}
      />
    </div>
  );
}
