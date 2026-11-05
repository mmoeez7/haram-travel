/** Keep in sync across client pickers and server uploadImageFile. */
export const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export const ALLOWED_IMAGE_ACCEPT =
  "image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const EXTENSION_TO_TYPE: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

export function imageTypeFromName(filename?: string | null) {
  if (!filename) return null;
  const ext = filename.split(".").pop()?.toLowerCase();
  if (!ext) return null;
  return EXTENSION_TO_TYPE[ext] ?? null;
}

/** Accepts MIME type and/or filename — browsers sometimes leave File.type empty for WebP. */
export function isAllowedImageType(type: string, filename?: string | null) {
  if (type && ALLOWED_IMAGE_TYPES.has(type)) return true;
  const fromName = imageTypeFromName(filename);
  return fromName !== null && ALLOWED_IMAGE_TYPES.has(fromName);
}

export function resolveImageType(type: string, filename?: string | null) {
  if (type && ALLOWED_IMAGE_TYPES.has(type)) return type;
  return imageTypeFromName(filename);
}
