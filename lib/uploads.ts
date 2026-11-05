import sharp from "sharp";
import {
  MAX_IMAGE_BYTES,
  isAllowedImageType,
  resolveImageType,
} from "@/lib/image-upload-limits";
import { getStorageProvider, type StorageFolder } from "@/lib/storage";

export async function uploadImageFile(
  file: File,
  folder: StorageFolder
) {
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
      // Keep animated WebP/GIF readable instead of rejecting them.
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
    // Already-WebP files can fail re-encode on some builds — store the original.
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
  if (!urlOrKey.startsWith("/uploads/")) {
    return;
  }
  const key = urlOrKey.replace(/^\/uploads\//, "");
  const storage = getStorageProvider();
  await storage.delete(key);
}
