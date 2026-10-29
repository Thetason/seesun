import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/marketing/BrandLogo";
import { buildMetadata } from "@/lib/seo";
import { KickoffCtaLink } from "@/components/marketing/KickoffCtaLink";
import { RelatedGuides } from "@/components/content/RelatedGuides";
import { ReviewHighlights } from "@/components/content/ReviewHighlights";
import { PRODUCTS, SITE_URL } from "@/lib/site";
import styles from "./page.module.css";

const PAGE_PATH = "/bundang-vocal-lesson";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

const PAGE_TITLE = "분당 보컬레슨 — 성인 1:1 보컬 트레이닝, 비용과 과정";
const PAGE_DESCRIPTION =
  "분당 보컬레슨 시선뮤직 아티스트클럽. 목이 아니라 몸으로 부르는 정파 발성 트레이닝. 성남시 분당구 취미·축가·심화 성인 1:1 보컬 레슨, 보컬트레이너 세타쓴(서영빈) 원장 직강.";

export const metadata: Metadata = buildMetadata({
  path: PAGE_PATH,
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  ogType: "article",
  image: "/images/coach/seo-youngbin-og.jpg",
});

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
    label: "STAGE",
    title: "축가 · 오디션 · 무대",
    desc: "결혼식 축가, 오디션, 공연처럼 날짜가 정해진 무대를 앞둔 분. 그날의 컨디션이 아니라 무너지지 않는 발성 구조로 준비합니다.",
  },
  {
    label: "ADVANCED",
    title: "보컬트레이닝 심화",
    desc: "이미 노래하는 싱어, 버스킹·공연을 뛰는 분. 소리의 한계를 발성 설계로 다시 열고 음색의 선택지를 넓힙니다.",
  },
];

const START_STEPS = [
  "먼저 홈페이지의 3분 무료 발성 진단에서 다섯 가지 질문에 답해 보세요. 고음, 호흡, 실전 중 지금 가장 막히는 지점이 어디인지 큰 방향을 잡을 수 있습니다. 건너뛰고 바로 상담을 신청해도 괜찮습니다.",
  "네이버 예약으로 30분 무료 킥오프 상담을 신청합니다. 상담에서는 원장이 실제로 소리를 내 보게 하며 지금 상태를 직접 듣고, 고민을 함께 짚은 뒤 어떤 훈련부터 시작할지 방향을 잡습니다.",
  "상담에서 들은 소리와 목표를 기준으로 과정을 고릅니다. 매일 혼자 연습하는 루틴이 필요한 분, 주 1회 1:1 수업으로 몸의 사용을 바꿔야 하는 분, 날짜가 정해진 무대를 준비하는 분은 출발점이 다릅니다.",
  "첫 수업부터는 숨 세팅에서 시작해 압력 연결, 음색, 곡 적용 순서로 갑니다. 수업에서 바뀐 감각이 수업 밖에서도 남도록 연습 방법과 기록을 함께 챙깁니다.",
];

const PRICED_PRODUCTS = PRODUCTS.filter((product) => product.id !== "crew");

function formatPrice(value: number) {
  return `${value.toLocaleString("ko-KR")}원`;
}

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
    q: "분당 보컬레슨 비용은 얼마인가요?",
    a: "주 1회 50분 1:1 수업인 시선 시그니처는 월 440,000원이고, 3개월 정기결제를 선택하면 월 420,000원입니다. 매일 혼자 하는 루틴과 주 1회 코치 피드백을 받는 데일리는 월 120,000원부터 시작합니다. 모든 금액은 VAT 포함입니다. 어떤 과정이 맞는지는 30분 무료 상담에서 소리를 들어 본 뒤 함께 정합니다.",
  },
  {
    q: "성인만 수강할 수 있나요? 직장인도 다닐 수 있나요?",
    a: "시선뮤직 아티스트클럽은 성인을 대상으로 1:1 보컬레슨을 진행합니다. 처음 노래를 배우는 직장인, 오래 쉬었다가 다시 시작하는 분, 이미 노래를 하고 있지만 한계를 느끼는 분이 함께 배우고 있습니다. 수업 가능한 시간은 상담에서 일정에 맞춰 안내드립니다.",
  },
  {
    q: "축가처럼 날짜가 정해진 무대도 준비할 수 있나요?",
    a: "네. 결혼식 축가, 공연, 오디션처럼 날짜가 정해진 무대도 준비합니다. 남은 기간과 부를 곡, 지금 소리 상태를 상담에서 함께 보고 필요한 수업 횟수와 순서를 정합니다. 기간이 짧을수록 그 곡에서 가장 흔들리는 부분부터 잡습니다.",
  },
  {
    q: "얼마나 다녀야 달라지나요?",
    a: "사람마다 다릅니다. 첫 수업에서 소리가 바뀌는 경험을 하는 분은 많지만, 그 감각이 의식하지 않아도 유지되려면 반복이 필요합니다. 그래서 수업 사이의 연습 방법과 기록을 함께 관리하고, 진행 상황은 녹음으로 비교하며 확인합니다.",
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
            분당에 보컬레슨은 많습니다. 시선뮤직이 다른 이유.
          </h2>
          <p className={styles.sectionBody}>
            대부분의 보컬레슨은 노래를 <strong>고쳐</strong>줍니다. 그 자리에서는
            좋아진 것 같지만, 혼자 부르면 다시 돌아옵니다. 시선뮤직은 소리가
            나오는{" "}
            <Link className={styles.inlineLink} href="/vocal-correction">
              <strong>몸부터 다시 설계</strong>
            </Link>
            합니다. 그래서 수업이 끝난
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
          <h2 className={styles.sectionTitle}>
            분당 보컬레슨, 처음이라면 이렇게 시작합니다
          </h2>
          <p className={styles.sectionBody}>
            보컬레슨을 처음 알아보면 어디서 무엇부터 시작해야 할지 막막합니다.
            시선뮤직에서는 등록부터 하지 않고, 지금 소리를 먼저 확인하는 것으로
            시작합니다.
          </p>
          <ol className={styles.checklist}>
            {START_STEPS.map((text) => (
              <li key={text.slice(0, 16)}>{text}</li>
            ))}
          </ol>
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
          <h2 className={styles.sectionTitle}>분당 보컬레슨 비용 한눈에</h2>
          <p className={styles.sectionBody}>
            시선뮤직은 성인을 대상으로 하며, 대면 수업은 모두 1:1로 진행합니다.
            금액은 VAT 포함이며, 어떤 과정이 맞는지는 무료 상담에서 소리를 들어
            본 뒤 함께 정합니다.
          </p>
          <div className={styles.grid}>
            {PRICED_PRODUCTS.map((product) => (
              <div key={product.id} className={styles.card}>
                <span className={styles.cardLabel}>
                  {product.billing === "month" ? "월" : "과정"}{" "}
                  {formatPrice(product.price)}
                </span>
                <h3 className={styles.cardTitle}>
                  <Link className={styles.inlineLink} href={product.path}>
                    {product.name}
                  </Link>
                </h3>
                <p className={styles.cardDesc}>
                  {product.description}
                  {product.commitPrice && product.commitMonths
                    ? ` ${product.commitMonths}개월 정기결제 시 월 ${formatPrice(product.commitPrice)}.`
                    : ""}
                </p>
              </div>
            ))}
          </div>
          <p className={styles.sectionBody}>
            레슨비를 비교할 때는 한 달 금액만 보지 마세요. 한 번의 수업이 몇
            분인지, 그 시간이 온전히 나에게 쓰이는 1:1인지, 수업과 수업 사이의
            연습을 누가 어떻게 봐 주는지에 따라 같은 금액이라도 실제로 받는 것이
            크게 달라집니다. 비교하는 기준은{" "}
            <Link
              className={styles.inlineLink}
              href="/guide/local-bundang/bundang-vocal-diagnosis-first"
            >
              분당 보컬레슨을 고르기 전에 확인할 것
            </Link>
            에 자세히 정리했습니다.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            1:1 보컬레슨이 다른 점
          </h2>
          <p className={styles.sectionBody}>
            여러 명이 함께 듣는 수업에서는 같은 설명을 듣고 같은 연습을 합니다.
            그런데 목이 조이는 이유도, 숨이 떨어지는 지점도 사람마다 다릅니다.
            1:1 보컬레슨에서는 수업 시간 전부를 내 소리에 씁니다. 지금 낸 소리를
            바로 녹음해 듣고, 어디서 힘이 들어가는지 그 자리에서 짚고, 내 몸에
            맞는 방법으로 다시 내 봅니다.
          </p>
          <p className={styles.sectionBody}>
            시선뮤직의 수업은 처음부터 끝까지 원장이 직접 맡습니다. 상담에서 들은
            소리와 수업에서 바뀐 소리를 같은 사람이 계속 듣기 때문에, 작은 변화도
            놓치지 않고 다음 단계로 이어 갈 수 있습니다.
          </p>
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
            <Link className={styles.profileLink} href="/coach">
              원장 소개 · 경력
            </Link>
            <Link className={styles.profileLink} href="/reviews">
              수강생 후기
            </Link>
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
              href="https://www.instagram.com/thetason_/"
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
          <p className={styles.sectionBody}>
            분당 보컬레슨은 성남시 분당구에서 진행하며, 정확한 위치는 무료 킥오프
            상담을 예약하실 때 안내드립니다. 정자·수내·서현 생활권은 물론 판교와
            용인 수지·죽전에서도 다니고 계십니다.
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

        <ReviewHighlights servicePath="/bundang-vocal-lesson" styles={styles} />

        <RelatedGuides servicePath="/bundang-vocal-lesson" styles={styles} />

        <div className={styles.cta}>
          <h2 className={styles.ctaTitle}>
            분당 보컬레슨, 진단부터 시작하세요
          </h2>
          <p className={styles.ctaDesc}>
            지금 소리의 상태를 함께 확인하고, 필요한 훈련의 방향부터 잡아드립니다.
          </p>
          <KickoffCtaLink
            className={styles.ctaBtn}
            source="landing:bundang-vocal-lesson"
          />
          <Link className={styles.homeLink} href="/">
            시선뮤직 아티스트클럽 홈 보기
          </Link>
        </div>
      </div>
    </div>
  );
}
