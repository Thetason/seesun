import { docPath, docsOfKind } from "@/lib/content/registry";
import { absoluteUrl, RSS_PATH } from "@/lib/seo";
import { BRAND } from "@/lib/site";

export const dynamic = "force-static";

const FEED_LIMIT = 50;

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

// Dates in the registry are KST calendar days; 09:00 KST keeps the day stable
// in every reader's timezone.
function rfc822(isoDate: string): string {
  return new Date(`${isoDate}T09:00:00+09:00`).toUTCString();
}

export function GET(): Response {
  const docs = docsOfKind("guide")
    .toSorted((a, b) => b.published.localeCompare(a.published))
    .slice(0, FEED_LIMIT);

  const items = docs
    .map((doc) => {
      const url = absoluteUrl(docPath(doc));
      return `    <item>
      <title>${escapeXml(doc.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(doc.published)}</pubDate>
      <category>${escapeXml(doc.categoryLabel)}</category>
      <description>${escapeXml(doc.description)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${BRAND.nameKo} 발성 가이드`)}</title>
    <link>${absoluteUrl("/guide")}</link>
    <description>목조임, 고음, 호흡, 음정까지 성인 보컬 트레이닝 현장에서 확인한 발성 가이드</description>
    <language>ko</language>
    <atom:link href="${absoluteUrl(RSS_PATH)}" rel="self" type="application/rss+xml" />
${docs.length ? `    <lastBuildDate>${rfc822(docs[0].published)}</lastBuildDate>\n` : ""}${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
