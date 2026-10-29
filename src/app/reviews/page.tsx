import Link from "next/link";
import { BrandLogo } from "@/components/marketing/BrandLogo";
import { KickoffCtaLink } from "@/components/marketing/KickoffCtaLink";
import { EARLIER_REVIEWS, RECORD_REVIEWS, type StudentReview } from "@/lib/content/reviews";
import { buildBreadcrumb, buildMetadata, jsonLd } from "@/lib/seo";
import { RECORD_REVIEWS_URL } from "@/lib/site";
import styles from "@/styles/keyword-landing.module.css";

const PAGE_PATH = "/reviews";

const PAGE_TITLE = "수강생 후기 — 분당 보컬레슨 시선뮤직 아티스트클럽";
const PAGE_DESCRIPTION =
  "시선뮤직 아티스트클럽 서영빈(세타쓴) 원장의 1:1 보컬레슨을 받은 수강생들의 후기. 축가 준비, 발성 교정, 무대 긴장, 취미 보컬까지 실제 후기를 원문 그대로 모았습니다.";

export const metadata = buildMetadata({
  path: PAGE_PATH,
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  image: "/images/coach/seo-youngbin-og.jpg",
  keywords: ["보컬레슨 후기", "분당 보컬학원 후기", "축가 레슨 후기", "발성교정 후기", "세타쓴 후기"],
});

const structuredData = [buildBreadcrumb(PAGE_PATH, [{ name: "수강생 후기", path: PAGE_PATH }])];

function ReviewCard({ review, meta }: { review: StudentReview; meta: string }) {
  return (
    <article className={styles.card}>
      <span className={styles.cardLabel}>{review.topic}</span>
      <p className={styles.cardDesc} style={{ whiteSpace: "pre-line" }}>
        {review.body}
      </p>
      <p className={styles.cardDesc} style={{ marginTop: 16, opacity: 0.6 }}>
        {meta}
      </p>
    </article>
  );
}

export default function ReviewsPage() {
  const total = RECORD_REVIEWS.length + EARLIER_REVIEWS.length;

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
          <Link href="/">홈</Link> <span aria-hidden>›</span> 수강생 후기
        </nav>

        <header className={styles.hero}>
          <span className={styles.kicker}>REVIEWS</span>
          <h1 className={styles.title}>수강생 후기</h1>
          <p className={styles.lead}>
            <Link className={styles.inlineLink} href="/coach">
              서영빈(세타쓴) 원장
            </Link>
            에게 직접 배운 분들이 남긴 후기 {total}편입니다. 축가를 앞둔 분, 목이
            조여 찾아온 분, 무대에서 긴장하는 분, 취미로 노래를 즐기는 분까지 —
            받은 그대로 옮겼고, 이름은 일부 가렸습니다.
          </p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Re:cord 인증 후기</h2>
          <p className={styles.sectionBody}>
            원장의 후기 프로필 Re:cord에 수강생들이 직접 남긴 글입니다.{" "}
            <a
              className={styles.inlineLink}
              href={RECORD_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              원문 보기
            </a>
          </p>
          <div style={{ display: "grid", gap: 16, maxWidth: 760 }}>
            {RECORD_REVIEWS.map((review) => (
              <ReviewCard
                key={`${review.date}-${review.author}`}
                review={review}
                meta={`${review.author} · ${review.date}`}
              />
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>클라우딘뮤직 대표원장 시절 후기</h2>
          <p className={styles.sectionBody}>
            서영빈 원장이 시선뮤직 이전에 대표원장으로 있던 클라우딘뮤직에서
            네이버와 당근에 남겨 주신 후기입니다.
          </p>
          <div style={{ display: "grid", gap: 16, maxWidth: 760 }}>
            {EARLIER_REVIEWS.map((review) => (
              <ReviewCard key={review.body.slice(0, 24)} review={review} meta={review.source} />
            ))}
          </div>
        </section>

        <div className={styles.cta}>
          <h2 className={styles.ctaTitle}>내 소리부터 들려주세요</h2>
          <p className={styles.ctaDesc}>
            30분 무료 킥오프 상담에서 원장이 직접 소리를 듣고 훈련의 방향을
            잡아 드립니다.
          </p>
          <KickoffCtaLink className={styles.ctaBtn} source="landing:reviews" />
          <Link className={styles.homeLink} href="/diagnosis">
            먼저 3분 무료 발성 진단 해보기
          </Link>
        </div>

        <footer className={styles.siteFooter}>
          <ul className={styles.footerNav}>
            <li>
              <Link href="/coach">원장 소개</Link>
            </li>
            <li>
              <Link href="/bundang-vocal-lesson">분당 보컬레슨 안내</Link>
            </li>
            <li>
              <Link href="/vocal-correction">발성교정 · 목조임 훈련</Link>
            </li>
            <li>
              <Link href="/adult-vocal-lesson">성인 보컬레슨 · 취미 보컬</Link>
            </li>
            <li>
              <Link href="/guide">발성 가이드</Link>
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
