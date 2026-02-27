"use client";

import type { FaqData } from "@/lib/cms";
import ArrayEditor from "./ArrayEditor";

interface Props {
  data: FaqData;
  onChange: (data: FaqData) => void;
}

export default function FaqEditor({ data, onChange }: Props) {
  const update = (partial: Partial<FaqData>) => onChange({ ...data, ...partial });

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
      <ArrayEditor
        label="FAQ-Einträge"
        items={data.items}
        onChange={items => update({ items })}
        createItem={() => ({ question: "Neue Frage?", answer: "" })}
        renderItem={(item, _, upd) => (
          <div>
            <div className="admin-form-group">
              <label className="admin-form-label">Frage</label>
              <input className="admin-form-input" value={item.question} onChange={e => upd({ ...item, question: e.target.value })} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Antwort</label>
              <textarea className="admin-form-input" rows={3} value={item.answer} onChange={e => upd({ ...item, answer: e.target.value })} />
            </div>
          </div>
        )}
      />
    </div>
  );
}
