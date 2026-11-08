import { PrismaClient } from "@prisma/client";
import { sanitizeSeoHtml } from "../lib/sanitize-html";
import { slugify } from "../lib/slugify";
import {
  MAKKAH_COVER_IMAGES,
  MADINAH_COVER_IMAGES,
} from "../lib/package-cover-images";

const prisma = new PrismaClient();

const BASE = "https://haramtravel.uk";
const FALLBACK_COVERS = [...MAKKAH_COVER_IMAGES, ...MADINAH_COVER_IMAGES];

/** Known WP posts currently listed on /blogs/ */
const IMPORT_POSTS: Array<{ path: string; slug: string }> = [
  {
    path: "/2026/11/06/umrah-packages-2026-uk-for-a-comfortable-and-memorable-umrah-in-the-winter-season/",
    slug: "umrah-packages-2026-uk-for-a-comfortable-and-memorable-umrah-in-the-winter-season",
  },
  {
    path: "/2026/11/05/how-to-carry-umrah-lessons-into-daily-life-with-affordable-umrah-package-2026/",
    slug: "how-to-carry-umrah-lessons-into-daily-life-with-affordable-umrah-package-2026",
  },
  {
    path: "/2026/10/14/experience-the-importance-of-masjid-quba-with-cheap-umrah-packages-from-uk/",
    slug: "experience-the-importance-of-masjid-quba-with-cheap-umrah-packages-from-uk",
  },
  {
    path: "/2026/09/11/affordable-umrah-package-2026-for-a-blessed-spiritual-journey/",
    slug: "affordable-umrah-package-2026-for-a-blessed-spiritual-journey",
  },
  {
    path: "/2026/09/11/umrah-packages-2026-uk-for-a-peaceful-and-affordable-spiritual-journey/",
    slug: "umrah-packages-2026-uk-for-a-peaceful-and-affordable-spiritual-journey",
  },
];

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

function extractMeta(html: string, property: string) {
  const re = new RegExp(
    `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`,
    "i"
  );
  const alt = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`,
    "i"
  );
  return decodeEntities(html.match(re)?.[1] || html.match(alt)?.[1] || "");
}

function extractTitle(html: string) {
  const og = extractMeta(html, "og:title");
  if (og) return og.replace(/\s*[|\-–].*$/, "").trim() || og;
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
  if (h1) return cleanInline(h1);
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  return title ? decodeEntities(title.replace(/\s*[|\-–].*$/, "").trim()) : "";
}

function extractCover(html: string) {
  const og = extractMeta(html, "og:image");
  // Skip logos / trust badges — not useful as post covers.
  if (
    og &&
    !/trustpilot|logo|icon|sprite|avatar/i.test(og) &&
    /\.(jpe?g|png|webp)/i.test(og)
  ) {
    return og;
  }
  const match = html.match(
    /<img[^>]+(?:class=["'][^"']*wp-post-image[^"']*["'][^>]+src=["']([^"']+)["']|src=["']([^"']+)["'][^>]+class=["'][^"']*wp-post-image)/i
  );
  const src = match?.[1] || match?.[2] || "";
  if (src && !/trustpilot|logo|icon|sprite|avatar/i.test(src)) return src;
  return "";
}

function extractPublishedAt(html: string): Date | null {
  const articleTime = html.match(
    /<meta[^>]+property=["']article:published_time["'][^>]+content=["']([^"']+)["']/i
  )?.[1];
  const alt = html.match(
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']article:published_time["']/i
  )?.[1];
  const raw = articleTime || alt;
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

function extractArticleHtml(pageHtml: string): string {
  const startMatchers = [
    /Discover The Comfort/i,
    /Applying The Spiritual/i,
    /Explore The History/i,
    /Make Your Umrah Journey/i,
    /Plan Your 2026 Umrah/i,
    /<h2\b/i,
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
  const tagRe = /<(h[1-6]|p)(\s[^>]*)?>([\s\S]*?)<\/\1>/gi;
  let match: RegExpExecArray | null;
  while ((match = tagRe.exec(slice))) {
    const tag = match[1].toLowerCase();
    const inner = cleanInline(match[3]);
    if (!inner || inner.length < 2) continue;
    if (/^(read more|book now|learn more)$/i.test(inner)) continue;
    const key = `${tag}:${inner.slice(0, 80).toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    blocks.push(`<${tag}>${inner}</${tag}>`);
  }
  return blocks.join("\n");
}

function makeExcerpt(contentHtml: string, fallback: string) {
  const text = decodeEntities(contentHtml.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
  if (text.length >= 40) {
    return text.slice(0, 280).replace(/\s+\S*$/, "") + (text.length > 280 ? "…" : "");
  }
  return fallback.slice(0, 280);
}

async function fetchHtml(path: string) {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (compatible; HaramTravelImporter/1.0; +https://haramtravel.uk)",
      accept: "text/html",
    },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`);
  return { html: await res.text(), finalUrl: res.url };
}

async function resolvePostPath(item: { path: string; slug: string }) {
  try {
    const { html, finalUrl } = await fetchHtml(item.path);
    return { html, path: item.path, finalUrl };
  } catch {
    // Fall back to slug-only discovery from blogs index if dated URL moved.
    const index = await fetchHtml("/blogs/");
    const re = new RegExp(
      `https?:\\/\\/haramtravel\\.uk\\/[^\"']*${item.slug}\\/?`,
      "i"
    );
    const found = index.html.match(re)?.[0];
    if (!found) throw new Error(`Could not resolve URL for ${item.slug}`);
    const path = found.replace(BASE, "");
    const { html, finalUrl } = await fetchHtml(path);
    return { html, path, finalUrl };
  }
}

async function main() {
  let updated = 0;
  let skipped = 0;

  for (let index = 0; index < IMPORT_POSTS.length; index++) {
    const item = IMPORT_POSTS[index];
    try {
      const { html } = await resolvePostPath(item);
      const title = extractTitle(html) || item.slug.replace(/-/g, " ");
      const slug = slugify(item.slug) || item.slug;
      const content = sanitizeSeoHtml(extractArticleHtml(html));
      if (!content || content.length < 200) {
        console.warn(`Skip ${item.slug}: content too short (${content.length})`);
        skipped += 1;
        continue;
      }

      const metaDescription = extractMeta(html, "description");
      const fallback = FALLBACK_COVERS[index % FALLBACK_COVERS.length];
      const extractedCover = extractCover(html);
      const coverImageUrl = extractedCover || fallback.url;
      const coverImageAlt = extractedCover ? title : fallback.alt;
      const publishedAt = extractPublishedAt(html) ?? new Date();
      const excerpt = makeExcerpt(content, metaDescription || title);

      const existing = await prisma.blogPost.findFirst({
        where: { slug, deletedAt: null },
        select: { id: true, coverImageUrl: true, coverImageAlt: true },
      });

      const data = {
        title,
        slug,
        excerpt,
        content,
        // Keep an existing Makkah/Madinah cover if re-import finds none.
        coverImageUrl: extractedCover || existing?.coverImageUrl || coverImageUrl,
        coverImageAlt:
          extractedCover || existing?.coverImageUrl
            ? existing?.coverImageAlt || coverImageAlt
            : coverImageAlt,
        metaTitle: title,
        metaDescription: metaDescription || excerpt,
        published: true,
        publishedAt,
        sortOrder: 0,
      };

      if (existing) {
        await prisma.blogPost.update({ where: { id: existing.id }, data });
      } else {
        await prisma.blogPost.create({ data });
      }

      console.log(`Upserted ${slug} — ${content.length} chars`);
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
