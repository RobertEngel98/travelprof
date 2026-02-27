"use client";

import type { TestimonialsData } from "@/lib/cms";
import ArrayEditor from "./ArrayEditor";

interface Props {
  data: TestimonialsData;
  onChange: (data: TestimonialsData) => void;
}

export default function TestimonialsEditor({ data, onChange }: Props) {
  const update = (partial: Partial<TestimonialsData>) => onChange({ ...data, ...partial });

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
        label="Testimonials"
        items={data.items}
        onChange={items => update({ items })}
        createItem={() => ({ quote: "", name: "", detail: "", initials: "" })}
        renderItem={(item, _, upd) => (
          <div>
            <div className="admin-form-group">
              <label className="admin-form-label">Zitat</label>
              <textarea className="admin-form-input" rows={3} value={item.quote} onChange={e => upd({ ...item, quote: e.target.value })} />
            </div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Name</label>
                <input className="admin-form-input" value={item.name} onChange={e => upd({ ...item, name: e.target.value })} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Initialen</label>
                <input className="admin-form-input" value={item.initials} onChange={e => upd({ ...item, initials: e.target.value })} />
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Detail</label>
              <input className="admin-form-input" value={item.detail} onChange={e => upd({ ...item, detail: e.target.value })} />
            </div>
          </div>
        )}
      />
    </div>
  );
}
