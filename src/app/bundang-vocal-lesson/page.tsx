import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { KickoffCtaLink } from "@/components/marketing/KickoffCtaLink";
import { RelatedGuides } from "@/components/content/RelatedGuides";
import { ReviewHighlights } from "@/components/content/ReviewHighlights";
import { PRODUCTS, SITE_URL } from "@/lib/site";
import styles from "@/styles/keyword-landing.module.css";
import { SiteFooter, SiteHeader } from "@/components/site/SiteChrome";

const PAGE_PATH = "/bundang-vocal-lesson";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

const PAGE_TITLE = "분당 보컬레슨 — 성인 1:1 보컬 트레이닝, 비용과 과정";
const PAGE_DESCRIPTION =
  "분당 보컬레슨 세타쓴의 시선뮤직. 유튜브 세타쓴 채널의 서영빈 원장이 성남시 분당구에서 성인 1:1 보컬레슨을 모두 직접 해요. 취미·축가·무대 준비, 깊은 발음으로 고음과 목 조임을 잡아요.";

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
    desc: "노래부터 고치지 않고, 지금 소리가 왜 그렇게 나는지 먼저 들어 봐요. 같은 고음 문제도 사람마다 원인이 달라서, 원인에 맞는 연습을 정해 드려요.",
  },
  {
    label: "BODY FIRST",
    title: "힘이 들어갈 곳은 따로 있어요",
    desc: "고음에서 목이 조이는 건 재능 탓이 아니에요. 원래 힘이 들어가야 할 곳을 제대로 쓰면, 목 힘은 자연스럽게 풀려요.",
  },
  {
    label: "ARCHIVE",
    title: "기록이 남는 성장",
    desc: "레슨마다 녹음을 남기고, 레슨 사이에는 루틴과 코치 피드백이 이어져요. 한 달 전 녹음과 나란히 들으면 얼마나 왔는지 귀로 들려요.",
  },
];

const FOR_WHOM = [
  {
    label: "HOBBY",
    title: "취미 보컬",
    desc: "노래방만 가면 목이 잠기는 직장인, 한 곡만이라도 제대로 부르고 싶은 분. 음치·박치여도 지금 소리를 듣는 데서 시작해요.",
  },
  {
    label: "STAGE",
    title: "축가 · 오디션 · 무대",
    desc: "결혼식 축가, 오디션, 공연처럼 날짜가 정해진 무대를 앞둔 분. 그날 컨디션에 덜 흔들리도록, 부를 곡에서 가장 불안한 부분부터 잡아요.",
  },
  {
    label: "ADVANCED",
    title: "보컬트레이닝 심화",
    desc: "이미 노래하는 싱어, 버스킹·공연을 하는 분. 막혀 있던 음역을 깊은 발음으로 다시 열고, 쓸 수 있는 음색을 넓혀요.",
  },
];

const START_STEPS = [
  "먼저 3분 무료 발성 진단에서 다섯 가지 질문에 답해 보세요. 고음, 호흡, 실전 중 지금 가장 막히는 곳이 어디인지 큰 방향이 잡혀요. 건너뛰고 바로 상담을 신청하셔도 괜찮아요.",
  "네이버 예약으로 30분 무료 상담을 신청해요. 상담에서는 원장이 실제로 소리를 내 보시게 하고 지금 상태를 직접 들은 뒤, 어떤 연습부터 시작할지 같이 정해요.",
  "상담에서 들은 소리와 목표를 기준으로 수업을 골라요. 매일 혼자 연습할 루틴이 필요한 분, 매주 1:1로 소리를 잡아야 하는 분, 날짜가 정해진 무대를 준비하는 분은 출발점이 달라요.",
  "첫 수업부터는 깊은 발음으로 소리를 잡고, 그 소리로 노래하고, 녹음해서 확인하는 순서로 가요. 수업에서 바뀐 감각이 수업 밖에서도 남도록 연습 방법과 기록을 함께 챙겨요.",
];

const PRICED_PRODUCTS = PRODUCTS.filter((product) => product.id !== "crew");

function formatPrice(value: number) {
  return `${value.toLocaleString("ko-KR")}원`;
}

const STEPS = [
  {
    step: "01",
    title: "깊은 발음",
    desc: "혀를 뒤로·위로 보내 소리를 깊게 넣어요. 고음에서 목이 덜 조여요.",
  },
  {
    step: "02",
    title: "노래",
    desc: "잡은 소리로 바로 부르고 싶은 곡을 불러요.",
  },
  {
    step: "03",
    title: "녹음",
    desc: "레슨 끝에 한 곡을 녹음해 오늘의 소리를 남겨요.",
  },
  {
    step: "04",
    title: "다시 듣기",
    desc: "한 달마다 첫 녹음과 나란히 들으며 다음 방향을 정해요.",
  },
];

const FAQ = [
  {
    q: "음치·박치도 분당 보컬레슨을 받을 수 있나요?",
    a: "네. 모든 수업은 지금 소리를 듣는 데서 시작해요. 음정과 박자가 흔들리는 데에도 이유가 있어서, 원인을 찾으면 연습으로 달라져요. 지금 상태 그대로 오시면 돼요.",
  },
  {
    q: "레슨은 어떻게 진행되나요?",
    a: "1:1 맞춤 수업이에요. 첫 상담에서 지금 소리를 들은 뒤, 레슨마다 깊은 발음 → 노래 → 녹음 순서로 진행해요. 수업 사이에는 매일 루틴과 녹음 업로드, 코치 피드백이 이어져요.",
  },
  {
    q: "위치는 어디인가요? 분당 어디에서 다닐 수 있나요?",
    a: "경기도 성남시 분당구에 있어요. 정자동·서현동·수내동·이매동·야탑동·미금동·구미동과 판교 생활권, 가까운 용인 수지·죽전에서도 다니고 계세요. 정확한 위치는 무료 상담을 예약하실 때 알려 드려요.",
  },
  {
    q: "분당 보컬레슨 비용은 얼마인가요?",
    a: "주 1회 50분 1:1 레슨은 월 440,000원이고, 3개월 정기결제를 고르시면 월 420,000원이에요. 매일 혼자 하는 루틴에 주 1회 코치 피드백을 받는 데일리는 월 120,000원부터예요. 모든 금액은 VAT 포함이고, 어떤 수업이 맞는지는 30분 무료 상담에서 소리를 들어 본 뒤 같이 정해요.",
  },
  {
    q: "성인만 수강할 수 있나요? 직장인도 다닐 수 있나요?",
    a: "시선뮤직은 성인만 1:1로 가르쳐요. 처음 노래를 배우는 직장인, 오래 쉬었다가 다시 시작하는 분, 이미 노래하지만 한계를 느끼는 분이 함께 배우고 있어요. 수업 가능한 시간은 상담 때 일정에 맞춰 알려 드려요.",
  },
  {
    q: "축가처럼 날짜가 정해진 무대도 준비할 수 있나요?",
    a: "네. 결혼식 축가, 공연, 오디션처럼 날짜가 정해진 무대도 준비해요. 남은 기간과 부를 곡, 지금 소리 상태를 상담에서 같이 보고 필요한 수업 횟수와 순서를 정해요. 기간이 짧을수록 그 곡에서 가장 흔들리는 부분부터 잡아요.",
  },
  {
    q: "얼마나 다녀야 달라지나요?",
    a: "사람마다 달라요. 첫 수업에서 소리가 바뀌는 걸 느끼는 분은 많지만, 그 감각이 신경 쓰지 않아도 나오려면 반복이 필요해요. 그래서 수업 사이 연습 방법과 기록을 같이 챙기고, 달라진 건 녹음으로 비교해서 확인해요.",
  },
  {
    q: "상담은 어떻게 신청하나요?",
    a: "페이지 아래 무료 상담 버튼으로 네이버 예약을 남겨 주시면 돼요. 상담에서는 지금 소리를 같이 확인하고, 어떤 연습이 필요한지 방향부터 잡아 드려요.",
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
    name: "분당 보컬레슨 — 1:1 보컬 트레이닝",
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
      <SiteHeader />
      <div className={styles.inner}>
        <nav className={styles.breadcrumb} aria-label="브레드크럼">
          <Link href="/">홈</Link> <span aria-hidden>›</span> 분당보컬레슨
        </nav>

        <header className={styles.hero}>
          <span className={styles.kicker}>BUNDANG VOCAL LESSON</span>
          <h1 className={styles.title}>
            분당 보컬레슨,
            <br />
            세타쓴의 시선뮤직
          </h1>
          <p className={styles.lead}>
            유튜브 세타쓴 채널의 서영빈 원장이 성남시 분당구에서 모든 1:1 레슨을 직접 해요.
            고음에서 목이 조이고, 혼자 부르면 소리가 다시 돌아오는 분들이 가장 많이 찾아오세요.
          </p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            분당에 보컬레슨은 많아요. 시선뮤직은 이렇게 가르쳐요.
          </h2>
          <p className={styles.sectionBody}>
            레슨실에서는 좋아졌는데 혼자 부르면 다시 돌아오는 경험, 해 보셨을 거예요. 그래서
            노래 한 곡을 고치기 전에 소리가 나오는{" "}
            <Link className={styles.inlineLink} href="/vocal-correction">
              <strong>방법부터 바꿔요</strong>
            </Link>
            . 원래 힘이 들어가야 할 곳을 쓰게 되면, 수업이 끝난 뒤에도 소리가 남아요.
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
            분당 보컬레슨, 처음이라면 이렇게 시작해요
          </h2>
          <p className={styles.sectionBody}>
            보컬레슨을 처음 알아보면 무엇부터 해야 할지 막막하죠. 시선뮤직은 등록부터 하지 않고,
            지금 소리를 먼저 들어 보는 데서 시작해요.
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
            레슨은 이렇게 진행돼요 — 깊은 발음 · 노래 · 녹음
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
            시선뮤직은 성인만 가르치고, 대면 수업은 모두 1:1이에요. 금액은 VAT 포함이고,
            어떤 수업이 맞는지는 무료 상담에서 소리를 들어 본 뒤 같이 정해요.
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
            레슨비를 비교할 때는 한 달 금액만 보지 마세요. 한 번 수업이 몇 분인지, 그 시간이
            온전히 나에게 쓰이는 1:1인지, 수업 사이 연습을 누가 어떻게 봐 주는지에 따라 같은
            금액이어도 받는 게 크게 달라져요. 비교하는 기준은{" "}
            <Link
              className={styles.inlineLink}
              href="/guide/local-bundang/bundang-vocal-diagnosis-first"
            >
              분당 보컬레슨을 고르기 전에 확인할 것
            </Link>
            에 자세히 정리했어요.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            1:1 보컬레슨이 다른 점
          </h2>
          <p className={styles.sectionBody}>
            여러 명이 함께 듣는 수업에서는 같은 설명을 듣고 같은 연습을 해요. 그런데 목이 조이는
            이유도, 숨이 떨어지는 지점도 사람마다 달라요. 1:1 보컬레슨에서는 수업 시간 전부를 내
            소리에 써요. 지금 낸 소리를 바로 녹음해 듣고, 어디서 힘이 들어가는지 그 자리에서 짚고,
            내 몸에 맞는 방법으로 다시 내 봐요.
          </p>
          <p className={styles.sectionBody}>
            시선뮤직의 수업은 처음부터 끝까지 원장이 직접 맡아요. 상담에서 들은 소리와 수업에서
            바뀐 소리를 같은 사람이 계속 들으니까, 작은 변화도 놓치지 않고 다음으로 이어 갈 수 있어요.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            원장 직강 — 보컬트레이너 세타쓴(서영빈)
          </h2>
          <p className={styles.sectionBody}>
            시선뮤직의 모든 보컬레슨은 원장 <strong>세타쓴(서영빈)</strong>이
            직접 해요. 곡을 만드는 아티스트이자 보컬 트레이너로서, 무대에서 실제로 쓰이는 소리를
            기준으로 가르쳐요. 유튜브 영상에서 제 설명과 소리를 먼저 들어 보셔도 좋아요.
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
            분당 보컬레슨은 성남시 분당구에서 하고, 정확한 위치는 무료 상담을 예약하실 때 알려
            드려요. 정자·수내·서현 생활권은 물론 판교와 용인 수지·죽전에서도 다니고 계세요.
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
            분당 보컬레슨, 지금 소리부터 들려주세요
          </h2>
          <p className={styles.ctaDesc}>
            지금 소리를 같이 확인하고, 필요한 연습의 방향부터 잡아 드려요.
          </p>
          <KickoffCtaLink
            className={styles.ctaBtn}
            source="landing:bundang-vocal-lesson"
          />
          <Link className={styles.homeLink} href="/">
            세타쓴의 시선뮤직 홈 보기
          </Link>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
