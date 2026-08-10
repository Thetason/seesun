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

const PAGE_PATH = "/vocal-correction";

const PAGE_TITLE = "발성교정 · 목조임 · 호흡 훈련 — D.A.P. 보컬 트레이닝";
const PAGE_DESCRIPTION =
  "고음에서 목이 조이고 숨이 먼저 떨어지는 이유는 대부분 목이 아니라 몸에 있습니다. 횡격막을 자동화하는 D.A.P.(Diaphragm Automatic Program) 트레이닝으로 발성의 토대를 다시 만듭니다. 성남시 분당구, 1:1 프라이빗 보컬 트레이닝.";

export const metadata = buildMetadata({
  path: PAGE_PATH,
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  ogType: "article",
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
    desc: "높은 음에서 후두가 위로 딸려 올라가고, 목 바깥 근육이 대신 버팁니다. 소리를 더 세게 밀수록 조임은 더 심해집니다. 원인은 고음이 아니라, 아래에서 받쳐야 할 압력이 비어 있다는 데 있습니다.",
  },
  {
    label: "BREATH",
    title: "한 소절도 못 가고 숨이 떨어진다",
    desc: "숨을 많이 마시는 문제가 아니라 마신 숨을 붙잡아 두지 못하는 문제입니다. 들이마신 공기가 첫 두 마디에서 한꺼번에 새어 나가면, 남은 구간은 목으로 버티게 됩니다.",
  },
  {
    label: "CRACK",
    title: "같은 자리에서 늘 삑사리가 난다",
    desc: "삑사리는 실수가 아니라 신호입니다. 특정 음역에서 성대의 사용 방식이 바뀌어야 하는데 몸이 준비되지 않으면, 매번 같은 자리에서 소리가 끊깁니다.",
  },
  {
    label: "FATIGUE",
    title: "두세 곡이면 목이 쉰다",
    desc: "노래가 끝난 뒤 목이 아프다면 소리를 목으로 만들고 있다는 뜻입니다. 몸이 일을 나눠 갖기 시작하면 같은 시간을 불러도 남는 피로가 달라집니다.",
  },
];

const DAP_STEPS = [
  {
    step: "01",
    title: "이너코어를 깨웁니다",
    desc: "숨을 잡아 두는 일은 배 근육을 조이는 것과 다릅니다. 몸 안쪽에서 압력을 만드는 근육들이 먼저 감각으로 살아나야 합니다.",
  },
  {
    step: "02",
    title: "횡격막을 자동화합니다",
    desc: "의식해서 쓰는 호흡은 노래에서 쓰이지 않습니다. D.A.P.는 생각하지 않아도 그 상태가 유지되도록 반복 설계로 만드는 과정입니다.",
  },
  {
    step: "03",
    title: "압력과 성대를 연결합니다",
    desc: "아래에서 압력이 올라오면 목은 버틸 이유가 없어집니다. 조임이 빠진 자리에서 고음의 여유와 음색의 선택지가 함께 열립니다.",
  },
  {
    step: "04",
    title: "곡으로 옮깁니다",
    desc: "훈련장에서만 되는 소리는 교정이 아닙니다. 실제 곡의 템포와 가사, 감정 안에서 같은 상태가 유지되는지까지 확인합니다.",
  },
];

const FAQ = [
  {
    q: "발성교정은 보통 얼마나 걸리나요?",
    a: "사람마다 다릅니다. 다만 감각이 바뀌는 것과 그 감각이 몸에 남는 것은 다른 일입니다. 첫 세션에서 달라진 느낌을 받는 경우는 많지만, 그 상태가 의식하지 않아도 유지되려면 매일의 반복이 필요합니다. 그래서 시선뮤직은 주 1회 트레이닝과 매일의 루틴을 한 세트로 운영합니다.",
  },
  {
    q: "혼자 복식호흡을 연습했는데 노래에는 안 쓰입니다.",
    a: "복식호흡을 배가 나오는 동작으로만 익히면 노래에서는 쓰이지 않습니다. 노래에 필요한 것은 호흡의 모양이 아니라 숨을 붙잡아 두는 압력이고, 그 압력은 이너코어가 만듭니다. D.A.P.는 이 부분을 동작이 아니라 감각과 자동화로 다룹니다.",
  },
  {
    q: "성대에 결절이나 통증이 있어도 받을 수 있나요?",
    a: "통증이 있거나 진단이 필요한 상태라면 먼저 이비인후과 진료를 권해 드립니다. 시선뮤직은 의료 기관이 아니며, 발성의 사용 방식을 다루는 곳입니다. 치료가 끝난 뒤 다시 무너지지 않는 사용법을 만드는 단계에서 함께하는 것이 순서입니다.",
  },
  {
    q: "지금 상태를 먼저 확인해 볼 방법이 있나요?",
    a: "3분 무료 발성 진단에서 질문 다섯 개로 지금 가장 막히는 지점을 확인할 수 있습니다. 진단 결과에 따라 매일의 루틴이 필요한지, 1:1 트레이닝이 필요한지 방향을 먼저 안내드립니다.",
  },
];

const structuredData = [
  buildBreadcrumb(PAGE_PATH, [{ name: "발성교정", path: PAGE_PATH }]),
  buildServiceSchema({
    path: PAGE_PATH,
    name: "발성교정 — D.A.P. 보컬 트레이닝",
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
      <div className={styles.inner}>
        <header className={styles.siteHeader}>
          <Link href="/" aria-label="시선뮤직 홈" style={{ textDecoration: "none" }}>
            <BrandLogo compact surface="dark" />
          </Link>
        </header>
        <nav className={styles.breadcrumb} aria-label="브레드크럼">
          <Link href="/">홈</Link> <span aria-hidden>›</span> 발성교정
        </nav>

        <header className={styles.hero}>
          <span className={styles.kicker}>VOCAL CORRECTION · D.A.P.</span>
          <h1 className={styles.title}>
            목이 조이는 건
            <br />
            고음 탓이 아닙니다
          </h1>
          <p className={styles.lead}>
            고음에서 목이 잠기고, 한 소절 만에 숨이 떨어지고, 늘 같은 자리에서
            삑사리가 납니다. 대부분은 목을 고쳐서 풀리지 않습니다. 소리를 받치는
            몸이 비어 있기 때문입니다. 시선뮤직 아티스트클럽은 성남시 분당구에서
            횡격막을 자동화하는 D.A.P. 트레이닝으로 발성의 토대부터 다시
            만듭니다.
          </p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            지금 겪고 있는 증상은 무엇인가요
          </h2>
          <p className={styles.sectionBody}>
            증상은 달라도 원인은 자주 겹칩니다. 아래 네 가지는 발성교정을 찾는
            분들이 가장 많이 이야기하는 상태이고, 전부{" "}
            <strong>압력을 만드는 몸</strong>이 준비되지 않았을 때 나타납니다.
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
            D.A.P. — 횡격막을 자동화하는 발성 훈련
          </h2>
          <p className={styles.sectionBody}>
            D.A.P.는 Diaphragm Automatic Program의 약자입니다. 정파 벨칸토
            계열의 발성 원리를 바탕으로,{" "}
            <strong>의식하지 않아도 유지되는 호흡 상태</strong>를 만드는 데
            목표를 둡니다. 레슨 중에만 되는 소리가 아니라, 레슨이 끝난 뒤에도
            남는 소리를 만들기 위한 순서입니다.
          </p>
          <ol className={styles.steps}>
            {DAP_STEPS.map((item) => (
              <li key={item.step} className={styles.card}>
                <span className={styles.cardLabel}>STEP {item.step}</span>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDesc}>{item.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>교정은 이렇게 이어집니다</h2>
          <ul className={styles.checklist}>
            <li>
              먼저 지금 소리가 왜 그렇게 나는지 진단합니다. 같은 증상이라도
              원인이 다르면 처방이 달라집니다.
            </li>
            <li>
              주 1회 50분 1:1 트레이닝에서 몸의 사용을 바꿉니다 —{" "}
              <Link className={styles.inlineLink} href="/signature">
                시선 시그니처 1:1 보컬 트레이닝
              </Link>
              에서 진행합니다.
            </li>
            <li>
              바뀐 감각은 매일 반복해야 남습니다. 매일 아침 루틴과 코치 피드백은{" "}
              <Link className={styles.inlineLink} href="/spark">
                데일리 멤버십
              </Link>
              이 담당합니다.
            </li>
            <li>
              마지막은 무대입니다. 실전에서 무너지지 않는 상태까지 가려면{" "}
              <Link className={styles.inlineLink} href="/reserve">
                15주 마스터 프로토콜
              </Link>
              처럼 실전 세션이 포함된 과정이 필요합니다.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            가르치는 사람 — 보컬트레이너 세타쓴(서영빈)
          </h2>
          <p className={styles.sectionBody}>
            모든 발성교정 세션은 원장 <strong>세타쓴(서영빈)</strong>이 직접
            진행합니다. D.A.P.를 설계한 사람이 그대로 가르칩니다. 커리큘럼
            설명보다, 가르치는 사람이 실제로 내는 소리로 판단해 주세요.
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

        <div className={styles.cta}>
          <h2 className={styles.ctaTitle}>
            지금 막히는 지점부터 확인하세요
          </h2>
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
              <Link href="/bundang-vocal-lesson">분당 보컬레슨 안내</Link>
            </li>
            <li>
              <Link href="/adult-vocal-lesson">성인 보컬레슨 · 취미 보컬</Link>
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
            구미동 · 판교 · 용인 수지 발성교정
          </p>
          <p className={styles.footerCopy}>
            &copy; 2026 SEE:SUN MUSIC All Rights Reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
