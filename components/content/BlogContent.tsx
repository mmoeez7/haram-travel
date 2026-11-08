import { sanitizeSeoHtml } from "@/lib/sanitize-html";

type BlogContentProps = {
  html: string | null | undefined;
};

export function BlogContent({ html }: BlogContentProps) {
  const clean = sanitizeSeoHtml(html);
  if (!clean) return null;

  return (
    <div
      className="blog-content space-y-4 text-base leading-relaxed text-muted [&_a]:text-gold [&_a]:underline [&_h1]:font-display [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:text-charcoal [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-charcoal [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-charcoal [&_h4]:font-semibold [&_h4]:text-charcoal [&_h5]:font-semibold [&_h5]:text-charcoal [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-3 [&_strong]:text-charcoal [&_ul]:list-disc [&_ul]:pl-5"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
