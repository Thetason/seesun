import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/marketing/BrandLogo";
import { KickoffCtaLink } from "@/components/marketing/KickoffCtaLink";
import { docPath, docsOfKind } from "@/lib/content/registry";
import { absoluteUrl, buildBreadcrumb, buildMetadata, jsonLd, SCHEMA_ID } from "@/lib/seo";
import styles from "@/styles/keyword-landing.module.css";

const PAGE_PATH = "/coach";

const PAGE_TITLE = "서영빈 원장 소개 — 보컬트레이너 세타쓴";
const PAGE_DESCRIPTION =
  "시선뮤직 아티스트클럽 대표원장 서영빈(세타쓴). 성악과 실용음악을 공부하고 한국발성교정협회 발성교정사 과정을 이수한 보컬트레이너로, 분당에서 모든 1:1 보컬 트레이닝을 직접 진행합니다.";

export const metadata = buildMetadata({
  path: PAGE_PATH,
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  image: "/images/coach/seo-youngbin-og.jpg",
  keywords: ["서영빈", "세타쓴", "보컬트레이너", "분당 보컬 원장", "발성교정사"],
});

const CAREER = [
  "인제대학교 성악과 이수 / 고신대학교 실용음악과 졸업",
  "한국발성교정협회 발성교정사 과정 이수",
  "프로덕션 찬스라인 작곡가 및 완가 사운드디자이너 역임",
  "클라우딘뮤직 대표원장 역임",
  "현 시선뮤직 아티스트클럽 대표원장",
];

const GALLERY = [
  { src: "/images/coach/seo-youngbin-mic.jpg", alt: "마이크를 들고 노래하는 서영빈 원장" },
  { src: "/images/coach/seo-youngbin-guitar.jpg", alt: "기타를 연주하는 서영빈 원장" },
  { src: "/images/coach/seo-youngbin-amp.jpg", alt: "앰프 위에 앉은 서영빈 원장" },
];

const structuredData = [
  buildBreadcrumb(PAGE_PATH, [{ name: "원장 소개", path: PAGE_PATH }]),
  {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${absoluteUrl(PAGE_PATH)}#profile`,
    url: absoluteUrl(PAGE_PATH),
    name: PAGE_TITLE,
    inLanguage: "ko-KR",
    mainEntity: { "@id": SCHEMA_ID.person },
  },
];

export default function CoachPage() {
  const guides = docsOfKind("guide");

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
          <Link href="/">홈</Link> <span aria-hidden>›</span> 원장 소개
        </nav>

        <header className={styles.hero}>
          <span className={styles.kicker}>HEAD COACH</span>
          <h1 className={styles.title}>서영빈</h1>
          <p className={styles.lead}>
            보컬트레이너 세타쓴 · 시선뮤직 아티스트클럽 대표원장
          </p>
          <Image
            src="/images/coach/seo-youngbin-portrait.jpg"
            alt="시선뮤직 아티스트클럽 대표원장 서영빈"
            width={1335}
            height={2000}
            priority
            sizes="(max-width: 480px) 100vw, 440px"
            style={{ display: "block", width: "100%", maxWidth: 440, height: "auto", marginTop: 40, borderRadius: 16 }}
          />
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>경력</h2>
          <ul className={styles.checklist}>
            {CAREER.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>가르치는 방식</h2>
          <p className={styles.sectionBody}>
            성악과 실용음악을 모두 공부했고, 발성교정사 과정을 거쳤습니다. 정파
            벨칸토 계열의 발성 원리를 바탕으로 횡격막을 자동화하는 훈련{" "}
            <Link className={styles.inlineLink} href="/vocal-correction">
              D.A.P.(Diaphragm Automatic Program)
            </Link>
            를 설계했습니다. 목으로 버티는 소리가 아니라, 몸이 받쳐 주는 소리를
            만드는 것이 목표입니다.
          </p>
          <p className={styles.sectionBody}>
            시선뮤직 아티스트클럽의 1:1 수업은 모두 <strong>서영빈 원장이 직접</strong>{" "}
            진행합니다. 처음 오시는 분은 30분 무료 킥오프 상담에서 실제로 소리를
            내 보고, 지금 상태를 직접 들은 뒤 어떤 훈련부터 시작할지 방향을 함께
            잡습니다.
          </p>
          <div className={styles.profileLinks}>
            <Link className={styles.profileLink} href="/reviews">
              수강생 후기
            </Link>
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
            <a
              className={styles.profileLink}
              href="https://www.instagram.com/thetason_/"
              target="_blank"
              rel="noopener noreferrer"
            >
              인스타그램
            </a>
            <a
              className={styles.profileLink}
              href="https://thetason.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              세타쓴 공식 사이트
            </a>
          </div>
        </section>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8, marginTop: 8 }}>
          {GALLERY.map((photo) => (
            <Image
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              width={1335}
              height={2000}
              sizes="(max-width: 480px) 33vw, 300px"
              style={{ display: "block", width: "100%", height: "auto", borderRadius: 12 }}
            />
          ))}
        </div>

        {guides.length > 0 ? (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>서영빈 원장이 쓴 발성 가이드</h2>
            <ul className={styles.checklist}>
              {guides.map((doc) => (
                <li key={docPath(doc)}>
                  <Link className={styles.inlineLink} href={docPath(doc)}>
                    {doc.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className={styles.cta}>
          <h2 className={styles.ctaTitle}>내 소리를 직접 들려주세요</h2>
          <p className={styles.ctaDesc}>
            30분 무료 킥오프 상담에서 원장이 직접 소리를 듣고 훈련의 방향을
            잡아 드립니다.
          </p>
          <KickoffCtaLink className={styles.ctaBtn} source="landing:coach" />
          <Link className={styles.homeLink} href="/diagnosis">
            먼저 3분 무료 발성 진단 해보기
          </Link>
        </div>

        <footer className={styles.siteFooter}>
          <ul className={styles.footerNav}>
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
              <Link href="/signature">1:1 보컬 트레이닝 시그니처</Link>
            </li>
            <li>
              <Link href="/reviews">수강생 후기</Link>
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
