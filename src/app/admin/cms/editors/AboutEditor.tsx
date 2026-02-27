"use client";

import type { AboutData } from "@/lib/cms";
import ImageUpload from "./ImageUpload";
import ArrayEditor from "./ArrayEditor";

interface Props {
  data: AboutData;
  onChange: (data: AboutData) => void;
}

export default function AboutEditor({ data, onChange }: Props) {
  const update = (partial: Partial<AboutData>) => onChange({ ...data, ...partial });

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
        <textarea className="admin-form-input" rows={3} value={data.subtitle} onChange={e => update({ subtitle: e.target.value })} />
      </div>
      <ArrayEditor
        label="Check-Items"
        items={data.check_items}
        onChange={check_items => update({ check_items })}
        createItem={() => ({ bold: "Neu:", text: "Beschreibung" })}
        renderItem={(item, _, upd) => (
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Fett</label>
              <input className="admin-form-input" value={item.bold} onChange={e => upd({ ...item, bold: e.target.value })} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Text</label>
              <input className="admin-form-input" value={item.text} onChange={e => upd({ ...item, text: e.target.value })} />
            </div>
          </div>
        )}
      />
      <ImageUpload label="About-Bild" value={data.image} onChange={image => update({ image })} />
      <div className="admin-form-group">
        <label className="admin-form-label">Mission Titel</label>
        <input className="admin-form-input" value={data.mission_title} onChange={e => update({ mission_title: e.target.value })} />
      </div>
      <div className="admin-form-group">
        <label className="admin-form-label">Mission Intro</label>
        <textarea className="admin-form-input" rows={2} value={data.mission_intro} onChange={e => update({ mission_intro: e.target.value })} />
      </div>
      <ArrayEditor
        label="Mission Punkte"
        items={data.mission_items}
        onChange={mission_items => update({ mission_items })}
        createItem={() => "Neuer Punkt"}
        renderItem={(item, _, upd) => (
          <div className="admin-form-group">
            <input className="admin-form-input" value={item} onChange={e => upd(e.target.value)} />
          </div>
        )}
      />
    </div>
  );
}
