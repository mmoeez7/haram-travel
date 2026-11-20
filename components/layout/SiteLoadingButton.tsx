"use client";

import { useRouter } from "next/navigation";
import { type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { showSiteLoader } from "@/components/layout/SiteLoader";

type SiteLoadingButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "gold" | "dark" | "whatsapp" | "call" | "outline" | "ghost" | "swipe";
  className?: string;
};

/** Button that shows the site refresh loader, then navigates. */
export function SiteLoadingButton({
  href,
  children,
  variant = "swipe",
  className = "",
}: SiteLoadingButtonProps) {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant={variant}
      className={className}
      onClick={() => {
        showSiteLoader();
        router.push(href);
      }}
    >
      {children}
    </Button>
  );
}
