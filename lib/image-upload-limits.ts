/** Keep in sync across client pickers and server uploadImageFile. */
export const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export const ALLOWED_IMAGE_ACCEPT =
  "image/jpeg,image/png,image/webp,image/gif";

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function isAllowedImageType(type: string) {
  return ALLOWED_IMAGE_TYPES.has(type);
}
