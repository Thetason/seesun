import Link from "next/link";
import {
  buildBreadcrumb,
  buildFaqSchema,
  buildMetadata,
  buildServiceSchema,
  jsonLd,
} from "@/lib/seo";
import { KickoffCtaLink } from "@/components/marketing/KickoffCtaLink";
import { RelatedGuides } from "@/components/content/RelatedGuides";
import { ReviewHighlights } from "@/components/content/ReviewHighlights";
import styles from "@/styles/keyword-landing.module.css";
import { SiteFooter, SiteHeader } from "@/components/site/SiteChrome";

const PAGE_PATH = "/adult-vocal-lesson";

const PAGE_TITLE = "성인 보컬레슨 · 취미 보컬 트레이닝";
const PAGE_DESCRIPTION =
  "입시가 아니라, 지금의 목소리를 위한 성인 보컬레슨. 성남시 분당구 1:1 스튜디오에서 호흡과 발성의 기본부터 다시 잡아요. 매일 루틴을 받는 데일리 월 120,000원부터 주 1회 1:1 레슨까지, 목표에 맞는 방식을 고르세요.";

export const metadata = buildMetadata({
  path: PAGE_PATH,
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  ogType: "article",
  image: "/images/coach/seo-youngbin-og-guitar.jpg",
  keywords: [
    "성인 보컬레슨",
    "취미 보컬",
    "직장인 보컬레슨",
    "1:1 보컬레슨",
    "40대 노래 배우기",
    "분당 보컬레슨",
    "성인 보컬 트레이닝",
  ],
});

const WORRIES = [
  {
    label: "AGE",
    title: "이 나이에 시작해도 되나요",
    desc: "발성은 재능보다 몸을 쓰는 방법에 가까워서, 나이와 상관없이 바뀌어요. 오히려 내 목소리를 정확히 듣는 귀는 시간이 지날수록 좋아져요.",
  },
  {
    label: "TALENT",
    title: "음치·박치라고 들어왔습니다",
    desc: "음정과 박자가 흔들리는 데에도 이유가 있어요. 소리를 만드는 몸이 불안정한 경우가 많고, 원인을 찾으면 연습으로 달라져요. 지금 상태 그대로 오시면 돼요.",
  },
  {
    label: "TIME",
    title: "매주 시간을 낼 자신이 없습니다",
    desc: "주 1회도 부담스러운 시기가 있죠. 그래서 매일 10분 루틴으로 시작하는 방법도 있어요. 생활에 맞는 밀도를 먼저 고르는 편이 오래가요.",
  },
  {
    label: "PURPOSE",
    title: "가수가 될 생각은 없습니다",
    desc: "여기는 입시를 준비하는 곳이 아니에요. 노래방에서 목이 잠기지 않는 것, 축가 한 곡을 무사히 마치는 것, 취미를 오래 이어 가는 것 모두 충분한 목표예요.",
  },
];

const PATHS = [
  {
    label: "DAILY",
    title: "매일 10분으로 시작하기",
    desc: "매일 아침 보컬 루틴이 도착하고, AI가 바로 분석하고, 일주일에 한 번 원장이 방향을 잡아 드려요. 월 120,000원(VAT 포함). 혼자 연습해도 방향이 틀어지지 않게 잡아 주는 구성이에요.",
    href: "/spark",
    linkText: "데일리 자세히 보기",
  },
  {
    label: "SIGNATURE",
    title: "주 1회 1:1로 몸부터 바꾸기",
    desc: "주 1회 50분, 한 달 네 번 1:1 레슨이에요. 월 440,000원(VAT 포함), 3개월 정기결제 시 월 420,000원. 발성의 기본을 원장과 직접 다시 잡아요.",
    href: "/signature",
    linkText: "1:1 레슨 자세히 보기",
  },
  {
    label: "COMPRESSION 15",
    title: "굳은 패턴을 15주 안에 다시 세우기",
    desc: "주 2회 70분 × 15주, 30회 전부 1:1로 하는 집중 과정이에요. 기수제로 운영하고, 완주하면 6개월 애프터케어가 이어져요.",
    href: "https://compression15.seesunmusic.com",
    linkText: "컴프레션 15주 자세히 보기",
  },
];

const FAQ = [
  {
    q: "성인 보컬레슨은 입시 수업과 무엇이 다른가요?",
    a: "입시는 정해진 심사 기준에 맞춰 짧은 기간에 결과를 만드는 과정이에요. 성인 레슨은 10년 뒤에도 무너지지 않는 사용법을 만드는 데 시간을 써요. 그래서 첫 수업도 노래보다 지금 소리를 듣는 데서 시작해요.",
  },
  {
    q: "노래방에서만 목이 잠기는데 이것도 상담 대상인가요?",
    a: "네. 특정 상황에서만 무너진다면 소리 자체보다 그 상황에서 몸을 쓰는 방법에 원인이 있는 경우가 많아요. 어떤 곡에서, 어느 음에서, 몇 곡째부터 무너지는지가 출발점이에요.",
  },
  {
    q: "직장인이라 저녁이나 주말만 가능합니다.",
    a: "1:1이라 시간은 상담에서 같이 맞춰요. 가능한 시간대를 무료 상담 때 말씀해 주시면 일정이 맞는지 먼저 확인해 드려요.",
  },
  {
    q: "어떤 것부터 시작해야 할지 모르겠습니다.",
    a: "3분 무료 발성 진단에서 질문 다섯 개에 답하면 지금 가장 막히는 곳과 맞는 시작 방법을 알려 드려요. 결제나 등록 없이 할 수 있어요.",
  },
];

const structuredData = [
  buildBreadcrumb(PAGE_PATH, [{ name: "성인 보컬레슨", path: PAGE_PATH }]),
  {
    ...buildServiceSchema({
      path: PAGE_PATH,
      name: "성인 보컬레슨 — 취미 보컬 트레이닝",
      serviceType: "성인 보컬레슨",
      description: PAGE_DESCRIPTION,
    }),
    audience: { "@type": "Audience", audienceType: "성인 · 직장인 취미 보컬" },
  },
  buildFaqSchema(PAGE_PATH, FAQ),
];

export default function AdultVocalLessonPage() {
  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
      />
      <SiteHeader />
      <div className={styles.inner}>
        <nav className={styles.breadcrumb} aria-label="브레드크럼">
          <Link href="/">홈</Link> <span aria-hidden>›</span> 성인 보컬레슨
        </nav>

        <header className={styles.hero}>
          <span className={styles.kicker}>ADULT VOCAL LESSON</span>
          <h1 className={styles.title}>
            노래를 다시 배우기로 한
            <br />
            어른들에게
          </h1>
          <p className={styles.lead}>
            학생 때 배우지 못했거나, 배웠지만 오래 쉬었거나, 혼자 부르다 한계를 느낀 분들이
            성남시 분당구의 이곳에 오세요. 시작이 늦었다고 생각하셔도 괜찮아요. 시선뮤직의 성인
            보컬레슨은 지금의 목소리에서 시작해요.
          </p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            시작 전에 가장 많이 하시는 걱정
          </h2>
          <div className={styles.grid}>
            {WORRIES.map((card) => (
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
            성인 보컬레슨을 시작하는 세 가지 방식
          </h2>
          <p className={styles.sectionBody}>
            같은 레슨을 만나는 횟수만 다르게 운영해요. 지금 생활과 목표에 맞는 것부터 고르시면
            되고, 중간에 옮겨도 돼요. 모든 금액은 VAT 포함이에요.
          </p>
          <div className={styles.grid}>
            {PATHS.map((card) => (
              <div key={card.label} className={styles.card}>
                <span className={styles.cardLabel}>{card.label}</span>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardDesc}>{card.desc}</p>
                <p className={styles.cardDesc} style={{ marginTop: "12px" }}>
                  <Link className={styles.inlineLink} href={card.href}>
                    {card.linkText}
                  </Link>
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            어른의 발성, 힘이 들어갈 곳부터 다시 잡아요
          </h2>
          <p className={styles.sectionBody}>
            성인 수강생이 가장 많이 이야기하는 문제는 고음 조임과 짧은 호흡이에요. 목에 힘을
            빼려고 애쓰기보다, <strong>원래 힘이 들어가야 할 곳</strong>을 쓰는 데서 시작해요.
            자세한 원리와 연습 순서는{" "}
            <Link className={styles.inlineLink} href="/vocal-correction">
              발성교정 안내
            </Link>
            에 정리해 두었어요.
          </p>
          <ul className={styles.checklist}>
            <li>첫 레슨은 지금 소리를 듣는 데서 시작해요.</li>
            <li>
              같은 증상이라도 원인이 다르면 연습이 달라져서, 사람마다 다른 방법을 정해 드려요.
            </li>
            <li>
              레슨 사이의 매일이 실력을 만들어요. 루틴과 녹음 업로드, 코치 피드백이 이어져요.
            </li>
            <li>
              모든 레슨은{" "}
              <Link className={styles.inlineLink} href="/coach">
                원장 세타쓴(서영빈)
              </Link>
              이 직접 해요.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>수강 가능 지역</h2>
          <p className={styles.areas}>
            성남시 분당구 어디서든 다니실 수 있어요 — 정자동 · 서현동 ·
            수내동 · 이매동 · 야탑동 · 미금동 · 구미동 · 판교(백현동 · 삼평동 ·
            운중동)
            <br />
            인근 생활권 — 용인 수지 · 죽전 · 성남 수정구 · 중원구 · 광주 · 하남
            <br />
            정확한 위치는 무료 상담 예약 때 알려 드려요. 지역별 안내는{" "}
            <Link className={styles.inlineLink} href="/bundang-vocal-lesson">
              분당 보컬레슨 페이지
            </Link>
            에서도 확인하실 수 있어요.
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

        <ReviewHighlights servicePath="/adult-vocal-lesson" styles={styles} />

        <RelatedGuides servicePath="/adult-vocal-lesson" styles={styles} />

        <div className={styles.cta}>
          <h2 className={styles.ctaTitle}>
            지금 목소리부터 같이 들어 봐요
          </h2>
          <p className={styles.ctaDesc}>
            무료 상담은 서로 맞는지 확인하는 30분이에요. 등록을 전제로 하지 않아요.
          </p>
          <KickoffCtaLink
            className={styles.ctaBtn}
            source="landing:adult-vocal-lesson"
          />
          <Link className={styles.homeLink} href="/diagnosis">
            먼저 3분 무료 발성 진단 해보기
          </Link>
        </div>

      </div>
      <SiteFooter />
    </div>
  );
}
