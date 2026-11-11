import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api-auth";

/** Admin-only diagnostic: does not reveal secret values. */
export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;

  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim() ?? "";
  const provider = process.env.STORAGE_PROVIDER?.trim() || "(unset)";

  return NextResponse.json({
    storageProvider: provider,
    hasBlobToken: token.length > 0,
    blobTokenLooksValid: token.startsWith("vercel_blob_rw_"),
    onVercel: process.env.VERCEL === "1",
    readyForUploads:
      token.length > 0 &&
      (provider === "vercel-blob" || provider === "(unset)" || Boolean(token)),
    hint: !token
      ? "Create a Blob store in Vercel → Storage, connect it to this project (adds BLOB_READ_WRITE_TOKEN), set STORAGE_PROVIDER=vercel-blob for Production, then Redeploy."
      : provider === "local"
        ? "STORAGE_PROVIDER is still local. Change it to vercel-blob for Production and Redeploy."
        : "Blob looks configured. Try uploading again.",
  });
}
