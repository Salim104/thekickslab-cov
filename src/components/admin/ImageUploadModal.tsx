"use client";

import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import { X, UploadCloud, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";

type ImageUploadModalProps = {
  open: boolean;
  images: string[];
  onChange: (images: string[]) => void;
  onClose: () => void;
};

// CldUploadWidget needs the cloud name at build/runtime. It's read here so we
// can gracefully disable upload when Cloudinary isn't configured yet.
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "thekickslab";

// Hand-built modal (NOT Shadcn Dialog, per spec): fixed overlay, white card,
// centered, max-w-2xl. Manages a grid of product image URLs.
export default function ImageUploadModal({ open, images, onChange, onClose }: ImageUploadModalProps) {
  if (!open) return null;

  function removeAt(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function addImage(url: string) {
    if (url && !images.includes(url)) onChange([...images, url]);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />

      {/* Card */}
      <div className="relative z-10 w-full max-w-2xl rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-[#0F172A]">Manage Images</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-6">
          {images.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center text-gray-400">
              <ImageOff className="h-8 w-8" />
              <p className="text-sm">No images yet. Upload one to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
              {images.map((src, i) => (
                <div
                  key={`${src}-${i}`}
                  className="group relative aspect-square overflow-hidden rounded-md border border-gray-200 bg-gray-50"
                >
                  <Image src={src} alt={`Product image ${i + 1}`} fill sizes="120px" className="object-contain p-2" />
                  <button
                    type="button"
                    onClick={() => removeAt(i)}
                    aria-label={`Remove image ${i + 1}`}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity hover:bg-red-500 group-hover:opacity-100"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-gray-200 px-6 py-4">
          {CLOUD_NAME ? (
            <CldUploadWidget
              uploadPreset={UPLOAD_PRESET}
              onSuccess={(result) => {
                const info = result?.info;
                if (info && typeof info !== "string" && info.secure_url) {
                  addImage(info.secure_url);
                }
              }}
            >
              {({ open: openWidget }) => (
                <Button type="button" variant="outline" onClick={() => openWidget()}>
                  <UploadCloud className="h-4 w-4" />
                  Upload Image
                </Button>
              )}
            </CldUploadWidget>
          ) : (
            <Button
              type="button"
              variant="outline"
              disabled
              title="Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME to enable uploads"
            >
              <UploadCloud className="h-4 w-4" />
              Upload Image (Cloudinary not configured)
            </Button>
          )}

          <Button type="button" onClick={onClose} className="bg-[#0F172A] hover:bg-red-500">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
