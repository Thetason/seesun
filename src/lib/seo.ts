import type { Metadata } from "next";
import { BRAND, SITE_URL } from "@/lib/site";

// Single swap point for the share card. Replace with a 1200x630 asset when one
// exists — every page inherits it through buildMetadata().
export const OG_IMAGE = "/og-main-v2.png";

/** Absolute URL for a site-relative path. Root resolves without a trailing slash. */
export function absoluteUrl(path: string): string {
  if (path === "/" || path === "") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Stable @id anchors for the global entity graph. */
export const SCHEMA_ID = {
  website: `${SITE_URL}/#website`,
  organization: `${SITE_URL}/#organization`,
  person: `${SITE_URL}/#person`,
  offerCatalog: `${SITE_URL}/#offercatalog`,
} as const;

export type PageSeo = {
  /** Site-relative path, e.g. "/signature". Drives canonical and og:url. */
  path: string;
  /** Page title without the brand suffix — the root template appends it. */
  title: string;
  description: string;
  keywords?: readonly string[];
  /** Overrides the template-appended brand suffix in <title>. */
  absoluteTitle?: boolean;
  ogType?: "website" | "article";
  image?: string;
  noIndex?: boolean;
};

/**
 * Builds page metadata with canonical, openGraph and twitter always populated.
 * Next.js replaces (not merges) the whole openGraph object per segment, so every
 * field a page needs must be emitted here — that is the bug this helper prevents.
 */
export function buildMetadata({
  path,
  title,
  description,
  keywords,
  absoluteTitle = false,
  ogType = "website",
  image = OG_IMAGE,
  noIndex = false,
}: PageSeo): Metadata {
  const ogTitle = absoluteTitle ? title : `${title} | ${BRAND.nameKo}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    ...(keywords?.length ? { keywords: [...keywords] } : {}),
    alternates: { canonical: path },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: ogTitle,
      description,
      url: path,
      siteName: BRAND.nameKo,
      type: ogType,
      locale: "ko_KR",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [image],
    },
  };
}

type BreadcrumbCrumb = { name: string; path: string };

/** Home is prepended automatically; pass the trail after it. */
export function buildBreadcrumb(path: string, trail: BreadcrumbCrumb[]) {
  const crumbs: BreadcrumbCrumb[] = [{ name: "홈", path: "/" }, ...trail];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(path)}#breadcrumb`,
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/**
 * BlogPosting for a content article. Author and publisher reference the global
 * entity graph by @id, so each article inherits the E-E-A-T of the Person node
 * (서영빈) and the Organization — a signal thin competitor pages lack.
 */
export function buildArticleSchema({
  path,
  title,
  description,
  published,
  updated,
  keywords,
}: {
  path: string;
  title: string;
  description: string;
  published: string;
  updated?: string;
  keywords?: readonly string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${absoluteUrl(path)}#article`,
    headline: title,
    description,
    inLanguage: "ko-KR",
    datePublished: published,
    dateModified: updated ?? published,
    ...(keywords?.length ? { keywords: keywords.join(", ") } : {}),
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(path) },
    author: { "@id": SCHEMA_ID.person },
    publisher: { "@id": SCHEMA_ID.organization },
  };
}

export type FaqEntry = { q: string; a: string };

export function buildFaqSchema(path: string, entries: readonly FaqEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${absoluteUrl(path)}#faq`,
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.q,
      acceptedAnswer: { "@type": "Answer", text: entry.a },
    })),
  };
}

export function buildServiceSchema({
  path,
  name,
  serviceType,
  description,
  areaServed = ["성남시 분당구", "판교", "성남시", "용인시 수지구"],
}: {
  path: string;
  name: string;
  serviceType: string;
  description: string;
  areaServed?: readonly string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(path)}#service`,
    name,
    serviceType,
    description,
    url: absoluteUrl(path),
    provider: { "@id": SCHEMA_ID.organization },
    areaServed: [...areaServed],
  };
}

/** Serialize a JSON-LD graph for a <script type="application/ld+json"> tag. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data);
}
