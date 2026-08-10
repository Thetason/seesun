import Link from "next/link";
import { BrandLogo } from "@/components/marketing/BrandLogo";
import {
  buildBreadcrumb,
  buildFaqSchema,
  buildMetadata,
  buildServiceSchema,
  jsonLd,
} from "@/lib/seo";
import { KICKOFF_CTA_LABEL, SMARTPLACE_URL } from "@/lib/site";
import styles from "@/styles/keyword-landing.module.css";

const PAGE_PATH = "/adult-vocal-lesson";

const PAGE_TITLE = "성인 보컬레슨 · 취미 보컬 트레이닝";
const PAGE_DESCRIPTION =
  "입시가 아니라, 지금의 목소리를 위한 성인 보컬레슨. 성남시 분당구 1:1 프라이빗 스튜디오에서 호흡과 발성의 기본부터 다시 세웁니다. 매일 루틴을 받는 데일리 월 120,000원부터 주 1회 1:1 시그니처까지, 목표에 맞는 방식을 고르세요.";

export const metadata = buildMetadata({
  path: PAGE_PATH,
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  ogType: "article",
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
    desc: "발성은 재능이 아니라 몸의 사용법입니다. 몸을 쓰는 방식은 나이와 무관하게 바뀝니다. 오히려 자기 목소리를 정확히 듣는 귀는 시간이 지날수록 좋아집니다.",
  },
  {
    label: "TALENT",
    title: "음치·박치라고 들어왔습니다",
    desc: "음정과 박자가 흔들리는 원인 대부분은 소리를 만드는 몸이 불안정하기 때문입니다. 원인이 몸에 있다면 훈련으로 바뀝니다. 지금 상태 그대로 오시면 됩니다.",
  },
  {
    label: "TIME",
    title: "매주 시간을 낼 자신이 없습니다",
    desc: "주 1회조차 부담스러운 시기가 있습니다. 그래서 매일 10분 루틴으로 시작하는 방식도 준비했습니다. 생활에 맞는 밀도를 먼저 고르는 편이 오래갑니다.",
  },
  {
    label: "PURPOSE",
    title: "가수가 될 생각은 없습니다",
    desc: "여기는 입시를 준비하는 곳이 아닙니다. 노래방에서 목이 잠기지 않는 것, 축가 한 곡을 무사히 마치는 것, 취미를 오래 이어가는 것 — 전부 충분한 목표입니다.",
  },
];

const PATHS = [
  {
    label: "DAILY",
    title: "매일 10분으로 시작하기",
    desc: "매일 아침 보컬 루틴이 도착하고, AI가 그 자리에서 분석하고, 코치가 주 1회 방향을 확정합니다. 월 120,000원(VAT 포함). 혼자 연습해도 방향이 틀어지지 않게 잡아 주는 구성입니다.",
    href: "/spark",
    linkText: "데일리 멤버십 자세히 보기",
  },
  {
    label: "SIGNATURE",
    title: "주 1회 1:1로 몸부터 바꾸기",
    desc: "주 1회 50분, 월 4회 1:1 트레이닝. 월 440,000원(VAT 포함), 3개월 정기결제 시 월 420,000원. 발성의 토대를 코치와 직접 다시 설계하는 정식 멤버십입니다.",
    href: "/signature",
    linkText: "시선 시그니처 자세히 보기",
  },
  {
    label: "PROTOCOL",
    title: "무대에서 한 곡을 해내기",
    desc: "주 2회, 총 30회 이상의 프라이빗 세션과 실전 세션으로 15주를 채우고 졸업공연으로 마무리합니다. 3,800,000원(VAT 포함), 분기 정원 5명.",
    href: "/reserve",
    linkText: "15주 마스터 프로토콜 자세히 보기",
  },
];

const FAQ = [
  {
    q: "성인 보컬레슨은 입시 수업과 무엇이 다른가요?",
    a: "입시는 정해진 심사 기준에 맞춰 짧은 기간에 결과를 만드는 과정입니다. 성인 트레이닝은 반대입니다. 지금 당장의 점수가 아니라, 10년 뒤에도 무너지지 않는 사용법을 만드는 데 시간을 씁니다. 그래서 첫 수업이 노래가 아니라 진단에서 시작합니다.",
  },
  {
    q: "노래방에서만 목이 잠기는데 이것도 상담 대상인가요?",
    a: "네. 특정 상황에서만 무너진다면 소리 자체보다 그 상황에서의 몸 사용에 원인이 있는 경우가 많습니다. 어떤 곡에서, 어느 음에서, 몇 곡째부터 무너지는지가 진단의 출발점입니다.",
  },
  {
    q: "직장인이라 저녁이나 주말만 가능합니다.",
    a: "1:1로 운영하기 때문에 시간은 상담에서 함께 조율합니다. 가능한 시간대를 무료 킥오프 상담 때 말씀해 주시면 일정이 맞는지 먼저 확인해 드립니다.",
  },
  {
    q: "어떤 것부터 시작해야 할지 모르겠습니다.",
    a: "3분 무료 발성 진단에서 질문 다섯 개에 답하면 지금 가장 막히는 지점과 그에 맞는 시작 방식을 안내받을 수 있습니다. 결제나 등록 없이 진행됩니다.",
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
      <div className={styles.inner}>
        <header className={styles.siteHeader}>
          <Link href="/" aria-label="시선뮤직 홈" style={{ textDecoration: "none" }}>
            <BrandLogo compact surface="dark" />
          </Link>
        </header>
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
            학생 때 배우지 못했거나, 배웠지만 오래 쉬었거나, 혼자 부르다 한계를
            느꼈거나. 시작이 늦었다고 생각하는 분들이 성남시 분당구의 이곳에
            옵니다. 시선뮤직 아티스트클럽의 성인 보컬 트레이닝은 입시가 아니라
            지금의 목소리를 기준으로 설계됩니다.
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
            같은 트레이닝을 밀도만 다르게 운영합니다. 지금의 생활과 목표에 맞는
            것부터 고르시면 되고, 도중에 옮기는 것도 가능합니다. 모든 금액은
            VAT 포함 기준입니다.
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
            어른의 발성은 몸부터 다시 만듭니다
          </h2>
          <p className={styles.sectionBody}>
            성인 수강생이 가장 많이 이야기하는 문제는 고음 조임과 짧은
            호흡입니다. 시선뮤직은 이 문제를 목이 아니라{" "}
            <strong>횡격막과 이너코어</strong>에서 다룹니다. 자세한 원리와 훈련
            순서는{" "}
            <Link className={styles.inlineLink} href="/vocal-correction">
              발성교정 · D.A.P. 안내
            </Link>
            에 정리해 두었습니다.
          </p>
          <ul className={styles.checklist}>
            <li>첫 세션은 노래가 아니라 진단으로 시작합니다.</li>
            <li>
              같은 증상이라도 원인이 다르면 훈련이 달라집니다. 사람마다 다른
              처방을 설계합니다.
            </li>
            <li>
              수업 사이의 매일이 실력을 만듭니다. 루틴과 음성 업로드, 코치
              피드백이 이어집니다.
            </li>
            <li>
              모든 세션은 원장 세타쓴(서영빈)이 직접 진행합니다.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>수강 가능 지역</h2>
          <p className={styles.areas}>
            성남시 분당구 전 지역에서 다니실 수 있습니다 — 정자동 · 서현동 ·
            수내동 · 이매동 · 야탑동 · 미금동 · 구미동 · 판교(백현동 · 삼평동 ·
            운중동)
            <br />
            인근 생활권 — 용인 수지 · 죽전 · 성남 수정구 · 중원구 · 광주 · 하남
            <br />
            정확한 위치는 무료 킥오프 상담 예약 시 안내드립니다. 지역별 안내는{" "}
            <Link className={styles.inlineLink} href="/bundang-vocal-lesson">
              분당 보컬레슨 페이지
            </Link>
            에서도 확인하실 수 있습니다.
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
            지금의 목소리부터 함께 확인하겠습니다
          </h2>
          <p className={styles.ctaDesc}>
            무료 킥오프 상담은 서로 맞는지 확인하는 30분입니다. 등록을 전제로
            하지 않습니다.
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
              <Link href="/bundang-vocal-lesson">분당 보컬레슨 안내</Link>
            </li>
            <li>
              <Link href="/vocal-correction">발성교정 · 목조임 훈련</Link>
            </li>
            <li>
              <Link href="/signature">1:1 보컬 트레이닝 시그니처</Link>
            </li>
            <li>
              <Link href="/spark">매일 보컬 연습 루틴 데일리</Link>
            </li>
            <li>
              <Link href="/reserve">15주 마스터 프로토콜</Link>
            </li>
            <li>
              <Link href="/diagnosis">3분 무료 발성 진단</Link>
            </li>
          </ul>
          <p className={styles.footerAreas}>
            성남시 분당구 · 정자동 · 서현동 · 수내동 · 이매동 · 야탑동 · 미금동 ·
            구미동 · 판교 · 용인 수지 성인 보컬레슨
          </p>
          <p className={styles.footerCopy}>
            &copy; 2026 SEE:SUN MUSIC All Rights Reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
