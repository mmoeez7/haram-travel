"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/admin-fetch";
import {
  AdminPageHeader,
  AdminStatCard,
  adminPageClass,
} from "@/components/admin/admin-ui";
import { AdminLoadingLink } from "@/components/admin/AdminLoadingLink";

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

  const featureLinks = [
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
    {
      href: "/admin/packages",
      title: "Packages",
      text: "Create and publish Umrah & Hajj packages with hotels and images.",
    },
  ];

  return (
    <div className={adminPageClass}>
      <AdminPageHeader
        title="Dashboard"
        description="Manage dynamic Haram Travel content from one workspace."
        actions={
          <AdminLoadingLink href="/admin/packages/new" pendingLabel="Opening…">
            Add package
          </AdminLoadingLink>
        }
      />

      {error ? (
        <p className="admin-enter admin-enter-delay-1 rounded-xl border border-call-border/30 bg-call px-3 py-2 text-sm text-call-border">
          {error}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <AdminStatCard
          className="admin-enter admin-enter-delay-1"
          label="Packages"
          value={stats?.packages ?? "—"}
          loading={!stats && !error}
        />
        <AdminStatCard
          className="admin-enter admin-enter-delay-2"
          label="Published"
          value={stats?.published ?? "—"}
          loading={!stats && !error}
        />
        <AdminStatCard
          className="admin-enter admin-enter-delay-3"
          label="Drafts"
          value={stats?.drafts ?? "—"}
          loading={!stats && !error}
        />
        <AdminStatCard
          className="admin-enter admin-enter-delay-4"
          label="Hotels"
          value={stats?.hotels ?? "—"}
          loading={!stats && !error}
        />
        <AdminStatCard
          className="admin-enter admin-enter-delay-5"
          label="Categories"
          value={stats?.categories ?? "—"}
          loading={!stats && !error}
        />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {featureLinks.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            className={`card-lift admin-enter admin-enter-delay-${index + 3} rounded-2xl border border-border bg-white p-5 transition hover:border-gold`}
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
