import { buildBreadcrumb, buildMetadata, jsonLd } from "@/lib/seo";
import SparkPageClient from "./SparkPageClient";

const PAGE_PATH = "/spark";

const PAGE_TITLE = "데일리 멤버십 — 매일 AI 루틴 + 주 1회 코치 피드백";
const PAGE_DESCRIPTION =
  "매일 아침 10분 보컬 루틴을 AI가 그 자리에서 분석하고, 주 1회 코치가 방향을 확정합니다. 혼자 연습해도 무너지지 않는 보컬 연습 루틴 — 데일리 구독 월 120,000원, 데일리 피드백 멤버십 월 200,000원 (VAT 포함).";

export const metadata = buildMetadata({
  path: PAGE_PATH,
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "보컬 연습 루틴",
    "매일 보컬 트레이닝",
    "온라인 보컬레슨",
    "AI 발성 분석",
    "보컬 독학",
    "분당 보컬 트레이닝",
  ],
});

const structuredData = [
  buildBreadcrumb(PAGE_PATH, [{ name: "데일리 멤버십", path: PAGE_PATH }]),
];

export default function SparkPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
      />
      <SparkPageClient />
    </>
  );
}
