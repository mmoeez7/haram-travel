"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import {
  AdminCard,
  AdminPageHeader,
  adminDangerButtonClass,
  adminGoldButtonClass,
  adminInputClass,
  adminPageClass,
  adminSecondaryButtonClass,
} from "@/components/admin/admin-ui";

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
        actions={
          <Link href="/admin/packages/new" className={adminGoldButtonClass}>
            Add package
          </Link>
        }
      />

      <form
        className="mb-4 flex flex-wrap gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          void load();
        }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search packages"
          className={`${adminInputClass} mt-0 max-w-xs`}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={`${adminInputClass} mt-0 max-w-[160px]`}
        >
          <option value="">All</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <button type="submit" className={adminSecondaryButtonClass}>
          Filter
        </button>
      </form>

      {error ? (
        <p className="mb-4 rounded-xl border border-call-border/30 bg-call px-3 py-2 text-sm text-call-border">
          {error}
        </p>
      ) : null}

      <AdminCard>
        {loading ? (
          <p className="text-sm text-muted">Loading packages…</p>
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
                  <th className="px-2 py-2">Actions</th>
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
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          pkg.published
                            ? "bg-forest/10 text-forest"
                            : "bg-cream-dark text-muted"
                        }`}
                      >
                        {pkg.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/packages/${pkg.id}`}
                          className="text-sm font-semibold text-gold-dark hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => void remove(pkg.id)}
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
