import { NextResponse } from "next/server";
import { getTestimonialsPage } from "@/lib/testimonials";
import { TESTIMONIALS_PAGE_SIZE } from "@/lib/testimonial-types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const offsetRaw = Number(searchParams.get("offset") ?? 0);
  const limitRaw = Number(
    searchParams.get("limit") ?? TESTIMONIALS_PAGE_SIZE
  );

  const offset = Number.isFinite(offsetRaw) ? offsetRaw : 0;
  const limit = Number.isFinite(limitRaw) ? limitRaw : TESTIMONIALS_PAGE_SIZE;

  const page = await getTestimonialsPage({ offset, limit });
  return NextResponse.json(page);
}
