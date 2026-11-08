import type { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { slugify } from "@/lib/slugify";

export { slugify };

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/admin/login");
  }
  return session;
}

export async function writeAuditLog(input: {
  adminUserId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Prisma.InputJsonValue;
  ipAddress?: string | null;
}) {
  await prisma.adminAuditLog.create({
    data: {
      adminUserId: input.adminUserId ?? null,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId ?? null,
      metadata: input.metadata ?? {},
      ipAddress: input.ipAddress ?? null,
    },
  });
}

/** True if slug is already owned by another row (includes soft-deleted). */
export async function isSlugTaken(
  entity: "package" | "hotel" | "category" | "blog",
  slug: string,
  excludeId?: string
) {
  const notSelf = excludeId ? { id: { not: excludeId } } : {};
  if (entity === "package") {
    return Boolean(
      await prisma.package.findFirst({
        where: { slug, ...notSelf },
        select: { id: true },
      })
    );
  }
  if (entity === "hotel") {
    return Boolean(
      await prisma.hotel.findFirst({
        where: { slug, ...notSelf },
        select: { id: true },
      })
    );
  }
  if (entity === "blog") {
    return Boolean(
      await prisma.blogPost.findFirst({
        where: { slug, ...notSelf },
        select: { id: true },
      })
    );
  }
  return Boolean(
    await prisma.category.findFirst({
      where: { slug, ...notSelf },
      select: { id: true },
    })
  );
}
