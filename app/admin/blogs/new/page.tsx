import { requireAdmin } from "@/lib/admin";
import { BlogFormClient } from "@/components/admin/BlogFormClient";

export default async function NewBlogPage() {
  await requireAdmin();
  return <BlogFormClient />;
}
