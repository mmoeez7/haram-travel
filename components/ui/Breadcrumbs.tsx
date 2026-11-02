import Link from "next/link";

type Crumb = { label: string; href?: string };

export function Breadcrumbs({
  items,
  tone = "default",
}: {
  items: Crumb[];
  tone?: "default" | "onDark";
}) {
  const onDark = tone === "onDark";

  return (
    <nav
      aria-label="Breadcrumb"
      className={`mb-4 text-sm ${onDark ? "text-white/75" : "text-muted"}`}
    >
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {i > 0 ? (
              <span className={onDark ? "text-white/40" : "text-border"}>/</span>
            ) : null}
            {item.href ? (
              <Link
                href={item.href}
                className={onDark ? "hover:text-gold-soft" : "hover:text-gold-dark"}
              >
                {item.label}
              </Link>
            ) : (
              <span className={onDark ? "text-white" : "text-charcoal"}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
