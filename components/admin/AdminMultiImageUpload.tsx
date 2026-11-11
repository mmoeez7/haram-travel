"use client";

import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useRef, useState, type MutableRefObject } from "react";
import { uploadAdminImage } from "@/lib/admin-blob-upload";
import { adminLabelClass } from "@/components/admin/admin-ui";
import { ImageUploadStatus } from "@/components/admin/AdminCoverUpload";
import {
  ALLOWED_IMAGE_ACCEPT,
  isAllowedImageType,
  MAX_IMAGE_BYTES,
} from "@/lib/image-upload-limits";
import type { StorageFolder } from "@/lib/storage/types";

export type ExistingGalleryImage = {
  id?: string;
  url: string;
  alt?: string | null;
};

/** @deprecated Use ExistingGalleryImage */
export type ExistingHotelImage = ExistingGalleryImage;

type PendingFile = {
  key: string;
  file: File;
  previewUrl: string;
};

type GalleryItem =
  | { key: string; kind: "existing"; url: string }
  | { key: string; kind: "pending"; url: string; pendingKey: string };

type AdminMultiImageUploadProps = {
  folder?: StorageFolder;
  label?: string;
  initialImages?: ExistingGalleryImage[];
  disabled?: boolean;
  className?: string;
  onError?: (message: string) => void;
};

export type MultiImageUploadHandle = {
  /** Upload pending files and return final ordered URL list (cover first). */
  collectUrls: () => Promise<string[]>;
};

export function AdminMultiImageUpload({
  folder = "hotels",
  label = "Images",
  initialImages = [],
  disabled = false,
  className = "",
  onError,
  uploadRef,
}: AdminMultiImageUploadProps & {
  uploadRef: MutableRefObject<MultiImageUploadHandle | null>;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [existing, setExisting] = useState<ExistingGalleryImage[]>(initialImages);
  const [pending, setPending] = useState<PendingFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{
    current: number;
    total: number;
    percent: number;
  } | null>(null);
  const existingRef = useRef(existing);
  const pendingRef = useRef(pending);
  existingRef.current = existing;
  pendingRef.current = pending;

  uploadRef.current = {
    async collectUrls() {
      const urls = existingRef.current.map((img) => img.url);
      const queue = [...pendingRef.current];
      if (!queue.length) return urls;

      setUploadProgress({ current: 1, total: queue.length, percent: 0 });
      try {
        for (let index = 0; index < queue.length; index += 1) {
          const item = queue[index];
          setUploadProgress({
            current: index + 1,
            total: queue.length,
            percent: 0,
          });
          try {
            const url = await uploadAdminImage(item.file, folder, (p) => {
              setUploadProgress({
                current: index + 1,
                total: queue.length,
                percent: p.percentage,
              });
            });
            urls.push(url);
            setExisting((prev) => [...prev, { url }]);
            setPending((prev) => prev.filter((p) => p.key !== item.key));
            existingRef.current = [...existingRef.current, { url }];
            pendingRef.current = pendingRef.current.filter(
              (p) => p.key !== item.key
            );
          } catch (err) {
            throw new Error(
              `Failed to upload ${item.file.name}: ${
                err instanceof Error ? err.message : "Upload failed"
              }`
            );
          }
        }
      } finally {
        setUploadProgress(null);
      }

      return urls;
    },
  };

  function addFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    const next: PendingFile[] = [];
    for (const file of Array.from(fileList)) {
      if (!isAllowedImageType(file.type, file.name)) {
        onError?.("Only JPEG, PNG, WebP, or GIF images are allowed.");
        continue;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        onError?.("Each image must be below 5MB.");
        continue;
      }
      next.push({
        key: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }
    if (next.length) setPending((prev) => [...prev, ...next]);
  }

  const items: GalleryItem[] = [
    ...existing.map((img) => ({
      key: img.url,
      kind: "existing" as const,
      url: img.url,
    })),
    ...pending.map((item) => ({
      key: item.key,
      kind: "pending" as const,
      url: item.previewUrl,
      pendingKey: item.key,
    })),
  ];

  function moveItem(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= items.length) return;

    // Rebuild existing + pending from reordered visual list.
    const reordered = [...items];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(nextIndex, 0, moved);

    const nextExisting: ExistingGalleryImage[] = [];
    const nextPending: PendingFile[] = [];
    for (const item of reordered) {
      if (item.kind === "existing") {
        nextExisting.push({ url: item.url });
      } else {
        const pendingItem = pending.find((p) => p.key === item.pendingKey);
        if (pendingItem) nextPending.push(pendingItem);
      }
    }
    setExisting(nextExisting);
    setPending(nextPending);
  }

  function setCover(index: number) {
    if (index <= 0) return;
    const reordered = [...items];
    const [moved] = reordered.splice(index, 1);
    reordered.unshift(moved);
    const nextExisting: ExistingGalleryImage[] = [];
    const nextPending: PendingFile[] = [];
    for (const item of reordered) {
      if (item.kind === "existing") {
        nextExisting.push({ url: item.url });
      } else {
        const pendingItem = pending.find((p) => p.key === item.pendingKey);
        if (pendingItem) nextPending.push(pendingItem);
      }
    }
    setExisting(nextExisting);
    setPending(nextPending);
  }

  function removeAt(index: number) {
    const item = items[index];
    if (!item) return;
    if (item.kind === "existing") {
      setExisting((prev) => prev.filter((img) => img.url !== item.url));
    } else {
      setPending((prev) => prev.filter((p) => p.key !== item.pendingKey));
    }
  }

  const uploading = uploadProgress !== null;
  const uploadLabel = uploadProgress
    ? uploadProgress.total > 1
      ? `Uploading ${uploadProgress.current}/${uploadProgress.total} (${uploadProgress.percent}%)`
      : `Uploading image… ${uploadProgress.percent}%`
    : "Uploading…";

  return (
    <div className={`relative ${className}`} aria-busy={uploading}>
      <p className={adminLabelClass}>{label}</p>
      <button
        type="button"
        disabled={disabled || uploading}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          addFiles(event.dataTransfer.files);
        }}
        className="mt-1 flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-call-border/40 bg-call/30 px-4 py-8 text-center transition hover:border-call-border hover:bg-call/50 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <ImageIcon className="h-10 w-10 text-call-border/80" aria-hidden />
        <span className="text-sm font-semibold text-call-border">
          Add images
        </span>
        <span className="text-xs text-muted">
          JPEG, PNG, WebP, or GIF. Multiple images, each under 5MB. Stored as WebP.
        </span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_IMAGE_ACCEPT}
        multiple
        className="hidden"
        onChange={(event) => {
          addFiles(event.target.files);
          event.target.value = "";
        }}
      />

      {items.length ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {items.map((item, index) => (
            <div
              key={item.key}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-cream"
            >
              <Image
                src={item.url}
                alt="Gallery image"
                fill
                unoptimized
                className="object-cover"
              />
              {index === 0 ? (
                <span className="absolute left-1.5 top-1.5 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-charcoal">
                  Cover
                </span>
              ) : null}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-charcoal/70 p-1.5 opacity-0 transition group-hover:opacity-100">
                <button
                  type="button"
                  disabled={disabled || index === 0}
                  onClick={() => moveItem(index, -1)}
                  className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white/90 text-charcoal disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Move left"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  disabled={disabled || index === 0}
                  onClick={() => setCover(index)}
                  className="inline-flex h-7 items-center gap-1 rounded-full bg-white/90 px-2 text-[10px] font-semibold text-charcoal disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Set as cover"
                >
                  <Star className="h-3 w-3" />
                  Cover
                </button>
                <button
                  type="button"
                  disabled={disabled || index === items.length - 1}
                  onClick={() => moveItem(index, 1)}
                  className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white/90 text-charcoal disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Move right"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
              <button
                type="button"
                disabled={disabled}
                onClick={() => removeAt(index)}
                className="absolute right-1.5 top-1.5 inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-charcoal/80 text-white opacity-90 transition hover:bg-call-hover disabled:cursor-not-allowed"
                aria-label="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-xs text-muted">No images added yet.</p>
      )}

      {items.length ? (
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            setExisting([]);
            setPending([]);
          }}
          className="mt-3 inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-call-border hover:underline disabled:cursor-not-allowed"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear all images
        </button>
      ) : null}
      {uploading ? <ImageUploadStatus label={uploadLabel} /> : null}
    </div>
  );
}
