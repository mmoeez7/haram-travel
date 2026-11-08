import { PrismaClient } from "@prisma/client";
import { sanitizeSeoHtml } from "../lib/sanitize-html";

const prisma = new PrismaClient();

const IMPORT_MAP: Array<{ path: string; slug: string }> = [
  { path: "/3-star-umrah-packages/", slug: "3-star" },
  { path: "/4-star-umrah-packages/", slug: "4-star" },
  { path: "/5-star-umrah-packages/", slug: "5-star" },
  { path: "/january-umrah-package/", slug: "january" },
  { path: "/february-umrah-package/", slug: "february" },
  { path: "/easter-umrah-package/", slug: "easter" },
  { path: "/ramadan-umrah-package/", slug: "ramadan" },
  { path: "/september-umrah-package/", slug: "september" },
  { path: "/october-umrah-package/", slug: "october" },
  { path: "/november-umrah-package/", slug: "november" },
  { path: "/december-umrah-package/", slug: "december" },
  { path: "/umrah-packages/", slug: "umrah-packages" },
];

const BASE = "https://haramtravel.uk";

function decodeEntities(text: string) {
  return text
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8230;/g, "…")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function cleanInline(html: string) {
  return decodeEntities(
    html
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<\/?(strong|b)>/gi, (m) =>
        m.startsWith("</") ? "</strong>" : "<strong>"
      )
      .replace(/<\/?(em|i)>/gi, (m) => (m.startsWith("</") ? "</em>" : "<em>"))
      .replace(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi, '<a href="$1">')
      .replace(/<\/a>/gi, "</a>")
      .replace(/<(?!\/?(?:strong|em|a)\b)[^>]+>/gi, "")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function extractArticleHtml(pageHtml: string): string {
  const startMatchers = [
    /Customize Your Umrah/i,
    /Affordable \d[\s-]*Star Umrah/i,
    /\d[\s-]*Star Umrah Package/i,
    /Umrah Packages from/i,
    /<h1\b/i,
  ];

  let start = -1;
  for (const pattern of startMatchers) {
    const idx = pageHtml.search(pattern);
    if (idx >= 0) {
      start = pageHtml.lastIndexOf("<", idx);
      if (start < 0) start = idx;
      break;
    }
  }
  if (start < 0) return "";

  const endMatchers = [
    /Get Discounted Deals/i,
    /Get in Touch/i,
    /Sign up with your email/i,
    /<footer\b/i,
  ];
  let end = pageHtml.length;
  for (const pattern of endMatchers) {
    const idx = pageHtml.slice(start).search(pattern);
    if (idx > 500) {
      end = start + idx;
      break;
    }
  }

  const slice = pageHtml.slice(start, end);
  const blocks: string[] = [];
  const seen = new Set<string>();

  const tagRe =
    /<(h[1-6]|p)(\s[^>]*)?>([\s\S]*?)<\/\1>/gi;
  let match: RegExpExecArray | null;
  while ((match = tagRe.exec(slice))) {
    const tag = match[1].toLowerCase();
    const inner = cleanInline(match[3]);
    if (!inner || inner.length < 2) continue;

    // Skip CTA button labels and tiny fragments.
    if (
      /^(customize your umrah journey|book now|view package|learn more)$/i.test(
        inner
      )
    ) {
      continue;
    }

    const key = `${tag}:${inner.slice(0, 80).toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);

    blocks.push(`<${tag}>${inner}</${tag}>`);
  }

  return blocks.join("\n");
}

async function fetchHtml(path: string) {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (compatible; HaramTravelImporter/1.0; +https://haramtravel.uk)",
      accept: "text/html",
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${path}`);
  }
  return res.text();
}

async function main() {
  let updated = 0;
  let skipped = 0;

  for (const item of IMPORT_MAP) {
    const category = await prisma.category.findFirst({
      where: { slug: item.slug, deletedAt: null },
      select: { id: true, name: true, slug: true },
    });
    if (!category) {
      console.warn(`Skip ${item.slug}: category not found`);
      skipped += 1;
      continue;
    }

    try {
      const pageHtml = await fetchHtml(item.path);
      const article = extractArticleHtml(pageHtml);
      const seoContent = sanitizeSeoHtml(article);
      if (!seoContent || seoContent.length < 200) {
        console.warn(
          `Skip ${item.slug}: extracted content too short (${seoContent.length} chars)`
        );
        skipped += 1;
        continue;
      }

      await prisma.category.update({
        where: { id: category.id },
        data: { seoContent },
      });
      console.log(
        `Updated ${category.slug} (${category.name}) — ${seoContent.length} chars`
      );
      updated += 1;
    } catch (err) {
      console.error(
        `Failed ${item.slug}:`,
        err instanceof Error ? err.message : err
      );
      skipped += 1;
    }
  }

  console.log(`Done. Updated ${updated}, skipped ${skipped}.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
