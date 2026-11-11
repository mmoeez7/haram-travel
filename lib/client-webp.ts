/** Browser-side image → WebP conversion for Vercel Blob client uploads. */

const MAX_EDGE = 2400;
const WEBP_QUALITY = 0.8;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image for WebP conversion."));
    };
    img.src = url;
  });
}

export async function convertImageToWebp(file: File): Promise<File> {
  if (file.type === "image/webp" && file.size < 800_000) {
    // Already a reasonably small WebP — skip re-encode.
    return file;
  }

  const img = await loadImage(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas is not available for WebP conversion.");
  }
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", WEBP_QUALITY)
  );

  if (!blob) {
    throw new Error("This browser could not encode WebP.");
  }

  const base = file.name.replace(/\.[^.]+$/, "") || "upload";
  return new File([blob], `${base}.webp`, { type: "image/webp" });
}
