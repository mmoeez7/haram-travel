/**
 * Kebab-case slug that may include `/` path segments
 * e.g. `umrah/5-star-10-nights-umrah-package`.
 *
 * Pass `preserveTrailingSlash: true` while the user is typing so a trailing
 * `/` is not wiped before the next segment is entered.
 */
export function slugify(
  input: string,
  options?: { preserveTrailingSlash?: boolean }
) {
  const preserveTrailing =
    Boolean(options?.preserveTrailingSlash) && /\/\s*$/.test(input);

  const segments = input
    .toLowerCase()
    .replace(/\\+/g, "/")
    .trim()
    .split("/")
    .map((segment) =>
      segment
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    )
    .filter(Boolean);

  let result = segments.join("/").replace(/\/{2,}/g, "/");
  if (preserveTrailing && result) {
    result += "/";
  }
  return result;
}

/** Lowercase kebab segments separated by optional `/` (no trailing slash). */
export const SLUG_PATH_REGEX =
  /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/;
