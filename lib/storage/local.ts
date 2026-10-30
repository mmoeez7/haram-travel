import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import type { StorageFolder, StorageProvider, UploadedObject } from "./types";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

function extensionFor(contentType: string, filename?: string) {
  if (filename && path.extname(filename)) {
    return path.extname(filename).toLowerCase();
  }
  switch (contentType) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    default:
      return "";
  }
}

export const localStorageProvider: StorageProvider = {
  async upload(file, options): Promise<UploadedObject> {
    const bytes =
      file instanceof Buffer
        ? file
        : Buffer.from(await (file as File).arrayBuffer());

    const ext = extensionFor(options.contentType, options.filename);
    const key = path.posix.join(
      options.folder,
      `${Date.now()}-${randomUUID()}${ext}`
    );
    const absolute = path.join(UPLOAD_ROOT, key);
    await mkdir(path.dirname(absolute), { recursive: true });
    await writeFile(absolute, bytes);

    return {
      key,
      url: `/uploads/${key}`,
      contentType: options.contentType,
      size: bytes.byteLength,
    };
  },

  async delete(key: string): Promise<void> {
    const safeKey = key.replace(/^\/+/, "").replace(/\.\./g, "");
    const absolute = path.join(UPLOAD_ROOT, safeKey);
    if (!absolute.startsWith(UPLOAD_ROOT)) {
      throw new Error("Invalid storage key");
    }
    try {
      await unlink(absolute);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        throw error;
      }
    }
  },

  getPublicUrl(key: string): string {
    const safeKey = key.replace(/^\/+/, "");
    return `/uploads/${safeKey}`;
  },
};

export function folderFromPublicUrl(url: string): StorageFolder | null {
  if (url.startsWith("/uploads/packages/")) return "packages";
  if (url.startsWith("/uploads/hotels/")) return "hotels";
  return null;
}
