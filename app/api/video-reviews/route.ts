import { NextResponse } from "next/server";
import {
  getPublishedVideoReviewsPage,
  VIDEO_REVIEWS_PAGE_SIZE,
} from "@/lib/video-reviews";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const offsetRaw = Number(searchParams.get("offset") ?? 0);
  const limitRaw = Number(
    searchParams.get("limit") ?? VIDEO_REVIEWS_PAGE_SIZE
  );

  const offset = Number.isFinite(offsetRaw) ? offsetRaw : 0;
  const limit = Number.isFinite(limitRaw) ? limitRaw : VIDEO_REVIEWS_PAGE_SIZE;

  const page = await getPublishedVideoReviewsPage({ offset, limit });
  return NextResponse.json(page);
}
