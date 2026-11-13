import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdminApi } from "@/lib/admin-api-auth";
import {
  buildPaginationMeta,
  parseAdminPage,
  parseAdminPageSize,
} from "@/lib/admin-pagination";

export async function GET(request: Request) {
  const { error } = await requireAdminApi();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status")?.trim();
  const source = searchParams.get("source")?.trim();
  const q = searchParams.get("q")?.trim();
  const page = parseAdminPage(searchParams);
  const pageSize = parseAdminPageSize(searchParams);

  const where: Prisma.PackageInquiryWhereInput = {
    deletedAt: null,
    ...(status ? { status } : {}),
    ...(source ? { source } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
            { message: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  if (page === null) {
    const inquiries = await prisma.packageInquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ inquiries });
  }

  const total = await prisma.packageInquiry.count({ where });
  const pagination = buildPaginationMeta(total, page, pageSize);
  const inquiries = await prisma.packageInquiry.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (pagination.page - 1) * pagination.pageSize,
    take: pagination.pageSize,
  });

  return NextResponse.json({ inquiries, pagination });
}
