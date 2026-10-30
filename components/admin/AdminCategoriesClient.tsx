"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import {
  AdminCard,
  AdminPageHeader,
  adminDangerButtonClass,
  adminGoldButtonClass,
  adminPageClass,
} from "@/components/admin/admin-ui";

type Category = {
  id: string;
  name: string;
  slug: string;
  kind: string;
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
        actions={
          <Link href="/admin/categories/new" className={adminGoldButtonClass}>
            Add category
          </Link>
        }
      />

      {error ? (
        <p className="mb-4 rounded-xl border border-call-border/30 bg-call px-3 py-2 text-sm text-call-border">
          {error}
        </p>
      ) : null}

      <AdminCard>
        {loading ? (
          <p className="text-sm text-muted">Loading categories…</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-border text-[10px] uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-2 py-2">Name</th>
                  <th className="px-2 py-2">Slug</th>
                  <th className="px-2 py-2">Kind</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b border-border/60">
                    <td className="px-2 py-3 font-medium text-charcoal">{category.name}</td>
                    <td className="px-2 py-3 text-muted">{category.slug}</td>
                    <td className="px-2 py-3">{category.kind}</td>
                    <td className="px-2 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          category.published
                            ? "bg-forest/10 text-forest"
                            : "bg-cream-dark text-muted"
                        }`}
                      >
                        {category.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/categories/${category.id}`}
                          className="text-sm font-semibold text-gold-dark hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => void remove(category.id)}
                          className={adminDangerButtonClass}
                        >
                          Delete
                        </button>
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
