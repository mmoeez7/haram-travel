import { localStorageProvider } from "./local";
import { vercelBlobStorageProvider } from "./vercel-blob";
import type { StorageProvider } from "./types";

export type { StorageFolder, StorageProvider, UploadedObject } from "./types";
export { folderFromPublicUrl } from "./local";
export { isVercelBlobUrl, deleteVercelBlobUrls } from "./vercel-blob";

function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

function runningOnVercel() {
  return process.env.VERCEL === "1";
}

/**
 * Resolve the active storage backend.
 * DB only stores public URLs — swap providers without schema changes.
 *
 * On Vercel, local disk is ephemeral — never use it there.
 */
export function getStorageProvider(): StorageProvider {
  const explicit = process.env.STORAGE_PROVIDER?.trim();
  const blobReady = hasBlobToken();

  if (explicit === "vercel-blob" || (!explicit && blobReady) || (runningOnVercel() && blobReady)) {
    if (!blobReady) {
      throw new Error(
        "BLOB_READ_WRITE_TOKEN is missing. Add it in Vercel → Project → Settings → Environment Variables (from Storage → Blob)."
      );
    }
    return vercelBlobStorageProvider;
  }

  if (runningOnVercel() || explicit === "vercel-blob") {
    throw new Error(
      "Image uploads need Vercel Blob. Set STORAGE_PROVIDER=vercel-blob and BLOB_READ_WRITE_TOKEN in Vercel env, then redeploy."
    );
  }

  if (explicit && explicit !== "local") {
    throw new Error(`Unsupported STORAGE_PROVIDER: ${explicit}`);
  }

  return localStorageProvider;
}
