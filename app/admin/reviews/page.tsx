import { Suspense } from "react";
import { requireAdmin } from "@/lib/admin";
import { AdminReviewsClient } from "@/components/admin/AdminReviewsClient";
import { AdminTableSkeleton, adminPageClass } from "@/components/admin/admin-ui";

export default async function AdminReviewsPage() {
  await requireAdmin();
  return (
    <Suspense
      fallback={
        <div className={adminPageClass}>
          <AdminTableSkeleton rows={5} cols={4} />
        </div>
      }
    >
      <AdminReviewsClient />
    </Suspense>
  );
}
