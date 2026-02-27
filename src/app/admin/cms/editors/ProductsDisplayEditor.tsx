"use client";

import type { ProductsDisplayData } from "@/lib/cms";
import ArrayEditor from "./ArrayEditor";

interface Props {
  data: ProductsDisplayData;
  onChange: (data: ProductsDisplayData) => void;
}

export default function ProductsDisplayEditor({ data, onChange }: Props) {
  const update = (partial: Partial<ProductsDisplayData>) => onChange({ ...data, ...partial });

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
        label="Produkte"
        items={data.items}
        onChange={items => update({ items })}
        createItem={() => ({ tag: "Starter", cls: "starter", price: "0 €", name: "Neues Produkt", desc: "", cta: "Jetzt kaufen", action: "buy" })}
        renderItem={(item, _, upd) => (
          <div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Tag</label>
                <input className="admin-form-input" value={item.tag} onChange={e => upd({ ...item, tag: e.target.value })} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">CSS-Klasse (free/starter/core/premium)</label>
                <select className="admin-form-select" value={item.cls} onChange={e => upd({ ...item, cls: e.target.value })}>
                  <option value="free">free</option>
                  <option value="starter">starter</option>
                  <option value="core">core</option>
                  <option value="premium">premium</option>
                </select>
              </div>
            </div>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Preis</label>
                <input className="admin-form-input" value={item.price} onChange={e => upd({ ...item, price: e.target.value })} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Action (leadmagnet/buy/termin/vip)</label>
                <select className="admin-form-select" value={item.action} onChange={e => upd({ ...item, action: e.target.value })}>
                  <option value="leadmagnet">leadmagnet</option>
                  <option value="buy">buy</option>
                  <option value="termin">termin</option>
                  <option value="vip">vip</option>
                </select>
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Name</label>
              <input className="admin-form-input" value={item.name} onChange={e => upd({ ...item, name: e.target.value })} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Beschreibung</label>
              <textarea className="admin-form-input" rows={2} value={item.desc} onChange={e => upd({ ...item, desc: e.target.value })} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">CTA-Text</label>
              <input className="admin-form-input" value={item.cta} onChange={e => upd({ ...item, cta: e.target.value })} />
            </div>
          </div>
        )}
      />
    </div>
  );
}
