import { localStorageProvider } from "./local";
import { vercelBlobStorageProvider } from "./vercel-blob";
import type { StorageProvider } from "./types";

export type { StorageFolder, StorageProvider, UploadedObject } from "./types";
export { folderFromPublicUrl } from "./local";
export { isVercelBlobUrl, deleteVercelBlobUrls } from "./vercel-blob";

/**
 * Resolve the active storage backend.
 * DB only stores public URLs — swap providers without schema changes.
 */
export function getStorageProvider(): StorageProvider {
  const provider = process.env.STORAGE_PROVIDER ?? "local";

  switch (provider) {
    case "local":
      return localStorageProvider;
    case "vercel-blob":
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        throw new Error(
          "BLOB_READ_WRITE_TOKEN is required when STORAGE_PROVIDER=vercel-blob"
        );
      }
      return vercelBlobStorageProvider;
    default:
      throw new Error(`Unsupported STORAGE_PROVIDER: ${provider}`);
  }
}
