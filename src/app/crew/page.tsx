import type { Metadata } from "next";
import CrewPageClient from "./CrewPageClient";

export const metadata: Metadata = {
  title: { absolute: "아티스트웨이 크루 | 시선뮤직 아티스트클럽" },
  description:
    "시즌마다 지원으로 합류하는 크리에이티브 클럽, 아티스트웨이 크루. 12주의 시즌 동안 매주 모여 아티스트웨이의 여정을 걷고, 예술과 영감을 나눕니다. 지원 → 선발 → 회비.",
  alternates: {
    canonical: "/crew",
  },
};

export default function CrewPage() {
  return <CrewPageClient />;
}
