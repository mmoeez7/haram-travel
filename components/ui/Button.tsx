import Link from "next/link";
import { type ReactNode } from "react";

type Variant = "gold" | "dark" | "whatsapp" | "outline" | "ghost";

const variants: Record<Variant, string> = {
  gold: "bg-gold text-white hover:bg-gold-dark shadow-sm",
  dark: "bg-charcoal text-white hover:bg-ink",
  whatsapp: "bg-whatsapp text-white hover:bg-whatsapp-dark",
  outline:
    "border border-border bg-white text-charcoal hover:border-gold hover:text-gold-dark",
  ghost: "bg-transparent text-charcoal hover:text-gold-dark",
};

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  target?: string;
  rel?: string;
};

export function Button({
  children,
  href,
  variant = "gold",
  className = "",
  type = "button",
  onClick,
  target,
  rel,
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold tracking-wide transition ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} target={target} rel={rel}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
