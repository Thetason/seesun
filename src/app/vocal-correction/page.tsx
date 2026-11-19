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

const PAGE_PATH = "/vocal-correction";

const PAGE_TITLE = "발성교정 · 목조임 · 호흡 훈련 — 분당 1:1 보컬 트레이닝";
const PAGE_DESCRIPTION =
  "고음에서 목이 조이고 숨이 먼저 떨어진다면, 목에 힘을 빼려고 애쓰기보다 원래 힘이 들어가야 할 곳을 써야 해요. 잘 당기고 깊은 발음으로 넣는 법을 성남시 분당구에서 1:1로 잡아 드려요.";

export const metadata = buildMetadata({
  path: PAGE_PATH,
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  ogType: "article",
  image: "/images/coach/seo-youngbin-og-mic.jpg",
  keywords: [
    "발성교정",
    "목조임",
    "고음 목조임",
    "복식호흡 노래",
    "횡격막 호흡",
    "삑사리",
    "발성 훈련",
    "분당 보컬 트레이닝",
  ],
});

const SYMPTOMS = [
  {
    label: "TIGHTNESS",
    title: "고음만 가면 목이 잠긴다",
    desc: "높은 음에서 후두가 위로 딸려 올라가고, 목 바깥 근육이 대신 버텨요. 소리를 더 세게 밀수록 조임은 더 심해지고요. 아래에서 받쳐 줘야 할 힘이 비어 있을 때 이렇게 돼요.",
  },
  {
    label: "BREATH",
    title: "한 소절도 못 가고 숨이 떨어진다",
    desc: "숨을 많이 마셔도 첫 두 마디에서 한꺼번에 새어 나가면, 남은 구간은 목으로 버티게 돼요. 마신 숨을 붙잡아 두는 힘이 먼저 필요해요.",
  },
  {
    label: "CRACK",
    title: "같은 자리에서 늘 삑사리가 난다",
    desc: "삑사리는 실수라기보다 신호예요. 특정 음역에서 소리 쓰는 방법이 바뀌어야 하는데 몸이 준비되지 않으면, 매번 같은 자리에서 소리가 끊겨요.",
  },
  {
    label: "FATIGUE",
    title: "두세 곡이면 목이 쉰다",
    desc: "노래가 끝난 뒤 목이 아프다면 소리를 목으로 만들고 있을 가능성이 커요. 몸이 일을 나눠 갖기 시작하면 같은 시간을 불러도 남는 피로가 달라져요.",
  },
];

const METHOD_STEPS = [
  {
    step: "01",
    title: "힘이 들어갈 곳부터 찾아요",
    desc: "앞배만 당기면 목도 같이 조이기 쉬워요. 그래서 등 쪽과 몸 아래쪽까지 같이 쓰는 감각부터 잡아요.",
  },
  {
    step: "02",
    title: "잘 당기기",
    desc: "립트릴을 할 때 수동 발전기 줄을 당기듯 배를 당겨요. 소리를 힘으로 누르던 습관이 여기서 드러나고 풀려요.",
  },
  {
    step: "03",
    title: "깊은 발음",
    desc: "텅트릴과 '펍' 같은 소리로 혀를 뒤로, 위로 보내요. 고음이 지나갈 소리의 길이 여기서 만들어져요.",
  },
  {
    step: "04",
    title: "곡으로 옮기기",
    desc: "연습할 때만 되는 소리로 끝내지 않고, 실제 곡의 템포와 가사, 감정 안에서도 같은 소리가 나는지 녹음으로 확인해요.",
  },
];

const FAQ = [
  {
    q: "발성교정은 보통 얼마나 걸리나요?",
    a: "사람마다 달라요. 첫 레슨에서 달라진 느낌을 받는 경우는 많지만, 그 상태가 신경 쓰지 않아도 유지되려면 매일 반복이 필요해요. 그래서 주 1회 1:1 레슨과 매일 루틴을 같이 권해 드려요.",
  },
  {
    q: "혼자 복식호흡을 연습했는데 노래에는 안 쓰입니다.",
    a: "복식호흡을 배가 나오는 동작으로만 익히면 노래에서는 잘 쓰이지 않아요. 앞배만 당기면 목도 같이 조이기 쉬워서, 수업에서는 등 쪽과 몸 아래쪽까지 같이 쓰는 감각부터 잡아요.",
  },
  {
    q: "성대에 결절이나 통증이 있어도 받을 수 있나요?",
    a: "통증이 있거나 진단이 필요한 상태라면 먼저 이비인후과 진료를 받아 보시길 권해요. 시선뮤직은 의료 기관이 아니고, 소리를 쓰는 방법을 다루는 곳이에요. 치료가 끝난 뒤 다시 무너지지 않는 사용법을 만드는 단계에서 함께하는 게 순서예요.",
  },
  {
    q: "지금 상태를 먼저 확인해 볼 방법이 있나요?",
    a: "3분 무료 발성 진단에서 질문 다섯 개로 지금 가장 막히는 곳을 확인할 수 있어요. 결과에 따라 매일 루틴이 필요한지, 1:1 레슨이 필요한지 방향부터 알려 드려요.",
  },
];

const structuredData = [
  buildBreadcrumb(PAGE_PATH, [{ name: "발성교정", path: PAGE_PATH }]),
  buildServiceSchema({
    path: PAGE_PATH,
    name: "발성교정 — 1:1 보컬 트레이닝",
    serviceType: "발성교정",
    description: PAGE_DESCRIPTION,
  }),
  buildFaqSchema(PAGE_PATH, FAQ),
];

export default function VocalCorrectionPage() {
  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
      />
      <SiteHeader />
      <div className={styles.inner}>
        <nav className={styles.breadcrumb} aria-label="브레드크럼">
          <Link href="/">홈</Link> <span aria-hidden>›</span> 발성교정
        </nav>

        <header className={styles.hero}>
          <span className={styles.kicker}>VOCAL CORRECTION</span>
          <h1 className={styles.title}>
            목이 조이는 건
            <br />
            고음 탓이 아니에요
          </h1>
          <p className={styles.lead}>
            고음에서 목이 잠기고, 한 소절 만에 숨이 떨어지고, 늘 같은 자리에서 삑사리가 나죠.
            목에 힘을 빼려고 애쓸수록 더 안 빠지는 경우가 많아요. 원래 힘이 들어가야 할 곳을 제대로
            쓰면 목 힘은 자연스럽게 풀려요. 세타쓴의 시선뮤직은 성남시 분당구에서 그 방법을 1:1로
            잡아 드려요.
          </p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            지금 겪고 있는 증상은 무엇인가요
          </h2>
          <p className={styles.sectionBody}>
            증상은 달라도 원인은 자주 겹쳐요. 아래 네 가지는 발성교정을 찾는 분들이 가장 많이
            이야기하는 상태이고, 대부분 <strong>소리를 받쳐 줄 힘</strong>이 준비되지 않았을 때
            나타나요.
          </p>
          <div className={styles.grid}>
            {SYMPTOMS.map((card) => (
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
            잘 당기고, 깊은 발음으로 넣는 발성 훈련
          </h2>
          <p className={styles.sectionBody}>
            유튜브에서 &ldquo;고음이 잘 나려면 결국 두 가지면 된다&rdquo;고 말씀드렸던 게 이거예요.
            <strong>잘 당기고, 깊은 발음으로 잘 넣으면</strong> 고음은 자연스럽게 따라와요. 수업에서는
            이 감각이 레슨 밖에서도 남도록, 연습한 소리를 바로 노래와 녹음으로 확인해요.
          </p>
          <ol className={styles.steps}>
            {METHOD_STEPS.map((item) => (
              <li key={item.step} className={styles.card}>
                <span className={styles.cardLabel}>STEP {item.step}</span>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDesc}>{item.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>교정은 이렇게 이어져요</h2>
          <ul className={styles.checklist}>
            <li>
              먼저 지금 소리가 왜 그렇게 나는지 들어 봐요. 같은 증상이라도 원인이 다르면 연습이 달라져요.
            </li>
            <li>
              주 1회 50분 1:1 레슨에서 소리 쓰는 방법을 바꿔요 —{" "}
              <Link className={styles.inlineLink} href="/signature">
                1:1 레슨 · 주 1회 50분
              </Link>
              에서 해요.
            </li>
            <li>
              바뀐 감각은 매일 반복해야 남아요. 매일 아침 루틴과 코치 피드백은{" "}
              <Link className={styles.inlineLink} href="/spark">
                데일리
              </Link>
              가 맡아요.
            </li>
            <li>
              오래 굳은 패턴을 한 번에 다시 세워야 한다면, 주 2회 × 15주로
              몰아서 가는{" "}
              <Link className={styles.inlineLink} href="https://compression15.seesunmusic.com">
                컴프레션 15주
              </Link>
              가 있어요.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            가르치는 사람 — 보컬트레이너 세타쓴(서영빈)
          </h2>
          <p className={styles.sectionBody}>
            모든 발성교정 레슨은 원장 <strong>세타쓴(서영빈)</strong>이 직접 해요. 유튜브에서
            설명하는 그 방법을 수업에서 그대로 잡아 드려요. 영상에서 제 소리를 먼저 들어 보셔도 좋아요.
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
              href="https://thetason.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              세타쓴 공식 사이트
            </a>
          </div>
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

        <ReviewHighlights servicePath="/vocal-correction" styles={styles} />

        <RelatedGuides servicePath="/vocal-correction" styles={styles} />

        <div className={styles.cta}>
          <h2 className={styles.ctaTitle}>
            지금 막히는 지점부터 확인하세요
          </h2>
          <p className={styles.ctaDesc}>
            3분 무료 발성 진단으로 원인의 방향을 먼저 잡고, 상담에서 필요한 연습을 같이 정해요.
          </p>
          <KickoffCtaLink
            className={styles.ctaBtn}
            source="landing:vocal-correction"
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
