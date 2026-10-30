import { localStorageProvider } from "./local";
import type { StorageProvider } from "./types";

export type { StorageFolder, StorageProvider, UploadedObject } from "./types";

/**
 * Resolve the active storage backend.
 * DB only stores public URLs — swap providers without schema changes.
 */
export function getStorageProvider(): StorageProvider {
  const provider = process.env.STORAGE_PROVIDER ?? "local";

  switch (provider) {
    case "local":
      return localStorageProvider;
    // case "r2":
    //   return r2StorageProvider;
    default:
      throw new Error(`Unsupported STORAGE_PROVIDER: ${provider}`);
  }
}
