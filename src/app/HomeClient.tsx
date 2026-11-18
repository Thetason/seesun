"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { trackKickoff } from "@/lib/kickoff";
import {
  COMPRESSION15_URL,
  PRODUCTS,
  RECORD_REVIEWS_URL,
  SMARTPLACE_URL,
  THETASON_LINKS,
} from "@/lib/site";
import s from "./home.module.css";

const YOUTUBE_URL = THETASON_LINKS.find((url) => url.includes("youtube.com")) ?? "";
const INSTAGRAM_URL = THETASON_LINKS.find((url) => url.includes("instagram.com")) ?? "";
const BLOG_URL = THETASON_LINKS.find((url) => url.includes("blog.naver.com")) ?? "";
const HIT_VIDEO_URL = "https://www.youtube.com/watch?v=Uc_RBUmjEYk";

const won = (amount: number) => `${amount.toLocaleString("ko-KR")}원`;
const productById = (id: string) => {
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) throw new Error(`Unknown product: ${id}`);
  return product;
};
const signature = productById("signature");
const daily = productById("daily");
const dailyFeedback = productById("daily-feedback");
const crew = productById("crew");

const REEL_SCENES = Array.from({ length: 11 }, (_, i) => `/images/home/reel/s${String(i + 1).padStart(2, "0")}.jpg`);

const PAINS = [
  ["고음만 올라가면", "목이 꽉 조여요."],
  ["목에 힘 빼라는데,", "그게 마음대로 안 돼요."],
  ["노래방만 가면", "마음이 졸여요."],
  ["혼자 연습하는데", "맞게 하는 건지 모르겠어요."],
] as const;

type Review = { before?: string; highlight: string; after?: string; author: string; meta: string };

// Excerpts quoted verbatim from Re:cord (see src/lib/content/reviews.ts).
const REVIEWS: readonly Review[] = [
  { highlight: "한번만에 소리가 바뀔꺼라고 생각못했는데 진짜 깜짝놀랐어요.", after: " 정말 잘 가르치시네요..! 또 찾아뵐께요.", author: "보컬꿈나무", meta: "첫 수업 · 2026.04" },
  { before: "저의 부족한 부분에 대해 바로 설명해주시고, 바로 연습해보고 반영할 수 있게 해주셔서 감사했습니다! ", highlight: "처음녹음과 마지막녹음이 확연히 나서 진짜 신기했어요 ㅎㅎ", author: "은*라", meta: "녹음 피드백 · 2026.04" },
  { before: "완전 족집게 슨생님입니다. 제가 가지고 있던 틀을 발견할 수 있는 시간 이었습니다. ", highlight: "바로 소리가 바뀌는 걸 보고 놀랐고 너무 재밌었습니다", author: "최*온", meta: "수업 방식 · 2026.04" },
  { before: "생애 첫 축가를 위해 레슨을 받았습니다. 제 부족한 부분을 콕콕 찝어 트레이닝 해주셨고 신경도 많이 써주셨어요. ", highlight: "당일 잘불렀다는 칭찬도 들었고 친구에게 너무 고맙다는 말도 들었습니다.", author: "Colin K.", meta: "축가 준비 · 2026.04" },
  { before: "50분 수업이 기본이었지만 ", highlight: "한시간이 넘도록 잘 봐주셨고", after: " 연습 방법이나 노래의 감등 여러가지 면에서 많은 노하우들을 받아갑니다.", author: "김*후", meta: "1:1 레슨 · 2026.04" },
  { before: "쌤이 발성이나 이런 걸 가르쳐 주실때 이해하기 쉽고 되게 효율적이게 가르쳐주셨다. ", highlight: "그리고 되게 삼촌 같았다", author: "이*우", meta: "취미 보컬 · 2025.11" },
];

const FAQS = [
  ["노래를 한 번도 배운 적 없는데 괜찮을까요?", "괜찮아요. 발성 이론을 몰라도 돼요. 영상에서처럼 발전기, 치즈스틱 같은 생활 속 예시로 풀어서 설명해 드려요."],
  ["어디서 수업하나요?", "경기 성남시 분당구에 있는 시선뮤직 스튜디오예요. 정확한 위치는 상담 예약 때 안내해 드려요."],
  ["상담은 정말 무료인가요?", "네, 30분 무료예요. 제가 직접 소리를 듣고 지금 어디서 막히는지, 어떤 수업이 맞을지 말씀드려요."],
  ["유튜브 영상만 보고 따라 해도 되지 않나요?", "영상만으로 좋아지는 분도 많아요. 다만 혼자서는 맞게 하고 있는지 확인하기가 어려워요. 수업에서는 그 자리에서 듣고 바로 고쳐 드려요."],
] as const;

// Internal links kept from the previous home footer for crawl paths.
const FOOTER_LINKS = [
  ["/bundang-vocal-lesson", "분당 보컬레슨 안내"],
  ["/adult-vocal-lesson", "성인 보컬레슨 · 취미 보컬"],
  ["/vocal-correction", "발성교정 · 목조임 훈련"],
  ["/signature", "1:1 레슨 · 주 1회 50분"],
  ["/spark", "데일리 피드백"],
  [COMPRESSION15_URL, "컴프레션 15주"],
  ["/diagnosis", "3분 무료 발성 진단"],
  ["/guide", "발성 가이드"],
  ["/coach", "원장 소개"],
  ["/reviews", "수강생 후기"],
  ["https://thetason.com", "보컬트레이너 세타쓴"],
] as const;

function BookingLink({ source, className, children }: { source: string; className: string; children: ReactNode }) {
  return (
    <a href={SMARTPLACE_URL} target="_blank" rel="noopener noreferrer" className={className} onClick={() => trackKickoff(source)}>
      {children}
    </a>
  );
}

function LoopVideo({ name }: { name: string }) {
  return (
    <video
      src={`/images/home/${name}.mp4`}
      poster={`/images/home/${name}.jpg`}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
    />
  );
}

export default function HomeClient() {
  const orange = `${s.btn} ${s.btnOrange}`;
  const khaki = `${s.btn} ${s.btnKhaki}`;

  return (
    <div className={s.page}>
      <header className={s.header}>
        <div className={`${s.wrap} ${s.headerInner}`}>
          <Link className={s.brand} href="/">
            <Image src="/brand/seesun-mark.png" alt="" width={34} height={31} priority />
            <span>
              <span className={s.brandName}>
                <span>세타쓴</span>의 시선뮤직
              </span>
              <span className={s.brandSub}>분당 1:1 보컬레슨</span>
            </span>
          </Link>
          <nav className={s.nav} aria-label="홈 메뉴">
            <a className={s.navLink} href="#method">수업 방식</a>
            <a className={s.navLink} href="#reviews">후기</a>
            <a className={s.navLink} href="#programs">수업 고르기</a>
            <BookingLink source="header" className={orange}>무료 상담 예약</BookingLink>
          </nav>
        </div>
      </header>

      <main>
        <div className={s.hero}>
          <div className={`${s.wrap} ${s.heroGrid}`}>
            <div>
              <h1 className={s.overline}>분당 1:1 보컬레슨 · 세타쓴의 시선뮤직</h1>
              <span className={s.eyebrow}>
                <i aria-hidden="true">▶</i>유튜브 세타쓴 채널에서 오셨다면
              </span>
              <p className={s.headline}>
                고음이 잘 나려면
                <br />
                결국 두 가지면 돼요.
                <span className={s.headlineL2}>
                  <span className={s.subBox}>잘 당기고,</span> <span className={s.subBox}>깊은 발음으로</span>
                </span>
              </p>
              <p className={s.lead}>
                영상 보고 혼자 따라 하다 막히는 부분, <b>분당 스튜디오에서 1:1로</b> 같이 잡아 드릴게요.
              </p>
              <div className={s.ctas}>
                <BookingLink source="home_hero" className={orange}>무료 상담 30분 예약</BookingLink>
                <a className={khaki} href="#programs">수업 고르기 ↓</a>
              </div>
              <p className={s.heroNote}>상담 때 제가 직접 소리를 듣고, 어떤 수업이 맞을지 말씀드려요.</p>
            </div>
            <div className={s.playerWrap}>
              <div className={s.player}>
                <LoopVideo name="clip-hero" />
                <div className={s.playerBar}>
                  <Image src="/images/coach/seo-youngbin-portrait.jpg" alt="" width={36} height={36} />
                  <div>
                    <b>한번 배우면 평생 써먹는 고음발성 성공 공식!</b>
                    <small>세타쓴 · 조회수 20만 회</small>
                  </div>
                  <a href={HIT_VIDEO_URL} target="_blank" rel="noopener noreferrer">영상 보기 ↗</a>
                </div>
              </div>
            </div>
          </div>

          <div className={s.reelBand}>
            <div className={`${s.wrap} ${s.who}`}>
              <Image src="/images/coach/seo-youngbin-portrait.jpg" alt="세타쓴 서영빈" width={52} height={52} />
              <p>
                <b>세타쓴(서영빈)</b>은 제 이름이고, <b>시선뮤직</b>은 제가 직접 수업하는 분당 스튜디오예요. 1:1 수업은 전부 제가 맡습니다.
              </p>
              <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">채널 영상 전체 ↗</a>
            </div>
            <div className={s.reel} aria-label="세타쓴 유튜브 영상 속 장면">
              <div className={s.reelTrack}>
                {[...REEL_SCENES, ...REEL_SCENES].map((src, i) => (
                  <Image key={`${src}-${i}`} src={src} alt="" width={520} height={292} sizes="280px" aria-hidden={i >= REEL_SCENES.length} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <section className={s.section}>
          <div className={s.wrap}>
            <p className={s.kicker}>혹시 이런 고민으로 오셨나요</p>
            <h2 className={s.h2}>
              영상 보고 찾아오시는 분들이
              <br />
              <span className={s.khakiWord}>제일 많이 하시는 말</span>이에요.
            </h2>
            <div className={s.painGrid}>
              {PAINS.map(([a, b]) => (
                <div key={a} className={s.painCard}>
                  {a}
                  <br />
                  {b}
                </div>
              ))}
            </div>
            <div className={s.answer}>
              <LoopVideo name="clip-cheese" />
              <div className={s.answerBody}>
                <blockquote>
                  “목에 힘을 빼려고 애쓰는 것보다, <span className={s.subBox}>원래 힘이 들어가야 할 곳</span>을 제대로 쓰는 게 훨씬 중요해요. 그러면 목 힘은 자연스럽게 풀립니다.”
                </blockquote>
                <cite>세타쓴 · 유튜브 「목에 힘이 빠지면 고음은 자연스럽게 따라옵니다」 중</cite>
              </div>
            </div>
          </div>
        </section>

        <section className={`${s.section} ${s.tint}`}>
          <div className={`${s.wrap} ${s.coachGrid}`}>
            <div className={s.coachPhoto}>
              <Image src="/images/coach/seo-youngbin-mic.jpg" alt="마이크 앞에 선 세타쓴 서영빈" width={1335} height={2000} sizes="(max-width: 960px) 100vw, 480px" />
              <span className={s.coachTag}>세타쓴 · 서영빈</span>
            </div>
            <div>
              <p className={s.kicker}>저는 이런 사람이에요</p>
              <h2 className={s.h2}>
                노래방만 가면 <span className={s.nowrap}>마음 졸였던 사람,</span>
                <br />
                <span className={s.khakiWord}>그게 저였어요.</span>
              </h2>
              <p className={s.coachBody}>
                고음에서 막히고, 이 방법 저 방법 헤매기도 많이 헤맸어요. 그래서 헤매는 마음을 압니다. 지금도 독일에 계신 스승님께 계속 배우면서, 제 몸으로 확인한 것만 수업에서 알려 드려요. 어렵게 돌아가지 않게, 최대한 단순하게요.
              </p>
              <ul className={s.facts}>
                <li><b>유튜브</b>세타쓴 채널 · 대표 영상 조회수 20만 회</li>
                <li><b>과정</b>한국발성교정협회 발성교정사 과정 이수</li>
                <li><b>수업</b>분당 시선뮤직 1:1 수업 전부 직접 진행</li>
              </ul>
            </div>
          </div>
        </section>

        <section className={s.section} id="method">
          <div className={s.wrap}>
            <p className={s.kicker}>영상에서 보신 그대로</p>
            <h2 className={s.h2}>
              수업에서는 이 세 가지를
              <br />
              <span className={s.khakiWord}>직접 손으로 잡아</span> 드려요.
            </h2>
            <p className={s.sectionLead}>
              영상은 혼자 따라 하셔야 하지만, 수업에서는 제가 바로 앞에서 듣고 고쳐 드려요. 맞게 하고 있는지 그 자리에서 알 수 있어요.
            </p>
            <div className={s.methodGrid}>
              <article className={s.step}>
                <LoopVideo name="clip-pull" />
                <div className={s.stepBody}>
                  <span className={s.stepNum}>01</span>
                  <h3>잘 당기기</h3>
                  <p>수동 발전기 줄을 당기듯 배를 당겨요. 소리를 힘으로 누르던 습관이 여기서 잡혀요.</p>
                </div>
              </article>
              <article className={s.step}>
                <LoopVideo name="clip-tongue" />
                <div className={s.stepBody}>
                  <span className={s.stepNum}>02</span>
                  <h3>깊은 발음</h3>
                  <p>혀를 뒤로, 위로 보내서 소리를 깊게 넣어요. 고음이 지나갈 길이 여기서 열려요.</p>
                </div>
              </article>
              <article className={s.step}>
                <Image src="/images/coach/seo-youngbin-guitar.jpg" alt="기타를 들고 앉은 세타쓴" width={1335} height={2000} sizes="(max-width: 960px) 100vw, 380px" />
                <div className={s.stepBody}>
                  <span className={s.stepNum}>03</span>
                  <h3>노래하고, 녹음해서 듣기</h3>
                  <p>배운 걸 바로 부르고 싶은 노래에 넣고, 녹음해서 같이 들어요. 처음 녹음과 마지막 녹음이 귀로 달라요.</p>
                </div>
              </article>
            </div>
            <p className={s.methodQuote}>
              “조금만 더 <span className={s.subBox}>단순하게</span> 생각해 주세요.”
              <small>세타쓴 · 유튜브 「한번 배우면 평생 써먹는 고음발성 성공 공식!」 중</small>
            </p>
          </div>
        </section>

        <section className={`${s.section} ${s.tint}`} id="reviews">
          <div className={s.wrap}>
            <p className={s.kicker}>먼저 배운 분들</p>
            <h2 className={s.h2}>
              “한 번에 소리가 <span className={s.khakiWord}>바뀔 줄</span>
              <br />
              <span className={s.khakiWord}>몰랐어요.</span>”
            </h2>
            <p className={s.sectionLead}>수업 받은 분들이 직접 남긴 후기예요. 고치지 않고 그대로 옮겼어요.</p>
            <div className={s.reviewGrid}>
              {REVIEWS.map((r) => (
                <div key={r.author} className={s.review}>
                  <p>
                    {r.before}
                    <mark>{r.highlight}</mark>
                    {r.after}
                  </p>
                  <div className={s.reviewMeta}>
                    <b>{r.author}</b>
                    <span>{r.meta}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className={s.source}>
              후기 원문은 <a href={RECORD_REVIEWS_URL} target="_blank" rel="noopener noreferrer">Re:cord 세타쓴 프로필</a>에서, 더 많은 후기는 <Link href="/reviews">후기 페이지</Link>에서 볼 수 있어요.
            </p>
          </div>
        </section>

        <section className={s.section} id="programs">
          <div className={s.wrap}>
            <p className={s.kicker}>수업 고르기</p>
            <h2 className={s.h2}>
              수업은 세 가지예요.
              <br />
              <span className={s.khakiWord}>얼마나 자주 만나느냐</span>가 달라요.
            </h2>
            <p className={s.sectionLead}>셋 다 제가 직접 듣고 피드백해요. 지금 내 시간과 목표에 맞는 걸 고르시면 돼요.</p>

            <div className={s.progGrid}>
              <article className={s.prog}>
                <p className={s.progFor}>꾸준히 오래 배우고 싶다면</p>
                <h3>1:1 레슨<em>주 1회 50분</em></h3>
                <p className={s.progNote}>매주 얼굴 보고 배우는 기본 수업이에요</p>
                <dl>
                  <div><dt>만남</dt><dd>매주 1번, 스튜디오에서 1:1</dd></div>
                  <div><dt>기간</dt><dd>한 달 단위로 계속</dd></div>
                  <div><dt>사이사이</dt><dd>레슨 없는 날도 코치 피드백 (영업일 하루 1회)</dd></div>
                </dl>
                <div className={s.price}>
                  <b>월 {won(signature.price)}</b>
                  <small>VAT 포함 · {signature.commitMonths}개월 정기결제 시 월 {won(signature.commitPrice ?? signature.price)}</small>
                </div>
                <Link className={khaki} href={signature.path}>1:1 레슨 자세히</Link>
              </article>

              <article className={`${s.prog} ${s.progFeature}`}>
                <p className={s.progFor}>짧게, 확실하게 바꾸고 싶다면</p>
                <h3>컴프레션 15주<br /><em>주 2회 70분 · 총 30회</em></h3>
                <p className={s.progNote}>기수제 · 기수마다 정원이 있어요</p>
                <dl>
                  <div><dt>만남</dt><dd>매주 월·목 2번, 스튜디오에서 1:1</dd></div>
                  <div><dt>기간</dt><dd>15주, 30회</dd></div>
                  <div><dt>끝나고</dt><dd>완주하면 6개월 동안 월 1회 1:1 레슨</dd></div>
                </dl>
                <div className={s.price}>
                  <b>1,980,000원</b>
                  <small>VAT 포함 · 70분 1회로 치면 66,000원</small>
                </div>
                <a className={orange} href={COMPRESSION15_URL}>컴프레션 15주 자세히</a>
              </article>

              <article className={s.prog}>
                <p className={s.progFor}>혼자 연습하면서 방향만 잡고 싶다면</p>
                <h3>데일리 피드백<em>혼자 연습 + 주 1회 코치 피드백</em></h3>
                <p className={s.progNote}>스튜디오에 오지 않아도 돼요</p>
                <dl>
                  <div><dt>만남</dt><dd>매일 10분 루틴은 AI가 봐 주고, 한 주치 녹음은 제가 직접 들어요</dd></div>
                  <div><dt>기간</dt><dd>한 달 단위로 계속</dd></div>
                  <div><dt>더 자주</dt><dd>매일 코치 피드백을 원하면 월 {won(dailyFeedback.price)}</dd></div>
                </dl>
                <div className={s.price}>
                  <b>월 {won(daily.price)}</b>
                  <small>VAT 포함 · 30일 안에 1:1 레슨으로 바꾸면 전액 차감</small>
                </div>
                <Link className={khaki} href={daily.path}>데일리 피드백 자세히</Link>
              </article>
            </div>

            <div className={s.progFoot}>
              <p>1:1 레슨 회원은 창작 모임 ‘아티스트웨이 크루’(월 {won(crew.price)})에도 지원할 수 있어요.</p>
              <p><Link href="/refund">해지·환불 기준 보기</Link></p>
            </div>

            <div className={s.help}>
              <div>
                <b>뭐가 맞을지 모르겠다면</b>
                <p>무료 상담 30분 동안 제가 소리를 듣고 같이 골라 드릴게요.</p>
              </div>
              <BookingLink source="home_programs" className={orange}>무료 상담 예약</BookingLink>
            </div>
          </div>
        </section>

        <section className={`${s.section} ${s.faq}`}>
          <div className={`${s.wrap} ${s.faqLayout}`}>
            <div className={s.faqHead}>
              <p className={s.kicker}>자주 물어보세요</p>
              <h2 className={s.h2}>
                시작 전에
                <br />
                <span className={s.khakiWord}>궁금한 것들</span>
              </h2>
              <p>여기 없는 건 상담 때 편하게 물어보세요.</p>
              <BookingLink source="home_faq" className={khaki}>무료 상담 예약</BookingLink>
            </div>
            <div className={s.faqList}>
              {FAQS.map(([q, a], i) => (
                <details key={q} open={i === 0}>
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className={s.closing} id="home-closing">
          <div className={s.wrap}>
            <Image src="/brand/seesun-logo.png" alt="시선뮤직 로고" width={120} height={104} />
            <h2 className={s.h2}>
              “네가 원래 이렇게
              <br />
              노래를 잘했었나?”
            </h2>
            <p>
              이 말 듣는 날까지 같이 갈게요.
              <br />
              각오만 가져오세요. 나머지는 제가 책임질게요.
            </p>
            <div className={s.ctas}>
              <BookingLink source="home_closing" className={orange}>무료 상담 30분 예약</BookingLink>
              <a className={`${s.btn} ${s.btnGhost}`} href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">유튜브 채널 보기</a>
            </div>
          </div>
        </section>
      </main>

      <footer className={s.footer}>
        <div className={s.wrap}>
          <nav className={s.footerNav} aria-label="사이트 안내">
            {FOOTER_LINKS.map(([href, label]) =>
              href.startsWith("http") ? (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer">{label}</a>
              ) : (
                <Link key={href} href={href}>{label}</Link>
              ),
            )}
          </nav>
          <p className={s.footerArea}>
            경기 성남시 분당구의 1:1 보컬 트레이닝 스튜디오 — 분당 · 정자동 · 서현동 · 수내동 · 이매동 · 야탑동 · 미금동 · 구미동 · 판교 · 용인 수지 보컬레슨
          </p>
          <div className={s.footerInner}>
            <span>세타쓴의 시선뮤직 · 세타쓴(서영빈) · © 2026 SEE:SUN MUSIC</span>
            <span>
              <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">유튜브</a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">인스타그램</a>
              <a href={BLOG_URL} target="_blank" rel="noopener noreferrer">블로그</a>
            </span>
          </div>
        </div>
      </footer>

      <div className={s.mobileBar}>
        <span>
          세타쓴이 직접 듣는
          <br />
          <b>무료 상담 30분</b>
        </span>
        <BookingLink source="sticky" className={orange}>예약하기</BookingLink>
      </div>
    </div>
  );
}
