"use client";

interface DateRangeSelectorProps {
  value: number;
  onChange: (days: number) => void;
  options?: { label: string; days: number }[];
}

const DEFAULT_OPTIONS = [
  { label: "7T", days: 7 },
  { label: "30T", days: 30 },
  { label: "90T", days: 90 },
  { label: "Gesamt", days: 0 },
];

export default function DateRangeSelector({ value, onChange, options }: DateRangeSelectorProps) {
  const opts = options ?? DEFAULT_OPTIONS;
  return (
    <div className="admin-date-range">
      {opts.map((opt) => (
        <button
          key={opt.days}
          className={value === opt.days ? "active" : ""}
          onClick={() => onChange(opt.days)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
