"use client";

import toast from "react-hot-toast";
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
import { AdminSlugField } from "@/components/admin/AdminSlugField";
import { AdminRichTextEditor } from "@/components/admin/AdminRichTextEditor";
import { SITE } from "@/lib/constants";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  sortOrder: number;
  published: boolean;
};

export function BlogFormClient({ post }: { post?: BlogPost }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [cover, setCover] = useState<CoverUploadState>({
    file: null,
    previewUrl: post?.coverImageUrl ?? null,
    removed: false,
  });
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [content, setContent] = useState(post?.content ?? "");

  const busy = saving !== null;

  async function save(published: boolean) {
    const form = formRef.current;
    if (!form) return;

    setSaving(published ? "publish" : "draft");

    const data = new FormData(form);
    const nextTitle = String(data.get("title") || title || "").trim();
    const excerpt = String(data.get("excerpt") || "");
    const metaTitle = String(data.get("metaTitle") || "");
    const metaDescription = String(data.get("metaDescription") || "");

    if (nextTitle.length < 2) {
      toast.error("Title must be at least 2 characters.");
      setSaving(null);
      return;
    }
    if (!slug.trim()) {
      toast.error("URL slug is required.");
      setSaving(null);
      return;
    }

    try {
      let coverImageUrl = cover.removed ? "" : (post?.coverImageUrl ?? "");
      if (cover.file) {
        setUploadingCover(true);
        try {
          coverImageUrl = await uploadAdminCover(cover.file, "blogs");
        } finally {
          setUploadingCover(false);
        }
      }

      const payload = {
        title: nextTitle,
        slug: slug.trim(),
        excerpt,
        content,
        coverImageUrl,
        coverImageAlt: nextTitle,
        metaTitle,
        metaDescription,
        sortOrder: post?.sortOrder ?? 0,
        published,
      };

      if (post) {
        await adminFetch(`/api/admin/blogs/${post.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch("/api/admin/blogs", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      toast.success(published ? "Blog published" : "Blog saved as draft");
      router.push("/admin/blogs");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
      setSaving(null);
    }
  }

  return (
    <div className={adminPageClass}>
      <AdminPageHeader
        title={post ? "Edit blog post" : "New blog post"}
        description="Write guides and articles for the public blogs section."
        showBack
      />
      <AdminCard className="max-w-4xl">

        <form
          ref={formRef}
          className="space-y-5"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className={adminLabelClass}>
            Title
            <input
              name="title"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className={adminInputClass}
            />
          </label>

          <AdminSlugField
            value={slug}
            source={title}
            disabled={busy}
            initiallyLocked={Boolean(post)}
            resetLabel="Reset from title"
            previewPath={(value) => {
              const path = value.replace(/^\/+/, "").replace(/\/+$/, "");
              return `${SITE.url}/blogs/${path}/`;
            }}
            hint="Lowercase letters, numbers, and hyphens."
            onChange={setSlug}
          />

          <label className={adminLabelClass}>
            Excerpt
            <textarea
              name="excerpt"
              rows={3}
              defaultValue={post?.excerpt ?? ""}
              className={adminInputClass}
              placeholder="Short summary shown on the blogs listing."
            />
          </label>

          <AdminCoverUpload
            initialUrl={post?.coverImageUrl}
            disabled={busy}
            uploading={uploadingCover}
            onChange={setCover}
            onError={(msg) => toast.error(msg)}
          />

          <label className={adminLabelClass}>
            Meta title
            <input
              name="metaTitle"
              defaultValue={post?.metaTitle ?? ""}
              className={adminInputClass}
              placeholder="Optional SEO title override"
            />
          </label>

          <label className={adminLabelClass}>
            Meta description
            <textarea
              name="metaDescription"
              rows={2}
              defaultValue={post?.metaDescription ?? ""}
              className={adminInputClass}
              placeholder="Optional SEO description"
            />
          </label>

          <div className="space-y-2">
            <div>
              <p className={adminLabelClass}>Content</p>
              <p className="mt-1 text-xs text-muted">
                Full article body. Use headings, bold, colors, and lists like a
                Word document.
              </p>
            </div>
            <AdminRichTextEditor
              value={content}
              onChange={setContent}
              disabled={busy}
            />
          </div>

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
              onClick={() => router.push("/admin/blogs")}
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
