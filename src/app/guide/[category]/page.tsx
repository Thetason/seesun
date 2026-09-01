import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandLogo } from "@/components/marketing/BrandLogo";
import { docPath, docsByCategory } from "@/lib/content/registry";
import { buildBreadcrumb, buildMetadata, jsonLd } from "@/lib/seo";
import styles from "@/styles/keyword-landing.module.css";

type Params = { category: string };

function group(category: string) {
  return docsByCategory("guide").find((g) => g.category === category);
}

export function generateStaticParams(): Params[] {
  return docsByCategory("guide").map((g) => ({ category: g.category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category } = await params;
  const g = group(category);
  if (!g) return {};

  return buildMetadata({
    path: `/guide/${category}`,
    title: `${g.label} 발성 가이드`,
    description: `${g.label} 관련 발성 가이드 모음. 시선뮤직 아티스트클럽이 현장에서 확인한 원리로 정리했습니다.`,
  });
}

export default async function GuideCategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category } = await params;
  const g = group(category);
  if (!g) notFound();

  const structuredData = [
    buildBreadcrumb(`/guide/${category}`, [
      { name: "가이드", path: "/guide" },
      { name: g.label, path: `/guide/${category}` },
    ]),
  ];

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
          <Link href="/">홈</Link> <span aria-hidden>›</span>{" "}
          <Link href="/guide">가이드</Link> <span aria-hidden>›</span> {g.label}
        </nav>

        <header className={styles.hero}>
          <span className={styles.kicker}>VOCAL GUIDE</span>
          <h1 className={styles.title}>{g.label} 가이드</h1>
        </header>

        <section className={styles.section}>
          <ul className={styles.checklist}>
            {g.docs.map((doc) => (
              <li key={doc.slug}>
                <Link className={styles.inlineLink} href={docPath(doc)}>
                  {doc.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <footer className={styles.siteFooter}>
          <ul className={styles.footerNav}>
            <li>
              <Link href="/guide">발성 가이드 전체</Link>
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
