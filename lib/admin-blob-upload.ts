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

function errorMessage(err: unknown, fallback: string) {
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

/**
 * Convert to WebP, upload via authenticated Blob client token when possible,
 * otherwise server `/api/admin/upload` (sharp → Blob put).
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

  // Prefer server upload first — sharp WebP + Blob put is the most reliable on Vercel.
  // Client token upload is tried when server path is unavailable.
  try {
    return await uploadViaServer(file, folder, onProgress);
  } catch (serverError) {
    let webpFile: File;
    try {
      webpFile = await convertImageToWebp(file);
    } catch {
      throw new Error(
        errorMessage(
          serverError,
          "Upload failed. On Vercel, set BLOB_READ_WRITE_TOKEN and STORAGE_PROVIDER=vercel-blob, then redeploy."
        )
      );
    }

    if (webpFile.size > MAX_IMAGE_BYTES) {
      throw new Error("Converted WebP is still larger than 5MB.");
    }

    try {
      const pathname = `${folder}/${Date.now()}-${crypto.randomUUID()}.webp`;
      const blob = await upload(pathname, webpFile, {
        access: "public",
        handleUploadUrl: `${window.location.origin}/api/admin/blob/upload/`,
        clientPayload: JSON.stringify({ folder }),
        contentType: "image/webp",
        multipart: false,
        onUploadProgress: (event) => {
          onProgress?.({ percentage: Math.round(event.percentage ?? 0) });
        },
      });
      return blob.url;
    } catch (clientError) {
      throw new Error(
        errorMessage(
          serverError,
          errorMessage(
            clientError,
            "Upload failed. Configure Vercel Blob (BLOB_READ_WRITE_TOKEN) and redeploy."
          )
        )
      );
    }
  }
}

async function uploadViaServer(
  file: File,
  folder: StorageFolder,
  onProgress?: (progress: AdminUploadProgress) => void
) {
  onProgress?.({ percentage: 10 });
  const form = new FormData();
  form.set("file", file);
  form.set("folder", folder);
  const response = await fetch("/api/admin/upload/", {
    method: "POST",
    body: form,
  });
  onProgress?.({ percentage: 90 });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      (payload as { error?: string }).error ||
        `Upload failed (${response.status})`
    );
  }
  onProgress?.({ percentage: 100 });
  return (payload as { url: string }).url;
}
