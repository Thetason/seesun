import { buildMetadata } from "@/lib/seo";
import HomeClient from "./HomeClient";

const PAGE_TITLE =
  "세타쓴의 시선뮤직 | 분당 1:1 보컬레슨·보컬트레이닝·발성교정";
const PAGE_DESCRIPTION =
  "영상에서 본 그 방법을, 유튜브 세타쓴 채널의 서영빈이 분당 스튜디오에서 직접 1:1로 잡아 드려요. 고음·목 조임·발성교정, 1:1 레슨은 첫 레슨에서 달라지지 않으면 남은 3회분 환불. 무료 상담 30분.";

export const metadata = buildMetadata({
  path: "/",
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  absoluteTitle: true,
});

export default function HomePage() {
  return <HomeClient />;
}
