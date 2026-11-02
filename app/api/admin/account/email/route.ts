import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { writeAuditLog } from "@/lib/admin";
import { requireAdminApi, jsonError } from "@/lib/admin-api-auth";

const changeEmailSchema = z
  .object({
    currentPassword: z.string().min(8),
    newEmail: z.string().email().max(190),
  })
  .transform((data) => ({
    ...data,
    newEmail: data.newEmail.toLowerCase().trim(),
  }));

export async function PATCH(request: Request) {
  const { session, error } = await requireAdminApi();
  if (error || !session) return error;

  const body = await request.json();
  const parsed = changeEmailSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid email payload");
  }

  const admin = await prisma.adminUser.findFirst({
    where: { id: session.user.id, deletedAt: null, isActive: true },
  });
  if (!admin) return jsonError("Admin account not found", 404);

  if (parsed.data.newEmail === admin.email) {
    return jsonError("New email must be different from the current email");
  }

  const valid = await bcrypt.compare(
    parsed.data.currentPassword,
    admin.passwordHash
  );
  if (!valid) return jsonError("Current password is incorrect", 403);

  const taken = await prisma.adminUser.findFirst({
    where: {
      email: parsed.data.newEmail,
      deletedAt: null,
      NOT: { id: admin.id },
    },
    select: { id: true },
  });
  if (taken) return jsonError("That email is already in use", 409);

  const updated = await prisma.adminUser.update({
    where: { id: admin.id },
    data: { email: parsed.data.newEmail },
    select: { id: true, email: true, name: true },
  });

  await writeAuditLog({
    adminUserId: admin.id,
    action: "ADMIN_EMAIL_CHANGE",
    entityType: "admin_user",
    entityId: admin.id,
    metadata: { from: admin.email, to: updated.email },
  });

  return Response.json({
    ok: true,
    message: "Email updated successfully. Sign in again with the new email.",
    reauthRequired: true,
    user: updated,
  });
}
