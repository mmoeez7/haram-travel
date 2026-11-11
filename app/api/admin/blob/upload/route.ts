import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { requireAdminApi, jsonError } from "@/lib/admin-api-auth";
import { MAX_IMAGE_BYTES } from "@/lib/image-upload-limits";
import type { StorageFolder } from "@/lib/storage";

const FOLDERS = new Set<StorageFolder>([
  "packages",
  "hotels",
  "categories",
  "blogs",
]);

function parseFolder(clientPayload: string | null): StorageFolder {
  if (!clientPayload) return "packages";
  try {
    const parsed = JSON.parse(clientPayload) as { folder?: string };
    const folder = parsed.folder as StorageFolder | undefined;
    if (folder && FOLDERS.has(folder)) return folder;
  } catch {
    // ignore
  }
  return "packages";
}

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        const { error } = await requireAdminApi();
        if (error) {
          throw new Error("Unauthorized");
        }

        const folder = parseFolder(clientPayload);
        return {
          allowedContentTypes: ["image/webp"],
          maximumSizeInBytes: MAX_IMAGE_BYTES,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ folder }),
          // Force pathname under the folder so keys stay organized.
          // Client still passes a filename; suffix keeps uniqueness.
          allowOverwrite: false,
        };
      },
      onUploadCompleted: async () => {
        // DB updates happen on form save (after Prisma succeeds), not here.
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    const status = message === "Unauthorized" ? 401 : 400;
    return jsonError(message, status);
  }
}
