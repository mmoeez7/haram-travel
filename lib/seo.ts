import type { Metadata } from "next";
import { SITE } from "./constants";

type PageSeo = {
  title: string;
  description: string;
  path: string;
  /** Use the title exactly as provided (no `| Haram Travel` suffix). */
  absolute?: boolean;
};

export function createMetadata({
  title,
  description,
  path,
  absolute = false,
}: PageSeo): Metadata {
  const url = `${SITE.url}${path === "/" ? "" : path}`;
  const fullTitle =
    absolute || path === "/" ? title : `${title} | ${SITE.name}`;

  return {
    title: absolute ? { absolute: fullTitle } : fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE.name,
      locale: "en_GB",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
