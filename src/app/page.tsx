"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BrandLogo } from "@/components/marketing/BrandLogo";
import DapShowcase from "@/components/marketing/DapShowcase";
import MasteryShowcase from "@/components/marketing/MasteryShowcase";
import { KAKAO_CHANNEL_URL, KICKOFF_CTA_LABEL, SMARTPLACE_URL } from "@/lib/site";
import { trackKickoff } from "@/lib/kickoff";

export default function Home() {
  const contentRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeOntology, setActiveOntology] = useState(0);
  const [showExpertBio, setShowExpertBio] = useState(false);
  const [videoIdx, setVideoIdx] = useState(0);
  const heroVideos = ["/hero-video-sm.mp4", "/hero-video-2-sm.mp4"];
  const proofHighlights = [
    {
      label: "FOUNDATION",
      title: "이전 보컬 프로그램 운영 경험 기반",
      desc: "이전 프로그램에서 여섯 명이 15주 몰입 과정을 완주했습니다. 가격, 커리큘럼, 회원 흐름을 실제 운영으로 검증한 위에서 SEE:SUN이 설계되었습니다.",
    },
    {
      label: "SYSTEM",
      title: "기록이 남는 성장 구조",
      desc: "상담 접수부터 미션파서블, 음성 업로드, 코치 피드백, 성장 아카이브까지 실제 서비스처럼 이어지는 구조를 갖추고 있습니다.",
    },
    {
      label: "CARE",
      title: "혼자 두지 않는 코칭 흐름",
      desc: "단발성 수업이 아니라 매일 루틴, 업로드, 보관함, 코치 코멘트로 이어지는 관리형 경험이 핵심입니다.",
    },
    {
      label: "RESULT",
      title: "실전용 변화에 초점",
      desc: "좋아 보이는 페이지보다 실제로 더 잘 부르고, 덜 흔들리고, 사람들 앞에서 해낼 수 있는 상태를 목표로 잡습니다.",
    },
  ];
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
        <div className="home-subnav__inner" style={{ maxWidth: "720px", margin: "0 auto", display: "flex", justifyContent: "center", gap: "8%", padding: "0 10px" }}>
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

          <Link href="/reserve" style={{ display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none", color: "#111", opacity: 0.6, transition: "opacity 0.2s" }} className="home-subnav__item hover:opacity-100">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "6px" }}>
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: 0 }}>프로토콜</span>
          </Link>
        </div>
      </nav>

      <main className="home-main" style={{ paddingTop: "128px" }}>

        {/* [HOOK] Hero Section: Apple-style punchy, large typography */}
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
          <span style={{ color: "#FE7502", fontWeight: 800, letterSpacing: "0.18em", fontSize: "0.78rem", textTransform: "uppercase" }}>Everlasting Change</span>
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
            고음이 막히고, 목이 조이고, 레슨실에선 되는데 실전에서 무너지고.<br className="home-hero-copy-break" />{" "}
            <span style={{ color: "#111", fontWeight: 700 }}>
              그 길을 코치가 먼저 걸었습니다.
            </span>{" "}
            목이 상하는 방법까지 직접 배워봤기에, 무엇이 진짜인지 구별해 드립니다.
          </p>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <div className="home-hero__actions" style={{ display: "flex", gap: "1rem", justifyContent: "center", alignItems: "center" }}>
              <a href={SMARTPLACE_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackKickoff("home_hero")} style={{ padding: "1.2rem 2.5rem", borderRadius: "40px", backgroundColor: "#111", color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: "1.05rem" }}>
                {KICKOFF_CTA_LABEL}
              </a>
              <Link href="/signature" style={{ padding: "1.2rem 2.5rem", borderRadius: "40px", border: "1px solid rgba(0,0,0,0.15)", color: "#111", textDecoration: "none", fontWeight: 700, fontSize: "1.05rem" }}>
                시그니처 자세히 보기
              </Link>
            </div>
            <p style={{ color: "#86868b", fontSize: "0.88rem", marginTop: "0.4rem", fontWeight: 500 }}>
              부담 없이 목소리 진단부터. 서로 맞는지 확인하는 30분입니다.
            </p>
            <p style={{ marginTop: "0.9rem", fontSize: "0.9rem", fontWeight: 600 }}>
              <a href="#programs" style={{ color: "#111", textDecoration: "underline", textUnderlineOffset: "4px" }}>프로그램 바로 보기 ↓</a>
              <span style={{ color: "#c7c7cc", margin: "0 10px" }}>·</span>
              <Link href="/diagnosis" style={{ color: "#86868b", textDecoration: "underline", textUnderlineOffset: "4px" }}>예약 전, 3분 보컬 진단</Link>
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
            className="hover:scale-100"
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

        {/* [Highlights] Apple-style "일단 핵심부터." Bento Grid */}
        <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "6rem 2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }} ref={addToRefs}>
            <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 800, letterSpacing: 0, color: "#111" }}>일단 핵심부터.</h2>
          </div>

          <style dangerouslySetInnerHTML={{
            __html: `
            .bento-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              grid-auto-rows: 320px;
              gap: 20px;
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
            .bento-box p {
              font-size: 1.3rem;
              font-weight: 600;
              letter-spacing: 0;
              line-height: 1.4;
              color: #111;
              position: relative;
              z-index: 2;
              word-break: keep-all;
              overflow-wrap: break-word;
            }
            .bento-box strong {
              color: #FE7502;
              font-weight: 800;
              letter-spacing: 0;
            }
            .bento-full-width {
              grid-column: 1 / -1;
            }
            .bento-two-thirds {
              grid-column: span 2;
            }
            .dap-mini-grid {
              display: grid;
              grid-template-columns: repeat(4, minmax(0, 1fr));
              gap: 8px;
              margin-top: 3rem;
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
            .dap-feature-copy {
              max-width: 360px;
              font-size: 0.96rem !important;
              line-height: 1.55 !important;
              color: #7b7b82 !important;
              margin: 0 !important;
            }
            @media (max-width: 900px) {
              .bento-grid {
                grid-template-columns: 1fr;
                grid-auto-rows: auto;
              }
              .bento-two-thirds, .bento-full-width {
                grid-column: 1 / -1;
              }
              .bento-box {
                min-height: 280px;
              }
              .dap-mini-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
                margin-top: 4.8rem;
              }
            }
            @media (max-width: 640px) {
              .dap-mini-grid {
                grid-template-columns: 1fr;
              }
            }
          `}} />

          <div className="bento-grid">

            {/* Box 1 (Hero Feature) */}
            <div className="bento-box bento-two-thirds home-bento-feature" style={{ background: "#f0f0f2", justifyContent: "flex-start", padding: "2rem 2rem 2.2rem" }} ref={addToRefs}>
              <div className="home-bento-label" style={{ position: "static", fontWeight: 900, fontSize: "1.3rem", color: "#111", marginBottom: 0 }}>D.A.P. 시스템</div>
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

            {/* Box 2 */}
            <div className="bento-box" style={{ background: "#FE7502" }} ref={addToRefs}>
              <div style={{ position: "absolute", top: "2.5rem", left: "2.5rem" }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </div>
              <p style={{ color: "rgba(255,255,255,0.7)" }}>
                <span style={{ color: "#fff", fontWeight: 800 }}>오직 당신의 성장만을 위해서.</span><br />
                매주 이어지는 1:1 보이스 피드백과 당신만을 위한 <span style={{ color: "#fff", fontWeight: 700 }}>정교한 가이드라인</span>.
              </p>
            </div>

            {/* Box 3: Expert / MASTER COACH (White Box, 1/3 size for zigzag) */}
            <div className="bento-box" style={{ background: "#fff", display: "flex", flexDirection: "column", justifyContent: "flex-end", border: "1px solid rgba(0,0,0,0.05)", overflow: "hidden" }} ref={addToRefs}>
              <div style={{ position: "absolute", top: "2.5rem", left: "2.5rem", color: "#FE7502", fontWeight: 800, letterSpacing: 0, fontSize: "0.8rem" }}>MASTER COACH</div>

              <div style={{ position: "relative", zIndex: 1 }}>
                <p style={{ color: "#111", marginBottom: "1.5rem", fontSize: "1.1rem", lineHeight: 1.4 }}>
                  <strong style={{ fontSize: "1.3rem", display: "block", marginBottom: "0.5rem" }}>할리우드 SLS x 유럽 벨칸토</strong>
                  <span style={{ color: "#86868b", fontSize: "0.9rem", fontWeight: 500, display: "block", wordBreak: "keep-all" }}>
                    Michael Jackson의 스승 Seth Riggs가 정립한 할리우드의 기술력과 400년 전통 유럽 벨칸토의 정수. 동서양을 관통하는 최상위 보컬 레퍼런스를 제시합니다.
                  </span>
                </p>

                <button
                  onClick={() => setShowExpertBio(!showExpertBio)}
                  style={{
                    background: "transparent", border: "1px solid rgba(0,0,0,0.1)", color: "#111",
                    padding: "10px 20px", borderRadius: "24px", fontSize: "0.85rem", cursor: "pointer",
                    transition: "all 0.2s", fontWeight: 600
                  }}
                  className="hover:bg-black hover:text-white"
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
                    <span style={{ color: "#86868b" }}>성악 & 실용음악 보컬 전공 (2010-2018)</span>
                  </div>
                  <div>
                    <strong style={{ display: "block", color: "#fff", marginBottom: "0.3rem" }}>Science of Voice</strong>
                    <span style={{ color: "#86868b" }}>故 남도현 교수 사사, 발성교정사 이수</span>
                  </div>
                  <div>
                    <strong style={{ display: "block", color: "#fff", marginBottom: "0.3rem" }}>Artistic Depth</strong>
                    <span style={{ color: "#86868b" }}>SLS Master Lesson & Bel Canto Reproduction 수료</span>
                  </div>
                  <div>
                    <strong style={{ display: "block", color: "#fff", marginBottom: "0.3rem" }}>Practical</strong>
                    <span style={{ color: "#86868b" }}>뮤지컬 배우 & 전 찬스라인 프로덕션 작곡가</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowExpertBio(false)}
                  style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "none", border: "none", fontSize: "1.8rem", cursor: "pointer", color: "#fff" }}
                >×</button>
              </div>
            </div>

            {/* Box 4: Personal Color & Recording (Black Box, 2/3 size for zigzag) */}
            <div className="bento-box bento-two-thirds" style={{ background: "#111", display: "flex", flexDirection: "column", justifyContent: "flex-end", overflow: "hidden" }} ref={addToRefs}>
              <Image
                src="/brand/seesun-mark.png"
                alt=""
                width={541}
                height={487}
                sizes="74px"
                style={{ position: "absolute", top: "2.5rem", left: "2.5rem", width: "74px", height: "auto", display: "block" }}
              />
              <p style={{ maxWidth: "600px", fontSize: "1.4rem", lineHeight: 1.5, color: "rgba(255,255,255,0.7)", marginBottom: "1rem" }}>
                옷에도 퍼스널컬러가 있듯, 노래에도 당신만의 고유한 음색이 있습니다. <br />
                시선은 당신도 몰랐던 매력적인 음색을 발견하고, <br />
                <span style={{ color: "#fff", fontWeight: 700 }}>가장 완벽한 형태의 예술로 기록합니다.</span><br />
                <span style={{ color: "#fff", fontWeight: 800 }}>이제 당신이 닿고 싶었던 목소리가 현실이 됩니다.</span>
              </p>
              <div style={{ position: "absolute", top: "2.5rem", right: "3rem", color: "rgba(255,255,255,0.3)", fontWeight: 700, letterSpacing: 0, fontSize: "0.9rem" }}>RECORDING</div>
            </div>

          </div>
        </section>

        {/* [PRESENTATION] D.A.P. scroll-driven showcase */}
        <DapShowcase />

        {/* [STORY] Journey of Mastery: scroll-driven showcase */}
        <MasteryShowcase />

        {/* Trust & Evidence */}
        <section style={{ padding: "7rem 2rem 6rem", background: "#050505", color: "#fff" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            {/* Trust-Building Footer Section */}
            <div ref={addToRefs}>
              <div style={{ textAlign: "center", marginBottom: "5rem" }}>
                <p style={{ color: "#FE7502", fontSize: "1.2rem", fontWeight: 800, marginBottom: "1rem" }}>TRUST & EVIDENCE</p>
                <h3 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, letterSpacing: 0, lineHeight: 1.2 }}>
                  이 14년의 축적은 경력 소개가 아니라,<br />
                  당신이 더 빨리 바뀌기 위한 <span style={{ color: "#FE7502" }}>압축된 지도</span>입니다.
                </h3>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem" }}>
                {/* Target Audience */}
                <div style={{ background: "rgba(255,255,255,0.03)", padding: "2.5rem", borderRadius: "30px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <h4 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "1.5rem", color: "#FE7502" }}>이런 분께 추천합니다</h4>
                  <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {["고음이 막혀 답답함을 느끼는 분", "목이 자주 잠겨 노래를 오래 못하는 분", "레슨실에선 되는데 실전에서 무너지는 분", "취미로 시작해도, 제대로 할 각오가 된 분"].map((item, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "center", gap: "0.8rem", color: "#d1d1d6", fontWeight: 600 }}>
                        <span style={{ color: "#FE7502", fontSize: "1.2rem" }}>✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Not For */}
                <div style={{ background: "rgba(255,255,255,0.03)", padding: "2.5rem", borderRadius: "30px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <h4 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "1.5rem", color: "#86868b" }}>다시 한번 생각해보셔요</h4>
                  <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {["노력 없이 되는 법을 찾는 분", "이번 달만 싸게 배워보고 말 분", "유튜브 영상 하나면 충분하다고 믿는 분"].map((item, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "center", gap: "0.8rem", color: "#86868b", fontWeight: 600 }}>
                        <span style={{ color: "#55555a", fontSize: "1.2rem" }}>✕</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Lesson Process */}
                <div style={{ background: "rgba(255,255,255,0.03)", padding: "2.5rem", borderRadius: "30px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <h4 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "1.5rem", color: "#FE7502" }}>검증된 수업 방식</h4>
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
                <div style={{ background: "rgba(255,255,255,0.03)", padding: "2.5rem", borderRadius: "30px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
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

        {/* [NEW] Apple-style Interactive Curriculum UI: Spacing Optimized */}
        <section style={{ padding: "2rem 2rem 8rem", background: "#050505", color: "#fff" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "4rem" }} ref={addToRefs}>
              <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 700, letterSpacing: 0, marginTop: "0.5rem" }}>
                첫 소절에, 방 안이 조용해지는 사람.
              </h2>
              <p style={{ color: "#a1a1a6", fontSize: "clamp(1rem, 1.5vw, 1.25rem)", fontWeight: 600, marginTop: "1rem" }}>
                그 사람이 되는 데에는, 순서가 있습니다.
              </p>
            </div>

            <div className="home-curriculum-layout" style={{ display: "flex", flexWrap: "wrap", gap: "2rem", minHeight: "600px" }}>
              {/* Left: Interactive Buttons */}
              <div className="home-curriculum-menu" style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "0.5rem", padding: "2rem 0" }}>
                {[
                  {
                    id: 0,
                    short: "호흡과 코어 (Core)",
                    title: "Breathing & Core",
                    desc: "D.A.P 코어 호흡 세팅. 가슴으로 얕게 쉬던 숨을 버리고, 몸 전체를 거대한 울림통으로 만드는 물리적 뼈대를 구축합니다."
                  },
                  {
                    id: 1,
                    short: "압력과 밸브 (Valve)",
                    title: "Pressure & Valve",
                    desc: "성대(Valve)의 완전한 통제. 코어에서 올라온 압력을 견고하게 버텨내어 피치로 변환합니다. 고음에서도 흔들림 없는 타격감을 만듭니다."
                  },
                  {
                    id: 2,
                    short: "톤 메이킹 (Tone - SLS)",
                    title: "Tone Making",
                    desc: "할리우드 팝 가수들의 표준 규격을 적용하여, 당신이 가진 가장 매력적인 음색(Tone)을 세공하듯 발굴하고 완성합니다."
                  },
                  {
                    id: 3,
                    short: "예술적 표현 (Art)",
                    title: "Artistic Expression",
                    desc: "기계적인 발성을 넘어 가사와 감정을 온전히 담아냅니다. 듣는 이를 몰입하게 만드는 다이내믹과 표현력을 완성하여 삶을 예술로 바꿉니다."
                  }
                ].map((item, index) => {
                  const isActive = activeOntology === index;
                  return (
                    <div key={item.id} style={{ display: "flex", flexDirection: "column" }}>
                      <button
                        onClick={() => setActiveOntology(index)}
                        style={{
                          display: "flex", alignItems: "center", gap: "10px",
                          padding: "16px 24px", borderRadius: "30px",
                          background: isActive ? "rgba(255,255,255,0.08)" : "transparent",
                          border: isActive ? "1px solid rgba(255,255,255,0.15)" : "1px solid transparent",
                          color: "#fff", cursor: "pointer", transition: "all 0.3s ease",
                          fontSize: "1.1rem", fontWeight: isActive ? 700 : 500,
                          opacity: isActive ? 1 : 0.5,
                          textAlign: "left"
                        }}
                      >
                        <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "1px solid currentColor", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>
                          {isActive ? "−" : "+"}
                        </div>
                        {item.short}
                      </button>

                      {/* Apple-style Expanding Details Bubble */}
                      <div style={{
                        maxHeight: isActive ? "200px" : "0",
                        opacity: isActive ? 1 : 0,
                        overflow: "hidden",
                        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                        marginLeft: "12px",
                        marginTop: isActive ? "8px" : "0",
                        marginBottom: isActive ? "16px" : "0"
                      }}>
                        <div
                          ref={addToRefs}
                          data-scroll-highlight="true"
                          style={{
                            background: "rgba(30,30,32,0.6)",
                            backdropFilter: "blur(10px)",
                            padding: "1.5rem", borderRadius: "20px",
                            border: "1px solid rgba(255,255,255,0.05)",
                            color: "#ccc", fontSize: "0.95rem", lineHeight: 1.6
                          }}
                        >
                          <strong style={{ display: "block", color: "#fff", marginBottom: "8px", fontSize: "1.05rem" }}>{item.title}</strong>
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right: Abstract Dynamic Visual Area */}
              <div className="home-curriculum-visual" style={{ flex: "1 1 500px", position: "relative", borderRadius: "30px", background: "#0a0a0c", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>

                {/* Dynamic Background Glow Based on Active Step */}
                <div style={{
                  position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                  width: "120%", height: "120%",
                  background:
                    activeOntology === 0 ? "radial-gradient(circle, rgba(254, 117, 2,0.4) 0%, rgba(0,0,0,0) 60%)" :
                      activeOntology === 1 ? "radial-gradient(circle, rgba(255,59,48,0.4) 0%, rgba(0,0,0,0) 60%)" :
                        activeOntology === 2 ? "radial-gradient(circle, rgba(10,132,255,0.4) 0%, rgba(0,0,0,0) 60%)" :
                          "radial-gradient(circle, rgba(191,90,242,0.4) 0%, rgba(0,0,0,0) 60%)",
                  transition: "background 0.8s ease",
                  filter: "blur(50px)", zIndex: 0
                }}></div>

                {/* Abstract Visual Elements / Images */}
                <div style={{ position: "relative", zIndex: 1, textAlign: "center", transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)", transform: `scale(${activeOntology === 0 ? 1 : 1.05})`, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {activeOntology === 0 && (
                    <Image src="/step1.jpg" alt="D.A.P. 1단계" fill sizes="(max-width: 768px) 100vw, 500px" style={{ objectFit: "cover", opacity: 0.9 }} />
                  )}
                  {activeOntology === 1 && (
                    <Image src="/step2.jpg" alt="D.A.P. 2단계" fill sizes="(max-width: 768px) 100vw, 500px" style={{ objectFit: "cover", opacity: 0.9 }} />
                  )}
                  {activeOntology === 2 && (
                    <Image src="/step3.jpg" alt="D.A.P. 3단계" fill sizes="(max-width: 768px) 100vw, 500px" style={{ objectFit: "cover", opacity: 0.9 }} />
                  )}
                  {activeOntology === 3 && (
                    <Image
                      src="/brand/seesun-mark.png"
                      alt=""
                      width={541}
                      height={487}
                      sizes="112px"
                      style={{ width: "112px", height: "auto", display: "block", filter: "drop-shadow(0 0 20px rgba(254, 117, 2,0.45))" }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section >

        <section style={{ padding: "3rem 2rem 2rem", background: "#f5f5f7" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }} ref={addToRefs}>
              <div style={{ fontSize: "0.8rem", color: "#FE7502", fontWeight: 800, letterSpacing: 0, marginBottom: "0.8rem" }}>
                TRUST SIGNALS
              </div>
              <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: 0, color: "#111", marginBottom: "0.8rem" }}>
                말만 그럴듯한 수업처럼 보이지 않도록.
              </h2>
              <p style={{ color: "#666", fontSize: "1.05rem", lineHeight: 1.7, maxWidth: "760px", margin: "0 auto" }}>
                SEE:SUN은 예쁜 문장보다 실제 운영 경험, 기록이 남는 구조, 그리고 반복 가능한 성장 시스템으로 신뢰를 만들고 있습니다.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              {proofHighlights.map((item) => (
                <div
                  key={item.title}
                  style={{
                    background: "#fff",
                    borderRadius: "24px",
                    padding: "1.5rem",
                    border: "1px solid rgba(0,0,0,0.05)",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.03)",
                  }}
                >
                  <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#FE7502", letterSpacing: 0, marginBottom: "0.75rem" }}>
                    {item.label}
                  </div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#111", marginBottom: "0.7rem", lineHeight: 1.35 }}>
                    {item.title}
                  </h3>
                  <p style={{ color: "#666", fontSize: "0.95rem", lineHeight: 1.65 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ maxWidth: "1100px", margin: "3.5rem auto 0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }} ref={addToRefs}>
              <div style={{ background: "#fff", borderRadius: "24px", padding: "2rem", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 8px 30px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ color: "#FE7502", fontSize: "0.95rem", letterSpacing: "2px" }}>★★★★★</div>
                <p style={{ fontSize: "1rem", lineHeight: 1.75, color: "#333", fontWeight: 500, flex: 1, wordBreak: "keep-all" }}>
                  &ldquo;생애 첫 축가를 앞두고 부족한 부분을 느껴 찾아뵈었는데, 제 부족한 부분을 콕콕 집어 트레이닝 해주셨어요. <strong style={{ color: "#111" }}>당일 잘불렀다는 칭찬도 들었고, 친구에게 너무 고맙다는 말도 들었습니다.</strong>&rdquo;
                </p>
                <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "1rem" }}>
                  <p style={{ fontWeight: 800, fontSize: "0.92rem", color: "#111" }}>Colin KOO</p>
                  <p style={{ fontSize: "0.8rem", color: "#888", marginTop: "2px" }}>Re:cord 인증 리뷰</p>
                </div>
              </div>
              <div style={{ background: "#fff", borderRadius: "24px", padding: "2rem", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 8px 30px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ color: "#FE7502", fontSize: "0.95rem", letterSpacing: "2px" }}>★★★★★</div>
                <p style={{ fontSize: "1rem", lineHeight: 1.75, color: "#333", fontWeight: 500, flex: 1, wordBreak: "keep-all" }}>
                  &ldquo;긴장이 높아서 평소 연습에 비해 무대 위에서 많이 흔들리는 타입인데, <strong style={{ color: "#111" }}>무대 위에서 필요한 마음가짐과 훈련 방법까지 함께 알려주셔서</strong>, 보컬 레슨을 넘어 공연을 준비하는 사람에게 꼭 필요한 방향성을 제시해주신 느낌이었습니다.&rdquo;
                </p>
                <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "1rem" }}>
                  <p style={{ fontWeight: 800, fontSize: "0.92rem", color: "#111" }}>멜로디민</p>
                  <p style={{ fontSize: "0.8rem", color: "#888", marginTop: "2px" }}>Re:cord 인증 리뷰</p>
                </div>
              </div>
              <div style={{ background: "#111", borderRadius: "24px", padding: "2rem", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", gap: "0.6rem" }}>
                <div style={{ fontSize: "3.2rem", fontWeight: 900, color: "#FE7502", lineHeight: 1 }}>6명</div>
                <p style={{ fontSize: "1.05rem", fontWeight: 800 }}>15주 몰입 과정 완주</p>
                <p style={{ fontSize: "0.88rem", color: "#a1a1a6", lineHeight: 1.65, wordBreak: "keep-all" }}>이전 프로그램에서 이미 검증된 커리큘럼 위에 SEE:SUN이 서 있습니다.</p>
              </div>
            </div>
          </div>
        </section>

        {/* [OFFER] Pricing / Track Cards: Stack the value and state the price */}
        <section id="programs" className="home-offer" style={{ padding: "8rem 2rem", background: "#f5f5f7", scrollMarginTop: "80px" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }} ref={addToRefs}>
            <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 3.8rem)", fontWeight: 800, letterSpacing: 0, color: "#111", marginTop: "0.5rem", lineHeight: 1.1 }}>
              가장 비싼 건,<br className="home-hero-mobile-break" /> 잘못 배우는 것입니다.
            </h2>
            <p style={{ color: "#666", fontSize: "1.2rem", marginTop: "1rem", fontWeight: 500 }}>레슨비를 버려본 분은 압니다. 싸게 여러 번보다, 제대로 한 번. 어떤 트랙이 맞을지는 무료 킥오프에서 함께 정합니다.</p>
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
              padding-top: 3.5rem; /* Slight padding adjust for the badge */
            }
            .t-card.reserve {
              background: #111;
              color: #fff;
              border: 1px solid rgba(255,255,255,0.1);
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
          `}} />

          <div className="track-grid">

            {/* Tier 1: Seesun Daily */}
            <Link href="/spark" className="t-card" style={{ textDecoration: "none", color: "#111", wordBreak: "keep-all" }} ref={addToRefs}>
              <div style={{ marginBottom: "2rem" }}>
                <span style={{ fontSize: "0.8rem", background: "rgba(0,0,0,0.05)", padding: "4px 10px", borderRadius: "4px", fontWeight: 700 }}>DAILY</span>
                <h3 style={{ fontSize: "1.8rem", fontWeight: 700, marginTop: "1rem", marginBottom: "0.5rem" }}>시선 데일리</h3>
                <p style={{ color: "#86868b", fontSize: "0.95rem", lineHeight: 1.5, minHeight: "65px" }}>
                  <span style={{ color: "#111", fontWeight: 700 }}>대충 100번보다, 제대로 10분.</span><br />
                  매일의 연습을 시스템으로 바꾸는 데일리 트레이닝.
                </p>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem 0", color: "#333", fontSize: "0.95rem", flexGrow: 1, wordBreak: "keep-all" }}>
                <li style={{ marginBottom: "12px", borderBottom: "1px dashed rgba(0,0,0,0.1)", paddingBottom: "12px" }}>매일 아침, 그날의 루틴 도착</li>
                <li style={{ marginBottom: "12px", borderBottom: "1px dashed rgba(0,0,0,0.1)", paddingBottom: "12px" }}>녹음 업로드 → 코치 피드백</li>
                <li style={{ paddingBottom: "12px" }}>변화가 보이는 성장 아카이브</li>
              </ul>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1.5rem", textAlign: "center" }}>120,000 <span style={{ fontSize: "0.9rem", color: "#888", fontWeight: 500 }}>KRW / 월</span></div>
              <div style={{ background: "#f5f5f7", color: "#111", textAlign: "center", padding: "15px", borderRadius: "12px", fontWeight: 700, border: "1px solid rgba(0,0,0,0.05)" }}>데일리 자세히 보기</div>
            </Link>

            {/* Tier 2: 시선 시그니처 (Signature) - HERO */}
            <Link href="/signature" className="t-card signature" style={{ textDecoration: "none", color: "#111", wordBreak: "keep-all" }} ref={addToRefs}>
              <div style={{ position: "absolute", top: "-15px", left: "50%", transform: "translateX(-50%)", background: "#FE7502", color: "#111", padding: "6px 20px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: 800, letterSpacing: 0, boxShadow: "0 4px 10px rgba(254, 117, 2,0.3)", wordBreak: "keep-all" }}>
                추천 프로그램
              </div>
              <div style={{ marginBottom: "2rem", paddingTop: "1rem" }}>
                <h3 style={{ fontSize: "2.4rem", fontWeight: 800, marginTop: "0.5rem", marginBottom: "0.5rem", letterSpacing: 0 }}>시선 시그니처</h3>
                <p style={{ color: "#86868b", fontSize: "1.05rem", lineHeight: 1.6, fontWeight: 500 }}>
                  레슨이 아니라 일주일 전체를 설계하는 <span style={{ color: "#111", fontWeight: 700 }}>SEE:SUN 메인 멤버십.</span>
                </p>
              </div>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2.5rem 0", color: "#111", fontSize: "1rem", flexGrow: 1, lineHeight: 1.4, wordBreak: "keep-all" }}>
                <li style={{ marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid rgba(0,0,0,0.05)", fontWeight: 700, display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <span style={{ color: "#FE7502", fontSize: "1.2rem" }}>✓</span>
                  <div>1:1 오프라인 밀착 세션 (50분)<br /><span style={{ fontSize: "0.85rem", color: "#666", fontWeight: 400, marginTop: "4px", display: "inline-block" }}>성대의 한계를 넘는 피지컬 세팅</span></div>
                </li>
                <li style={{ marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid rgba(0,0,0,0.05)", fontWeight: 700, display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <span style={{ color: "#FE7502", fontSize: "1.2rem" }}>✓</span>
                  <div>48시간 내 개인 맞춤 피드백<br /><span style={{ fontSize: "0.85rem", color: "#666", fontWeight: 400, marginTop: "4px", display: "inline-block" }}>수업 후에도 나를 놓치지 않는 밀착 관리</span></div>
                </li>
                <li style={{ marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid rgba(0,0,0,0.05)", fontWeight: 700, display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <span style={{ color: "#FE7502", fontSize: "1.2rem" }}>✓</span>
                  <div>주 1회 1:1 멤버십 (월 4회)<br /><span style={{ fontSize: "0.85rem", color: "#FE7502", fontWeight: 600, marginTop: "4px", display: "inline-block", background: "rgba(254, 117, 2,0.1)", padding: "2px 8px", borderRadius: "4px" }}>세션 사이의 6일까지 설계하는 구조</span></div>
                </li>
                <li style={{ marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid rgba(0,0,0,0.05)", fontWeight: 700, display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <span style={{ color: "#FE7502", fontSize: "1.2rem" }}>✓</span>
                  <div>성장 아카이브 제공<br /><span style={{ fontSize: "0.85rem", color: "#666", fontWeight: 400, marginTop: "4px", display: "inline-block" }}>이전 기록 비교 및 성장 과정 데이터화</span></div>
                </li>
                <li style={{ fontWeight: 700, display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <span style={{ color: "#FE7502", fontSize: "1.2rem" }}>+</span>
                  <div style={{ color: "#FE7502" }}>아티스트 웨이 크루 포함 (월 5만 원 상당)<br /><span style={{ fontSize: "0.85rem", color: "#888", fontWeight: 400, marginTop: "4px", display: "inline-block" }}>멤버 전용 예술·인문학 클럽 — 노래를 넘어, 자기 세계까지</span></div>
                </li>
              </ul>

              <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#111", letterSpacing: 0, textAlign: "center", marginBottom: "0.5rem" }}>
                480,000<span style={{ fontSize: "1.1rem", fontWeight: 600 }}>KRW / 월</span>
              </div>
              <div style={{ fontSize: "0.9rem", color: "#666", fontWeight: 600, textAlign: "center", marginBottom: "1.5rem" }}>주 1회 1:1 + 크루 포함</div>

              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <span style={{ display: "inline-block", background: "#f5f5f7", color: "#555", padding: "6px 14px", borderRadius: "8px", fontSize: "0.9rem", fontWeight: 600 }}>
                  제대로 변하기로 한 사람들의 코스
                </span>
              </div>

              <div style={{ background: "#FE7502", color: "#111", textAlign: "center", padding: "18px", borderRadius: "8px", fontWeight: 800, fontSize: "1.15rem", boxShadow: "0 4px 15px rgba(254, 117, 2,0.3)" }}>시그니처 코스 혜택 보기</div>
            </Link>

            {/* Tier 3: 15-Week Master Protocol */}
            <Link href="/reserve" className="t-card reserve" style={{ textDecoration: "none", wordBreak: "keep-all" }} ref={addToRefs}>
              <div style={{ marginBottom: "2rem" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#FE7502", letterSpacing: 0, marginBottom: "0.8rem", display: "block" }}>MASTER TRACK</div>
                <h3 style={{ fontSize: "2.3rem", fontWeight: 900, marginBottom: "0.5rem", letterSpacing: 0 }}>15주 마스터 프로토콜</h3>
                <p style={{ color: "#aaa", fontSize: "0.95rem", lineHeight: 1.5, minHeight: "65px" }}>
                  소리가 아니라, 사람이 바뀌는 15주 몰입. 아무나 받지 않습니다.
                </p>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem 0", color: "#e5e5ea", fontSize: "0.95rem", flexGrow: 1, wordBreak: "keep-all" }}>
                <li style={{ marginBottom: "12px", borderBottom: "1px dashed rgba(255,255,255,0.1)", paddingBottom: "12px", fontWeight: 600 }}>시그니처 코스 모든 혜택 포함</li>
                <li style={{ marginBottom: "12px", borderBottom: "1px dashed rgba(255,255,255,0.1)", paddingBottom: "12px" }}>이미 여섯 명이 완주한 검증된 과정</li>
                <li style={{ marginBottom: "12px", borderBottom: "1px dashed rgba(255,255,255,0.1)", paddingBottom: "12px" }}>해체 → 재건 → 실전 → 증명의 15주 설계</li>
                <li style={{ paddingBottom: "12px" }}>목표 미달성 시 4주 연장 (성과 보증)</li>
              </ul>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem", textAlign: "center" }}>가격은 상담에서만</div>
              <div style={{ fontSize: "0.9rem", color: "#a1a1a6", textAlign: "center", marginBottom: "1.5rem" }}>분기별 선착순 5명 TO 운영</div>
              <div style={{ background: "#fff", color: "#111", textAlign: "center", padding: "15px", borderRadius: "12px", fontWeight: 700, transition: "background 0.2s" }} className="hover:bg-gray-200">킥오프 상담 예약</div>
            </Link>

          </div>

          {/* Closing vow */}
          <div style={{ textAlign: "center", marginTop: "7rem", maxWidth: "760px", marginLeft: "auto", marginRight: "auto" }} ref={addToRefs}>
            <p style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 900, letterSpacing: 0, color: "#111", lineHeight: 1.25, wordBreak: "keep-all" }}>
              당신의 <span style={{ color: "#FE7502" }}>마지막 보컬 레슨</span>이 되겠습니다.
            </p>
            <p style={{ color: "#86868b", fontSize: "1.05rem", marginTop: "1.2rem", fontWeight: 500, wordBreak: "keep-all" }}>
              한번 제대로 만든 소리는, 평생 당신 편입니다.
            </p>
            <div style={{ marginTop: "2.4rem" }}>
              <a href={SMARTPLACE_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackKickoff("home_vow")} style={{ display: "inline-block", padding: "1.2rem 2.8rem", borderRadius: "40px", backgroundColor: "#111", color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: "1.05rem" }}>
                {KICKOFF_CTA_LABEL}
              </a>
            </div>
            <p style={{ color: "#a1a1a6", fontSize: "0.85rem", marginTop: "1rem", fontWeight: 500 }}>
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
        </section >

      </main >

      <style jsx global>{`
        .home-mastery-mobile {
          display: none;
        }

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
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 0 !important;
            padding: 0 0.75rem !important;
            width: 100%;
          }

          .home-page .home-subnav__item {
            min-width: 0;
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

          .home-page .home-hero__actions a {
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

          .home-page .bento-box p {
            font-size: 1.08rem !important;
          }

          .home-page .home-bento-feature {
            min-height: 340px !important;
          }

          .home-page .home-bento-label {
            position: static !important;
            margin-bottom: 1.25rem;
            display: block;
            font-size: 1.2rem !important;
          }

          .home-page .home-audio-sphere,
          .home-page .home-mastery-connector,
          .home-page .home-precision {
            display: none !important;
          }

          .home-page .home-mastery {
            padding: 6.5rem 1.25rem 3rem !important;
          }

          .home-page .home-mastery-mobile {
            display: grid;
            gap: 0;
            margin-top: 2.5rem;
          }

          .home-page .home-mastery-mobile-sphere {
            position: relative;
            height: 220px;
            margin: 0 auto;
            width: 100%;
            max-width: 340px;
            perspective: 900px;
          }

          .home-page .home-mastery-mobile-sphere__card {
            position: absolute;
            top: 0;
            width: 96px;
            height: 142px;
            border-radius: 16px;
            padding: 0.9rem 0.7rem;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            background: rgba(25, 25, 27, 0.82);
            border: 1px solid rgba(255, 255, 255, 0.16);
            box-shadow: 0 14px 32px rgba(0, 0, 0, 0.55);
            backdrop-filter: blur(12px);
          }

          .home-page .home-mastery-mobile-sphere__card span {
            color: rgba(255, 255, 255, 0.45);
            font-size: 0.58rem;
            font-weight: 800;
            margin-bottom: 0.3rem;
            letter-spacing: 0;
          }

          .home-page .home-mastery-mobile-sphere__card strong {
            font-size: 0.92rem;
            line-height: 1.05;
            font-weight: 900;
            letter-spacing: 0;
          }

          .home-page .home-mastery-mobile-connector {
            height: 86px;
            width: 100%;
            max-width: 340px;
            margin: -0.75rem auto 0.25rem;
          }

          .home-page .home-mastery-mobile-timeline {
            position: relative;
            display: grid;
            gap: 1rem;
            padding-left: 0;
          }

          .home-page .home-mastery-mobile-timeline__line {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 41px;
            width: 1px;
            background: linear-gradient(
              to bottom,
              rgba(254, 117, 2, 0) 0%,
              rgba(254, 117, 2, 0.45) 10%,
              rgba(255, 255, 255, 0.08) 100%
            );
          }

          .home-page .home-mastery-mobile-step {
            position: relative;
            display: grid;
            grid-template-columns: 82px minmax(0, 1fr);
            align-items: start;
            gap: 0.9rem;
          }

          .home-page .home-mastery-mobile-step.is-left .home-mastery-mobile-step__body {
            transform: translateX(-6px);
          }

          .home-page .home-mastery-mobile-step.is-right .home-mastery-mobile-step__body {
            transform: translateX(6px);
          }

          .home-page .home-mastery-mobile-step__node {
            position: relative;
            z-index: 1;
            width: 56px;
            height: 56px;
            margin: 0 auto;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: #FE7502;
            color: #000;
            font-weight: 950;
            font-size: 1.25rem;
            box-shadow: 0 0 28px rgba(254, 117, 2, 0.45);
            border: 2px solid rgba(255, 255, 255, 0.16);
          }

          .home-page .home-mastery-mobile-step__body {
            background: rgba(255, 255, 255, 0.035);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 22px;
            padding: 1.15rem;
            backdrop-filter: blur(10px);
          }

          .home-page .home-mastery-mobile-step__period {
            display: block;
            color: rgba(254, 117, 2, 0.6);
            font-size: 0.72rem;
            font-weight: 800;
            letter-spacing: 0;
            text-transform: uppercase;
            margin-bottom: 0.45rem;
          }

          .home-page .home-mastery-mobile-step__badges {
            display: flex;
            flex-wrap: wrap;
            gap: 0.4rem;
            margin-bottom: 0.8rem;
          }

          .home-page .home-mastery-mobile-step__badges span {
            display: inline-flex;
            align-items: center;
            padding: 0.32rem 0.62rem;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.08);
            color: #fff;
            font-size: 0.72rem;
            font-weight: 700;
          }

          .home-page .home-mastery-mobile-step h3 {
            font-size: 1.18rem;
            font-weight: 900;
            margin-bottom: 0.65rem;
            letter-spacing: 0;
            line-height: 1.05;
          }

          .home-page .home-mastery-mobile-step p {
            color: #d1d1d6;
            font-size: 0.9rem;
            line-height: 1.65;
          }

          .home-page .home-curriculum-layout {
            flex-direction: column !important;
            min-height: 0 !important;
          }

          .home-page .home-curriculum-menu {
            width: 100%;
            padding: 0 !important;
          }

          .home-page .home-curriculum-visual {
            min-height: 280px !important;
            width: 100%;
          }

          .home-page .track-grid {
            gap: 1.5rem !important;
          }

          .home-page .t-card {
            padding: 2rem 1.4rem !important;
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

          .home-page .home-mastery h2,
          .home-page .home-offer h2 {
            font-size: clamp(2rem, 9vw, 2.6rem) !important;
            line-height: 1.08 !important;
          }

          .home-page .home-mastery-mobile-sphere {
            max-width: 312px;
            height: 188px;
          }

          .home-page .home-mastery-mobile-sphere__card {
            width: 84px;
            height: 128px;
            padding: 0.8rem 0.62rem;
          }

          .home-page .home-mastery-mobile-sphere__card strong {
            font-size: 0.84rem;
          }

          .home-page .home-mastery-mobile-connector {
            max-width: 312px;
            margin-top: -0.4rem;
          }

          .home-page .home-mastery-mobile-step {
            grid-template-columns: 68px minmax(0, 1fr);
            gap: 0.7rem;
          }

          .home-page .home-mastery-mobile-timeline__line {
            left: 33px;
          }

          .home-page .home-mastery-mobile-step__node {
            width: 48px;
            height: 48px;
            font-size: 1.05rem;
          }

          .home-page .home-mastery-mobile-step__body {
            padding: 1rem;
            border-radius: 20px;
          }

          .home-page .home-curriculum-visual {
            min-height: 220px !important;
            border-radius: 24px !important;
          }

          .home-page .bento-box {
            padding: 1.25rem !important;
            min-height: 220px !important;
          }

          .home-page .bento-box p {
            font-size: 1rem !important;
          }
        }
      `}</style>

      {/* Footer */}
      <footer style={{ background: "#f5f5f7", padding: "4rem 2rem", borderTop: "1px solid rgba(0,0,0,0.05)", color: "#86868b", fontSize: "0.85rem", textAlign: "center" }}>
        <p>&copy; 2026 SEE:SUN MUSIC All Rights Reserved.</p>
      </footer>
    </div >
  );
}
