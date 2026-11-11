import sharp from "sharp";
import {
  MAX_IMAGE_BYTES,
  isAllowedImageType,
  resolveImageType,
} from "@/lib/image-upload-limits";
import {
  deleteVercelBlobUrls,
  getStorageProvider,
  isVercelBlobUrl,
  type StorageFolder,
} from "@/lib/storage";

export async function uploadImageFile(file: File, folder: StorageFolder) {
  if (!isAllowedImageType(file.type, file.name)) {
    throw new Error("Only JPEG, PNG, WebP, or GIF images are allowed.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image must be 5MB or smaller.");
  }

  const input = Buffer.from(await file.arrayBuffer());
  const sourceType = resolveImageType(file.type, file.name);

  let webp: Buffer;
  try {
    webp = await sharp(input, {
      animated: sourceType === "image/webp" || sourceType === "image/gif",
      failOn: "none",
    })
      .rotate()
      .resize({
        width: 2400,
        height: 2400,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toBuffer();
  } catch {
    if (sourceType === "image/webp") {
      webp = input;
    } else {
      throw new Error("Could not convert image to WebP. Please try another file.");
    }
  }

  const storage = getStorageProvider();
  return storage.upload(webp, {
    folder,
    filename: "upload.webp",
    contentType: "image/webp",
  });
}

export async function deleteStoredObject(urlOrKey: string) {
  if (!urlOrKey) return;

  if (isVercelBlobUrl(urlOrKey)) {
    await deleteVercelBlobUrls([urlOrKey]);
    return;
  }

  if (!urlOrKey.startsWith("/uploads/")) {
    return;
  }
  const key = urlOrKey.replace(/^\/uploads\//, "");
  const storage = getStorageProvider();
  await storage.delete(key);
}

/** After a successful DB save, remove Blob URLs that are no longer referenced. */
export async function cleanupRemovedBlobUrls(
  previousUrls: string[],
  nextUrls: string[]
) {
  const next = new Set(nextUrls.filter(Boolean));
  const removed = previousUrls.filter(
    (url) => url && !next.has(url) && isVercelBlobUrl(url)
  );
  if (removed.length) {
    await deleteVercelBlobUrls(removed);
  }
}
