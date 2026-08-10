import { buildBreadcrumb, buildMetadata, jsonLd } from "@/lib/seo";
import DiagnosisPageClient from "./DiagnosisPageClient";

const PAGE_PATH = "/diagnosis";

const PAGE_TITLE = "3분 무료 발성 진단 — 지금 막히는 지점 확인하기";
const PAGE_DESCRIPTION =
  "질문 다섯 개로 고음·호흡·실전 중 지금 가장 막히는 지점을 확인합니다. 성남시 분당구 시선뮤직 아티스트클럽에서 나에게 맞는 시작 코스를 안내받고, 진단 후 바로 상담으로 연결됩니다.";

export const metadata = buildMetadata({
  path: PAGE_PATH,
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "보컬 자가진단",
    "발성 진단",
    "음역대 테스트",
    "고음 안 올라가는 이유",
    "분당 보컬레슨",
  ],
});

const structuredData = [
  buildBreadcrumb(PAGE_PATH, [{ name: "무료 발성 진단", path: PAGE_PATH }]),
];

export default function DiagnosisPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
      />
      <DiagnosisPageClient />
    </>
  );
}
