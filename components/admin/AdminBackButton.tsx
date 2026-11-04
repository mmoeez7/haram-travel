"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function AdminBackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined" && window.history.length > 1) {
          router.back();
          return;
        }
        router.push("/admin");
      }}
      className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-gold hover:text-gold-dark"
    >
      <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
      Back
    </button>
  );
}
