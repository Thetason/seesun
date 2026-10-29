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

type ServiceLink = { href: string; label: string; description: string };

const VOCAL_CORRECTION: ServiceLink = {
  href: "/vocal-correction",
  label: "발성교정 · 목조임 레슨 안내",
  description: "목조임, 고음, 호흡처럼 소리를 내는 방식 자체를 바꾸는 1:1 수업이 어떻게 진행되는지 확인하세요.",
};
const ADULT_LESSON: ServiceLink = {
  href: "/adult-vocal-lesson",
  label: "성인 · 취미 보컬레슨 안내",
  description: "처음 배우는 성인과 직장인을 위한 1:1 수업의 구성과 시작 방법을 확인하세요.",
};
const BUNDANG_LESSON: ServiceLink = {
  href: "/bundang-vocal-lesson",
  label: "분당 보컬레슨 안내",
  description: "성남시 분당구에서 진행하는 1:1 보컬 트레이닝의 과정과 상담 방법을 확인하세요.",
};

const SERVICE_BY_CATEGORY: Record<string, ServiceLink> = {
  "throat-tension": VOCAL_CORRECTION,
  "high-notes-tension": VOCAL_CORRECTION,
  "vocal-correction-guide": VOCAL_CORRECTION,
  "voice-issues": VOCAL_CORRECTION,
  breathing: VOCAL_CORRECTION,
  registers: VOCAL_CORRECTION,
  "vocal-method": VOCAL_CORRECTION,
  "hobby-singing": ADULT_LESSON,
  "local-bundang": BUNDANG_LESSON,
};

/** The service page a guide should send readers to — links guides into the money pages. */
export function serviceLinkFor(doc: ContentDoc): ServiceLink {
  return serviceLinkForCategory(doc.category);
}

export function serviceLinkForCategory(category: string): ServiceLink {
  return SERVICE_BY_CATEGORY[category] ?? BUNDANG_LESSON;
}

/** Guides that point at a given service page, newest first — the reverse hub-and-spoke link. */
export function guidesForService(href: string, limit = 6): ContentDoc[] {
  return docsOfKind("guide")
    .filter((doc) => serviceLinkFor(doc).href === href)
    .sort((a, b) => (a.published < b.published ? 1 : -1))
    .slice(0, limit);
}
