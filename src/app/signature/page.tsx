import { buildBreadcrumb, buildFaqSchema, buildMetadata, buildServiceSchema, jsonLd } from "@/lib/seo";
import { SIGNATURE_FAQ } from "./faq";
import SignaturePageClient from "./SignaturePageClient";

const PAGE_PATH = "/signature";

const PAGE_TITLE = "1:1 레슨 주 1회 50분 — 분당 보컬레슨 세타쓴 직강";
const PAGE_DESCRIPTION =
  "유튜브 세타쓴 채널의 서영빈이 직접 하는 분당 1:1 보컬레슨. 깊은 발음으로 소리를 잡고, 노래하고, 레슨마다 녹음으로 확인해요. 주 1회 50분·월 4회, 월 440,000원(VAT 포함) · 3개월 정기결제 시 월 420,000원. 첫 레슨에서 달라지지 않으면 남은 3회분 환불.";

export const metadata = buildMetadata({
  path: PAGE_PATH,
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  image: "/images/coach/seo-youngbin-og-amp.jpg",
  keywords: [
    "1:1 보컬레슨",
    "발성교정",
    "분당 보컬 트레이닝",
    "고음 발성",
    "벨칸토 발성",
    "프리미엄 보컬레슨",
  ],
});

// serviceType mirrors PRODUCTS["signature"] in src/lib/site.ts. Pricing stays in
// the global OfferCatalog so this node never restates a number.
const structuredData = [
  buildBreadcrumb(PAGE_PATH, [{ name: "1:1 레슨", path: PAGE_PATH }]),
  buildServiceSchema({
    path: PAGE_PATH,
    name: PAGE_TITLE,
    serviceType: "1:1 보컬 트레이닝",
    description: PAGE_DESCRIPTION,
  }),
  buildFaqSchema(PAGE_PATH, SIGNATURE_FAQ),
];

export default function SignaturePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
      />
      <SignaturePageClient />
    </>
  );
}
