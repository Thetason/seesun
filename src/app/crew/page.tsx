import type { Metadata } from "next";
import { buildBreadcrumb, buildMetadata, jsonLd } from "@/lib/seo";
import CrewPageClient from "./CrewPageClient";

const PAGE_PATH = "/crew";

export const metadata: Metadata = buildMetadata({
  path: PAGE_PATH,
  title: "아티스트웨이 크루 | 시선뮤직 아티스트클럽",
  absoluteTitle: true,
  description:
    "『아티스트웨이』 한 권으로 12주를 같이 걷는 시선뮤직 회원 모임. 매일 아침 모닝 페이지를 쓰고, 러닝·요가·미식·영화를 함께해요. 지원 → 선발 → 활동비(월 40,000원, VAT 포함).",
});

const structuredData = [
  buildBreadcrumb(PAGE_PATH, [{ name: "아티스트웨이 크루", path: PAGE_PATH }]),
];

export default function CrewPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
      />
      <CrewPageClient />
    </>
  );
}
