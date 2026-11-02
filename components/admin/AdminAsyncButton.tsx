"use client";

import { Loader2 } from "lucide-react";
import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";

type AdminAsyncButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick"
> & {
  onClick: () => void | Promise<void>;
  pendingLabel?: ReactNode;
  idleIcon?: ReactNode;
};

export function AdminAsyncButton({
  onClick,
  children,
  pendingLabel,
  idleIcon,
  className = "",
  disabled,
  type = "button",
  ...rest
}: AdminAsyncButtonProps) {
  const [pending, setPending] = useState(false);

  return (
    <button
      type={type}
      disabled={disabled || pending}
      className={`${className} gap-2`}
      onClick={() => {
        void (async () => {
          setPending(true);
          try {
            await onClick();
          } finally {
            setPending(false);
          }
        })();
      }}
      {...rest}
    >
      {pending ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
          {pendingLabel ?? children}
        </>
      ) : (
        <>
          {idleIcon}
          {children}
        </>
      )}
    </button>
  );
}
