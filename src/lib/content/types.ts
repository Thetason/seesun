import type { FaqEntry } from "@/lib/seo";

export type ContentKind = "guide" | "glossary" | "review";

export type ContentSection = {
  heading: string;
  /** Each string is one paragraph. */
  body: readonly string[];
};

// One content document — a guide, glossary term, or review. Adding an article
// means appending one of these to the matching data file; the route, metadata,
// schema, sitemap entry and internal links all follow automatically.
export type ContentDoc = {
  kind: ContentKind;
  /** ASCII slug — Korean folder routes 404 on Vercel; keywords live in title/body. */
  slug: string;
  category: string;
  categoryLabel: string;
  /** Keyword-first, matching the pattern that ranks: "[키워드], [베네핏]". */
  title: string;
  description: string;
  keywords: readonly string[];
  /** ISO date. Drives sitemap lastModified and article schema. */
  published: string;
  updated?: string;
  /** Opening paragraph shown under the H1. */
  lead: string;
  sections: readonly ContentSection[];
  faq?: readonly FaqEntry[];
  /** Slugs of related docs — powers hub-and-spoke internal linking. */
  related?: readonly string[];
  /** External sources cited at the end — grounds the article for E-E-A-T and AI citation. */
  references?: readonly { label: string; url: string }[];
};
