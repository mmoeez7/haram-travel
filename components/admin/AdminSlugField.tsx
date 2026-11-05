"use client";

import { useEffect, useState } from "react";
import { slugify } from "@/lib/slugify";
import { adminInputClass, adminLabelClass } from "@/components/admin/admin-ui";

type AdminSlugFieldProps = {
  value: string;
  source: string;
  disabled?: boolean;
  readOnly?: boolean;
  /** When true (edit mode), start locked so renaming is intentional. */
  initiallyLocked?: boolean;
  previewPath?: (slug: string) => string;
  hint?: string;
  resetLabel?: string;
  onChange: (slug: string) => void;
};

export function AdminSlugField({
  value,
  source,
  disabled = false,
  readOnly = false,
  initiallyLocked = false,
  previewPath,
  hint,
  resetLabel = "Reset from title",
  onChange,
}: AdminSlugFieldProps) {
  const [locked, setLocked] = useState(initiallyLocked || readOnly);

  useEffect(() => {
    if (readOnly || locked || disabled) return;
    const next = slugify(source);
    if (next && next !== value) onChange(next);
    // Only sync from source while unlocked
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, locked, readOnly, disabled]);

  function onSlugInput(raw: string) {
    if (readOnly || disabled) return;
    if (!locked) setLocked(true);
    // Keep a trailing "/" while typing so the next path segment can be added
    onChange(slugify(raw, { preserveTrailingSlash: true }));
  }

  function resetFromSource() {
    if (readOnly || disabled) return;
    setLocked(false);
    onChange(slugify(source));
  }

  // Show the live public URL from the raw slug (keeps mid-path "/").
  // WordPress-style trailing "/" is added by previewPath helpers.
  const preview = value
    ? previewPath
      ? previewPath(value)
      : value
    : null;

  return (
    <div>
      <div className="flex items-end justify-between gap-2">
        <p className={adminLabelClass}>URL slug</p>
        {!readOnly ? (
          <button
            type="button"
            disabled={disabled || !source.trim()}
            onClick={resetFromSource}
            className="cursor-pointer text-xs font-semibold text-call-border hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            {resetLabel}
          </button>
        ) : null}
      </div>
      <input
        value={value}
        disabled={disabled || readOnly}
        onChange={(event) => onSlugInput(event.target.value)}
        onBlur={() => {
          // Finalize without trailing slash for a clean stored URL
          if (value) onChange(slugify(value));
        }}
        placeholder="e.g. umrah/5-star-10-nights-umrah-package"
        className={`${adminInputClass} mt-1 font-mono text-sm`}
        autoComplete="off"
        spellCheck={false}
        aria-label="URL slug"
      />
      <p className="mt-1.5 text-xs text-muted">
        {hint ??
          "Use / between path segments (e.g. umrah/my-package). Lowercase letters, numbers, and hyphens only."}
      </p>
      {preview ? (
        <p className="mt-1 break-all font-mono text-xs text-charcoal/80">
          {preview}
        </p>
      ) : null}
      {initiallyLocked && locked && !readOnly ? (
        <p className="mt-1 text-xs text-muted">
          Changing a published slug will break existing links.
        </p>
      ) : null}
    </div>
  );
}
