import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminApi } from "@/lib/admin-api-auth";

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;

  const [packages, hotels, categories, drafts, published] = await Promise.all([
    prisma.package.count({ where: { deletedAt: null } }),
    prisma.hotel.count({ where: { deletedAt: null } }),
    prisma.category.count({ where: { deletedAt: null } }),
    prisma.package.count({ where: { deletedAt: null, published: false } }),
    prisma.package.count({ where: { deletedAt: null, published: true } }),
  ]);

  return NextResponse.json({
    packages,
    hotels,
    categories,
    drafts,
    published,
  });
}
