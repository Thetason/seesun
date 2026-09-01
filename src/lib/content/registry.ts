import { GUIDES } from "@/lib/content/guides";
import type { ContentDoc, ContentKind } from "@/lib/content/types";

// Single source for all content. New kinds (reviews, glossary) merge in here.
const ALL: readonly ContentDoc[] = [...GUIDES];

export function docsOfKind(kind: ContentKind): readonly ContentDoc[] {
  return ALL.filter((doc) => doc.kind === kind);
}

export function findDoc(
  kind: ContentKind,
  category: string,
  slug: string
): ContentDoc | undefined {
  return ALL.find(
    (doc) => doc.kind === kind && doc.category === category && doc.slug === slug
  );
}

/** Groups a kind's docs by category, preserving first-seen category order. */
export function docsByCategory(
  kind: ContentKind
): { category: string; label: string; docs: ContentDoc[] }[] {
  const groups = new Map<string, { label: string; docs: ContentDoc[] }>();
  for (const doc of docsOfKind(kind)) {
    const group = groups.get(doc.category);
    if (group) group.docs.push(doc);
    else groups.set(doc.category, { label: doc.categoryLabel, docs: [doc] });
  }
  return [...groups].map(([category, g]) => ({ category, ...g }));
}

export function relatedDocs(doc: ContentDoc): ContentDoc[] {
  if (!doc.related?.length) return [];
  return doc.related
    .map((slug) => ALL.find((d) => d.slug === slug))
    .filter((d): d is ContentDoc => d !== undefined);
}

/** Path for a doc, keyed by kind. */
export function docPath(doc: ContentDoc): string {
  const base = doc.kind === "guide" ? "/guide" : `/${doc.kind}`;
  return `${base}/${doc.category}/${doc.slug}`;
}
