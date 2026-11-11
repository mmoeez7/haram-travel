import { randomUUID } from "crypto";
import { del, put } from "@vercel/blob";
import { isVercelBlobUrl } from "@/lib/blob-urls";
import type { StorageProvider, UploadedObject } from "./types";

export { isVercelBlobUrl } from "@/lib/blob-urls";

function extensionFor(contentType: string, filename?: string) {
  if (filename && filename.includes(".")) {
    const ext = filename.slice(filename.lastIndexOf(".")).toLowerCase();
    if (ext.length <= 8) return ext;
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
      return ".bin";
  }
}

export const vercelBlobStorageProvider: StorageProvider = {
  async upload(file, options): Promise<UploadedObject> {
    const bytes =
      file instanceof Buffer
        ? file
        : Buffer.from(await (file as File).arrayBuffer());

    const ext = extensionFor(options.contentType, options.filename);
    const key = `${options.folder}/${Date.now()}-${randomUUID()}${ext}`;

    const blob = await put(key, bytes, {
      access: "public",
      contentType: options.contentType,
      addRandomSuffix: false,
    });

    return {
      key: blob.pathname.replace(/^\//, ""),
      url: blob.url,
      contentType: options.contentType,
      size: bytes.byteLength,
    };
  },

  async delete(keyOrUrl: string): Promise<void> {
    const target = keyOrUrl.trim();
    if (!target) return;
    try {
      if (isVercelBlobUrl(target) || target.startsWith("http")) {
        await del(target);
      } else {
        await del(target.replace(/^\/+/, ""));
      }
    } catch (error) {
      // Missing blob is fine — avoid failing the save path.
      if ((error as { code?: string }).code === "not_found") return;
      throw error;
    }
  },

  getPublicUrl(key: string): string {
    return key;
  },
};

export async function deleteVercelBlobUrls(urls: string[]) {
  const blobUrls = [...new Set(urls.filter(isVercelBlobUrl))];
  await Promise.all(
    blobUrls.map(async (url) => {
      try {
        await del(url);
      } catch {
        // best-effort cleanup
      }
    })
  );
}
