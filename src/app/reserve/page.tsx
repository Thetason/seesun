import { buildBreadcrumb, buildMetadata, jsonLd } from "@/lib/seo";
import ReservePageClient from "./ReservePageClient";

const PAGE_PATH = "/reserve";

const PAGE_TITLE = "15주 마스터 프로토콜 — 분당 프라이빗 보컬 집중 과정";
const PAGE_DESCRIPTION =
  "사람들 앞에서 한 곡을 실제로 해내는 상태까지. 주 2회(트레이닝 1회 + 실전 세션 1회), 총 30회 이상의 프라이빗 세션과 졸업공연으로 완성하는 15주 프로그램. 3,800,000원(VAT 포함), 분기 정원 5명.";

export const metadata = buildMetadata({
  path: PAGE_PATH,
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "직장인 보컬레슨",
    "프라이빗 보컬 트레이닝",
    "무대 긴장 극복",
    "축가 레슨",
    "분당 보컬레슨",
    "성인 보컬",
  ],
});

const structuredData = [
  buildBreadcrumb(PAGE_PATH, [{ name: "15주 마스터 프로토콜", path: PAGE_PATH }]),
];

export default function ReservePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
      />
      <ReservePageClient />
    </>
  );
}
