import Link from "next/link";
import type { Metadata } from "next";
import { BrandLogo } from "@/components/marketing/BrandLogo";
import { docPath, docsByCategory } from "@/lib/content/registry";
import { buildBreadcrumb, buildMetadata, jsonLd } from "@/lib/seo";
import styles from "@/styles/keyword-landing.module.css";

const PAGE_PATH = "/guide";

export const metadata: Metadata = buildMetadata({
  path: PAGE_PATH,
  title: "발성 가이드 — 목조임·고음·발성 트레이닝",
  description:
    "노래할 때 목조임과 고음 문제를 발성 원리로 풀어냅니다. 시선뮤직 아티스트클럽이 현장에서 확인한 발성 트레이닝 가이드입니다. 성남시 분당구, 1:1 프라이빗 보컬 트레이닝.",
  keywords: ["목조임", "고음 목조임", "발성 가이드", "노래 목조임", "분당 보컬 트레이닝"],
});

const structuredData = [
  buildBreadcrumb(PAGE_PATH, [{ name: "가이드", path: PAGE_PATH }]),
];

export default function GuideHubPage() {
  const categories = docsByCategory("guide");

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
      />
      <div className={styles.inner}>
        <header className={styles.siteHeader}>
          <Link href="/" aria-label="시선뮤직 홈" style={{ textDecoration: "none" }}>
            <BrandLogo compact surface="dark" />
          </Link>
        </header>

        <nav className={styles.breadcrumb} aria-label="브레드크럼">
          <Link href="/">홈</Link> <span aria-hidden>›</span> 가이드
        </nav>

        <header className={styles.hero}>
          <span className={styles.kicker}>VOCAL GUIDE</span>
          <h1 className={styles.title}>발성 가이드</h1>
          <p className={styles.lead}>
            목조임과 고음, 발성의 원리를 현장에서 확인한 그대로 정리합니다.
            증상을 눌러 없애는 팁이 아니라, 왜 그런 소리가 나는지부터
            다룹니다.
          </p>
        </header>

        {categories.map((group) => (
          <section key={group.category} className={styles.section}>
            <h2 className={styles.sectionTitle}>{group.label}</h2>
            <ul className={styles.checklist}>
              {group.docs.map((doc) => (
                <li key={doc.slug}>
                  <Link className={styles.inlineLink} href={docPath(doc)}>
                    {doc.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <footer className={styles.siteFooter}>
          <ul className={styles.footerNav}>
            <li>
              <Link href="/vocal-correction">발성교정 · 목조임</Link>
            </li>
            <li>
              <Link href="/bundang-vocal-lesson">분당 보컬레슨 안내</Link>
            </li>
            <li>
              <Link href="/diagnosis">3분 무료 발성 진단</Link>
            </li>
          </ul>
          <p className={styles.footerCopy}>
            &copy; 2026 SEE:SUN MUSIC All Rights Reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
