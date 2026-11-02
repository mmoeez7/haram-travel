"use client";

import Link from "next/link";
import { Pencil, Search, Trash2 } from "lucide-react";
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

const filterControlClass =
  "h-10 w-full rounded-xl border border-border bg-white px-3.5 text-sm text-ink outline-none ring-gold transition focus:ring-2";

const filterSelectClass =
  "admin-select h-10 w-full rounded-xl border border-border px-3.5 text-sm text-ink outline-none ring-gold transition focus:ring-2";

type PackageRow = {
  id: string;
  title: string;
  journeyType: string;
  stars: number;
  priceFrom: string | number;
  published: boolean;
};

export function AdminPackagesClient() {
  const [packages, setPackages] = useState<PackageRow[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load(nextQ = q, nextStatus = status) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (nextQ) params.set("q", nextQ);
      if (nextStatus) params.set("status", nextStatus);
      const data = await adminFetch<{ packages: PackageRow[] }>(
        `/api/admin/packages?${params.toString()}`
      );
      setPackages(data.packages);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function remove(id: string) {
    if (!confirm("Delete this package?")) return;
    await adminFetch(`/api/admin/packages/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className={adminPageClass}>
      <AdminPageHeader
        title="Packages"
        description="Create and publish Umrah and Hajj packages."
      />

      <form
        className="admin-enter admin-enter-delay-1 mb-4 flex flex-wrap items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          void load();
        }}
      >
        <label className="relative block min-w-[220px] max-w-xs flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search packages"
            className={`${filterControlClass} pl-9`}
          />
        </label>
        <select
          value={status}
          onChange={(e) => {
            const nextStatus = e.target.value;
            setStatus(nextStatus);
            void load(q, nextStatus);
          }}
          className={`${filterSelectClass} max-w-[180px]`}
          aria-label="Filter by status"
        >
          <option value="">All</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <div className="ml-auto">
          <AdminLoadingLink href="/admin/packages/new" pendingLabel="Opening…">
            Add package
          </AdminLoadingLink>
        </div>
      </form>

      {error ? (
        <p className="mb-4 rounded-xl border border-call-border/30 bg-call px-3 py-2 text-sm text-call-border">
          {error}
        </p>
      ) : null}

      <AdminCard className="admin-enter admin-enter-delay-2">
        {loading ? (
          <AdminTableSkeleton rows={7} cols={6} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-border text-[10px] uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-2 py-2">Title</th>
                  <th className="px-2 py-2">Type</th>
                  <th className="px-2 py-2">Stars</th>
                  <th className="px-2 py-2">Price</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg) => (
                  <tr key={pkg.id} className="border-b border-border/60">
                    <td className="px-2 py-3 font-medium text-charcoal">{pkg.title}</td>
                    <td className="px-2 py-3">{pkg.journeyType}</td>
                    <td className="px-2 py-3">{pkg.stars}★</td>
                    <td className="px-2 py-3">£{Number(pkg.priceFrom).toLocaleString()}</td>
                    <td className="px-2 py-3">
                      <span
                        className={
                          pkg.published
                            ? adminStatusPublishedClass
                            : adminStatusDraftClass
                        }
                      >
                        {pkg.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/packages/${pkg.id}`}
                          className={adminEditLinkClass}
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden />
                          Edit
                        </Link>
                        <AdminAsyncButton
                          onClick={() => remove(pkg.id)}
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
