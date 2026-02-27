"use client";

import type { ContactData } from "@/lib/cms";
import ArrayEditor from "./ArrayEditor";

interface Props {
  data: ContactData;
  onChange: (data: ContactData) => void;
}

export default function ContactEditor({ data, onChange }: Props) {
  const update = (partial: Partial<ContactData>) => onChange({ ...data, ...partial });

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
        label="Kontakt-Karten"
        items={data.items}
        onChange={items => update({ items })}
        createItem={() => ({ title: "Neuer Kanal", description: "", link_text: "", link_url: "", link_type: "link" })}
        renderItem={(item, _, upd) => (
          <div>
            <div className="admin-form-group">
              <label className="admin-form-label">Titel</label>
              <input className="admin-form-input" value={item.title} onChange={e => upd({ ...item, title: e.target.value })} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Beschreibung</label>
              <textarea className="admin-form-input" rows={2} value={item.description} onChange={e => upd({ ...item, description: e.target.value })} />
            </div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Link-Text</label>
                <input className="admin-form-input" value={item.link_text} onChange={e => upd({ ...item, link_text: e.target.value })} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Link-Typ</label>
                <select className="admin-form-select" value={item.link_type} onChange={e => upd({ ...item, link_type: e.target.value })}>
                  <option value="button">Button</option>
                  <option value="link">Link</option>
                </select>
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">URL</label>
              <input className="admin-form-input" value={item.link_url} onChange={e => upd({ ...item, link_url: e.target.value })} />
            </div>
          </div>
        )}
      />
    </div>
  );
}
