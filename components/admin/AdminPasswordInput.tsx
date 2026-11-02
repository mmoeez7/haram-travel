"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState, type InputHTMLAttributes } from "react";

const defaultInputClass =
  "w-full rounded-xl border border-border bg-white px-3.5 py-2 pr-10 text-sm text-ink outline-none ring-gold focus:ring-2";

type AdminPasswordInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  inputClassName?: string;
};

export function AdminPasswordInput({
  className,
  inputClassName = defaultInputClass,
  ...props
}: AdminPasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={`relative ${className ?? "mt-1"}`}>
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={inputClassName}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-1 text-muted transition hover:text-charcoal"
        aria-label={visible ? "Hide password" : "Show password"}
        tabIndex={-1}
      >
        {visible ? (
          <EyeOff className="h-4 w-4" aria-hidden />
        ) : (
          <Eye className="h-4 w-4" aria-hidden />
        )}
      </button>
    </div>
  );
}
