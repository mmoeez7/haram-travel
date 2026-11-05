import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import {
  AdminEntityView,
  AdminPreviewHero,
  AdminPreviewSection,
  AdminViewStatus,
} from "@/components/admin/AdminEntityView";

export default async function ViewCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const category = await prisma.category.findFirst({
    where: { id, deletedAt: null },
    include: {
      parent: { select: { id: true, name: true, slug: true } },
      _count: { select: { children: true, packages: true } },
    },
  });
  if (!category) notFound();

  const eyebrow = category.parent?.name
    ? `${category.parent.name} · ${category.kind}`
    : `Root group · ${category.kind}`;

  return (
    <AdminEntityView
      title="Category preview"
      description="How this category appears across the site."
      editHref={`/admin/categories/${category.id}`}
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <AdminPreviewHero
          imageUrl={category.coverImageUrl}
          imageAlt={category.coverImageAlt || category.name}
          eyebrow={eyebrow}
          title={category.name}
          intro={
            category.description?.trim() ||
            "Category used for navigation and package grouping."
          }
          status={<AdminViewStatus published={category.published} />}
          meta={
            <div className="flex flex-wrap gap-2 text-xs text-muted">
              <span className="rounded-full bg-cream px-2.5 py-1 font-medium text-ink">
                {category.slug}
              </span>
              <span className="rounded-full bg-cream px-2.5 py-1 font-medium text-ink">
                Sort {category.sortOrder}
              </span>
            </div>
          }
        />

        <aside className="space-y-4 rounded-2xl border border-border bg-white p-5 shadow-sm">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Parent group</p>
            <p className="mt-1 text-sm font-medium text-charcoal">
              {category.parent?.name ?? "Root group"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Subcategories</p>
            <p className="mt-1 font-display text-3xl font-semibold text-charcoal">
              {category._count.children}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Linked packages</p>
            <p className="mt-1 font-display text-3xl font-semibold text-charcoal">
              {category._count.packages}
            </p>
          </div>
        </aside>
      </div>

      <AdminPreviewSection title="Description">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <p className="whitespace-pre-line text-sm leading-relaxed text-muted md:text-base">
            {category.description?.trim() || "No description added yet."}
          </p>
        </div>
      </AdminPreviewSection>
    </AdminEntityView>
  );
}
