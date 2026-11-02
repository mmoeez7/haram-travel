"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import {
  AdminCard,
  AdminPageHeader,
  AdminTableSkeleton,
  adminDangerButtonClass,
  adminEditLinkClass,
  adminPageClass,
  adminStatusDraftClass,
  adminStatusPublishedClass,
} from "@/components/admin/admin-ui";
import { AdminLoadingLink } from "@/components/admin/AdminLoadingLink";
import { AdminAsyncButton } from "@/components/admin/AdminAsyncButton";

type Category = {
  id: string;
  name: string;
  slug: string;
  published: boolean;
};

export function AdminCategoriesClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await adminFetch<{ categories: Category[] }>("/api/admin/categories");
      setCategories(data.categories);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function remove(id: string) {
    if (!confirm("Delete this category?")) return;
    await adminFetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className={adminPageClass}>
      <AdminPageHeader
        title="Categories"
        description="Group packages by star, season, or journey."
      />

      {error ? (
        <p className="mb-4 rounded-xl border border-call-border/30 bg-call px-3 py-2 text-sm text-call-border">
          {error}
        </p>
      ) : null}

      <div className="admin-enter admin-enter-delay-1 mb-3 flex justify-end">
        <AdminLoadingLink href="/admin/categories/new" pendingLabel="Opening…">
          Add category
        </AdminLoadingLink>
      </div>

      <AdminCard className="admin-enter admin-enter-delay-2">
        {loading ? (
          <AdminTableSkeleton rows={6} cols={4} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-border text-[10px] uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-2 py-2">Name</th>
                  <th className="px-2 py-2">Slug</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b border-border/60">
                    <td className="px-2 py-3 font-medium text-charcoal">{category.name}</td>
                    <td className="px-2 py-3 text-muted">{category.slug}</td>
                    <td className="px-2 py-3">
                      <span
                        className={
                          category.published
                            ? adminStatusPublishedClass
                            : adminStatusDraftClass
                        }
                      >
                        {category.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/categories/${category.id}`}
                          className={adminEditLinkClass}
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden />
                          Edit
                        </Link>
                        <AdminAsyncButton
                          onClick={() => remove(category.id)}
                          pendingLabel="Deleting…"
                          idleIcon={<Trash2 className="h-3.5 w-3.5" />}
                          className={adminDangerButtonClass}
                        >
                          Delete
                        </AdminAsyncButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
}
