import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { writeAuditLog } from "@/lib/admin";
import { requireAdminApi, jsonError } from "@/lib/admin-api-auth";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(8).max(128),
    confirmPassword: z.string().min(8).max(128),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirmation do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from the current password",
    path: ["newPassword"],
  });

export async function PATCH(request: Request) {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error;

  const body = await request.json();
  const parsed = changePasswordSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid password payload");
  }

  const admin = await prisma.adminUser.findFirst({
    where: { id: session.user.id, deletedAt: null, isActive: true },
  });
  if (!admin) return jsonError("Admin account not found", 404);

  const valid = await bcrypt.compare(
    parsed.data.currentPassword,
    admin.passwordHash
  );
  if (!valid) return jsonError("Current password is incorrect", 403);

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { passwordHash },
  });

  await writeAuditLog({
    adminUserId: admin.id,
    action: "ADMIN_PASSWORD_CHANGE",
    entityType: "admin_user",
    entityId: admin.id,
  });

  return Response.json({
    ok: true,
    message: "Password updated successfully",
  });
}
