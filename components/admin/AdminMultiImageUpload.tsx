"use client";

import Image from "next/image";
import { ImageIcon, Trash2, X } from "lucide-react";
import { useRef, useState, type MutableRefObject } from "react";
import { adminLabelClass } from "@/components/admin/admin-ui";
import { uploadAdminCover } from "@/components/admin/AdminCoverUpload";

export type ExistingHotelImage = {
  id?: string;
  url: string;
  alt?: string | null;
};

type PendingFile = {
  key: string;
  file: File;
  previewUrl: string;
};

type AdminMultiImageUploadProps = {
  initialImages?: ExistingHotelImage[];
  disabled?: boolean;
  className?: string;
  onError?: (message: string) => void;
};

export type MultiImageUploadHandle = {
  /** Upload pending files and return final ordered URL list. */
  collectUrls: () => Promise<string[]>;
};

export function AdminMultiImageUpload({
  initialImages = [],
  disabled = false,
  className = "",
  onError,
  uploadRef,
}: AdminMultiImageUploadProps & {
  uploadRef: MutableRefObject<MultiImageUploadHandle | null>;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [existing, setExisting] = useState<ExistingHotelImage[]>(initialImages);
  const [pending, setPending] = useState<PendingFile[]>([]);

  uploadRef.current = {
    async collectUrls() {
      const uploaded = await Promise.all(
        pending.map((item) => uploadAdminCover(item.file, "hotels"))
      );
      return [...existing.map((img) => img.url), ...uploaded];
    },
  };

  function addFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    const next: PendingFile[] = [];
    for (const file of Array.from(fileList)) {
      if (!file.type.startsWith("image/")) {
        onError?.("Please choose image files only.");
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
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

  function removeExisting(url: string) {
    setExisting((prev) => prev.filter((img) => img.url !== url));
  }

  function removePending(key: string) {
    setPending((prev) => prev.filter((item) => item.key !== key));
  }

  const previews = [
    ...existing.map((img) => ({ key: img.url, url: img.url, kind: "existing" as const })),
    ...pending.map((item) => ({
      key: item.key,
      url: item.previewUrl,
      kind: "pending" as const,
    })),
  ];

  return (
    <div className={className}>
      <p className={adminLabelClass}>Hotel images</p>
      <button
        type="button"
        disabled={disabled}
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
          Add hotel images
        </span>
        <span className="text-xs text-muted">
          Multiple images supported. Each under 5MB.
        </span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => {
          addFiles(event.target.files);
          event.target.value = "";
        }}
      />

      {previews.length ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {previews.map((item) => (
            <div
              key={item.key}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-cream"
            >
              <Image
                src={item.url}
                alt="Hotel image"
                fill
                unoptimized
                className="object-cover"
              />
              <button
                type="button"
                disabled={disabled}
                onClick={() =>
                  item.kind === "existing"
                    ? removeExisting(item.key)
                    : removePending(item.key)
                }
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

      {previews.length ? (
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
    </div>
  );
}
