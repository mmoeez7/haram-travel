"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import {
  UMRAH_DEALS_ROOT_SLUG,
  UMRAH_PACKAGES_ROOT_SLUG,
} from "@/lib/category-roots";
import {
  AdminCard,
  AdminPageHeader,
  adminInputClass,
  adminLabelClass,
  adminPageClass,
  adminCancelButtonClass,
  adminPrimaryButtonClass,
  adminSecondaryButtonClass,
  adminSelectClass,
} from "@/components/admin/admin-ui";
import {
  AdminCoverUpload,
  uploadAdminCover,
  type CoverUploadState,
} from "@/components/admin/AdminCoverUpload";

type Category = {
  id: string;
  name: string;
  slug: string;
  kind: string;
  parentId: string | null;
  description: string | null;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  sortOrder: number;
  published: boolean;
};

type RootOption = { id: string; name: string; slug: string };

export function CategoryFormClient({ category }: { category?: Category }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [roots, setRoots] = useState<RootOption[]>([]);
  const [cover, setCover] = useState<CoverUploadState>({
    file: null,
    previewUrl: category?.coverImageUrl ?? null,
    removed: false,
  });

  const isRoot =
    Boolean(category) &&
    category?.parentId === null &&
    (category?.slug === UMRAH_PACKAGES_ROOT_SLUG ||
      category?.slug === UMRAH_DEALS_ROOT_SLUG);

  useEffect(() => {
    async function loadRoots() {
      try {
        const data = await adminFetch<{ categories: RootOption[] }>(
          "/api/admin/categories?rootsOnly=1"
        );
        setRoots(
          data.categories.filter(
            (c) =>
              c.slug === UMRAH_PACKAGES_ROOT_SLUG || c.slug === UMRAH_DEALS_ROOT_SLUG
          )
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load parent groups");
      }
    }
    if (!isRoot) void loadRoots();
  }, [isRoot]);

  async function save(published: boolean) {
    const form = formRef.current;
    if (!form) return;

    setSaving(published ? "publish" : "draft");
    setError("");

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const description = String(data.get("description") || "");
    const parentId = String(data.get("parentId") || "");

    if (name.length < 2) {
      setError("Name must be at least 2 characters.");
      setSaving(null);
      return;
    }

    if (!isRoot && !parentId) {
      setError("Select a parent group.");
      setSaving(null);
      return;
    }

    try {
      let coverImageUrl = cover.removed ? "" : (category?.coverImageUrl ?? "");
      if (cover.file) {
        setUploadingCover(true);
        try {
          coverImageUrl = await uploadAdminCover(cover.file, "categories");
        } finally {
          setUploadingCover(false);
        }
      }

      const payload = {
        name,
        kind: category?.kind ?? "CUSTOM",
        parentId: isRoot ? null : parentId,
        description,
        coverImageUrl,
        coverImageAlt: name,
        sortOrder: category?.sortOrder ?? 0,
        published,
      };

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
      setSaving(null);
    }
  }

  const busy = saving !== null;

  return (
    <div className={adminPageClass}>
      <AdminPageHeader
        title={category ? "Edit category" : "New category"}
        description="Subcategories sit under Umrah Packages or Umrah Deals."
        showBack
      />
      <AdminCard className="max-w-2xl">
        {error ? (
          <p className="mb-4 rounded-xl border border-call-border/30 bg-call px-3 py-2 text-sm text-call-border">
            {error}
          </p>
        ) : null}

        <form
          ref={formRef}
          className="space-y-5"
          onSubmit={(event) => event.preventDefault()}
        >
          {!isRoot ? (
            <label className={adminLabelClass}>
              Parent group
              <select
                name="parentId"
                required
                defaultValue={category?.parentId ?? ""}
                className={adminSelectClass}
              >
                <option value="">Select group</option>
                {roots.map((root) => (
                  <option key={root.id} value={root.id}>
                    {root.name}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <p className="rounded-xl border border-border bg-cream/60 px-3 py-2 text-sm text-muted">
              Root group — packages must use a subcategory under this parent.
            </p>
          )}

          <label className={adminLabelClass}>
            Name
            <input
              name="name"
              required
              defaultValue={category?.name}
              className={adminInputClass}
            />
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

          <AdminCoverUpload
            initialUrl={category?.coverImageUrl}
            disabled={busy}
            uploading={uploadingCover}
            onChange={setCover}
            onError={setError}
          />

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              disabled={busy}
              onClick={() => void save(false)}
              className={adminSecondaryButtonClass}
            >
              {saving === "draft" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Saving…
                </>
              ) : (
                "Draft"
              )}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void save(true)}
              className={adminPrimaryButtonClass}
            >
              {saving === "publish" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Publishing…
                </>
              ) : (
                "Publish"
              )}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => router.push("/admin/categories")}
              className={adminCancelButtonClass}
            >
              Cancel
            </button>
          </div>
        </form>
      </AdminCard>
    </div>
  );
}
