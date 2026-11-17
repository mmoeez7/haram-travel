import Link from "next/link";
import { type ReactNode } from "react";

type Variant = "gold" | "dark" | "whatsapp" | "call" | "outline" | "ghost" | "swipe";

const variants: Record<Variant, string> = {
  gold: "bg-gradient-to-l from-gold to-gold-dark text-charcoal shadow-sm hover:from-gold-dark hover:to-gold",
  dark: "bg-gradient-to-l from-gold to-gold-dark text-charcoal hover:from-gold-dark hover:to-gold",
  whatsapp: "bg-whatsapp text-white hover:bg-whatsapp-dark",
  call: "border border-call-border bg-call text-call-border hover:border-call-hover hover:bg-call-hover hover:text-white [&_svg]:text-call-border hover:[&_svg]:text-white",
  outline:
    "border border-border bg-white text-charcoal hover:border-gold hover:text-gold-dark",
  ghost: "bg-transparent text-charcoal hover:text-gold-dark",
  swipe:
    "relative overflow-hidden border border-gold bg-white text-gold-dark shadow-sm transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-gold before:transition-all before:duration-500 hover:text-charcoal hover:shadow-md hover:shadow-gold/30 hover:before:w-full",
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
  disabled?: boolean;
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
  disabled = false,
}: ButtonProps) {
  const isSwipe = variant === "swipe";
  const classes = `inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold tracking-wide transition ${variants[variant]} ${className} ${
    disabled ? "pointer-events-none opacity-60" : ""
  }`;

  const content = isSwipe ? (
    <span className="relative z-10 inline-flex items-center justify-center gap-2">
      {children}
    </span>
  ) : (
    children
  );

  if (href) {
    return (
      <Link href={href} className={classes} target={target} rel={rel}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {content}
    </button>
  );
}
