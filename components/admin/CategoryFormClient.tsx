"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import {
  AdminCard,
  AdminPageHeader,
  adminInputClass,
  adminLabelClass,
  adminPageClass,
  adminPrimaryButtonClass,
  adminSecondaryButtonClass,
} from "@/components/admin/admin-ui";

type Category = {
  id: string;
  name: string;
  slug: string;
  kind: string;
  description: string | null;
  sortOrder: number;
  published: boolean;
};

export function CategoryFormClient({ category }: { category?: Category }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      slug: String(form.get("slug") || ""),
      kind: String(form.get("kind") || "CUSTOM"),
      description: String(form.get("description") || ""),
      sortOrder: Number(form.get("sortOrder") || 0),
      published: form.get("published") === "on",
    };

    try {
      if (category) {
        await adminFetch(`/api/admin/categories/${category.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch("/api/admin/categories", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      router.push("/admin/categories");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={adminPageClass}>
      <AdminPageHeader
        title={category ? "Edit category" : "New category"}
        description="Categories power filters and package groupings on the public site."
      />
      <AdminCard className="max-w-2xl">
        {error ? (
          <p className="mb-4 rounded-xl border border-call-border/30 bg-call px-3 py-2 text-sm text-call-border">
            {error}
          </p>
        ) : null}
        <form onSubmit={onSubmit} className="space-y-4">
          <label className={adminLabelClass}>
            Name
            <input name="name" required defaultValue={category?.name} className={adminInputClass} />
          </label>
          <label className={adminLabelClass}>
            Slug
            <input name="slug" required defaultValue={category?.slug} className={adminInputClass} />
          </label>
          <label className={adminLabelClass}>
            Kind
            <select name="kind" defaultValue={category?.kind ?? "CUSTOM"} className={adminInputClass}>
              <option value="STAR">STAR</option>
              <option value="SEASON">SEASON</option>
              <option value="JOURNEY">JOURNEY</option>
              <option value="CUSTOM">CUSTOM</option>
            </select>
          </label>
          <label className={adminLabelClass}>
            Description
            <textarea
              name="description"
              rows={4}
              defaultValue={category?.description ?? ""}
              className={adminInputClass}
            />
          </label>
          <label className={adminLabelClass}>
            Sort order
            <input
              name="sortOrder"
              type="number"
              defaultValue={category?.sortOrder ?? 0}
              className={adminInputClass}
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-medium text-charcoal">
            <input name="published" type="checkbox" defaultChecked={category?.published ?? false} />
            Published
          </label>
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className={adminPrimaryButtonClass}>
              {saving ? "Saving…" : "Save category"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/categories")}
              className={adminSecondaryButtonClass}
            >
              Cancel
            </button>
          </div>
        </form>
      </AdminCard>
    </div>
  );
}
