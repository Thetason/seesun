import { buildMetadata } from "@/lib/seo";
import HomeClient from "./HomeClient";

const PAGE_TITLE =
  "세타쓴의 시선뮤직 | 분당 1:1 보컬레슨·보컬트레이닝·발성교정";
const PAGE_DESCRIPTION =
  "유튜브 세타쓴 채널의 서영빈이 분당 스튜디오에서 직접 하는 1:1 보컬레슨. 고음·목 조임·발성교정을 깊은 발음으로 잡아 드립니다. 성남시 분당구, 무료 상담 30분.";

export const metadata = buildMetadata({
  path: "/",
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  absoluteTitle: true,
});

export default function HomePage() {
  return <HomeClient />;
}
