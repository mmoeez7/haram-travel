import { getStorageProvider, type StorageFolder } from "@/lib/storage";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAX_BYTES = 5 * 1024 * 1024;

export async function uploadImageFile(
  file: File,
  folder: StorageFolder
) {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Only JPEG, PNG, WebP, or GIF images are allowed.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image must be 5MB or smaller.");
  }

  const storage = getStorageProvider();
  return storage.upload(file, {
    folder,
    filename: file.name,
    contentType: file.type,
  });
}

export async function deleteStoredObject(urlOrKey: string) {
  if (!urlOrKey.startsWith("/uploads/")) {
    return;
  }
  const key = urlOrKey.replace(/^\/uploads\//, "");
  const storage = getStorageProvider();
  await storage.delete(key);
}
