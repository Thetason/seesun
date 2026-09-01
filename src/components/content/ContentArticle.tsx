import Link from "next/link";
import { BrandLogo } from "@/components/marketing/BrandLogo";
import { docPath, relatedDocs } from "@/lib/content/registry";
import type { ContentDoc } from "@/lib/content/types";
import {
  buildArticleSchema,
  buildBreadcrumb,
  buildFaqSchema,
  jsonLd,
} from "@/lib/seo";
import { KICKOFF_CTA_LABEL, SMARTPLACE_URL } from "@/lib/site";
import styles from "@/styles/keyword-landing.module.css";

// Renders one content document into a full page. Every guide/glossary/review
// uses this single template, so the schema, breadcrumb, related links and CTA
// stay consistent across the whole content library.
export function ContentArticle({ doc }: { doc: ContentDoc }) {
  const path = docPath(doc);
  const hubHref = doc.kind === "guide" ? "/guide" : `/${doc.kind}`;
  const hubLabel = doc.kind === "guide" ? "가이드" : doc.kind;
  const related = relatedDocs(doc);

  const structuredData = [
    buildBreadcrumb(path, [
      { name: hubLabel, path: hubHref },
      { name: doc.categoryLabel, path: `${hubHref}/${doc.category}` },
      { name: doc.title, path },
    ]),
    buildArticleSchema({
      path,
      title: doc.title,
      description: doc.description,
      published: doc.published,
      updated: doc.updated,
      keywords: doc.keywords,
    }),
    ...(doc.faq?.length ? [buildFaqSchema(path, doc.faq)] : []),
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
          <Link href={hubHref}>{hubLabel}</Link> <span aria-hidden>›</span>{" "}
          {doc.categoryLabel}
        </nav>

        <header className={styles.hero}>
          <span className={styles.kicker}>{doc.categoryLabel}</span>
          <h1 className={styles.title}>{doc.title}</h1>
          <p className={styles.lead}>{doc.lead}</p>
        </header>

        {doc.sections.map((section) => (
          <section key={section.heading} className={styles.section}>
            <h2 className={styles.sectionTitle}>{section.heading}</h2>
            {section.body.map((para, i) => (
              <p key={i} className={styles.sectionBody}>
                {para}
              </p>
            ))}
          </section>
        ))}

        {doc.faq?.length ? (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>자주 묻는 질문</h2>
            {doc.faq.map((item) => (
              <div key={item.q} className={styles.faqItem}>
                <h3 className={styles.faqQ}>{item.q}</h3>
                <p className={styles.faqA}>{item.a}</p>
              </div>
            ))}
          </section>
        ) : null}

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>쓴 사람 — 보컬트레이너 세타쓴(서영빈)</h2>
          <p className={styles.sectionBody}>
            시선뮤직 아티스트클럽 원장 <strong>세타쓴(서영빈)</strong>이 직접
            씁니다. D.A.P.를 설계한 사람이 현장에서 확인한 내용을 담습니다.
          </p>
          <div className={styles.profileLinks}>
            <a
              className={styles.profileLink}
              href="https://www.youtube.com/@thetasonwillcreate"
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube에서 소리 확인하기
            </a>
            <a
              className={styles.profileLink}
              href="https://blog.naver.com/thetason"
              target="_blank"
              rel="noopener noreferrer"
            >
              네이버 블로그
            </a>
          </div>
        </section>

        {doc.references?.length ? (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>참고 자료</h2>
            <ul className={styles.checklist}>
              {doc.references.map((ref) => (
                <li key={ref.url}>
                  <a
                    className={styles.inlineLink}
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {ref.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {related.length ? (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>이어 읽으면 좋은 글</h2>
            <ul className={styles.checklist}>
              {related.map((r) => (
                <li key={r.slug}>
                  <Link className={styles.inlineLink} href={docPath(r)}>
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className={styles.cta}>
          <h2 className={styles.ctaTitle}>지금 막히는 지점부터 확인하세요</h2>
          <p className={styles.ctaDesc}>
            3분 무료 발성 진단으로 원인의 방향을 먼저 잡고, 상담에서 필요한
            훈련을 함께 정합니다.
          </p>
          <a
            className={styles.ctaBtn}
            href={SMARTPLACE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {KICKOFF_CTA_LABEL}
          </a>
          <Link className={styles.homeLink} href="/diagnosis">
            먼저 3분 무료 발성 진단 해보기
          </Link>
        </div>

        <footer className={styles.siteFooter}>
          <ul className={styles.footerNav}>
            <li>
              <Link href="/guide">발성 가이드 전체</Link>
            </li>
            <li>
              <Link href="/vocal-correction">발성교정 · 목조임</Link>
            </li>
            <li>
              <Link href="/bundang-vocal-lesson">분당 보컬레슨 안내</Link>
            </li>
            <li>
              <Link href="/adult-vocal-lesson">성인 보컬레슨 · 취미 보컬</Link>
            </li>
            <li>
              <Link href="/diagnosis">3분 무료 발성 진단</Link>
            </li>
          </ul>
          <p className={styles.footerAreas}>
            성남시 분당구 · 정자동 · 서현동 · 수내동 · 이매동 · 야탑동 · 미금동 ·
            구미동 · 판교 · 용인 수지 보컬 트레이닝
          </p>
          <p className={styles.footerCopy}>
            &copy; 2026 SEE:SUN MUSIC All Rights Reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
