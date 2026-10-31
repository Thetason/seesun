import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/marketing/BrandLogo";
import { KickoffCtaLink } from "@/components/marketing/KickoffCtaLink";
import styles from "@/styles/keyword-landing.module.css";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다",
  robots: { index: false, follow: true },
};

const ROUTES = [
  { href: "/bundang-vocal-lesson", label: "분당 1:1 보컬레슨 안내", desc: "과정·비용·후기를 한 페이지에" },
  { href: "/signature", label: "시선 시그니처", desc: "주 1회 50분, 원장과 1:1" },
  { href: "/reviews", label: "수강생 후기", desc: "먼저 배운 분들의 이야기" },
  { href: "/guide", label: "발성 가이드", desc: "목조임·고음·호흡 고민별 정리" },
  { href: "/coach", label: "원장 소개", desc: "보컬트레이너 세타쓴(서영빈)" },
];

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <header className={styles.siteHeader}>
          <Link href="/" aria-label="시선뮤직 홈" style={{ textDecoration: "none" }}>
            <BrandLogo compact surface="dark" />
          </Link>
        </header>

        <header className={styles.hero}>
          <span className={styles.kicker}>404</span>
          <h1 className={styles.title}>찾으시는 페이지가 없어요</h1>
          <p className={styles.lead}>
            주소가 바뀌었거나 정리된 페이지입니다. 아래에서 가장 많이 찾으시는
            곳으로 바로 가실 수 있어요.
          </p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>이곳을 찾으셨나요?</h2>
          <ul className={styles.checklist}>
            {ROUTES.map((route) => (
              <li key={route.href}>
                <Link className={styles.inlineLink} href={route.href}>
                  {route.label}
                </Link>{" "}
                — {route.desc}
              </li>
            ))}
          </ul>
        </section>

        <div className={styles.cta}>
          <h2 className={styles.ctaTitle}>내 소리부터 들려주세요</h2>
          <p className={styles.ctaDesc}>
            30분 무료 킥오프 상담에서 원장이 직접 소리를 듣고 방향을 잡아
            드립니다.
          </p>
          <KickoffCtaLink className={styles.ctaBtn} source="landing:404" />
          <Link className={styles.homeLink} href="/">
            홈으로 가기
          </Link>
        </div>
      </div>
    </div>
  );
}
