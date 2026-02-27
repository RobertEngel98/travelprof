"use client";

import type { GalleryData } from "@/lib/cms";
import ImageUpload from "./ImageUpload";
import ArrayEditor from "./ArrayEditor";

interface Props {
  data: GalleryData;
  onChange: (data: GalleryData) => void;
}

export default function GalleryEditor({ data, onChange }: Props) {
  const update = (partial: Partial<GalleryData>) => onChange({ ...data, ...partial });

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
        label="Gallery Items"
        items={data.items}
        onChange={items => update({ items })}
        createItem={() => ({ label: "Reel", text: "", image: "" })}
        renderItem={(item, _, upd) => (
          <div>
            <ImageUpload label="Bild" value={item.image} onChange={image => upd({ ...item, image })} />
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Label</label>
                <input className="admin-form-input" value={item.label} onChange={e => upd({ ...item, label: e.target.value })} />
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Text</label>
              <textarea className="admin-form-input" rows={2} value={item.text} onChange={e => upd({ ...item, text: e.target.value })} />
            </div>
          </div>
        )}
      />
    </div>
  );
}
