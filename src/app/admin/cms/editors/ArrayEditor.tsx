"use client";

interface ArrayEditorProps<T> {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, index: number, update: (item: T) => void) => React.ReactNode;
  createItem: () => T;
  label?: string;
}

export default function ArrayEditor<T>({ items, onChange, renderItem, createItem, label }: ArrayEditorProps<T>) {
  function updateItem(index: number, item: T) {
    const next = [...items];
    next[index] = item;
    onChange(next);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function moveItem(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="admin-form-group">
      {label && <label className="admin-form-label">{label}</label>}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {items.map((item, i) => (
          <div className="admin-array-item" key={i}>
            <div className="admin-array-item-header">
              <span style={{ fontSize: "0.75rem", color: "#78716c" }}>#{i + 1}</span>
              <div style={{ display: "flex", gap: "0.25rem" }}>
                <button
                  type="button"
                  className="admin-btn-secondary"
                  style={{ padding: "0.2rem 0.4rem", fontSize: "0.72rem" }}
                  onClick={() => moveItem(i, -1)}
                  disabled={i === 0}
                >↑</button>
                <button
                  type="button"
                  className="admin-btn-secondary"
                  style={{ padding: "0.2rem 0.4rem", fontSize: "0.72rem" }}
                  onClick={() => moveItem(i, 1)}
                  disabled={i === items.length - 1}
                >↓</button>
                <button
                  type="button"
                  className="admin-btn-secondary"
                  style={{ padding: "0.2rem 0.4rem", fontSize: "0.72rem", color: "#f87171" }}
                  onClick={() => removeItem(i)}
                >✕</button>
              </div>
            </div>
            {renderItem(item, i, (updated) => updateItem(i, updated))}
          </div>
        ))}
      </div>
      <button
        type="button"
        className="admin-btn admin-btn-secondary"
        style={{ marginTop: "0.5rem", width: "100%" }}
        onClick={() => onChange([...items, createItem()])}
      >+ Hinzufügen</button>
    </div>
  );
}
