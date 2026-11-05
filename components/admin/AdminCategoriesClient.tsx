"use client";

import Link from "next/link";
import { Copy, Pencil, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import {
  UMRAH_DEALS_ROOT_SLUG,
  UMRAH_PACKAGES_ROOT_SLUG,
  type UmrahRootSlug,
} from "@/lib/category-roots";
import {
  ADMIN_PAGE_SIZE,
  type AdminPaginationMeta,
} from "@/lib/admin-pagination";
import {
  AdminCard,
  AdminPageHeader,
  AdminTableSkeleton,
  adminDangerButtonClass,
  adminDuplicateButtonClass,
  adminEditLinkClass,
  adminPageClass,
  adminSelectClass,
  adminStatusDraftClass,
  adminStatusPublishedClass,
  adminTitleLinkClass,
} from "@/components/admin/admin-ui";
import { AdminLoadingLink } from "@/components/admin/AdminLoadingLink";
import { AdminAsyncButton } from "@/components/admin/AdminAsyncButton";
import { AdminPagination } from "@/components/admin/AdminPagination";

const filterControlClass =
  "h-10 w-full rounded-xl border border-border bg-white px-3.5 text-sm text-ink outline-none ring-gold transition focus:ring-2";

type Category = {
  id: string;
  name: string;
  slug: string;
  published: boolean;
  parentId: string | null;
  parent: { id: string; name: string; slug: string } | null;
  _count?: { children: number };
};

const emptyMeta: AdminPaginationMeta = {
  page: 1,
  pageSize: ADMIN_PAGE_SIZE,
  total: 0,
  totalPages: 1,
};

export function AdminCategoriesClient() {
  const [roots, setRoots] = useState<Category[]>([]);
  const [children, setChildren] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<AdminPaginationMeta>(emptyMeta);
  const [page, setPage] = useState(1);
  const [groupFilter, setGroupFilter] = useState<UmrahRootSlug>(
    UMRAH_PACKAGES_ROOT_SLUG
  );
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const activeRoot =
    roots.find((root) => root.slug === groupFilter) ?? null;

  async function loadRoots() {
    const data = await adminFetch<{ categories: Category[] }>(
      "/api/admin/categories?rootsOnly=1"
    );
    setRoots(
      data.categories.filter(
        (c) =>
          c.slug === UMRAH_PACKAGES_ROOT_SLUG || c.slug === UMRAH_DEALS_ROOT_SLUG
      )
    );
  }

  async function loadChildren(
    nextRoot = groupFilter,
    nextPage = page,
    nextQ = q
  ) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("root", nextRoot);
      params.set("page", String(nextPage));
      params.set("limit", String(ADMIN_PAGE_SIZE));
      if (nextQ.trim()) params.set("q", nextQ.trim());
      const data = await adminFetch<{
        categories: Category[];
        pagination: AdminPaginationMeta;
      }>(`/api/admin/categories?${params.toString()}`);
      setChildren(data.categories);
      setPagination(data.pagination ?? emptyMeta);
      setPage(data.pagination?.page ?? nextPage);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function boot() {
      try {
        await loadRoots();
        await loadChildren(UMRAH_PACKAGES_ROOT_SLUG, 1, "");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
        setLoading(false);
      }
    }
    void boot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function remove(id: string) {
    if (!confirm("Delete this category?")) return;
    try {
      await adminFetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      const nextPage =
        children.length === 1 && page > 1 ? page - 1 : page;
      setPage(nextPage);
      await loadChildren(groupFilter, nextPage, q);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  async function duplicate(id: string) {
    try {
      await adminFetch(`/api/admin/categories/${id}/duplicate`, {
        method: "POST",
      });
      setPage(1);
      await loadChildren(groupFilter, 1, q);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Duplicate failed");
    }
  }

  return (
    <div className={adminPageClass}>
      <AdminPageHeader
        title="Categories"
        description="Subcategories under Umrah Packages and Umrah Deals."
      />

      {error ? (
        <p className="mb-4 rounded-xl border border-call-border/30 bg-call px-3 py-2 text-sm text-call-border">
          {error}
        </p>
      ) : null}

      <form
        className="admin-enter admin-enter-delay-1 mb-3 flex flex-wrap items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          setPage(1);
          void loadChildren(groupFilter, 1, q);
        }}
      >
        <label className="relative block min-w-[220px] max-w-xs flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <input
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Search categories"
            className={`${filterControlClass} pl-9`}
            aria-label="Search categories"
          />
        </label>
        <select
          value={groupFilter}
          onChange={(event) => {
            const next = event.target.value as UmrahRootSlug;
            setGroupFilter(next);
            setPage(1);
            void loadChildren(next, 1, q);
          }}
          className={`${adminSelectClass} max-w-[220px]`}
          aria-label="Filter by group"
        >
          <option value={UMRAH_PACKAGES_ROOT_SLUG}>Umrah Packages</option>
          <option value={UMRAH_DEALS_ROOT_SLUG}>Umrah Deals</option>
        </select>
        <div className="ml-auto">
          <AdminLoadingLink href="/admin/categories/new" pendingLabel="Opening…">
            Add category
          </AdminLoadingLink>
        </div>
      </form>

      <AdminCard className="admin-enter admin-enter-delay-2">
        {loading ? (
          <AdminTableSkeleton rows={6} cols={5} />
        ) : !activeRoot ? (
          <p className="text-sm text-muted">Selected root group not found.</p>
        ) : (
          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2">
              <div>
                <h2 className="text-sm font-semibold text-charcoal">
                  <Link
                    href={`/admin/categories/${activeRoot.id}/view`}
                    className={adminTitleLinkClass}
                  >
                    {activeRoot.name}
                  </Link>
                </h2>
                <p className="text-xs text-muted">
                  Root group · {activeRoot.slug}
                </p>
              </div>
              <Link
                href={`/admin/categories/${activeRoot.id}`}
                className={adminEditLinkClass}
              >
                <Pencil className="h-3.5 w-3.5" aria-hidden />
                Edit root
              </Link>
            </div>

            {children.length === 0 ? (
              <p className="text-sm text-muted">No subcategories yet.</p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="border-b border-border text-[10px] uppercase tracking-wide text-muted">
                      <tr>
                        <th className="px-2 py-2">Name</th>
                        <th className="px-2 py-2">Slug</th>
                        <th className="px-2 py-2">Group</th>
                        <th className="px-2 py-2">Status</th>
                        <th className="px-2 py-2 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {children.map((category) => (
                        <tr key={category.id} className="border-b border-border/60">
                          <td className="px-2 py-3">
                            <Link
                              href={`/admin/categories/${category.id}/view`}
                              className={adminTitleLinkClass}
                            >
                              {category.name}
                            </Link>
                          </td>
                          <td className="px-2 py-3 text-muted">{category.slug}</td>
                          <td className="px-2 py-3">
                            <span className="inline-flex rounded-full bg-gold/10 px-2.5 py-0.5 text-[10px] font-semibold text-gold-dark">
                              {activeRoot.name}
                            </span>
                          </td>
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
                                onClick={() => duplicate(category.id)}
                                pendingLabel="Copying…"
                                idleIcon={<Copy className="h-3.5 w-3.5" />}
                                className={adminDuplicateButtonClass}
                              >
                                Duplicate
                              </AdminAsyncButton>
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
                <AdminPagination
                  meta={pagination}
                  disabled={loading}
                  onPageChange={(nextPage) => {
                    setPage(nextPage);
                    void loadChildren(groupFilter, nextPage, q);
                  }}
                />
              </>
            )}
          </div>
        )}
      </AdminCard>
    </div>
  );
}
