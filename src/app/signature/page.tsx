import { buildBreadcrumb, buildMetadata, jsonLd } from "@/lib/seo";
import SignaturePageClient from "./SignaturePageClient";

const PAGE_PATH = "/signature";

const PAGE_TITLE = "시선 시그니처 — 주 1회 50분 1:1 보컬 트레이닝";
const PAGE_DESCRIPTION =
  "분당 1:1 보컬레슨 시그니처 멤버십. 횡격막을 자동화하는 D.A.P. 트레이닝으로 목이 아니라 몸으로 부르게 만듭니다. 주 1회 50분·월 4회, 월 440,000원(VAT 포함) · 3개월 정기결제 시 월 420,000원.";

export const metadata = buildMetadata({
  path: PAGE_PATH,
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "1:1 보컬레슨",
    "발성교정",
    "분당 보컬 트레이닝",
    "D.A.P.",
    "횡격막 호흡",
    "프리미엄 보컬레슨",
  ],
});

const structuredData = [
  buildBreadcrumb(PAGE_PATH, [{ name: "시선 시그니처", path: PAGE_PATH }]),
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
