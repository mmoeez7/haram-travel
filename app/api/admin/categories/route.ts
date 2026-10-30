import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminApi, jsonError } from "@/lib/admin-api-auth";
import { writeAuditLog, slugify } from "@/lib/admin";
import { categorySchema } from "@/lib/admin-schemas";

export async function GET() {
  const { error } = await requireAdminApi();
  if (error) return error;

  const categories = await prisma.category.findMany({
    where: { deletedAt: null },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error;

  const body = await request.json();
  const parsed = categorySchema.safeParse({
    ...body,
    slug: body.slug || slugify(String(body.name || "")),
  });
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid category");
  }

  const category = await prisma.category.create({
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      kind: parsed.data.kind,
      description: parsed.data.description || null,
      sortOrder: parsed.data.sortOrder,
      published: parsed.data.published,
    },
  });

  await writeAuditLog({
    adminUserId: session.user.id,
    action: "CATEGORY_CREATE",
    entityType: "category",
    entityId: category.id,
    metadata: { slug: category.slug },
  });

  return NextResponse.json({ category }, { status: 201 });
}
