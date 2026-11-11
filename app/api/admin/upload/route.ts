import { NextResponse } from "next/server";
import { requireAdminApi, jsonError } from "@/lib/admin-api-auth";
import { uploadImageFile } from "@/lib/uploads";
import type { StorageFolder } from "@/lib/storage";

export async function POST(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = String(formData.get("folder") || "packages") as StorageFolder;

  if (!(file instanceof File) || file.size === 0) {
    return jsonError("Image file is required");
  }
  if (
    folder !== "packages" &&
    folder !== "hotels" &&
    folder !== "categories" &&
    folder !== "blogs"
  ) {
    return jsonError("Invalid upload folder");
  }

  try {
    const uploaded = await uploadImageFile(file, folder);
    return NextResponse.json(uploaded);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    console.error("[admin/upload]", message);
    const status =
      message.includes("BLOB_READ_WRITE_TOKEN") ||
      message.includes("Vercel Blob")
        ? 503
        : 400;
    return jsonError(message, status);
  }
}
