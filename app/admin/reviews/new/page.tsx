import { requireAdmin } from "@/lib/admin";
import { ReviewFormClient } from "@/components/admin/ReviewFormClient";

export default async function NewReviewPage() {
  await requireAdmin();
  return <ReviewFormClient />;
}
