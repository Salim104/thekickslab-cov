"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { Loader2, ImagePlus } from "lucide-react";
import { toast } from "sonner";

import { api } from "../../../convex/_generated/api";
import type { Doc, Id } from "../../../convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ImageUploadModal from "@/components/admin/ImageUploadModal";

const SIZES = ["6", "7", "8", "9", "10", "11", "12"];

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function calcDiscount(sale: string, original: string) {
  const s = parseFloat(sale);
  const o = parseFloat(original);
  if (!o || o <= 0 || isNaN(s)) return "";
  return String(Math.max(0, Math.round((1 - s / o) * 100)));
}

export default function ProductForm({ product }: { product?: Doc<"products"> }) {
  const router = useRouter();
  const createProduct = useMutation(api.products.create);
  const updateProduct = useMutation(api.products.update);
  const isEdit = Boolean(product);

  const [name, setName] = useState(product?.name ?? "");
  const [brand, setBrand] = useState(product?.brand ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [category, setCategory] = useState(product?.category ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [originalPrice, setOriginalPrice] = useState(product ? String(product.originalPrice) : "");
  const [discountPercent, setDiscountPercent] = useState(
    product ? String(product.discountPercent) : ""
  );
  const [sizes, setSizes] = useState<string[]>(product?.sizes ?? [...SIZES]);
  const [inStock, setInStock] = useState(product?.inStock ?? true);
  const [isBestSeller, setIsBestSeller] = useState(product?.isBestSeller ?? false);
  const [isOnDeal, setIsOnDeal] = useState(product?.isOnDeal ?? false);
  const [images, setImages] = useState<string[]>(product?.images ?? []);

  // Once the user hand-edits slug / discount, stop auto-deriving them.
  const [slugEdited, setSlugEdited] = useState(isEdit);
  const [discountEdited, setDiscountEdited] = useState(isEdit);

  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleNameChange(value: string) {
    setName(value);
    if (!slugEdited) setSlug(slugify(value));
  }

  function handlePriceChange(value: string) {
    setPrice(value);
    if (!discountEdited) setDiscountPercent(calcDiscount(value, originalPrice));
  }

  function handleOriginalChange(value: string) {
    setOriginalPrice(value);
    if (!discountEdited) setDiscountPercent(calcDiscount(price, value));
  }

  function toggleSize(size: string) {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !brand.trim() || !slug.trim() || !category.trim()) {
      toast.error("Name, Brand, Slug and Category are required.");
      return;
    }
    const priceNum = parseFloat(price);
    const originalNum = parseFloat(originalPrice);
    if (isNaN(priceNum) || isNaN(originalNum)) {
      toast.error("Sale Price and Original Price must be valid numbers.");
      return;
    }

    const payload = {
      name: name.trim(),
      brand: brand.trim(),
      slug: slug.trim(),
      category: category.trim(),
      price: priceNum,
      originalPrice: originalNum,
      discountPercent: parseInt(discountPercent, 10) || 0,
      images,
      sizes,
      inStock,
      isBestSeller,
      isOnDeal,
    };

    setSubmitting(true);
    try {
      if (isEdit && product) {
        await updateProduct({ id: product._id as Id<"products">, ...payload });
        toast.success("Product updated.");
      } else {
        await createProduct(payload);
        toast.success("Product created.");
      }
      router.push("/admin/products");
      router.refresh();
    } catch {
      toast.error("Could not save product. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name" required>
            <Input value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Air Jordan 4 Retro" />
          </Field>
          <Field label="Brand" required>
            <Input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Jordan" />
          </Field>
          <Field label="Slug" required hint="Auto-generated from name — editable">
            <Input
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugEdited(true);
              }}
              placeholder="air-jordan-4-retro"
            />
          </Field>
          <Field label="Category" required>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="sneakers" />
          </Field>
          <Field label="Sale Price / R" required>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => handlePriceChange(e.target.value)}
              placeholder="1799.99"
            />
          </Field>
          <Field label="Original Price / R" required>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={originalPrice}
              onChange={(e) => handleOriginalChange(e.target.value)}
              placeholder="1999.99"
            />
          </Field>
          <Field label="Discount %" hint="Auto-calculated from prices — editable">
            <Input
              type="number"
              min="0"
              max="100"
              value={discountPercent}
              onChange={(e) => {
                setDiscountPercent(e.target.value);
                setDiscountEdited(true);
              }}
              placeholder="10"
            />
          </Field>
        </div>
      </div>

      {/* Sizes */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <Label className="mb-3 block">Sizes (UK)</Label>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => {
            const active = sizes.includes(size);
            return (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={cn(
                  "h-10 min-w-10 rounded-md border px-3 text-sm font-medium transition-colors",
                  active
                    ? "border-[#0F172A] bg-[#0F172A] text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Toggles */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="space-y-4">
          <ToggleRow label="In Stock" checked={inStock} onChange={setInStock} />
          <ToggleRow label="Is Best Seller" checked={isBestSeller} onChange={setIsBestSeller} />
          <ToggleRow label="Is On Deal" checked={isOnDeal} onChange={setIsOnDeal} />
        </div>
      </div>

      {/* Images */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <Label className="block">Images</Label>
            <p className="mt-1 text-sm text-gray-500">
              {images.length} image{images.length === 1 ? "" : "s"} attached
            </p>
          </div>
          <Button type="button" variant="outline" onClick={() => setModalOpen(true)}>
            <ImagePlus className="h-4 w-4" />
            Manage Images
          </Button>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" className="bg-[#0F172A] hover:bg-red-500" disabled={submitting}>
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEdit ? "Save Changes" : "Create Product"}
        </Button>
      </div>

      <ImageUploadModal
        open={modalOpen}
        images={images}
        onChange={setImages}
        onClose={() => setModalOpen(false)}
      />
    </form>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </Label>
      {children}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <Label className="font-normal">{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
