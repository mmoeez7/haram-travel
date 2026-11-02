"use client";

import Link from "next/link";
import { Loader2, Plus } from "lucide-react";
import { useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { adminGoldButtonClass } from "@/components/admin/admin-ui";

type AdminLoadingLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  pendingLabel?: string;
  showPlus?: boolean;
};

export function AdminLoadingLink({
  href,
  children,
  className = adminGoldButtonClass,
  pendingLabel,
  showPlus = true,
}: AdminLoadingLinkProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Link
      href={href}
      onClick={(event) => {
        event.preventDefault();
        startTransition(() => {
          router.push(href);
        });
      }}
      aria-disabled={pending}
      className={`${className} gap-2 ${pending ? "pointer-events-none opacity-80" : ""}`}
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          {pendingLabel ?? children}
        </>
      ) : (
        <>
          {showPlus ? <Plus className="h-4 w-4" aria-hidden strokeWidth={2.5} /> : null}
          {children}
        </>
      )}
    </Link>
  );
}
