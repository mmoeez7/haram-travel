"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { adminFetch } from "@/lib/admin-fetch";
import { extractYoutubeId } from "@/lib/youtube";
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

type Review = {
  id: string;
  videoUrl: string;
  youtubeId: string;
  title: string;
  description: string;
  cta: string;
  sortOrder: number;
  published: boolean;
};

export function ReviewFormClient({ review }: { review?: Review }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);
  const [videoUrl, setVideoUrl] = useState(review?.videoUrl ?? "");

  const busy = saving !== null;
  const previewId = extractYoutubeId(videoUrl);

  async function save(published: boolean) {
    const form = formRef.current;
    if (!form) return;

    setSaving(published ? "publish" : "draft");

    const data = new FormData(form);
    const nextUrl = String(data.get("videoUrl") || videoUrl || "").trim();
    const description = String(data.get("description") || "").trim();

    if (!extractYoutubeId(nextUrl)) {
      toast.error("Enter a valid YouTube video link.");
      setSaving(null);
      return;
    }
    if (description.length < 2) {
      toast.error("Description must be at least 2 characters.");
      setSaving(null);
      return;
    }

    try {
      const payload = {
        videoUrl: nextUrl,
        description,
        title: review?.title || "Customer Umrah Experience",
        cta: review?.cta || "Watch Story",
        sortOrder: review?.sortOrder ?? 0,
        published,
      };

      if (review) {
        await adminFetch(`/api/admin/reviews/${review.id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        await adminFetch("/api/admin/reviews", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      toast.success(published ? "Review published" : "Review saved as draft");
      router.push("/admin/reviews");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
      setSaving(null);
    }
  }

  return (
    <div className={adminPageClass}>
      <AdminPageHeader
        title={review ? "Edit review" : "New review"}
        description="Paste a YouTube link and a short description for the video card."
        showBack
      />
      <AdminCard className="max-w-2xl">
        <form
          ref={formRef}
          className="space-y-5"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className={adminLabelClass}>
            Video link
            <input
              name="videoUrl"
              required
              value={videoUrl}
              onChange={(event) => setVideoUrl(event.target.value)}
              className={adminInputClass}
              placeholder="https://www.youtube.com/watch?v=…"
            />
          </label>

          {previewId ? (
            <p className="rounded-xl border border-border bg-cream/60 px-3 py-2 text-xs text-muted">
              YouTube ID detected:{" "}
              <span className="font-mono text-ink">{previewId}</span>
            </p>
          ) : null}

          <label className={adminLabelClass}>
            Description
            <textarea
              name="description"
              required
              rows={3}
              defaultValue={review?.description ?? ""}
              className={adminInputClass}
              placeholder="Short line shown under the video, e.g. Recorded Live in Madinah…"
            />
          </label>

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
              onClick={() => router.push("/admin/reviews")}
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
