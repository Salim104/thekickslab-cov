"use client";

import { Search } from "lucide-react";

import { formatZAR } from "@/lib/utils";

export const PRICE_MIN = 1000;
export const PRICE_MAX = 2000;

type Brand = { brand: string; count: number };

export default function FilterSidebar({
  search,
  onSearchChange,
  brands,
  selectedBrand,
  onSelectBrand,
  pendingMaxPrice,
  onPendingMaxPriceChange,
  onApplyPrice,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  brands: Brand[];
  selectedBrand: string | null;
  onSelectBrand: (brand: string | null) => void;
  pendingMaxPrice: number;
  onPendingMaxPriceChange: (value: number) => void;
  onApplyPrice: () => void;
}) {
  return (
    <div className="space-y-8">
      {/* Search */}
      <div>
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-full border border-gray-300 py-2 pl-4 pr-10 text-sm focus:border-black focus:outline-none"
          />
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Price range */}
      <div>
        <h3 className="mb-4 text-lg font-bold">Filter by price</h3>
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={50}
          value={pendingMaxPrice}
          onChange={(e) => onPendingMaxPriceChange(Number(e.target.value))}
          className="w-full accent-black"
        />
        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Price: {formatZAR(PRICE_MIN)} — {formatZAR(pendingMaxPrice)}
          </p>
          <button
            onClick={onApplyPrice}
            className="rounded-md bg-black px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
          >
            Filter
          </button>
        </div>
      </div>

      {/* Categories (brands) */}
      <div>
        <h3 className="mb-4 text-lg font-bold">Product categories</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <button
              onClick={() => onSelectBrand(null)}
              className={`flex w-full items-center justify-between transition-colors hover:text-black ${
                selectedBrand === null
                  ? "font-semibold text-black"
                  : "text-gray-600"
              }`}
            >
              <span>All</span>
            </button>
          </li>
          {brands.map(({ brand, count }) => (
            <li key={brand}>
              <button
                onClick={() => onSelectBrand(brand)}
                className={`flex w-full items-center justify-between transition-colors hover:text-black ${
                  selectedBrand === brand
                    ? "font-semibold text-black"
                    : "text-gray-600"
                }`}
              >
                <span>{brand}</span>
                <span className="text-gray-400">({count})</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Tags (static for now) */}
      <div>
        <h3 className="mb-4 text-lg font-bold">Product tags</h3>
        <span className="inline-block rounded-full border border-gray-300 px-3 py-1 text-xs text-gray-600">
          NEW BALANCE 550
        </span>
      </div>
    </div>
  );
}
