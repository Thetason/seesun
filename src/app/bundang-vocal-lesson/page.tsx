import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/marketing/BrandLogo";
import { KICKOFF_CTA_LABEL, SITE_URL, SMARTPLACE_URL } from "@/lib/site";
import styles from "./page.module.css";

const PAGE_PATH = "/bundang-vocal-lesson";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

const PAGE_TITLE = "분당보컬레슨 · 분당 보컬 트레이닝";
const PAGE_DESCRIPTION =
  "분당 보컬레슨 시선뮤직 아티스트클럽. 목이 아니라 몸으로 부르는 정파 발성 트레이닝. 성남시 분당구 취미·입시·심화 1:1 보컬 레슨, 보컬트레이너 세타쓴(서영빈) 원장 직강.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: PAGE_PATH,
  },
  openGraph: {
    title: `${PAGE_TITLE} | 시선뮤직 아티스트클럽`,
    description: PAGE_DESCRIPTION,
    url: PAGE_PATH,
    type: "article",
  },
};

const WHY_CARDS = [
  {
    label: "DIAGNOSIS",
    title: "고치기 전에, 진단부터",
    desc: "노래를 바로 고치지 않습니다. 지금 소리가 왜 그렇게 나는지 몸의 사용부터 진단하고, 사람마다 다른 원인에 맞는 처방을 설계합니다.",
  },
  {
    label: "BODY FIRST",
    title: "목이 아니라, 몸으로",
    desc: "고음이 조이고 목이 잠기는 건 재능의 문제가 아니라 몸 사용의 문제입니다. 소리가 나는 몸부터 다시 만드는 것이 정파 발성의 시작입니다.",
  },
  {
    label: "ARCHIVE",
    title: "기록이 남는 성장",
    desc: "매일 루틴, 음성 업로드, 코치 피드백, 성장 아카이브까지. 한 번 듣고 끝나는 레슨이 아니라 변화가 기록으로 쌓이는 관리형 트레이닝입니다.",
  },
];

const FOR_WHOM = [
  {
    label: "HOBBY",
    title: "취미 보컬",
    desc: "노래방만 가면 목이 잠기는 직장인, 한 곡만이라도 제대로 부르고 싶은 분. 음치·박치 걱정 없이 진단부터 시작합니다.",
  },
  {
    label: "AUDITION",
    title: "입시 · 오디션",
    desc: "실용음악과 입시와 기획사 오디션은 하루의 컨디션이 아니라 무너지지 않는 발성 구조가 승부를 가릅니다. 구조부터 만듭니다.",
  },
  {
    label: "ADVANCED",
    title: "보컬트레이닝 심화",
    desc: "이미 노래하는 싱어, 버스킹·공연을 뛰는 분. 소리의 한계를 발성 설계로 다시 열고 음색의 선택지를 넓힙니다.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "숨 세팅",
    desc: "숨이 덜 급해지고 소리의 시작이 안정됩니다.",
  },
  {
    step: "02",
    title: "압력 연결",
    desc: "고음에서 덜 버티고, 덜 조이게 됩니다.",
  },
  {
    step: "03",
    title: "음색 세팅",
    desc: "더 편안하고 내 목소리답게 들립니다.",
  },
  {
    step: "04",
    title: "곡 적용",
    desc: "만든 발성을 실제 곡과 무대에서 쓰는 소리로 연결합니다.",
  },
];

const FAQ = [
  {
    q: "음치·박치도 분당 보컬레슨을 받을 수 있나요?",
    a: "네. 시선뮤직의 모든 수업은 진단에서 시작합니다. 음정과 박자가 흔들리는 원인 대부분은 재능이 아니라 몸 사용의 문제이고, 원인을 알면 훈련으로 바뀝니다. 지금 상태 그대로 오시면 됩니다.",
  },
  {
    q: "레슨은 어떻게 진행되나요?",
    a: "1:1 맞춤 수업입니다. 첫 진단에서 소리의 현재 상태를 파악한 뒤, 숨 세팅 → 압력 연결 → 음색 세팅 → 곡 적용의 정파 발성 4단계로 진행합니다. 수업 사이에는 매일 루틴과 음성 업로드, 코치 피드백이 이어집니다.",
  },
  {
    q: "위치는 어디인가요? 분당 어디에서 다닐 수 있나요?",
    a: "경기도 성남시 분당구에서 운영합니다. 정자동·서현동·수내동·이매동·야탑동·미금동·구미동과 판교 생활권, 인근 용인 수지·죽전에서도 수강하고 계십니다. 정확한 위치는 무료 킥오프 상담 예약 시 안내드립니다.",
  },
  {
    q: "상담은 어떻게 신청하나요?",
    a: "페이지 하단의 무료 킥오프 상담 버튼으로 네이버 예약을 남겨주시면 됩니다. 상담에서는 현재 소리 상태를 함께 확인하고, 어떤 훈련이 필요한지 방향을 먼저 잡아드립니다.",
  },
];

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${PAGE_URL}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "분당보컬레슨", item: PAGE_URL },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${PAGE_URL}#service`,
    name: "분당 보컬레슨 — 정파 발성 트레이닝",
    serviceType: "보컬레슨",
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: ["성남시 분당구", "판교", "용인시 수지구", "성남시"],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${PAGE_URL}#faq`,
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  },
];

export default function BundangVocalLessonPage() {
  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className={styles.inner}>
        <header className={styles.siteHeader}>
          <Link href="/" aria-label="시선뮤직 홈" style={{ textDecoration: "none" }}>
            <BrandLogo compact surface="dark" />
          </Link>
        </header>
        <nav className={styles.breadcrumb} aria-label="브레드크럼">
          <Link href="/">홈</Link> <span aria-hidden>›</span> 분당보컬레슨
        </nav>

        <header className={styles.hero}>
          <span className={styles.kicker}>BUNDANG VOCAL LESSON</span>
          <h1 className={styles.title}>
            분당 보컬레슨,
            <br />
            시선뮤직 아티스트클럽
          </h1>
          <p className={styles.lead}>
            쉽게 얻는 소리는 팔지 않습니다. 성남시 분당구에서 목이 아니라 몸으로
            부르는 정파 발성 트레이닝 — 한 번의 레슨이 아니라, 평생 무너지지
            않는 소리를 만듭니다.
          </p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            분당 보컬학원은 많습니다. 시선뮤직이 다른 이유.
          </h2>
          <p className={styles.sectionBody}>
            대부분의 보컬레슨은 노래를 <strong>고쳐</strong>줍니다. 그 자리에서는
            좋아진 것 같지만, 혼자 부르면 다시 돌아옵니다. 시선뮤직은 소리가
            나오는 <strong>몸부터 다시 설계</strong>합니다. 그래서 수업이 끝난
            뒤에도 소리가 남습니다.
          </p>
          <div className={styles.grid}>
            {WHY_CARDS.map((card) => (
              <div key={card.label} className={styles.card}>
                <span className={styles.cardLabel}>{card.label}</span>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardDesc}>{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>이런 분들의 분당 보컬 트레이닝</h2>
          <div className={styles.grid}>
            {FOR_WHOM.map((card) => (
              <div key={card.label} className={styles.card}>
                <span className={styles.cardLabel}>{card.label}</span>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardDesc}>{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            수업은 이렇게 진행됩니다 — 정파 발성 4단계
          </h2>
          <ol className={styles.steps}>
            {STEPS.map((item) => (
              <li key={item.step} className={styles.card}>
                <span className={styles.cardLabel}>STEP {item.step}</span>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDesc}>{item.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            원장 직강 — 보컬트레이너 세타쓴(서영빈)
          </h2>
          <p className={styles.sectionBody}>
            시선뮤직의 모든 보컬레슨은 원장 <strong>세타쓴(서영빈)</strong>이
            직접 진행합니다. 음악을 만드는 아티스트이자 보컬 트레이너로서, 무대
            위에서 실제로 쓰이는 소리를 기준으로 가르칩니다. 간판과 커리큘럼이
            아니라, 가르치는 사람의 소리로 판단해 주세요.
          </p>
          <div className={styles.profileLinks}>
            <a
              className={styles.profileLink}
              href="https://thetason.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              세타쓴 공식 사이트
            </a>
            <a
              className={styles.profileLink}
              href="https://www.youtube.com/@thetasonwillcreate"
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube
            </a>
            <a
              className={styles.profileLink}
              href="https://www.instagram.com/thetasonwillsing/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
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

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>수강 가능 지역</h2>
          <p className={styles.areas}>
            성남시 분당구 전 지역 — 정자동 · 서현동 · 수내동 · 이매동 · 야탑동 ·
            미금동 · 구미동 · 판교(백현동·삼평동·운중동)
            <br />
            인근 생활권 — 용인 수지 · 죽전 · 성남 수정구·중원구 · 광주 · 하남
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>자주 묻는 질문</h2>
          {FAQ.map((item) => (
            <div key={item.q} className={styles.faqItem}>
              <h3 className={styles.faqQ}>{item.q}</h3>
              <p className={styles.faqA}>{item.a}</p>
            </div>
          ))}
        </section>

        <div className={styles.cta}>
          <h2 className={styles.ctaTitle}>
            분당 보컬레슨, 진단부터 시작하세요
          </h2>
          <p className={styles.ctaDesc}>
            지금 소리의 상태를 함께 확인하고, 필요한 훈련의 방향부터 잡아드립니다.
          </p>
          <a
            className={styles.ctaBtn}
            href={SMARTPLACE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {KICKOFF_CTA_LABEL}
          </a>
          <Link className={styles.homeLink} href="/">
            시선뮤직 아티스트클럽 홈 보기
          </Link>
        </div>
      </div>
    </div>
  );
}
