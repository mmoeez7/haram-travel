/** Shared (client-safe) helpers for recognizing Vercel Blob URLs. */

export function isVercelBlobUrl(url: string) {
  try {
    const host = new URL(url).hostname;
    return (
      host.endsWith(".public.blob.vercel-storage.com") ||
      host.endsWith(".blob.vercel-storage.com")
    );
  } catch {
    return false;
  }
}
