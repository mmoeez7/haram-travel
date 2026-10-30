import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminApi, jsonError } from "@/lib/admin-api-auth";
import { writeAuditLog, slugify } from "@/lib/admin";
import { categorySchema } from "@/lib/admin-schemas";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { error } = await requireAdminApi();
  if (error) return error;
  const { id } = await params;

  const category = await prisma.category.findFirst({
    where: { id, deletedAt: null },
  });
  if (!category) return jsonError("Category not found", 404);
  return NextResponse.json({ category });
}

export async function PATCH(request: Request, { params }: Params) {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error;
  const { id } = await params;
  const body = await request.json();

  const parsed = categorySchema.safeParse({
    ...body,
    slug: body.slug || slugify(String(body.name || "")),
  });
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid category");
  }

  const existing = await prisma.category.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) return jsonError("Category not found", 404);

  const category = await prisma.category.update({
    where: { id },
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
    action: "CATEGORY_UPDATE",
    entityType: "category",
    entityId: category.id,
    metadata: { slug: category.slug },
  });

  return NextResponse.json({ category });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error;
  const { id } = await params;

  const existing = await prisma.category.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) return jsonError("Category not found", 404);

  await prisma.category.update({
    where: { id },
    data: { deletedAt: new Date(), published: false },
  });

  await writeAuditLog({
    adminUserId: session.user.id,
    action: "CATEGORY_DELETE",
    entityType: "category",
    entityId: id,
  });

  return NextResponse.json({ ok: true });
}
