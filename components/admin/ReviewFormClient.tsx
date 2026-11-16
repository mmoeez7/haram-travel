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

export type ReviewKind = "video" | "text";

type VideoReview = {
  id: string;
  videoUrl: string;
  youtubeId: string;
  title: string;
  description: string;
  cta: string;
  sortOrder: number;
  published: boolean;
};

type TextReview = {
  id: string;
  title: string;
  name: string;
  initial: string;
  text: string;
  sortOrder: number;
  published: boolean;
};

type ReviewFormClientProps = {
  kind: ReviewKind;
  videoReview?: VideoReview;
  textReview?: TextReview;
};

export function ReviewFormClient({
  kind: initialKind,
  videoReview,
  textReview,
}: ReviewFormClientProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [kind, setKind] = useState<ReviewKind>(initialKind);
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);
  const [videoUrl, setVideoUrl] = useState(videoReview?.videoUrl ?? "");

  const busy = saving !== null;
  const isEditing = Boolean(videoReview || textReview);
  const previewId = extractYoutubeId(videoUrl);
  const lockedKind = isEditing;

  async function save(published: boolean) {
    const form = formRef.current;
    if (!form) return;

    setSaving(published ? "publish" : "draft");
    const data = new FormData(form);

    try {
      if (kind === "video") {
        const nextUrl = String(data.get("videoUrl") || videoUrl || "").trim();
        const description = String(data.get("description") || "").trim();
        const title = String(data.get("title") || "").trim();
        const cta = String(data.get("cta") || "").trim();

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

        const payload = {
          videoUrl: nextUrl,
          description,
          title: title || "Customer Umrah Experience",
          cta: cta || "Watch Story",
          sortOrder: videoReview?.sortOrder ?? 0,
          published,
        };

        if (videoReview) {
          await adminFetch(`/api/admin/reviews/${videoReview.id}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
          });
        } else {
          await adminFetch("/api/admin/reviews", {
            method: "POST",
            body: JSON.stringify(payload),
          });
        }
      } else {
        const title = String(data.get("title") || "").trim();
        const name = String(data.get("name") || "").trim();
        const initial = String(data.get("initial") || name.charAt(0) || "H")
          .trim()
          .slice(0, 2)
          .toUpperCase();
        const text = String(data.get("text") || "").trim();

        if (title.length < 2) {
          toast.error("Enter a review title.");
          setSaving(null);
          return;
        }
        if (name.length < 2) {
          toast.error("Enter the pilgrim name.");
          setSaving(null);
          return;
        }
        if (text.length < 10) {
          toast.error("Review text must be at least 10 characters.");
          setSaving(null);
          return;
        }

        const payload = {
          title,
          name,
          initial,
          text,
          sortOrder: textReview?.sortOrder ?? 0,
          published,
        };

        if (textReview) {
          await adminFetch(`/api/admin/text-reviews/${textReview.id}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
          });
        } else {
          await adminFetch("/api/admin/text-reviews", {
            method: "POST",
            body: JSON.stringify(payload),
          });
        }
      }

      toast.success(published ? "Review published" : "Review saved as draft");
      router.push(`/admin/reviews?type=${kind}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
      setSaving(null);
    }
  }

  return (
    <div className={adminPageClass}>
      <AdminPageHeader
        title={
          isEditing
            ? kind === "video"
              ? "Edit video review"
              : "Edit text review"
            : "New review"
        }
        description={
          kind === "video"
            ? "Paste a YouTube link and a short description for the video card."
            : "Add a written pilgrim review shown on the customer reviews page."
        }
        showBack
      />
      <AdminCard className="max-w-2xl">
        {!lockedKind ? (
          <div className="mb-5 flex flex-wrap gap-2">
            {(
              [
                { id: "video", label: "Video review" },
                { id: "text", label: "Text review" },
              ] as const
            ).map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setKind(option.id)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
                  kind === option.id
                    ? "border-gold bg-gold/15 text-gold-dark"
                    : "border-border bg-white text-muted hover:border-gold/50 hover:text-charcoal"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : null}

        <form
          ref={formRef}
          className="space-y-5"
          onSubmit={(event) => event.preventDefault()}
        >
          {kind === "video" ? (
            <>
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
                Title
                <input
                  name="title"
                  defaultValue={videoReview?.title ?? "Customer Umrah Experience"}
                  className={adminInputClass}
                  placeholder="Customer Umrah Experience"
                />
              </label>

              <label className={adminLabelClass}>
                Description
                <textarea
                  name="description"
                  required
                  rows={3}
                  defaultValue={videoReview?.description ?? ""}
                  className={adminInputClass}
                  placeholder="Short line shown under the video, e.g. Recorded Live in Madinah…"
                />
              </label>

              <label className={adminLabelClass}>
                Button label
                <input
                  name="cta"
                  defaultValue={videoReview?.cta ?? "Watch Story"}
                  className={adminInputClass}
                  placeholder="Watch Story"
                />
              </label>
            </>
          ) : (
            <>
              <label className={adminLabelClass}>
                Review title
                <input
                  name="title"
                  required
                  defaultValue={textReview?.title ?? ""}
                  className={adminInputClass}
                  placeholder="Exceptional Experience from Start to End!"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-[1fr_5rem]">
                <label className={adminLabelClass}>
                  Pilgrim name
                  <input
                    name="name"
                    required
                    defaultValue={textReview?.name ?? ""}
                    className={adminInputClass}
                    placeholder="Asma Faisal"
                  />
                </label>
                <label className={adminLabelClass}>
                  Initial
                  <input
                    name="initial"
                    maxLength={2}
                    defaultValue={textReview?.initial ?? ""}
                    className={adminInputClass}
                    placeholder="A"
                  />
                </label>
              </div>

              <label className={adminLabelClass}>
                Review text
                <textarea
                  name="text"
                  required
                  rows={5}
                  defaultValue={textReview?.text ?? ""}
                  className={adminInputClass}
                  placeholder="Write the pilgrim’s review…"
                />
              </label>
            </>
          )}

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
              onClick={() => router.push(`/admin/reviews?type=${kind}`)}
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
