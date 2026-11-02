import { requireAdmin } from "@/lib/admin";
import { AdminAccountClient } from "@/components/admin/AdminAccountClient";

export default async function AdminAccountPage() {
  const session = await requireAdmin();
  return (
    <AdminAccountClient
      initialUser={{
        name: session.user.name ?? "Admin",
        email: session.user.email ?? "",
      }}
    />
  );
}
