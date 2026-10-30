"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/admin-fetch";
import {
  AdminPageHeader,
  AdminStatCard,
  adminGoldButtonClass,
  adminPageClass,
} from "@/components/admin/admin-ui";

type DashboardStats = {
  packages: number;
  hotels: number;
  categories: number;
  drafts: number;
  published: number;
};

export function AdminDashboardClient() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminFetch<DashboardStats>("/api/admin/dashboard")
      .then(setStats)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className={adminPageClass}>
      <AdminPageHeader
        title="Dashboard"
        description="Manage dynamic Haram Travel content from one workspace."
        actions={
          <Link href="/admin/packages/new" className={adminGoldButtonClass}>
            Add package
          </Link>
        }
      />

      {error ? (
        <p className="rounded-xl border border-call-border/30 bg-call px-3 py-2 text-sm text-call-border">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <AdminStatCard label="Packages" value={stats?.packages ?? "—"} />
        <AdminStatCard label="Published" value={stats?.published ?? "—"} />
        <AdminStatCard label="Drafts" value={stats?.drafts ?? "—"} />
        <AdminStatCard label="Hotels" value={stats?.hotels ?? "—"} />
        <AdminStatCard label="Categories" value={stats?.categories ?? "—"} />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          {
            href: "/admin/packages",
            title: "Packages",
            text: "Create and publish Umrah & Hajj packages with hotels and images.",
          },
          {
            href: "/admin/categories",
            title: "Categories",
            text: "Organize packages by star rating, season, and journey type.",
          },
          {
            href: "/admin/hotels",
            title: "Hotels",
            text: "Maintain Makkah and Madinah hotel inventory for packages.",
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl border border-border bg-white p-5 transition hover:border-gold"
          >
            <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-charcoal">
              {item.title}
            </h2>
            <p className="mt-2 text-sm text-muted">{item.text}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
