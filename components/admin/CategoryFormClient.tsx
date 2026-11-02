"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import {
  AdminCard,
  AdminPageHeader,
  adminInputClass,
  adminLabelClass,
  adminPageClass,
  adminCancelButtonClass,
  adminPrimaryButtonClass,
  adminSecondaryButtonClass,
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
  description: string | null;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  sortOrder: number;
  published: boolean;
};

export function CategoryFormClient({ category }: { category?: Category }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);
  const [cover, setCover] = useState<CoverUploadState>({
    file: null,
    previewUrl: category?.coverImageUrl ?? null,
    removed: false,
  });

  async function save(published: boolean) {
    const form = formRef.current;
    if (!form) return;

    setSaving(published ? "publish" : "draft");
    setError("");

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const description = String(data.get("description") || "");

    if (name.length < 2) {
      setError("Name must be at least 2 characters.");
      setSaving(null);
      return;
    }

    try {
      let coverImageUrl = cover.removed ? "" : (category?.coverImageUrl ?? "");
      if (cover.file) {
        coverImageUrl = await uploadAdminCover(cover.file, "categories");
      }

      const payload = {
        name,
        kind: category?.kind ?? "CUSTOM",
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
        description="Categories power filters and package groupings on the public site."
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
