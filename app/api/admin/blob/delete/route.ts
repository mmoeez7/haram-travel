import { NextResponse } from "next/server";
import { requireAdminApi, jsonError } from "@/lib/admin-api-auth";
import { isVercelBlobUrl } from "@/lib/blob-urls";
import { deleteVercelBlobUrls } from "@/lib/storage";

export async function POST(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;

  const body = await request.json().catch(() => null);
  const urls = Array.isArray(body?.urls)
    ? body.urls.filter((u: unknown): u is string => typeof u === "string")
    : typeof body?.url === "string"
      ? [body.url]
      : [];

  const blobUrls = urls.filter(isVercelBlobUrl);
  if (!blobUrls.length) {
    return jsonError("No Vercel Blob URLs to delete");
  }

  await deleteVercelBlobUrls(blobUrls);
  return NextResponse.json({ ok: true, deleted: blobUrls.length });
}
