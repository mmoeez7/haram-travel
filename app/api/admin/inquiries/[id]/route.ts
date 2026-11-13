import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminApi, jsonError } from "@/lib/admin-api-auth";
import { writeAuditLog } from "@/lib/admin";
import { packageInquiryStatusSchema } from "@/lib/admin-schemas";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error;
  const { id } = await params;

  const existing = await prisma.packageInquiry.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) return jsonError("Inquiry not found", 404);

  const body = await request.json();
  const parsed = packageInquiryStatusSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid status");
  }

  const inquiry = await prisma.packageInquiry.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  await writeAuditLog({
    adminUserId: session.user.id,
    action: "PACKAGE_INQUIRY_UPDATE",
    entityType: "package_inquiry",
    entityId: inquiry.id,
    metadata: { status: inquiry.status },
  });

  return NextResponse.json({ inquiry });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error;
  const { id } = await params;

  const existing = await prisma.packageInquiry.findFirst({
    where: { id, deletedAt: null },
  });
  if (!existing) return jsonError("Inquiry not found", 404);

  await prisma.packageInquiry.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  await writeAuditLog({
    adminUserId: session.user.id,
    action: "PACKAGE_INQUIRY_DELETE",
    entityType: "package_inquiry",
    entityId: id,
  });

  return NextResponse.json({ ok: true });
}
