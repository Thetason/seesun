import {
  buildBreadcrumb,
  buildFaqSchema,
  buildMetadata,
  buildServiceSchema,
  jsonLd,
  type FaqEntry,
} from "@/lib/seo";
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

// Single source for the visible FAQ section and the FAQPage markup — the client
// renders these exact strings, so the two can never drift apart.
const FAQ: readonly FaqEntry[] = [
  {
    q: "AI만으로도 되나요?",
    a: "AI는 매일의 교정을 맡습니다. 방향은 코치가 잡습니다. 일주일 치 데이터를 코치가 직접 보고 정밀 진단을 주기 때문에, 매일의 반복이 잘못된 길로 쌓이지 않습니다.",
  },
  {
    q: "피드백은 얼마나 자주 받나요?",
    a: "데일리는 코치가 주 1회 큐레이션 피드백을 드립니다. 데일리 피드백 멤버십은 1일 1회(영업일 기준)입니다.",
  },
  {
    q: "해지는 어떻게 하나요?",
    a: "월 단위 구독으로 언제든 해지할 수 있습니다. 자세한 기준은 환불 규정에서 확인하실 수 있습니다.",
  },
  {
    q: "시그니처로 바꾸면 어떻게 되나요?",
    a: "데일리에서 보낸 첫 달은 사라지지 않습니다. 구독 첫 30일 안에 시그니처로 입회하면 첫 달 구독료가 전액 차감됩니다.",
  },
];

// PRODUCTS["daily"] and PRODUCTS["daily-feedback"] share this path, so the page
// publishes one representative Service on their common serviceType. Both tiers'
// pricing stays in the global OfferCatalog.
const structuredData = [
  buildBreadcrumb(PAGE_PATH, [{ name: "데일리 멤버십", path: PAGE_PATH }]),
  buildServiceSchema({
    path: PAGE_PATH,
    name: PAGE_TITLE,
    serviceType: "보컬 트레이닝 구독",
    description: PAGE_DESCRIPTION,
  }),
  buildFaqSchema(PAGE_PATH, FAQ),
];

export default function SparkPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
      />
      <SparkPageClient faq={FAQ} />
    </>
  );
}
