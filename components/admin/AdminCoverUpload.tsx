"use client";

import Image from "next/image";
import { ImageIcon, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { adminLabelClass } from "@/components/admin/admin-ui";
import {
  ALLOWED_IMAGE_ACCEPT,
  isAllowedImageType,
  MAX_IMAGE_BYTES,
} from "@/lib/image-upload-limits";

export type CoverUploadState = {
  file: File | null;
  previewUrl: string | null;
  removed: boolean;
};

type AdminCoverUploadProps = {
  initialUrl?: string | null;
  disabled?: boolean;
  uploading?: boolean;
  className?: string;
  onChange?: (state: CoverUploadState) => void;
  onError?: (message: string) => void;
};

export function ImageUploadStatus({ label }: { label: string }) {
  return (
    <div
      className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 rounded-2xl bg-white/85 px-4 text-center text-call-border"
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-8 w-8 animate-spin" aria-hidden />
      <span className="text-sm font-semibold">{label}</span>
    </div>
  );
}

export async function uploadAdminCover(file: File, folder: "packages" | "hotels" | "categories") {
  const form = new FormData();
  form.set("file", file);
  form.set("folder", folder);
  const response = await fetch("/api/admin/upload", {
    method: "POST",
    body: form,
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Upload failed");
  return payload.url as string;
}

export function resolveCoverImageUrl(
  state: CoverUploadState,
  existingUrl?: string | null
) {
  if (state.file) return null; // caller must upload
  if (state.removed) return "";
  return existingUrl ?? "";
}

export function AdminCoverUpload({
  initialUrl = null,
  disabled = false,
  uploading = false,
  className = "",
  onChange,
  onError,
}: AdminCoverUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl);
  const [file, setFile] = useState<File | null>(null);
  const [removed, setRemoved] = useState(false);

  function emit(next: CoverUploadState) {
    onChange?.(next);
  }

  function onCoverChange(nextFile: File | null) {
    if (!nextFile) return;
    if (!isAllowedImageType(nextFile.type, nextFile.name)) {
      onError?.("Only JPEG, PNG, WebP, or GIF images are allowed.");
      return;
    }
    if (nextFile.size > MAX_IMAGE_BYTES) {
      onError?.("Image size must be below 5MB.");
      return;
    }
    const nextPreview = URL.createObjectURL(nextFile);
    setFile(nextFile);
    setPreviewUrl(nextPreview);
    setRemoved(false);
    emit({ file: nextFile, previewUrl: nextPreview, removed: false });
  }

  function clearCover() {
    setFile(null);
    setPreviewUrl(null);
    setRemoved(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
    emit({ file: null, previewUrl: null, removed: true });
  }

  return (
    <div className={`relative ${className}`} aria-busy={uploading}>
      <p className={adminLabelClass}>Cover image</p>
      <button
        type="button"
        disabled={disabled || uploading}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          onCoverChange(event.dataTransfer.files?.[0] ?? null);
        }}
        className="mt-1 flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-call-border/40 bg-call/30 px-4 py-10 text-center transition hover:border-call-border hover:bg-call/50 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {previewUrl ? (
          <div className="relative h-36 w-full max-w-sm overflow-hidden rounded-xl">
            <Image
              src={previewUrl}
              alt="Cover preview"
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        ) : (
          <>
            <ImageIcon className="h-10 w-10 text-call-border/80" aria-hidden />
            <span className="text-sm font-semibold text-call-border">Add cover</span>
          </>
        )}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_IMAGE_ACCEPT}
        className="hidden"
        onChange={(event) => onCoverChange(event.target.files?.[0] ?? null)}
      />
      <p className="mt-2 text-xs text-muted">
        JPEG, PNG, WebP, or GIF under 5MB. Drag and drop or click to upload.
      </p>
      {previewUrl ? (
        <button
          type="button"
          disabled={disabled || uploading}
          onClick={clearCover}
          className="mt-2 cursor-pointer text-xs font-semibold text-call-border hover:underline disabled:cursor-not-allowed"
        >
          Remove cover
        </button>
      ) : null}
      {uploading ? <ImageUploadStatus label="Uploading image…" /> : null}
    </div>
  );
}
