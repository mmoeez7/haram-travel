"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export function LoginSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-gold to-gold-dark px-4 py-3 text-sm font-semibold text-charcoal shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-80"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Signing in…
        </>
      ) : (
        "Sign in"
      )}
    </button>
  );
}
