"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { adminInputClass, adminLabelClass } from "@/components/admin/admin-ui";

type AdminIncludesInputProps = {
  value: string[];
  disabled?: boolean;
  className?: string;
  onChange: (next: string[]) => void;
};

export function AdminIncludesInput({
  value,
  disabled = false,
  className = "",
  onChange,
}: AdminIncludesInputProps) {
  const [draft, setDraft] = useState("");

  function addItem() {
    const next = draft.trim();
    if (!next) return;
    if (value.some((item) => item.toLowerCase() === next.toLowerCase())) {
      setDraft("");
      return;
    }
    onChange([...value, next]);
    setDraft("");
  }

  function removeItem(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className={className}>
      <p className={adminLabelClass}>Includes</p>
      <p className="mt-1 text-xs text-muted">
        Add package inclusions shown with checkmarks on cards and detail pages.
      </p>

      {value.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {value.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/15 px-3 py-1.5 text-xs font-medium text-charcoal"
            >
              {item}
              <button
                type="button"
                disabled={disabled}
                onClick={() => removeItem(index)}
                className="inline-flex h-4 w-4 cursor-pointer items-center justify-center rounded-full text-muted transition hover:bg-charcoal/10 hover:text-charcoal disabled:cursor-not-allowed"
                aria-label={`Remove ${item}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          value={draft}
          disabled={disabled}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addItem();
            }
          }}
          placeholder="e.g., Transportation, Meals, Accommodation (Press Enter to add)"
          className={`${adminInputClass} sm:flex-1`}
        />
        <button
          type="button"
          disabled={disabled || !draft.trim()}
          onClick={addItem}
          className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl border border-gold/40 bg-gold/20 px-4 text-sm font-semibold text-charcoal transition hover:bg-gold/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Add
        </button>
      </div>
    </div>
  );
}
