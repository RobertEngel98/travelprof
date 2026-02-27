"use client";

import type { HeroData } from "@/lib/cms";
import ImageUpload from "./ImageUpload";
import ArrayEditor from "./ArrayEditor";

interface Props {
  data: HeroData;
  onChange: (data: HeroData) => void;
}

export default function HeroEditor({ data, onChange }: Props) {
  const update = (partial: Partial<HeroData>) => onChange({ ...data, ...partial });

  return (
    <div>
      <div className="admin-form-group">
        <label className="admin-form-label">Badge-Text</label>
        <input className="admin-form-input" value={data.badge} onChange={e => update({ badge: e.target.value })} />
      </div>
      <div className="admin-form-group">
        <label className="admin-form-label">Titel (HTML erlaubt, z.B. &lt;em&gt;)</label>
        <input className="admin-form-input" value={data.title} onChange={e => update({ title: e.target.value })} />
      </div>
      <div className="admin-form-group">
        <label className="admin-form-label">Untertitel (HTML erlaubt)</label>
        <textarea className="admin-form-input" rows={3} value={data.subtitle} onChange={e => update({ subtitle: e.target.value })} />
      </div>
      <ArrayEditor
        label="Stats"
        items={data.stats}
        onChange={stats => update({ stats })}
        createItem={() => ({ emoji: "🌟", text: "Neuer Stat" })}
        renderItem={(item, _, upd) => (
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label className="admin-form-label">Emoji</label>
              <input className="admin-form-input" value={item.emoji} onChange={e => upd({ ...item, emoji: e.target.value })} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Text</label>
              <input className="admin-form-input" value={item.text} onChange={e => upd({ ...item, text: e.target.value })} />
            </div>
          </div>
        )}
      />
      <div className="admin-form-row">
        <div className="admin-form-group">
          <label className="admin-form-label">Bewertung</label>
          <input className="admin-form-input" value={data.rating_score} onChange={e => update({ rating_score: e.target.value })} />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Bewertungsquelle</label>
          <input className="admin-form-input" value={data.rating_source} onChange={e => update({ rating_source: e.target.value })} />
        </div>
      </div>
      <ImageUpload label="Hero-Bild" value={data.hero_image} onChange={hero_image => update({ hero_image })} />
    </div>
  );
}
