import { buildMetadata } from "@/lib/seo";
import HomeClient from "./HomeClient";

const PAGE_TITLE =
  "시선뮤직 아티스트클럽 | 분당 보컬학원·보컬레슨·보컬트레이닝";
const PAGE_DESCRIPTION =
  "분당 보컬학원 시선뮤직 아티스트클럽. 성남시 분당구 보컬레슨·보컬트레이닝·실용음악 전문. 평생 무너지지 않는 소리를 만드는 정파 발성, 세타쓴(서영빈) 원장 직강.";

export const metadata = buildMetadata({
  path: "/",
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  absoluteTitle: true,
});

export default function HomePage() {
  return <HomeClient />;
}
