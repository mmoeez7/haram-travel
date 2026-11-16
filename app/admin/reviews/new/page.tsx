import { requireAdmin } from "@/lib/admin";
import { ReviewFormClient, type ReviewKind } from "@/components/admin/ReviewFormClient";

type PageProps = {
  searchParams: Promise<{ type?: string }>;
};

export default async function NewReviewPage({ searchParams }: PageProps) {
  await requireAdmin();
  const params = await searchParams;
  const kind: ReviewKind = params.type === "text" ? "text" : "video";
  return <ReviewFormClient kind={kind} />;
}
