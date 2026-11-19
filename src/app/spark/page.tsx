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

const PAGE_TITLE = "데일리 — 매일 보컬 루틴 + 주 1회 코치 피드백";
const PAGE_DESCRIPTION =
  "매일 아침 10분 보컬 루틴을 AI가 바로 분석하고, 일주일에 한 번 세타쓴이 한 주치 녹음을 직접 듣고 방향을 잡아 드려요. 데일리 · 주 1회 피드백 월 120,000원, 데일리 · 매일 피드백 월 200,000원 (VAT 포함).";

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
    a: "매일 하는 확인은 AI가 맡고, 방향은 제가 잡아요. 한 주치 기록을 제가 직접 보고 진단해 드리니까, 매일 하는 연습이 엉뚱한 쪽으로 쌓이지 않아요.",
  },
  {
    q: "피드백은 얼마나 자주 받나요?",
    a: "데일리 · 주 1회 피드백은 일주일에 한 번, 데일리 · 매일 피드백은 영업일마다 하루 한 번 피드백을 드려요.",
  },
  {
    q: "해지는 어떻게 하나요?",
    a: "한 달 단위라 언제든 해지할 수 있어요. 자세한 기준은 환불 규정에서 확인하실 수 있어요.",
  },
  {
    q: "1:1 레슨으로 바꾸면 어떻게 되나요?",
    a: "데일리 시작 후 30일 안에 1:1 레슨으로 바꾸시면, 첫 달 데일리 금액은 전액 차감해 드려요.",
  },
];

// PRODUCTS["daily"] and PRODUCTS["daily-feedback"] share this path, so the page
// publishes one representative Service on their common serviceType. Both tiers'
// pricing stays in the global OfferCatalog.
const structuredData = [
  buildBreadcrumb(PAGE_PATH, [{ name: "데일리", path: PAGE_PATH }]),
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
