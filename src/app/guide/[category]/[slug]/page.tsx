import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentArticle } from "@/components/content/ContentArticle";
import { docsOfKind, findDoc } from "@/lib/content/registry";
import { buildMetadata } from "@/lib/seo";

type Params = { category: string; slug: string };

export function generateStaticParams(): Params[] {
  return docsOfKind("guide").map((doc) => ({
    category: doc.category,
    slug: doc.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const doc = findDoc("guide", category, slug);
  if (!doc) return {};

  return buildMetadata({
    path: `/guide/${doc.category}/${doc.slug}`,
    title: doc.title,
    description: doc.description,
    keywords: doc.keywords,
    ogType: "article",
  });
}

export default async function GuidePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category, slug } = await params;
  const doc = findDoc("guide", category, slug);
  if (!doc) notFound();

  return <ContentArticle doc={doc} />;
}
