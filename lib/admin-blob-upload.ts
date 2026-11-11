"use client";

import { upload } from "@vercel/blob/client";
import { convertImageToWebp } from "@/lib/client-webp";
import {
  isAllowedImageType,
  MAX_IMAGE_BYTES,
} from "@/lib/image-upload-limits";
import type { StorageFolder } from "@/lib/storage/types";

export type AdminUploadProgress = {
  percentage: number;
};

/**
 * Convert to WebP, then client-upload to Vercel Blob via authenticated token route.
 * Falls back to server `/api/admin/upload` (sharp → storage) if client WebP fails.
 */
export async function uploadAdminImage(
  file: File,
  folder: StorageFolder,
  onProgress?: (progress: AdminUploadProgress) => void
): Promise<string> {
  if (!isAllowedImageType(file.type, file.name)) {
    throw new Error("Only JPEG, PNG, WebP, or GIF images are allowed.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image must be 5MB or smaller.");
  }

  let webpFile: File;
  try {
    webpFile = await convertImageToWebp(file);
  } catch {
    return uploadViaServer(file, folder);
  }

  if (webpFile.size > MAX_IMAGE_BYTES) {
    throw new Error("Converted WebP is still larger than 5MB.");
  }

  try {
    const pathname = `${folder}/${Date.now()}-${crypto.randomUUID()}.webp`;
    const blob = await upload(pathname, webpFile, {
      access: "public",
      handleUploadUrl: "/api/admin/blob/upload/",
      clientPayload: JSON.stringify({ folder }),
      contentType: "image/webp",
      multipart: false,
      onUploadProgress: (event) => {
        onProgress?.({ percentage: Math.round(event.percentage ?? 0) });
      },
    });
    return blob.url;
  } catch {
    // Token/client upload unavailable locally without Blob — use server path.
    return uploadViaServer(file, folder);
  }
}

async function uploadViaServer(file: File, folder: StorageFolder) {
  const form = new FormData();
  form.set("file", file);
  form.set("folder", folder);
  const response = await fetch("/api/admin/upload/", {
    method: "POST",
    body: form,
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Upload failed");
  return payload.url as string;
}
