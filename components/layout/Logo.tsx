import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  className?: string;
  priority?: boolean;
};

export function Logo({ className = "", priority = false }: LogoProps) {
  return (
    <Link href="/" className={`inline-flex items-center ${className}`} aria-label="Haram Travel home">
      <Image
        src="/images/haram-travel-logo.png"
        alt="Haram Travel — Trusted Umrah, Seamless Journey"
        width={220}
        height={64}
        priority={priority}
        className="h-10 w-auto md:h-12"
      />
    </Link>
  );
}
