import sharp from "sharp";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
} from "@/lib/image-upload-limits";
import { getStorageProvider, type StorageFolder } from "@/lib/storage";

export async function uploadImageFile(
  file: File,
  folder: StorageFolder
) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Only JPEG, PNG, WebP, or GIF images are allowed.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image must be 5MB or smaller.");
  }

  const input = Buffer.from(await file.arrayBuffer());
  let webp: Buffer;
  try {
    webp = await sharp(input)
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
    throw new Error("Could not convert image to WebP. Please try another file.");
  }

  const storage = getStorageProvider();
  return storage.upload(webp, {
    folder,
    filename: "upload.webp",
    contentType: "image/webp",
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
