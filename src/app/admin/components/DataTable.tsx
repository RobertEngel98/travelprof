"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface Column {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
}

interface DataTableProps {
  title?: string;
  columns: Column[];
  data: any[];
  actions?: React.ReactNode;
}

export default function DataTable({
  title,
  columns,
  data,
  actions,
}: DataTableProps) {
  return (
    <div className="admin-table-wrap">
      {(title || actions) && (
        <div className="admin-table-header">
          {title && <div className="admin-table-title">{title}</div>}
          {actions && <div style={{ display: "flex", gap: "0.5rem" }}>{actions}</div>}
        </div>
      )}
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center", color: "#78716c", padding: "2rem" }}>
                Keine Daten vorhanden
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row) : String(row[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
