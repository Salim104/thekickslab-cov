"use client";

import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { SlidersHorizontal } from "lucide-react";

import { api } from "../../convex/_generated/api";
import ProductCard from "@/components/ProductCard";
import FilterSidebar, { PRICE_MAX } from "@/components/FilterSidebar";
import SortDropdown, { type SortOption } from "@/components/SortDropdown";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const PER_PAGE = 12;

function CardSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="mb-3 h-60 w-full" />
      <Skeleton className="mx-auto mb-2 h-4 w-3/4" />
      <Skeleton className="mx-auto h-4 w-1/3" />
    </div>
  );
}

export default function ShopClient() {
  const allProducts = useQuery(api.products.getAll);
  const brands = useQuery(api.products.getBrands);
  const loading = allProducts === undefined || brands === undefined;

  // Filter / sort / pagination state
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [pendingMaxPrice, setPendingMaxPrice] = useState(PRICE_MAX);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(PRICE_MAX);
  const [sort, setSort] = useState<SortOption>("default");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Any state change that shrinks/reorders the list resets to page 1.
  const update = {
    search: (value: string) => {
      setSearch(value);
      setPage(1);
    },
    brand: (value: string | null) => {
      setSelectedBrand(value);
      setPage(1);
    },
    applyPrice: () => {
      setAppliedMaxPrice(pendingMaxPrice);
      setPage(1);
    },
    sort: (value: SortOption) => {
      setSort(value);
      setPage(1);
    },
  };

  const filtered = useMemo(() => {
    if (!allProducts) return [];
    const term = search.trim().toLowerCase();
    const result = allProducts.filter((p) => {
      if (term && !p.name.toLowerCase().includes(term)) return false;
      if (selectedBrand && p.brand !== selectedBrand) return false;
      if (p.price > appliedMaxPrice) return false;
      return true;
    });
    if (sort === "price_asc") result.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") result.sort((a, b) => b.price - a.price);
    return result;
  }, [allProducts, search, selectedBrand, appliedMaxPrice, sort]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PER_PAGE;
  const pageItems = filtered.slice(start, start + PER_PAGE);
  const showingFrom = total === 0 ? 0 : start + 1;
  const showingTo = Math.min(start + PER_PAGE, total);

  const sidebar = (
    <FilterSidebar
      search={search}
      onSearchChange={update.search}
      brands={brands ?? []}
      selectedBrand={selectedBrand}
      onSelectBrand={update.brand}
      pendingMaxPrice={pendingMaxPrice}
      onPendingMaxPriceChange={setPendingMaxPrice}
      onApplyPrice={update.applyPrice}
    />
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 md:px-8">
      <h1 className="mb-2 text-3xl font-bold">Shop</h1>
      <p className="mb-8 text-sm text-gray-500">
        Showing {showingFrom} – {showingTo} of {total} results
      </p>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Desktop sidebar */}
        <aside className="hidden w-1/4 shrink-0 lg:block">{sidebar}</aside>

        {/* Main column */}
        <div className="flex-1">
          {/* Toolbar: mobile filter trigger + sort */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filter
            </button>
            <div className="ml-auto">
              <SortDropdown value={sort} onChange={update.sort} />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : total === 0 ? (
            <div className="flex flex-col items-center gap-2 py-20 text-center">
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm text-gray-500">
                Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pageItems.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const n = i + 1;
                    return (
                      <button
                        key={n}
                        onClick={() => setPage(n)}
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm transition-colors ${
                          n === currentPage
                            ? "bg-black text-white"
                            : "border border-gray-300 text-gray-700 hover:border-black"
                        }`}
                      >
                        {n}
                      </button>
                    );
                  })}
                  {currentPage < totalPages && (
                    <button
                      onClick={() => setPage(currentPage + 1)}
                      className="ml-2 rounded-full border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-black"
                    >
                      NEXT
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent side="left" className="w-full overflow-y-auto bg-white sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-6">{sidebar}</div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
