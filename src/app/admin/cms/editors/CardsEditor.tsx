"use client";

import type { CardsData } from "@/lib/cms";
import ImageUpload from "./ImageUpload";
import ArrayEditor from "./ArrayEditor";

interface Props {
  data: CardsData;
  onChange: (data: CardsData) => void;
}

export default function CardsEditor({ data, onChange }: Props) {
  const update = (partial: Partial<CardsData>) => onChange({ ...data, ...partial });

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
        label="Karten"
        items={data.items}
        onChange={items => update({ items })}
        createItem={() => ({ img: "", title: "Neue Karte", description: "" })}
        renderItem={(item, _, upd) => (
          <div>
            <ImageUpload label="Bild" value={item.img} onChange={img => upd({ ...item, img })} />
            <div className="admin-form-group">
              <label className="admin-form-label">Titel</label>
              <input className="admin-form-input" value={item.title} onChange={e => upd({ ...item, title: e.target.value })} />
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
