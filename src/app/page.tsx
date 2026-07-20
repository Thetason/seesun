"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BrandLogo } from "@/components/marketing/BrandLogo";
import DapShowcase from "@/components/marketing/DapShowcase";
import MasteryShowcase from "@/components/marketing/MasteryShowcase";
import StickyKickoffBar from "@/components/marketing/StickyKickoffBar";
import { KAKAO_CHANNEL_URL, KICKOFF_CTA_LABEL } from "@/lib/site";
import { openKickoff, trackKickoff } from "@/lib/kickoff";

export default function Home() {
  const contentRefs = useRef<(HTMLElement | null)[]>([]);
  const [showExpertBio, setShowExpertBio] = useState(false);
  const [videoIdx, setVideoIdx] = useState(0);
  const heroVideos = ["/hero-video-sm.mp4", "/hero-video-2-sm.mp4"];
  const dapMiniCards = [
    {
      step: "01",
      title: "숨 세팅",
      summary: "숨이 덜 급하고 시작이 더 안정됩니다.",
    },
    {
      step: "02",
      title: "압력 연결",
      summary: "고음에서 덜 버티고 덜 조이게 됩니다.",
    },
    {
      step: "03",
      title: "음색 세팅",
      summary: "더 편안하고 내 목소리답게 들립니다.",
    },
    {
      step: "04",
      title: "곡 적용",
      summary: "실전에서도 무너지지 않게 연결합니다.",
    },
  ];
  const artistwayCards = [
    {
      title: "『아티스트웨이』 12주",
      summary: "한 권의 책을 축으로, 한 시즌을 함께 걷습니다.",
    },
    {
      title: "모닝 페이지",
      summary: "매일 아침 손으로 쓰는 세 페이지, 각자의 방에서.",
    },
    {
      title: "아티스트 데이트",
      summary: "러닝·요가·미식·영화 — 혼자 가는 대신 같이 갑니다.",
    },
    {
      title: "동료",
      summary: "같은 방향을 보는 사람들과 함께 갑니다.",
    },
  ];

  const homeReviews = [
    {
      quote: "생애 첫 축가를 앞두고 부족한 부분을 느껴 찾아뵈었는데, 제 부족한 부분을 콕콕 집어 트레이닝 해주셨어요. 당일 잘불렀다는 칭찬도 들었고, 친구에게 너무 고맙다는 말도 들었습니다.",
      author: "Colin KOO",
      source: "Re:cord 인증 리뷰",
      stars: true,
    },
    {
      quote: "긴장이 높아서 평소 연습에 비해 무대 위에서 많이 흔들리는 타입인데, 무대 위에서 필요한 마음가짐과 훈련 방법까지 함께 알려주셔서, 공연을 준비하는 사람에게 꼭 필요한 방향성을 제시해주신 느낌이었습니다.",
      author: "멜로디민",
      source: "Re:cord 인증 리뷰",
      stars: true,
    },
    {
      quote: "전 긴장이 높은 편인데 너무 친절하게 맞아주시고 배려해주셔서 편하게 노래해볼 수 있었습니다. 바로 소리가 바뀌는 걸 보고 놀랐고 너무 재밌었습니다.",
      author: "최지온",
      source: "Re:cord 인증 리뷰",
      stars: true,
    },
    {
      quote: "혼자 부르기만 하니 어느 순간 더이상 발전은 없는 것 같고… 올바르게 호흡하는 느낌을 바로 잡아 주셨습니다. 바르게 호흡을 하다 보니 노래 부르기가 한결 편해졌습니다.",
      author: "이찬영",
      source: "Re:cord 인증 리뷰",
      stars: true,
    },
    {
      quote: "저의 부족한 부분에 대해 바로 설명해주시고, 바로 연습해보고 반영할 수 있게 해주셔서 감사했습니다. 처음 녹음과 마지막 녹음이 확연히 나서 진짜 신기했어요.",
      author: "은나라",
      source: "Re:cord 인증 리뷰",
      stars: true,
    },
    {
      quote: "어떤 선생님 수업을 들어도 두루뭉술했던 보컬 발성의 길에 기준점을 잡아주어서, 연습을 할 때 훨씬 직관적으로 접근할 수 있게 되었다.",
      author: "이석주",
      source: "Re:cord 인증 리뷰",
      stars: true,
    },
    {
      quote: "가장 기초가 되는 발성과 그걸 어떻게 해나가야 되는지 중요한 요소들을 알려주셨습니다. 한번만에 소리가 바뀔 거라고 생각 못했는데 진짜 깜짝 놀랐어요.",
      author: "보컬꿈나무",
      source: "Re:cord 인증 리뷰",
      stars: true,
    },
    {
      quote: "기초 발성부터 시작해서, 노래를 하는 마음가짐과 무대에 서는 경험까지 하나의 완결된 경험을 할 수 있다는 측면에서 기억에 남는 레슨이었습니다.",
      author: "학준",
      source: "Re:cord 인증 리뷰",
      stars: true,
    },
    {
      quote: "무료라고 해서 간단한 조언 정도만 받을 줄 알았는데, 정말 놀라울 정도로 체계적이고 전문적인 컨설팅을 받았어요. 단계별로 어떻게 연습해야 하는지 구체적인 로드맵까지 제시해주셨습니다.",
      author: "상초",
      source: "당근 후기 · 시선뮤직",
      stars: false,
    },
    {
      quote: "짧은 시간이었지만 제 장점과 문제점을 분명하게 파악해주시고 명확한 피드백을 주셨습니다. 잠깐의 코치로도 소리의 방향을 잡을 수 있어서 놀랐습니다.",
      author: "다니엘권",
      source: "당근 후기 · 시선뮤직",
      stars: false,
    },
  ];

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !contentRefs.current.includes(el)) {
      contentRefs.current.push(el);
    }
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    contentRefs.current.forEach((el) => {
      if (!el) return;

      const isHighlight = el.getAttribute('data-scroll-highlight') === 'true';

      if (isHighlight) {
        gsap.fromTo(
          el,
          { opacity: 0.2 },
          {
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play reverse play reverse",
              scrub: true,
            },
            opacity: 1,
            duration: 0.5,
          }
        );
      } else {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
          }
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="home-page" style={{ backgroundColor: "#f5f5f7", color: "#1d1d1f", minHeight: "100vh", overflowX: "hidden" }}>

      {/* 1. Global Header */}
      <header
        className="home-header"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "60px",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "saturate(180%) blur(20px)",
          WebkitBackdropFilter: "saturate(180%) blur(20px)",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
          zIndex: 100,
          display: "flex",
          alignItems: "center"
        }}
      >
        <div className="home-header__inner" style={{ maxWidth: "1200px", width: "100%", margin: "0 auto", padding: "0 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/" aria-label="시선뮤직 홈" style={{ textDecoration: "none" }}>
            <BrandLogo compact surface="light" />
          </Link>
          <Link href="/login" style={{ color: "#111", fontSize: "0.85rem", fontWeight: 600, border: "1px solid rgba(0,0,0,0.1)", padding: "6px 14px", borderRadius: "20px", transition: "all 0.2s" }} className="hover:bg-black hover:text-white">
            로그인
          </Link>
        </div>
      </header>

      {/* 2. Apple-style Sub Navigation */}
      <nav
        className="home-subnav"
        style={{
          position: "fixed",
          top: "60px",
          left: 0,
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.6)",
          backdropFilter: "saturate(180%) blur(20px)",
          WebkitBackdropFilter: "saturate(180%) blur(20px)",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
          zIndex: 90,
          padding: "12px 0",
        }}
      >
        <div className="home-subnav__inner" style={{ maxWidth: "720px", margin: "0 auto", display: "flex", justifyContent: "center", gap: "6%", padding: "0 10px" }}>
          <Link href="/spark" style={{ display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none", color: "#111", opacity: 0.6, transition: "opacity 0.2s" }} className="home-subnav__item hover:opacity-100">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "6px" }}>
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: 0 }}>데일리</span>
          </Link>

          <Link href="/signature" style={{ display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none", color: "#111", opacity: 0.6, transition: "opacity 0.2s" }} className="home-subnav__item hover:opacity-100">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "6px" }}>
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: 0 }}>시그니처</span>
          </Link>

          <Link href="/crew" style={{ display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none", color: "#111", opacity: 0.6, transition: "opacity 0.2s" }} className="home-subnav__item hover:opacity-100">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "6px" }}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: 0 }}>크루</span>
          </Link>

          <Link href="/reserve" style={{ display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none", color: "#111", opacity: 0.6, transition: "opacity 0.2s" }} className="home-subnav__item hover:opacity-100">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "6px" }}>
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: 0 }}>프로토콜</span>
          </Link>
        </div>
      </nav>

      <main className="home-main" style={{ paddingTop: "128px" }}>

        {/* [0] One-line announcement strip */}
        <button
          onClick={() => openKickoff("announcement")}
          style={{
            width: "100%",
            display: "block",
            background: "#111",
            color: "#fff",
            padding: "11px 1rem",
            fontSize: "0.86rem",
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            textAlign: "center",
            fontFamily: "inherit",
            letterSpacing: "0.01em",
          }}
        >
          첫 시즌이 시작됩니다 · 무료 킥오프 상담 →
        </button>

        {/* [1] Hero */}
        <section className="home-hero" ref={addToRefs} style={{ textAlign: "center", padding: "5.5rem 2rem 6rem", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.6rem" }}>
            <Image
              src="/brand/seesun-logo.png"
              alt="SEE:SUN"
              width={188}
              height={164}
              priority
              sizes="168px"
              style={{ width: "min(168px, 44vw)", height: "auto", display: "block" }}
            />
          </div>
          <span style={{ color: "#FE7502", fontWeight: 800, letterSpacing: "0.06em", fontSize: "0.86rem" }}>분당 · 프리미엄 보컬 트레이닝</span>
          <span style={{ display: "block", color: "#a1a1a6", fontWeight: 700, letterSpacing: "0.2em", fontSize: "0.66rem", marginTop: "6px", textTransform: "uppercase" }}>Everlasting Change</span>
          <h1 style={{ fontSize: "clamp(2.7rem, 6.4vw, 4.8rem)", fontWeight: 900, letterSpacing: 0, lineHeight: 1.12, margin: "1.2rem 0 1.8rem", color: "#111", wordBreak: "keep-all" }}>
            &ldquo;네가 원래 이렇게
            <span className="home-hero-mobile-break"><br /></span>
            <span className="home-hero-desktop-space"> </span>
            노래를 잘했었나?&rdquo;<br />
            <span style={{ color: "#FE7502" }}>
              그 한마디의 순간을 위해,
              <span className="home-hero-mobile-break"><br /></span>
              <span className="home-hero-desktop-space"> </span>
              몸부터 다시 만듭니다.
            </span>
          </h1>
          <p style={{ fontSize: "clamp(1rem, 2.2vw, 1.2rem)", color: "#86868b", fontWeight: 500, maxWidth: "580px", margin: "0 auto 2.8rem", lineHeight: 1.65, wordBreak: "keep-all" }}>
            고음이 막히고, 목이 조이고, 실전에서 무너지고 — 여기까지는 트레이닝이 풉니다.{" "}
            <span style={{ color: "#111", fontWeight: 700 }}>그다음이 있습니다.</span>{" "}
            시선뮤직 아티스트클럽은 몸을 다시 설계하는 트레이닝과 매일의 루틴, 자기 세계를 넓히는 크루로 &lsquo;노래하며 사는 사람&rsquo;을 만듭니다.
          </p>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <div className="home-hero__actions" style={{ display: "flex", gap: "1rem", justifyContent: "center", alignItems: "center" }}>
              <button
                onClick={() => openKickoff("home_hero")}
                style={{ padding: "1.2rem 2.5rem", borderRadius: "40px", backgroundColor: "#111", color: "#fff", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "1.05rem", fontFamily: "inherit" }}
              >
                {KICKOFF_CTA_LABEL}
              </button>
            </div>
            <p style={{ color: "#86868b", fontSize: "0.88rem", marginTop: "0.4rem", fontWeight: 500 }}>
              서로 맞는지 확인하는 30분입니다.
            </p>
            <p style={{ marginTop: "0.9rem", fontSize: "0.9rem", fontWeight: 600 }}>
              <Link href="/diagnosis" style={{ color: "#111", textDecoration: "underline", textUnderlineOffset: "4px" }}>예약 전, 3분 발성 진단</Link>
              <span style={{ color: "#c7c7cc", margin: "0 10px" }}>·</span>
              <a href="#programs" style={{ color: "#86868b", textDecoration: "underline", textUnderlineOffset: "4px" }}>프로그램 바로 보기 ↓</a>
            </p>
          </div>

          {/* Apple-style Inline Hero Video (Centerpiece) */}
          <div ref={addToRefs} style={{
            marginTop: "6rem",
            maxWidth: "1200px",
            margin: "6rem auto 0",
            borderRadius: "30px",
            overflow: "hidden",
            boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
            background: "#000",
            transform: "scale(0.98)",
            transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
            className="home-hero__video hover:scale-100"
          >
            <video
              key={heroVideos[videoIdx]}
              autoPlay
              muted
              playsInline
              poster="/hero-poster.jpg"
              preload="metadata"
              onEnded={() => setVideoIdx((prev) => (prev + 1) % heroVideos.length)}
              style={{ width: "100%", height: "auto", display: "block", aspectRatio: "16/9", objectFit: "cover", opacity: 0.85 }}
              src={heroVideos[videoIdx]}
            />
          </div>
        </section>

        {/* [2] Two axes: Training x Artistway */}
        <section className="home-axes" style={{ maxWidth: "1200px", margin: "0 auto", padding: "6rem 2rem" }}>
          <div className="home-axes__head" style={{ textAlign: "center", marginBottom: "4rem" }} ref={addToRefs}>
            <h2 style={{ fontSize: "clamp(2rem, 4.4vw, 3.2rem)", fontWeight: 800, letterSpacing: 0, color: "#111", lineHeight: 1.2, wordBreak: "keep-all" }}>
              잘 부르게 만드는 건 트레이닝입니다.<br />
              계속 부르게 만드는 건 <span style={{ color: "#FE7502" }}>아티스트웨이</span>입니다.
            </h2>
            <p style={{ color: "#666", fontSize: "1.05rem", lineHeight: 1.75, maxWidth: "720px", margin: "1.6rem auto 0", fontWeight: 500, wordBreak: "keep-all" }}>
              하나의 축은 D.A.P. — 목이 아니라 몸이 노래하게, 이너코어가 자동으로 소리를 지탱할 때까지. 숨이 덜 급하고, 시작이 더 안정됩니다.<br className="home-hero-copy-break" />{" "}
              다른 축은 아티스트웨이 — 『아티스트웨이』 12주를 함께 걷고, 매일 아침 모닝 페이지를 쓰고, 달리고 먹고 보며 자기 세계를 넓힙니다.{" "}
              <span style={{ color: "#111", fontWeight: 700 }}>발성은 축 하나로도 좋아집니다. 삶이 바뀌는 건 두 축이 같이 돌 때입니다.</span>
            </p>
          </div>

          <style dangerouslySetInnerHTML={{
            __html: `
            .axes-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              align-items: stretch;
            }
            .bento-box {
              background: #fff;
              border-radius: 36px;
              padding: 2.5rem;
              display: flex;
              flex-direction: column;
              justify-content: flex-end;
              box-shadow: 0 10px 40px rgba(0,0,0,0.04);
              position: relative;
              overflow: hidden;
              border: 1px solid rgba(0,0,0,0.03);
              transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .bento-box:hover {
              transform: scale(1.02);
              box-shadow: 0 20px 50px rgba(0,0,0,0.08);
            }
            .axes-grid .bento-box {
              min-height: 440px;
              height: 100%;
            }
            .dap-mini-grid {
              display: grid;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 8px;
              margin-top: 2rem;
              margin-bottom: 1.5rem;
            }
            .dap-mini-card {
              background: rgba(255,255,255,0.75);
              border: 1px solid rgba(0,0,0,0.05);
              border-radius: 14px;
              padding: 14px 12px;
              display: flex;
              flex-direction: column;
              gap: 5px;
              overflow: hidden;
            }
            .dap-mini-step {
              font-size: 0.68rem;
              font-weight: 900;
              color: #FE7502;
              letter-spacing: 0;
            }
            .dap-mini-title {
              font-size: 0.94rem;
              line-height: 1.15;
              font-weight: 900;
              color: #111;
            }
            .dap-mini-summary {
              font-size: 0.76rem;
              line-height: 1.45;
              font-weight: 700;
              color: #6f6f76;
            }
            .artistway-grid {
              display: grid;
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: 8px;
              margin-top: 2rem;
              margin-bottom: 1.5rem;
            }
            .artistway-card {
              background: rgba(255,255,255,0.06);
              border: 1px solid rgba(255,255,255,0.09);
              border-radius: 14px;
              padding: 14px 12px;
              display: flex;
              flex-direction: column;
              gap: 5px;
              overflow: hidden;
            }
            .artistway-title {
              font-size: 0.94rem;
              line-height: 1.15;
              font-weight: 900;
              color: #fff;
            }
            .artistway-summary {
              font-size: 0.76rem;
              line-height: 1.45;
              font-weight: 700;
              color: rgba(255,255,255,0.55);
            }
            .dap-feature-copy {
              max-width: 400px;
              font-size: 0.96rem !important;
              line-height: 1.55 !important;
              color: #7b7b82 !important;
              margin: 0 !important;
              word-break: keep-all;
            }
            @media (max-width: 900px) {
              .axes-grid {
                grid-template-columns: 1fr;
              }
              .bento-box {
                min-height: 280px;
              }
            }
            @media (max-width: 640px) {
              .dap-mini-grid, .artistway-grid {
                gap: 6px;
                margin-top: 1.2rem;
                margin-bottom: 1rem;
              }
              .dap-mini-card, .artistway-card {
                padding: 10px 9px;
              }
              .dap-mini-summary, .artistway-summary {
                font-size: 0.72rem;
              }
            }
          `}} />

          <div className="axes-grid">

            {/* Axis 1: Training (D.A.P.) */}
            <div className="bento-box home-bento-feature" style={{ background: "#f0f0f2", justifyContent: "flex-start", padding: "2rem 2rem 2.2rem" }} ref={addToRefs}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div className="home-bento-label" style={{ position: "static", fontWeight: 900, fontSize: "1.3rem", color: "#111", marginBottom: 0 }}>트레이닝 — D.A.P.</div>
                <div style={{ color: "rgba(0,0,0,0.25)", fontWeight: 800, fontSize: "0.78rem", letterSpacing: "0.12em" }}>TRAINING</div>
              </div>
              <div className="dap-mini-grid">
                {dapMiniCards.map((card) => (
                  <div key={card.step} className="dap-mini-card">
                    <div className="dap-mini-step">{card.step}</div>
                    <div className="dap-mini-title">{card.title}</div>
                    <div className="dap-mini-summary">{card.summary}</div>
                  </div>
                ))}
              </div>
              <p className="dap-feature-copy">
                몸이 먼저 바뀌어야 소리가 바뀝니다.
                <br />
                <span style={{ color: "#555", fontWeight: 600 }}>D.A.P.(Diaphragm Automatic Program)는 이너코어를 깨워 몸쓰기를 자동화하는 4단계 메소드입니다.</span>
              </p>
            </div>

            {/* Axis 2: Artistway (absorbs RECORDING) */}
            <div className="bento-box" style={{ background: "#111", justifyContent: "flex-start", padding: "2rem 2rem 2.2rem" }} ref={addToRefs}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontWeight: 900, fontSize: "1.3rem", color: "#fff" }}>아티스트웨이</div>
                <div style={{ color: "rgba(255,255,255,0.3)", fontWeight: 800, fontSize: "0.78rem", letterSpacing: "0.12em" }}>ARTISTWAY</div>
              </div>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.92rem", fontWeight: 600, marginTop: "0.5rem", wordBreak: "keep-all" }}>
                매주의 모임, 예술과 영감의 나눔, 자기 세계의 확장.
              </p>
              <div className="artistway-grid">
                {artistwayCards.map((card) => (
                  <div key={card.title} className="artistway-card">
                    <div className="artistway-title">{card.title}</div>
                    <div className="artistway-summary">{card.summary}</div>
                  </div>
                ))}
              </div>
              <div style={{ color: "#FE7502", fontWeight: 800, fontSize: "0.72rem", letterSpacing: "0.15em", margin: "0.4rem 0 0.5rem" }}>RECORDING</div>
              <p className="dap-feature-copy" style={{ color: "rgba(255,255,255,0.55)" }}>
                옷에도 퍼스널컬러가 있듯, 노래에도 당신만의 음색이 있습니다.{" "}
                <span style={{ color: "#fff", fontWeight: 600 }}>그 음색을 발견해, 가장 완벽한 형태의 예술로 기록합니다.</span>
              </p>
            </div>

          </div>
        </section>

        {/* [PRESENTATION] D.A.P. scroll-driven showcase */}
        <DapShowcase />

        {/* [3] Evidence strip (compact, no pin) */}
        <section className="home-evidence" style={{ padding: "4.5rem 2rem 4rem", background: "#f5f5f7" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }} ref={addToRefs}>
              <div style={{ fontSize: "0.8rem", color: "#FE7502", fontWeight: 800, letterSpacing: "0.1em", marginBottom: "0.8rem" }}>
                EVIDENCE
              </div>
              <h2 style={{ fontSize: "clamp(1.8rem, 3.6vw, 2.6rem)", fontWeight: 800, letterSpacing: 0, color: "#111", wordBreak: "keep-all" }}>
                말이 아니라, 기록으로 증명합니다.
              </h2>
            </div>

            <style dangerouslySetInnerHTML={{
              __html: `
              .review-marquee { overflow: hidden; position: relative; }
              .review-marquee::before, .review-marquee::after { content: ""; position: absolute; top: 0; bottom: 0; width: 60px; z-index: 2; pointer-events: none; }
              .review-marquee::before { left: 0; background: linear-gradient(to right, #f5f5f7, transparent); }
              .review-marquee::after { right: 0; background: linear-gradient(to left, #f5f5f7, transparent); }
              .review-marquee__track { display: flex; gap: 1.2rem; width: max-content; animation: reviewScroll 65s linear infinite; }
              .review-marquee:hover .review-marquee__track { animation-play-state: paused; }
              @keyframes reviewScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
              .review-card { width: 340px; flex-shrink: 0; background: #fff; border-radius: 20px; padding: 1.6rem; border: 1px solid rgba(0,0,0,0.05); box-shadow: 0 8px 30px rgba(0,0,0,0.03); display: flex; flex-direction: column; gap: 0.8rem; }
              @media (max-width: 640px) { .review-card { width: 290px; padding: 1.15rem 1.25rem; gap: 0.6rem; } .review-card p { font-size: 0.9rem; line-height: 1.6; } }
              @media (prefers-reduced-motion: reduce) { .review-marquee__track { animation: none; } .review-marquee { overflow-x: auto; } }
              `,
            }} />

            <div className="review-marquee" ref={addToRefs}>
              <div className="review-marquee__track">
                {[...homeReviews, ...homeReviews].map((review, i) => (
                  <div key={i} className="review-card" aria-hidden={i >= homeReviews.length}>
                    {review.stars ? (
                      <div style={{ color: "#FE7502", fontSize: "0.85rem", letterSpacing: "2px" }}>★★★★★</div>
                    ) : (
                      <div style={{ color: "#FE7502", fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.08em" }}>REVIEW</div>
                    )}
                    <p style={{ fontSize: "0.94rem", lineHeight: 1.7, color: "#333", fontWeight: 500, flex: 1, wordBreak: "keep-all" }}>
                      &ldquo;{review.quote}&rdquo;
                    </p>
                    <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "0.8rem" }}>
                      <p style={{ fontWeight: 800, fontSize: "0.88rem", color: "#111" }}>{review.author}</p>
                      <p style={{ fontSize: "0.76rem", color: "#888", marginTop: "2px" }}>{review.source}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.8rem", marginTop: "2.2rem" }} ref={addToRefs}>
              {[
                "공개 리뷰 25개",
                "직접 후기 평균 5.0",
                "15주 몰입 과정 완주 6명",
              ].map((stat) => (
                <span key={stat} style={{ background: "#111", color: "#fff", borderRadius: "999px", padding: "0.55rem 1.1rem", fontSize: "0.88rem", fontWeight: 700 }}>
                  {stat}
                </span>
              ))}
            </div>

            <p style={{ textAlign: "center", marginTop: "1.8rem", color: "#6f6f76", fontSize: "0.92rem", fontWeight: 600, wordBreak: "keep-all" }} ref={addToRefs}>
              코치 크레덴셜 — 성악·실용음악 전공 · 뮤지컬 배우 · 14년의 트레이닝
            </p>

            <p style={{ textAlign: "center", marginTop: "0.9rem" }} ref={addToRefs}>
              <a href="https://recordyours.com/syb2020" target="_blank" rel="noopener noreferrer" style={{ color: "#FE7502", fontWeight: 700, fontSize: "0.92rem", textDecoration: "none" }}>
                리뷰 전체 보기 — Re:cord 프로필 →
              </a>
            </p>
          </div>
        </section>

        {/* [4] Membership: 3 cards */}
        <section id="programs" className="home-offer" style={{ padding: "6rem 2rem 7rem", background: "#f5f5f7", scrollMarginTop: "80px" }}>
          <div className="home-offer__head" style={{ textAlign: "center", marginBottom: "4rem" }} ref={addToRefs}>
            <h2 style={{ fontSize: "clamp(2.3rem, 5vw, 3.6rem)", fontWeight: 800, letterSpacing: 0, color: "#111", marginTop: "0.5rem", lineHeight: 1.15, wordBreak: "keep-all" }}>
              멤버는 목소리를 만듭니다.<br className="home-hero-mobile-break" /> 크루는 자기 세계를 만듭니다.
            </h2>
            <p style={{ color: "#666", fontSize: "1.15rem", marginTop: "1.2rem", fontWeight: 500, lineHeight: 1.7, wordBreak: "keep-all" }}>
              가장 비싼 건, 잘못 배우는 것입니다.<br className="home-hero-mobile-break" />{" "}
              AI는 모두에게, 코치는 위로 갈수록. 모든 가격은 VAT 포함입니다.
            </p>
          </div>

          <style dangerouslySetInnerHTML={{
            __html: `
            .track-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 2rem;
              max-width: 1200px;
              margin: 0 auto;
            }
            .t-card {
              border-radius: 24px;
              padding: 3rem 2rem;
              display: flex;
              flex-direction: column;
              transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
              position: relative;
              background: #fff;
              border: 1px solid rgba(0,0,0,0.05);
            }
            .t-card:hover {
              transform: translateY(-5px);
              box-shadow: 0 15px 30px rgba(0,0,0,0.08);
            }
            .t-card.signature {
              border: 2px solid #FE7502;
              box-shadow: 0 15px 40px rgba(254, 117, 2,0.1);
              z-index: 10;
              padding-top: 3.5rem;
            }
            .t-card.reserve {
              background: #111;
              color: #fff;
              border: 1px solid rgba(255,255,255,0.1);
            }
            .t-card-cta {
              text-align: center;
              font-weight: 700;
              font-size: 0.95rem;
              text-decoration: underline;
              text-underline-offset: 4px;
            }
            @media (max-width: 1024px) {
              .track-grid {
                grid-template-columns: 1fr;
                gap: 3rem;
                max-width: 500px;
              }
              .t-card.signature {
                padding-top: 3.5rem;
              }
            }
            .track-carousel-hint {
              display: none;
            }
            @media (max-width: 767px) {
              .home-page .home-offer .track-grid {
                display: flex !important;
                max-width: none !important;
                gap: 12px !important;
                margin: 0 -1.25rem;
                padding: 24px 1.25rem 4px;
                overflow-x: auto;
                scroll-snap-type: x mandatory;
                -webkit-overflow-scrolling: touch;
                scrollbar-width: none;
              }
              .home-page .home-offer .track-grid::-webkit-scrollbar {
                display: none;
              }
              .home-page .home-offer .t-card {
                flex: 0 0 86%;
                scroll-snap-align: center;
                padding: 1.5rem 1.25rem 1.4rem !important;
              }
              .home-page .home-offer .t-card.signature {
                padding-top: 2.2rem !important;
              }
              .home-page .home-offer .t-card h3 {
                font-size: 1.55rem !important;
                margin-top: 0.4rem !important;
                margin-bottom: 0.4rem !important;
              }
              .home-page .home-offer .t-card ul {
                font-size: 0.9rem !important;
                margin-bottom: 1.1rem !important;
              }
              .home-page .home-offer .t-card ul li {
                margin-bottom: 8px !important;
                padding-bottom: 8px !important;
              }
              .home-page .home-offer .t-card .t-card-price {
                font-size: 1.35rem !important;
                margin-bottom: 0.3rem !important;
              }
              .home-page .home-offer .track-carousel-hint {
                display: block;
                text-align: center;
                color: #86868b;
                font-size: 0.82rem;
                font-weight: 600;
                margin-top: 0.75rem;
              }
            }
          `}} />

          <div className="track-grid">

            {/* Tier 1: DAILY */}
            <Link href="/spark" className="t-card" style={{ textDecoration: "none", color: "#111", wordBreak: "keep-all" }} ref={addToRefs}>
              <div style={{ marginBottom: "1.6rem" }}>
                <span style={{ fontSize: "0.8rem", background: "rgba(0,0,0,0.05)", padding: "4px 10px", borderRadius: "4px", fontWeight: 700 }}>DAILY</span>
                <h3 style={{ fontSize: "1.8rem", fontWeight: 700, marginTop: "1rem", marginBottom: "0.5rem" }}>데일리(DAILY)</h3>
                <p style={{ color: "#86868b", fontSize: "0.95rem", lineHeight: 1.5, minHeight: "48px" }}>
                  <span style={{ color: "#111", fontWeight: 700 }}>매일은 AI가 잡아주고,<br />매주 코치가 직접 듣습니다.</span>
                </p>
                <span style={{ display: "inline-block", marginTop: "0.6rem", fontSize: "0.78rem", fontWeight: 700, color: "#FE7502", background: "rgba(254, 117, 2, 0.08)", border: "1px solid rgba(254, 117, 2, 0.25)", padding: "4px 10px", borderRadius: "999px" }}>
                  베타는 대기명단 순서로 열립니다
                </span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem 0", color: "#333", fontSize: "0.95rem", flexGrow: 1, wordBreak: "keep-all" }}>
                <li style={{ marginBottom: "12px", borderBottom: "1px dashed rgba(0,0,0,0.1)", paddingBottom: "12px" }}>OB1 마스터리 — 분석 무제한</li>
                <li style={{ marginBottom: "12px", borderBottom: "1px dashed rgba(0,0,0,0.1)", paddingBottom: "12px" }}>매일 아침 10분 루틴</li>
                <li style={{ marginBottom: "12px", borderBottom: "1px dashed rgba(0,0,0,0.1)", paddingBottom: "12px" }}>코치 주 1회 큐레이션 피드백</li>
                <li style={{ paddingBottom: "12px" }}>성장 아카이브</li>
              </ul>
              <div className="t-card-price" style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.4rem", textAlign: "center" }}>
                월 120,000원 <span style={{ fontSize: "0.85rem", color: "#888", fontWeight: 500 }}>(VAT 포함) 구독</span>
              </div>
              <p style={{ fontSize: "0.82rem", color: "#666", lineHeight: 1.6, textAlign: "center", marginBottom: "1.5rem", wordBreak: "keep-all" }}>
                데일리에서 보낸 첫 달은 사라지지 않습니다 —<br className="home-hero-copy-break" />{" "}
                첫 30일 안에 시그니처로 입회하면 전액 차감됩니다.
              </p>
              <div className="t-card-cta" style={{ color: "#111" }}>데일리 자세히 보기 →</div>
            </Link>

            {/* Tier 2: SIGNATURE - HERO */}
            <Link href="/signature" className="t-card signature" style={{ textDecoration: "none", color: "#111", wordBreak: "keep-all" }} ref={addToRefs}>
              <div style={{ position: "absolute", top: "-15px", left: "50%", transform: "translateX(-50%)", background: "#FE7502", color: "#111", padding: "6px 20px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: 800, letterSpacing: 0, boxShadow: "0 4px 10px rgba(254, 117, 2,0.3)", wordBreak: "keep-all", whiteSpace: "nowrap" }}>
                가장 많이 선택
              </div>
              <div style={{ marginBottom: "2rem", paddingTop: "1rem" }}>
                <h3 style={{ fontSize: "2.4rem", fontWeight: 800, marginTop: "0.5rem", marginBottom: "0.5rem", letterSpacing: 0 }}>시선 시그니처</h3>
                <p style={{ color: "#86868b", fontSize: "1.05rem", lineHeight: 1.6, fontWeight: 500 }}>
                  단순한 레슨 4회가 아니라, <span style={{ color: "#111", fontWeight: 700 }}>클럽의 정식 멤버십입니다.</span>
                </p>
              </div>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem 0", color: "#111", fontSize: "1rem", flexGrow: 1, lineHeight: 1.4, wordBreak: "keep-all" }}>
                <li style={{ marginBottom: "14px", paddingBottom: "14px", borderBottom: "1px solid rgba(0,0,0,0.05)", fontWeight: 700, display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <span style={{ color: "#FE7502", fontSize: "1.2rem" }}>✓</span>
                  <div>주 1회 50분 1:1 트레이닝 (월 4회)</div>
                </li>
                <li style={{ marginBottom: "14px", paddingBottom: "14px", borderBottom: "1px solid rgba(0,0,0,0.05)", fontWeight: 700, display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <span style={{ color: "#FE7502", fontSize: "1.2rem" }}>✓</span>
                  <div>OB1 마스터리(월 29,000원) 무제한</div>
                </li>
                <li style={{ marginBottom: "14px", paddingBottom: "14px", borderBottom: "1px solid rgba(0,0,0,0.05)", fontWeight: 700, display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <span style={{ color: "#FE7502", fontSize: "1.2rem" }}>✓</span>
                  <div>코치 피드백 1일 1회(영업일 기준)</div>
                </li>
                <li style={{ marginBottom: "14px", paddingBottom: "14px", borderBottom: "1px solid rgba(0,0,0,0.05)", fontWeight: 700, display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <span style={{ color: "#FE7502", fontSize: "1.2rem" }}>✓</span>
                  <div>녹음+믹싱 분기 1곡</div>
                </li>
                <li style={{ fontWeight: 700, display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <span style={{ color: "#FE7502", fontSize: "1.2rem" }}>+</span>
                  <div style={{ color: "#FE7502" }}>아티스트웨이 크루 지원 자격</div>
                </li>
              </ul>

              <div className="t-card-price" style={{ fontSize: "2.2rem", fontWeight: 800, color: "#111", letterSpacing: 0, textAlign: "center", marginBottom: "0.4rem" }}>
                월 440,000원 <span style={{ fontSize: "0.95rem", fontWeight: 500, color: "#888" }}>(VAT 포함)</span>
              </div>
              <p style={{ fontSize: "0.82rem", color: "#666", lineHeight: 1.6, textAlign: "center", marginBottom: "1.5rem", wordBreak: "keep-all" }}>
                크루 지원 자격은 시그니처 멤버에게만 열립니다. 크루 활동은 월 40,000원을 더합니다.<br className="home-hero-copy-break" />{" "}
                3개월 정기결제 시 월 420,000원.
              </p>

              <div className="t-card-cta" style={{ color: "#FE7502", fontSize: "1.05rem" }}>시그니처 자세히 보기 →</div>
            </Link>

            {/* Tier 3: MASTER PROTOCOL */}
            <Link href="/reserve" className="t-card reserve" style={{ textDecoration: "none", wordBreak: "keep-all" }} ref={addToRefs}>
              <div style={{ marginBottom: "1.6rem" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#FE7502", letterSpacing: 0, marginBottom: "0.8rem", display: "block" }}>MASTER TRACK</div>
                <h3 style={{ fontSize: "2.3rem", fontWeight: 900, marginBottom: "0.5rem", letterSpacing: 0 }}>15주 마스터 프로토콜</h3>
                <p style={{ color: "#e5e5ea", fontSize: "0.98rem", lineHeight: 1.55, minHeight: "48px", fontWeight: 700 }}>
                  목표에 도달하지 못하면,<br />4주를 무상 연장합니다.
                </p>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.6rem 0", color: "#e5e5ea", fontSize: "0.95rem", flexGrow: 1, wordBreak: "keep-all" }}>
                <li style={{ marginBottom: "12px", borderBottom: "1px dashed rgba(255,255,255,0.1)", paddingBottom: "12px" }}>주 2회, 총 30회+ (프라이빗 15 + 실전 15)</li>
                <li style={{ marginBottom: "12px", borderBottom: "1px dashed rgba(255,255,255,0.1)", paddingBottom: "12px" }}>OB1 마스터리(월 29,000원) 무제한</li>
                <li style={{ marginBottom: "12px", borderBottom: "1px dashed rgba(255,255,255,0.1)", paddingBottom: "12px" }}>졸업공연</li>
                <li style={{ paddingBottom: "12px" }}>분기 정원 5명</li>
              </ul>
              <p style={{ fontSize: "0.85rem", color: "#d1d1d6", lineHeight: 1.65, marginBottom: "1.2rem", wordBreak: "keep-all" }}>
                프로토콜의 킥오프와 분기 정원 5명이 곧 선발입니다. 크루 합류는 별도로 지원하고, 선발됩니다 (회비 월 40,000원).
              </p>
              <p style={{ fontSize: "0.78rem", color: "#a1a1a6", lineHeight: 1.65, marginBottom: "1.4rem", wordBreak: "keep-all" }}>
                성과 보장 — 출석률 90% 이상, 주간 과제를 이행했음에도 킥오프에서 합의한 목표에 도달하지 못하면 4주를 무상으로 연장합니다.
              </p>
              <div className="t-card-price" style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.4rem", textAlign: "center" }}>
                3,800,000원 / 15주 <span style={{ fontSize: "0.85rem", color: "#a1a1a6", fontWeight: 500 }}>(VAT 포함)</span>
              </div>
              <p style={{ fontSize: "0.82rem", color: "#a1a1a6", textAlign: "center", marginBottom: "1.5rem", wordBreak: "keep-all" }}>
                무료 킥오프 상담을 거친 분만 합류할 수 있습니다.
              </p>
              <div className="t-card-cta" style={{ color: "#fff" }}>프로토콜 자세히 보기 →</div>
            </Link>

          </div>

          <p className="track-carousel-hint">옆으로 넘겨 비교하세요 →</p>

          <p style={{ textAlign: "center", marginTop: "2.5rem", color: "#86868b", fontSize: "0.9rem", fontWeight: 500 }} ref={addToRefs}>
            각 멤버십의 해지·환불 기준은 <a href="/refund" style={{ color: "#111", textDecoration: "underline", textUnderlineOffset: "4px" }}>환불 규정</a>에서 확인하실 수 있습니다.
          </p>

          <div style={{ textAlign: "center", marginTop: "3rem" }} ref={addToRefs}>
            <button
              onClick={() => openKickoff("home_membership")}
              style={{ padding: "1.2rem 2.8rem", borderRadius: "40px", backgroundColor: "#111", color: "#fff", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "1.05rem", fontFamily: "inherit" }}
            >
              {KICKOFF_CTA_LABEL}
            </button>
            <p style={{ color: "#86868b", fontSize: "0.88rem", marginTop: "1rem", fontWeight: 500 }}>
              어떤 멤버십이 맞을지는 무료 킥오프에서 함께 정합니다.
            </p>
          </div>
        </section>

        {/* [5] Crew teaser (dark, full-bleed) */}
        <section className="home-crew" style={{ padding: "7rem 2rem", background: "#050505", color: "#fff" }}>
          <div style={{ maxWidth: "760px", margin: "0 auto", textAlign: "center" }} ref={addToRefs}>
            <p style={{ color: "#FE7502", fontSize: "0.85rem", fontWeight: 800, letterSpacing: "0.15em", marginBottom: "1.2rem" }}>ARTISTWAY CREW</p>
            <h2 style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", fontWeight: 900, letterSpacing: 0, lineHeight: 1.2, wordBreak: "keep-all" }}>
              훈련의 끝에는, <span style={{ color: "#FE7502" }}>자기 세계</span>가 있습니다.
            </h2>
            <p style={{ color: "#d1d1d6", fontSize: "1.08rem", lineHeight: 1.8, marginTop: "1.8rem", fontWeight: 500, wordBreak: "keep-all" }}>
              아티스트웨이 크루 — 시즌마다 지원으로 합류하는 크리에이티브 클럽입니다.
              12주의 시즌 동안 『아티스트웨이』를 함께 걷고, 매일 아침 세 페이지를 쓰고, 달리고 요가하고 먹고 보며 자기 세계를 넓힙니다.
              <strong style={{ color: "#fff" }}>크루 모임은 크루만의 것입니다.</strong>{" "}
              크루는 결제로 가입하는 상품이 아닙니다. <strong style={{ color: "#fff" }}>지원하고, 선발됩니다.</strong>{" "}
              노래를 배우러 왔다가, 자기 세계를 넓히고 갑니다.
            </p>

            <div style={{ marginTop: "2.6rem", background: "rgba(254, 117, 2, 0.08)", border: "1px solid rgba(254, 117, 2, 0.3)", borderRadius: "18px", padding: "1.2rem 1.6rem", display: "inline-block" }}>
              <p style={{ fontSize: "0.98rem", fontWeight: 800, color: "#fff", wordBreak: "keep-all" }}>
                첫 시즌, <span style={{ color: "#FE7502" }}>1기는 파운딩 멤버로 구성됩니다.</span>
              </p>
            </div>

            <p style={{ marginTop: "2rem", fontSize: "0.95rem", fontWeight: 600 }}>
              <Link href="/crew" style={{ color: "#fff", textDecoration: "underline", textUnderlineOffset: "4px" }}>크루 알아보기</Link>
              <span style={{ color: "#55555a", margin: "0 10px" }}>·</span>
              <Link href="/crew#apply" style={{ color: "#a1a1a6", textDecoration: "underline", textUnderlineOffset: "4px" }}>다음 시즌 알림 받기</Link>
            </p>

            <div style={{ marginTop: "3rem" }}>
              <button
                onClick={() => openKickoff("home_crew")}
                style={{ padding: "1.2rem 2.8rem", borderRadius: "40px", backgroundColor: "#fff", color: "#111", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "1.05rem", fontFamily: "inherit" }}
              >
                {KICKOFF_CTA_LABEL}
              </button>
            </div>
          </div>
        </section>

        {/* [6] Coach / evidence pool */}
        <MasteryShowcase />

        <section className="home-trust" style={{ padding: "7rem 2rem 3rem", background: "#050505", color: "#fff" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div ref={addToRefs}>
              <div className="home-trust__head" style={{ textAlign: "center", marginBottom: "5rem" }}>
                <p style={{ color: "#FE7502", fontSize: "1.2rem", fontWeight: 800, marginBottom: "1rem" }}>TRUST &amp; EVIDENCE</p>
                <h3 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, letterSpacing: 0, lineHeight: 1.2, wordBreak: "keep-all" }}>
                  이 14년의 축적은 경력 소개가 아니라,<br />
                  당신이 더 빨리 바뀌기 위한 <span style={{ color: "#FE7502" }}>압축된 지도</span>입니다.
                </h3>
              </div>

              <div className="home-trust-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem" }}>
                {/* Master coach card (moved from bento) */}
                <div className="home-trust-card" style={{ background: "rgba(255,255,255,0.03)", padding: "2.5rem", borderRadius: "30px", border: "1px solid rgba(255,255,255,0.05)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                  <div style={{ position: "absolute", top: "2.5rem", left: "2.5rem", color: "#FE7502", fontWeight: 800, letterSpacing: 0, fontSize: "0.8rem" }}>MASTER COACH</div>

                  <div style={{ position: "relative", zIndex: 1, marginTop: "3rem" }}>
                    <p style={{ color: "#fff", marginBottom: "1.5rem", fontSize: "1.1rem", lineHeight: 1.4 }}>
                      <strong style={{ fontSize: "1.3rem", display: "block", marginBottom: "0.5rem" }}>할리우드 SLS x 유럽 벨칸토</strong>
                      <span style={{ color: "#a1a1a6", fontSize: "0.9rem", fontWeight: 500, display: "block", wordBreak: "keep-all" }}>
                        Michael Jackson의 스승 Seth Riggs가 정립한 할리우드의 기술력과 400년 전통 유럽 벨칸토의 정수. 동서양을 관통하는 최상위 보컬 레퍼런스를 제시합니다.
                      </span>
                    </p>

                    <button
                      onClick={() => setShowExpertBio(!showExpertBio)}
                      style={{
                        background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "#fff",
                        padding: "10px 20px", borderRadius: "24px", fontSize: "0.85rem", cursor: "pointer",
                        transition: "all 0.2s", fontWeight: 600, fontFamily: "inherit"
                      }}
                      className="hover:bg-white hover:text-black"
                    >
                      {showExpertBio ? "닫기" : "노래 선생님. 세타쓴"}
                    </button>
                  </div>

                  {/* Bio Slide-up */}
                  <div style={{
                    position: "absolute", bottom: 0, left: 0, width: "100%",
                    background: "#111", color: "#fff", padding: "2.5rem",
                    transform: showExpertBio ? "translateY(0)" : "translateY(100%)",
                    opacity: showExpertBio ? 1 : 0,
                    visibility: showExpertBio ? "visible" : "hidden",
                    transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease",
                    zIndex: 10, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center"
                  }}>
                    <h4 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1.5rem", color: "#FE7502" }}>Master Setassun</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.2rem", fontSize: "0.9rem" }}>
                      <div>
                        <strong style={{ display: "block", color: "#fff", marginBottom: "0.3rem" }}>Foundation</strong>
                        <span style={{ color: "#86868b" }}>성악 &amp; 실용음악 보컬 전공 (2010-2018)</span>
                      </div>
                      <div>
                        <strong style={{ display: "block", color: "#fff", marginBottom: "0.3rem" }}>Science of Voice</strong>
                        <span style={{ color: "#86868b" }}>故 남도현 교수 사사, 발성교정사 이수</span>
                      </div>
                      <div>
                        <strong style={{ display: "block", color: "#fff", marginBottom: "0.3rem" }}>Artistic Depth</strong>
                        <span style={{ color: "#86868b" }}>SLS Master Lesson &amp; Bel Canto Reproduction 수료</span>
                      </div>
                      <div>
                        <strong style={{ display: "block", color: "#fff", marginBottom: "0.3rem" }}>Practical</strong>
                        <span style={{ color: "#86868b" }}>뮤지컬 배우 &amp; 전 찬스라인 프로덕션 작곡가</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowExpertBio(false)}
                      style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "none", border: "none", fontSize: "1.8rem", cursor: "pointer", color: "#fff" }}
                    >×</button>
                  </div>
                </div>

                {/* Target Audience */}
                <div className="home-trust-card" style={{ background: "rgba(255,255,255,0.03)", padding: "2.5rem", borderRadius: "30px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <h4 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "1.5rem", color: "#FE7502" }}>이런 분께 추천합니다</h4>
                  <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {["고음이 막혀 답답함을 느끼는 분", "목이 자주 잠겨 노래를 오래 못하는 분", "레슨실에선 되는데 실전에서 무너지는 분", "취미로 시작해도, 제대로 할 각오가 된 분"].map((item, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "center", gap: "0.8rem", color: "#d1d1d6", fontWeight: 600 }}>
                        <span style={{ color: "#FE7502", fontSize: "1.2rem" }}>✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Training Process */}
                <div className="home-trust-card" style={{ background: "rgba(255,255,255,0.03)", padding: "2.5rem", borderRadius: "30px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <h4 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "1.5rem", color: "#FE7502" }}>검증된 트레이닝 방식</h4>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
                    {["진단", "교정", "적용", "피드백"].map((step, i) => (
                      <div key={i} style={{ textAlign: "center", flex: 1 }}>
                        <div style={{ width: "45px", height: "45px", borderRadius: "50%", background: "rgba(254, 117, 2, 0.15)", border: "1px solid #FE7502", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.8rem", color: "#FE7502", fontWeight: 900 }}>{i + 1}</div>
                        <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "#fff" }}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Result Tag Cloud */}
                <div className="home-trust-card" style={{ background: "rgba(255,255,255,0.03)", padding: "2.5rem", borderRadius: "30px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem", justifyContent: "center" }}>
                    {["안 무너지는 발성", "재현 가능한 고음", "전달되는 표현", "실전 컨트롤", "나만의 음색"].map((tag, i) => (
                      <span key={i} style={{ padding: "0.6rem 1.2rem", background: "rgba(255,255,255,0.08)", borderRadius: "50px", color: "#fff", fontWeight: 700, fontSize: "1rem", border: "1px solid rgba(255,255,255,0.1)" }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* [7] Exclusion + closing vow (dark) */}
        <section id="home-closing" className="home-closing" style={{ padding: "4rem 2rem 8rem", background: "#050505", color: "#fff" }}>
          <div style={{ maxWidth: "680px", margin: "0 auto", textAlign: "center" }}>
            <div style={{ background: "rgba(255,255,255,0.03)", padding: "2.5rem", borderRadius: "30px", border: "1px solid rgba(255,255,255,0.05)", marginBottom: "3.5rem" }} ref={addToRefs}>
              <h4 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "1.2rem", color: "#86868b" }}>다시 한번 생각해보셔요</h4>
              <p style={{ color: "#a1a1a6", fontSize: "1.02rem", lineHeight: 1.75, fontWeight: 600, wordBreak: "keep-all" }}>
                빨리, 싸게, 대충을 찾고 계신다면 — 그 방법은 저희에게 없습니다.
              </p>
              <p style={{ color: "#d1d1d6", fontSize: "1.02rem", lineHeight: 1.75, fontWeight: 700, marginTop: "1rem", wordBreak: "keep-all" }}>
                킥오프에서 보는 건 실력이 아니라 <span style={{ color: "#FE7502" }}>각오</span>뿐입니다.
              </p>
            </div>

            <div ref={addToRefs}>
              <p style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, letterSpacing: 0, color: "#fff", lineHeight: 1.25, wordBreak: "keep-all" }}>
                당신의 <span style={{ color: "#FE7502" }}>마지막 보컬 레슨</span>이 되겠습니다.
              </p>
              <p style={{ color: "#a1a1a6", fontSize: "1.05rem", marginTop: "1.2rem", fontWeight: 500, wordBreak: "keep-all" }}>
                한번 제대로 만든 소리는, 평생 당신 편입니다.
              </p>
              <div style={{ marginTop: "2.4rem" }}>
                <button
                  onClick={() => openKickoff("home_vow")}
                  style={{ display: "inline-block", padding: "1.2rem 2.8rem", borderRadius: "40px", backgroundColor: "#fff", color: "#111", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "1.05rem", fontFamily: "inherit" }}
                >
                  {KICKOFF_CTA_LABEL}
                </button>
              </div>
              <p style={{ color: "#6f6f76", fontSize: "0.85rem", marginTop: "1rem", fontWeight: 500 }}>
                네이버 지도에서 &lsquo;시선뮤직&rsquo;을 검색하셔도 됩니다.
              </p>
              {KAKAO_CHANNEL_URL ? (
                <p style={{ marginTop: "1.2rem" }}>
                  <a href={KAKAO_CHANNEL_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackKickoff("kakao_channel")} style={{ color: "#86868b", fontSize: "0.9rem", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "4px" }}>
                    아직 고민 중이라면 — 카카오톡 채널 추가하고 소식 받기
                  </a>
                </p>
              ) : null}
            </div>
          </div>
        </section>

        {/* [8] Location strip */}
        <section style={{ background: "#f5f5f7", padding: "1.4rem 2rem", textAlign: "center", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
          <p style={{ color: "#6f6f76", fontSize: "0.92rem", fontWeight: 600, wordBreak: "keep-all" }}>
            경기 성남시 분당구 — 정확한 위치는 킥오프 상담 예약 시 안내드립니다.
          </p>
        </section>

      </main>

      <StickyKickoffBar />

      <style jsx global>{`
        .home-hero-mobile-break {
          display: none;
        }

        @media (max-width: 768px) {
          .home-page .home-header {
            height: 56px !important;
          }

          .home-page .home-header__inner {
            padding: 0 1rem !important;
          }

          .home-page .home-subnav {
            top: 56px !important;
            padding: 10px 0 !important;
          }

          .home-page .home-subnav__inner {
            display: grid !important;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 0 !important;
            padding: 0 0.75rem !important;
            width: 100%;
          }

          .home-page .home-subnav__item {
            min-width: 0;
          }

          .home-page .home-subnav__item svg {
            display: none !important;
          }

          .home-page .home-main {
            padding-top: 114px !important;
          }

          .home-page .home-hero {
            padding: 3.4rem 1.25rem 4rem !important;
          }

          .home-page .home-hero h1 {
            font-size: clamp(2.1rem, 9vw, 2.8rem) !important;
            line-height: 1.13 !important;
            overflow-wrap: break-word;
            text-wrap: balance;
          }

          .home-page .home-hero p {
            font-size: 1rem !important;
            max-width: 34rem !important;
            overflow-wrap: break-word;
          }

          .home-page .home-hero__actions {
            flex-direction: column !important;
            width: min(100%, 340px);
            margin: 0 auto;
          }

          .home-page .home-hero__actions a,
          .home-page .home-hero__actions button {
            width: 100%;
            justify-content: center;
            font-size: 1rem !important;
            padding: 1rem 1.25rem !important;
          }

          .home-page .bento-box {
            border-radius: 28px !important;
            padding: 1.5rem !important;
            min-height: 240px !important;
          }

          .home-page .home-bento-feature {
            min-height: 340px !important;
          }

          .home-page .home-bento-label {
            position: static !important;
            display: block;
            font-size: 1.2rem !important;
          }

          .home-page .track-grid {
            gap: 1.5rem !important;
          }

          .home-page .t-card {
            padding: 2rem 1.4rem !important;
          }

          .home-page .home-hero__video {
            margin: 3rem auto 0 !important;
          }

          .home-page .home-axes {
            padding: 3rem 1.25rem !important;
          }

          .home-page .home-axes__head {
            margin-bottom: 2rem !important;
          }

          .home-page .axes-grid {
            gap: 12px !important;
          }

          .home-page .home-evidence {
            padding: 2.75rem 1.25rem 2.5rem !important;
          }

          .home-page .home-offer {
            padding: 3rem 1.25rem 3.5rem !important;
          }

          .home-page .home-offer__head {
            margin-bottom: 2rem !important;
          }

          .home-page .home-crew {
            padding: 3.5rem 1.25rem !important;
          }

          .home-page .home-trust {
            padding: 3.5rem 1.25rem 2rem !important;
          }

          .home-page .home-trust__head {
            margin-bottom: 2.5rem !important;
          }

          .home-page .home-trust-grid {
            gap: 1.25rem !important;
          }

          .home-page .home-trust-card {
            padding: 1.6rem !important;
          }

          .home-page .home-closing {
            padding: 2.5rem 1.25rem 4.5rem !important;
          }
        }

        @media (max-width: 430px) {
          .home-page .home-header__inner > div span {
            font-size: 0.92rem !important;
            letter-spacing: 0 !important;
          }

          .home-page .home-header__inner > a:last-child {
            font-size: 0.78rem !important;
            padding: 0.55rem 0.85rem !important;
          }

          .home-page .home-subnav__item span {
            font-size: 0.68rem !important;
            line-height: 1.2;
            text-align: center;
            word-break: keep-all;
          }

          .home-page .home-hero {
            padding: 2.75rem 1rem 3.5rem !important;
          }

          .home-page .home-hero h1 {
            font-size: 1.72rem !important;
            line-height: 1.16 !important;
            margin-left: auto !important;
            margin-right: auto !important;
            max-width: 310px !important;
          }

          .home-page .home-hero p {
            font-size: 0.98rem !important;
            line-height: 1.7 !important;
            max-width: 320px !important;
            word-break: normal !important;
          }

          .home-hero-mobile-break {
            display: inline;
          }

          .home-hero-desktop-space,
          .home-hero-copy-break {
            display: none;
          }

          .home-page .home-hero__actions {
            width: min(100%, 310px) !important;
          }

          .home-page .home-offer h2 {
            font-size: clamp(2rem, 9vw, 2.6rem) !important;
            line-height: 1.08 !important;
          }

          .home-page .bento-box {
            padding: 1.25rem !important;
            min-height: 220px !important;
          }
        }
      `}</style>

      {/* Footer */}
      <footer style={{ background: "#f5f5f7", padding: "4rem 2rem", borderTop: "1px solid rgba(0,0,0,0.05)", color: "#86868b", fontSize: "0.85rem", textAlign: "center" }}>
        <p style={{ marginBottom: "0.75rem" }}>
          <Link href="/bundang-vocal-lesson" style={{ color: "#86868b", textDecoration: "underline" }}>
            분당보컬레슨 안내
          </Link>
          {" · "}
          <a href="https://thetason.com" target="_blank" rel="noopener noreferrer" style={{ color: "#86868b", textDecoration: "underline" }}>
            보컬트레이너 세타쓴
          </a>
        </p>
        <p style={{ marginBottom: "0.75rem" }}>
          분당 · 정자동 · 서현동 · 수내동 · 이매동 · 야탑동 · 미금동 · 구미동 · 판교 · 용인 수지 보컬레슨
        </p>
        <p>&copy; 2026 SEE:SUN MUSIC All Rights Reserved.</p>
      </footer>
    </div >
  );
}
