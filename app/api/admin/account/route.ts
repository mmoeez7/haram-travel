import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminApi, jsonError } from "@/lib/admin-api-auth";

/** Current logged-in admin profile */
export async function GET() {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error;

  const admin = await prisma.adminUser.findFirst({
    where: { id: session.user.id, deletedAt: null, isActive: true },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });
  if (!admin) return jsonError("Admin account not found", 404);

  return NextResponse.json({ user: admin });
}
