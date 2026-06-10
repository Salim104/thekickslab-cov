"use client";

export type SortOption = "default" | "price_asc" | "price_desc";

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: "default", label: "Default sorting" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export default function SortDropdown({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (value: SortOption) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortOption)}
      aria-label="Sort products"
      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 focus:border-black focus:outline-none"
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
