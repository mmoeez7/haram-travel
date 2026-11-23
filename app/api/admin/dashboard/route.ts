import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminApi } from "@/lib/admin-api-auth";

function pctDelta(current: number, previous: number) {
  if (previous <= 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function GET(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const rangeParam = searchParams.get("range");
  const rangeDays = rangeParam === "all" ? null : 30;

  const now = new Date();
  const rangeStart =
    rangeDays == null ? null : startOfDay(new Date(now.getTime() - rangeDays * 24 * 60 * 60 * 1000));
  const prevStart =
    rangeDays == null || !rangeStart
      ? null
      : startOfDay(new Date(rangeStart.getTime() - rangeDays * 24 * 60 * 60 * 1000));

  const inquiryBase = { deletedAt: null } as const;

  const reviewWhere = { deletedAt: null, published: true } as const;

  const [
    bookingsTotal,
    bookingsPrev,
    hotelsActive,
    hotelsPrev,
    packagesActive,
    packagesPrev,
    videoReviewsActive,
    textReviewsActive,
    videoReviewsPrev,
    textReviewsPrev,
    inquiriesInRange,
  ] = await Promise.all([
    prisma.packageInquiry.count({
      where: {
        ...inquiryBase,
        ...(rangeStart ? { createdAt: { gte: rangeStart } } : {}),
      },
    }),
    rangeStart && prevStart
      ? prisma.packageInquiry.count({
          where: {
            ...inquiryBase,
            createdAt: { gte: prevStart, lt: rangeStart },
          },
        })
      : Promise.resolve(0),
    prisma.hotel.count({ where: { deletedAt: null, published: true } }),
    // Hotels/packages deltas: published created in previous window vs current
    rangeStart && prevStart
      ? prisma.hotel.count({
          where: {
            deletedAt: null,
            published: true,
            createdAt: { gte: prevStart, lt: rangeStart },
          },
        })
      : Promise.resolve(0),
    prisma.package.count({ where: { deletedAt: null, published: true } }),
    rangeStart && prevStart
      ? prisma.package.count({
          where: {
            deletedAt: null,
            published: true,
            createdAt: { gte: prevStart, lt: rangeStart },
          },
        })
      : Promise.resolve(0),
    prisma.videoReview.count({ where: reviewWhere }),
    prisma.textReview.count({ where: reviewWhere }),
    rangeStart && prevStart
      ? prisma.videoReview.count({
          where: {
            ...reviewWhere,
            createdAt: { gte: prevStart, lt: rangeStart },
          },
        })
      : Promise.resolve(0),
    rangeStart && prevStart
      ? prisma.textReview.count({
          where: {
            ...reviewWhere,
            createdAt: { gte: prevStart, lt: rangeStart },
          },
        })
      : Promise.resolve(0),
    prisma.packageInquiry.findMany({
      where: {
        ...inquiryBase,
        createdAt: {
          gte:
            rangeStart ??
            startOfDay(new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000)),
        },
      },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const reviewsActive = videoReviewsActive + textReviewsActive;
  const reviewsPrev = videoReviewsPrev + textReviewsPrev;

  // Hotels/packages/reviews delta: compare counts created in current vs previous window
  const hotelsCurrentWindow =
    rangeStart == null
      ? hotelsActive
      : await prisma.hotel.count({
          where: {
            deletedAt: null,
            published: true,
            createdAt: { gte: rangeStart },
          },
        });
  const packagesCurrentWindow =
    rangeStart == null
      ? packagesActive
      : await prisma.package.count({
          where: {
            deletedAt: null,
            published: true,
            createdAt: { gte: rangeStart },
          },
        });
  const reviewsCurrentWindow =
    rangeStart == null
      ? reviewsActive
      : (
          await Promise.all([
            prisma.videoReview.count({
              where: { ...reviewWhere, createdAt: { gte: rangeStart } },
            }),
            prisma.textReview.count({
              where: { ...reviewWhere, createdAt: { gte: rangeStart } },
            }),
          ])
        ).reduce((a, b) => a + b, 0);

  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const trendStart =
    rangeStart ?? startOfDay(new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000));
  const trend: { label: string; count: number }[] = [];
  for (let i = 0; i < 4; i += 1) {
    const weekFrom = new Date(trendStart.getTime() + i * weekMs);
    const weekTo = new Date(trendStart.getTime() + (i + 1) * weekMs);
    const count = inquiriesInRange.filter(
      (row) => row.createdAt >= weekFrom && row.createdAt < weekTo
    ).length;
    trend.push({ label: `Week ${i + 1}`, count });
  }

  return NextResponse.json({
    bookingsTotal,
    hotelsActive,
    packagesActive,
    reviewsActive,
    bookingsDeltaPct: pctDelta(bookingsTotal, bookingsPrev),
    hotelsDeltaPct: pctDelta(hotelsCurrentWindow, hotelsPrev),
    packagesDeltaPct: pctDelta(packagesCurrentWindow, packagesPrev),
    reviewsDeltaPct: pctDelta(reviewsCurrentWindow, reviewsPrev),
    trend,
    range: rangeDays == null ? "all" : "30",
  });
}
