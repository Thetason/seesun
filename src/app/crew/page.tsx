import type { Metadata } from "next";
import CrewPageClient from "./CrewPageClient";

export const metadata: Metadata = {
  title: { absolute: "아티스트웨이 크루 | 시선뮤직 아티스트클럽" },
  description:
    "시즌마다 지원으로 합류하는 크리에이티브 클럽, 아티스트웨이 크루. 12주 시즌제로 『아티스트웨이』를 함께 걷고, 매일 아침 모닝 페이지를 쓰고, 러닝·요가·미식·영화로 라이프스타일을 넓힙니다. 지원 → 선발 → 회비(시그니처 멤버십 + 월 40,000원, VAT 포함).",
  alternates: {
    canonical: "/crew",
  },
};

export default function CrewPage() {
  return <CrewPageClient />;
}
