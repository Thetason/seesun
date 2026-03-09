"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Home() {
  const contentRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeOntology, setActiveOntology] = useState(0);
  const [showExpertBio, setShowExpertBio] = useState(false);
  const [videoIdx, setVideoIdx] = useState(0);
  const heroVideos = ["/hero-video.mp4", "/hero-video-2.mp4"];

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !contentRefs.current.includes(el)) {
      contentRefs.current.push(el);
    }
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Timeline Path & Silhouette Animation
    const path = document.querySelector('.path-progress');
    const silhouette = document.querySelector('.walking-silhouette');
    if (path) {
      gsap.to(path, {
        strokeDashoffset: 0,
        scrollTrigger: {
          trigger: path.parentElement,
          start: "top 20%",
          end: "bottom 80%",
          scrub: 1,
          onUpdate: (self) => {
            if (silhouette) {
              // Basic horizontal positioning synchronized with scroll for the silhouette
              // In a real motion path, we'd use MotionPathPlugin, but here we can simulate 
              // by moving it based on the self.progress
              const progress = self.progress;
              gsap.set(silhouette, { x: progress * 800, y: Math.sin(progress * Math.PI * 4) * 50 });
            }
          }
        }
      });
    }

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
    <div style={{ backgroundColor: "#f5f5f7", color: "#1d1d1f", minHeight: "100vh", overflowX: "hidden" }}>

      {/* 1. Global Header */}
      <header
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
        <div style={{ maxWidth: "1200px", width: "100%", margin: "0 auto", padding: "0 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#FF9F0A" strokeWidth="2" />
              <path d="M12 6v12M6 12h12" stroke="#FF9F0A" strokeWidth="2" />
            </svg>
            <span style={{ fontWeight: 700, letterSpacing: "0.1em", color: "#111" }}>
              SEE:SUN
            </span>
          </div>
          <Link href="/login" style={{ color: "#111", fontSize: "0.85rem", fontWeight: 600, border: "1px solid rgba(0,0,0,0.1)", padding: "6px 14px", borderRadius: "20px", transition: "all 0.2s" }} className="hover:bg-black hover:text-white">
            로그인 / 회원가입
          </Link>
        </div>
      </header>

      {/* 2. Apple-style Sub Navigation */}
      <nav
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
        <div style={{ maxWidth: "600px", margin: "0 auto", display: "flex", justifyContent: "center", gap: "10%", padding: "0 10px" }}>
          <Link href="/studio" style={{ display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none", color: "#111", opacity: 0.6, transition: "opacity 0.2s" }} className="hover:opacity-100">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: "6px" }}>
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span style={{ fontSize: "0.7rem", letterSpacing: "0.02em", fontWeight: 600 }}>스파크 (ESSENTIAL)</span>
          </Link>

          <Link href="/signature" style={{ display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none", color: "#111", opacity: 0.6, transition: "opacity 0.2s" }} className="hover:opacity-100">
            <div style={{ fontSize: "1.5rem", marginBottom: "4px" }}>⭐</div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em" }}>시그니처 (MAIN)</span>
          </Link>

          <Link href="/reserve" style={{ display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none", color: "#111", opacity: 0.6, transition: "opacity 0.2s" }} className="hover:opacity-100">
            <div style={{ fontSize: "1.5rem", marginBottom: "4px" }}>💎</div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.05em" }}>리저브 (VVIP)</span>
          </Link>
        </div>
      </nav>

      <main style={{ paddingTop: "140px" }}>

        {/* [HOOK] Hero Section: Apple-style punchy, large typography */}
        <section ref={addToRefs} style={{ textAlign: "center", padding: "12rem 2rem 8rem", position: "relative" }}>
          <span style={{ color: "#FF9F0A", fontWeight: 700, letterSpacing: "0.1em", fontSize: "0.9rem", textTransform: "uppercase" }}>SEE:SUN MUSIC</span>
          <h1 style={{ fontSize: "clamp(3.5rem, 9vw, 6rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1, margin: "1rem 0", color: "#111", wordBreak: "keep-all" }}>
            예술의 가치를 아는 당신.<br />
            <span style={{ color: "#FF9F0A" }}>가장 자유로운 자아실현.</span>
          </h1>
          <p style={{ fontSize: "clamp(1.1rem, 3vw, 1.4rem)", color: "#86868b", fontWeight: 500, maxWidth: "700px", margin: "0 auto 3rem", lineHeight: 1.5, wordBreak: "keep-all" }}>
            음악이 가진 바래지 않는 가치. 가치 있는 것은 아무나 얻을 순 없습니다.<br />
            정확한 코칭과 노력으로 만들어내는 <span style={{ color: "#111", fontWeight: 700 }}>경이로운 변화</span>.<br />
            당신의 목소리가 <span style={{ color: "#111", fontWeight: 700 }}>예술이 되는 순간</span>을 느끼시도록 돕습니다.
          </p>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", alignItems: "center" }}>
              <Link href="/diagnosis" style={{ padding: "1.2rem 2.5rem", borderRadius: "40px", backgroundColor: "#111", color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: "1.1rem" }}>
                보컬 진단 시작
              </Link>
              <Link href="/signature" style={{ padding: "1.2rem 2.5rem", borderRadius: "40px", border: "1px solid #111", color: "#111", textDecoration: "none", fontWeight: 700, fontSize: "1.1rem" }}>
                클래스 둘러보기
              </Link>
            </div>
            <p style={{ color: "#86868b", fontSize: "0.9rem", marginTop: "0.5rem", fontWeight: 500 }}>
              3분 사전 체크 후, 현재 발성의 병목과 시작 방향을 안내합니다.
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
              onEnded={() => setVideoIdx((prev) => (prev + 1) % heroVideos.length)}
              style={{ width: "100%", height: "auto", display: "block", aspectRatio: "16/9", objectFit: "cover", opacity: 0.85 }}
              src={heroVideos[videoIdx]}
            />
          </div>
        </section>

        {/* [Highlights] Apple-style "일단 핵심부터." Bento Grid */}
        <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "6rem 2rem" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }} ref={addToRefs}>
            <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.04em", color: "#111" }}>일단 핵심부터.</h2>
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
              letter-spacing: -0.03em;
              line-height: 1.4;
              color: #111;
              position: relative;
              z-index: 2;
              word-break: keep-all;
              overflow-wrap: break-word;
            }
            .bento-box strong {
              color: #FF9F0A;
              font-weight: 800;
              letter-spacing: -0.04em;
            }
            .bento-full-width {
              grid-column: 1 / -1;
            }
            .bento-two-thirds {
              grid-column: span 2;
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
            }
          `}} />

          <div className="bento-grid">

            {/* Box 1 (Hero Feature) */}
            <div className="bento-box bento-two-thirds" style={{ background: "#f5f5f7" }} ref={addToRefs}>
              <div style={{ position: "absolute", top: "2.5rem", left: "2.5rem", fontWeight: 800, fontSize: "1.5rem", color: "#111" }}>D.A.P. 시스템</div>
              <p style={{ maxWidth: "450px", fontSize: "1.4rem", color: "#86868b" }}>
                우리 몸이 <span style={{ color: "#111", fontWeight: 700 }}>디자인된 쓰임새</span> 그대로, <br />
                노래하는 사람들만 아는 비밀을 그대로. <br />
                <span style={{ color: "#111", fontWeight: 800 }}>&quot;놀라운 변화는 남다른 인풋으로부터&quot;</span>
              </p>
            </div>

            {/* Box 2 */}
            <div className="bento-box" style={{ background: "#FF9F0A" }} ref={addToRefs}>
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
              <div style={{ position: "absolute", top: "2.5rem", left: "2.5rem", color: "#FF9F0A", fontWeight: 800, letterSpacing: "0.2em", fontSize: "0.8rem" }}>MASTER COACH</div>

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
                <h4 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1.5rem", color: "#FF9F0A" }}>Master Setassun</h4>
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
              <div style={{ position: "absolute", top: "2.5rem", left: "2.5rem", fontSize: "3rem" }}>🎙️</div>
              <p style={{ maxWidth: "600px", fontSize: "1.4rem", lineHeight: 1.5, color: "rgba(255,255,255,0.7)", marginBottom: "1rem" }}>
                옷에도 퍼스널컬러가 있듯, 노래에도 당신만의 고유한 음색이 있습니다. <br />
                시선은 당신도 몰랐던 매력적인 음색을 발견하고, <br />
                <span style={{ color: "#fff", fontWeight: 700 }}>가장 완벽한 형태의 예술로 기록합니다.</span><br />
                <span style={{ color: "#fff", fontWeight: 800 }}>이제 당신이 닿고 싶었던 목소리가 현실이 됩니다.</span>
              </p>
              <div style={{ position: "absolute", top: "2.5rem", right: "3rem", color: "rgba(255,255,255,0.3)", fontWeight: 700, letterSpacing: "0.1em", fontSize: "0.9rem" }}>RECORDING</div>
            </div>

          </div>
        </section>

        {/* [STORY] Journey of Mastery: Audio Sphere & Precision Timeline */}
        <section style={{ padding: "8rem 2rem 4rem", background: "#050505", color: "#fff", position: "relative", overflow: "hidden" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "4rem" }} ref={addToRefs}>
              <h2 style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 900, letterSpacing: "-0.05em", color: "#fff", textTransform: "uppercase" }}>Journey of Mastery</h2>
              <div style={{ marginTop: "1.5rem" }}>
                <p style={{ color: "#fff", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", fontWeight: 850, letterSpacing: "-0.04em", marginBottom: "0.5rem" }}>
                  14년의 탐구가 당신의 소리를 바꾸는 이유
                </p>
                <p style={{ color: "#a1a1a6", fontSize: "clamp(1rem, 1.5vw, 1.3rem)", fontWeight: 600, letterSpacing: "-0.02em" }}>
                  감이 아니라 구조로, 고음·호흡·표현·음색을 당신 몸에 맞게 다시 설계합니다.
                </p>
                <div style={{
                  marginTop: "2rem",
                  display: "inline-block",
                  padding: "0.8rem 1.5rem",
                  background: "rgba(255, 159, 10, 0.1)",
                  border: "1px solid rgba(255, 159, 10, 0.3)",
                  borderRadius: "50px",
                  color: "#FF9F0A",
                  fontWeight: 800,
                  fontSize: "1.1rem"
                }}>
                  잘 부르는 법이 아니라, 안 무너지는 소리를 만듭니다.
                </div>
              </div>
            </div>

            {/* Audio Sphere Cards UI: Responsive & Enhanced */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "450px",
              position: "relative",
              perspective: "1200px",
              marginBottom: "0",
              overflow: "hidden" /* Prevent card rotation bleed */
            }}>
              <style dangerouslySetInnerHTML={{
                __html: `
                .audio-sphere-card {
                  position: absolute;
                  width: 200px;
                  height: 280px;
                  border-radius: 20px;
                  padding: 1.5rem;
                  display: flex;
                  flex-direction: column;
                  justify-content: flex-end;
                  transition: all 0.7s cubic-bezier(0.23, 1, 0.32, 1);
                  cursor: pointer;
                  backdrop-filter: blur(12px);
                  border: 1px solid rgba(255,255,255,0.15);
                  box-shadow: 0 10px 40px rgba(0,0,0,0.6);
                  transform-origin: center bottom;
                }
                .audio-sphere-card:hover {
                  transform: translateY(-40px) scale(1.1) rotate(0deg) !important;
                  z-index: 50 !important;
                  box-shadow: 0 30px 60px rgba(0,0,0,0.9);
                  border-color: rgba(255,255,255,0.4);
                }
                .card-title { font-weight: 900; font-size: 1.3rem; margin-bottom: 0.4rem; letter-spacing: -0.02em; }
                .card-period { font-size: 0.85rem; font-weight: 800; opacity: 0.6; color: #fff; margin-bottom: 2px; }
                .card-blur-bg {
                  position: absolute;
                  top: 40%;
                  left: 50%;
                  width: 150px;
                  height: 150px;
                  border-radius: 50%;
                  filter: blur(45px);
                  transform: translate(-50%, -50%);
                  opacity: 0.4;
                  pointer-events: none;
                }

                @media (max-width: 1024px) {
                  .audio-sphere-card { width: 160px; height: 220px; }
                  .card-title { font-size: 1.1rem; }
                }
                @media (max-width: 768px) {
                  .audio-sphere-card { 
                    width: 130px; 
                    height: 180px; 
                  }
                  .card-title { font-size: 0.9rem; }
                  .card-period { font-size: 0.7rem; }
                }
              `}} />

              {[
                { title: "Foundation", period: "2010 - 2018", color: "#FF9F0A", rotate: -12, x: -30, y: 15, offset: -240 },
                { title: "Science of Voice", period: "2016 - 2018", color: "#FF9F0A", rotate: -6, x: -15, y: 5, offset: -120 },
                { title: "Artistic Depth", period: "2018 - 2023", color: "#FF9F0A", rotate: 0, x: 0, y: 0, offset: 0 },
                { title: "Practical Experience", period: "2020 - 2024", color: "#FF9F0A", rotate: 6, x: 15, y: 5, offset: 120 },
                { title: "Genre Expansion", period: "Current", color: "#FF9F0A", rotate: 12, x: 30, y: 15, offset: 240 }
              ].map((card, i) => (
                <div
                  key={i}
                  className="audio-sphere-card"
                  style={{
                    backgroundColor: "rgba(25, 25, 27, 0.8)",
                    left: `calc(50% + ${card.offset}px)`,
                    transform: `translateX(-50%) translateY(${card.y}px) rotate(${card.rotate}deg)`,
                    zIndex: i
                  }}
                >
                  <div className="card-blur-bg" style={{ backgroundColor: card.color }}></div>
                  <span className="card-period">{card.period}</span>
                  <p className="card-title" style={{ color: card.color }}>{card.title}</p>
                </div>
              ))}
            </div>

            {/* Curved Connector SVG: Precision Aligned Trajectory */}
            <div style={{ width: "100%", height: "120px", position: "relative", marginTop: "-2rem" }}>
              <svg width="100%" height="100%" viewBox="0 0 1000 120" preserveAspectRatio="none">
                <path
                  d="M 500 0 C 500 60 200 60 200 120"
                  fill="none"
                  stroke="#FF9F0A"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                  strokeLinecap="round"
                  opacity="0.8"
                />
              </svg>
            </div>

            <div style={{
              position: "relative",
              width: "100%",
              aspectRatio: "1000 / 1400",
              maxWidth: "1000px",
              margin: "0 auto"
            }}>
              {/* SVG Background Path */}
              <svg
                viewBox="0 0 1000 1400"
                preserveAspectRatio="xMidYMid meet"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 0,
                  pointerEvents: "none"
                }}
              >
                {/*
                  Anchor coordinates (viewBox 1000x1400):
                  P1: 200, 200 (20%, 14.28%)
                  P2: 800, 200 (80%, 14.28%)
                  P3: 200, 500 (20%, 35.71%)
                  P4: 800, 800 (80%, 57.14%)
                  P5: 200, 1100 (20%, 78.57%)
                */}
                <path
                  data-scroll-path="true"
                  d="M 200 0 L 200 200 L 800 200 C 800 200 800 350 500 350 C 200 350 200 500 200 500 C 200 500 200 650 500 650 C 800 650 800 800 800 800 C 800 800 800 950 500 950 C 200 950 200 1100 200 1100 L 200 1400"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  className="path-progress"
                  d="M 200 0 L 200 200 L 800 200 C 800 200 800 350 500 350 C 200 350 200 500 200 500 C 200 500 200 650 500 650 C 800 650 800 800 800 800 C 800 800 800 950 500 950 C 200 950 200 1100 200 1100 L 200 1400"
                  fill="none"
                  stroke="url(#precision-gradient-v4)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="5000"
                  strokeDashoffset="5000"
                  style={{ transition: "stroke-dashoffset 0.1s linear" }}
                />

                <defs>
                  <linearGradient id="precision-gradient-v4" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FF9F0A" />
                    <stop offset="50%" stopColor="#FF7A00" />
                    <stop offset="100%" stopColor="#FF9F0A" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Waypoints / Milestones */}
              <style dangerouslySetInnerHTML={{
                __html: `
                .precision-anchor {
                  position: absolute;
                  width: 0;
                  height: 0;
                  z-index: 10; /* Higher than SVG */
                }
                .precision-node {
                  width: 140px;
                  height: 140px;
                  border-radius: 50%;
                  background: #FF9F0A; /* Changed from red */
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 2.5rem;
                  font-weight: 950;
                  color: #000;
                  box-shadow: 0 0 50px rgba(255, 159, 10, 0.6);
                  border: 2px solid rgba(255,255,255,0.2);
                  position: absolute;
                  transform: translate(-50%, -50%); /* Center node on anchor */
                }
                .precision-content {
                  position: absolute;
                  width: clamp(280px, 35vw, 420px); /* Flexible width to prevent overflow */
                  text-align: left;
                  transform: translateY(-50%); /* Align content vertically to node center */
                  text-shadow: 0 2px 20px rgba(0,0,0,1); /* Stronger shadow to pop against path */
                  z-index: 15;
                }
                .precision-content.left {
                  right: 120px;
                  text-align: right;
                }
                .precision-content.right {
                  left: 120px;
                  text-align: left;
                }

                .precision-content h3 {
                  font-size: 2.22rem;
                  font-weight: 900;
                  margin-bottom: 0.8rem;
                  color: #fff;
                  white-space: nowrap;
                  letter-spacing: -0.02em;
                }
                .precision-period {
                  font-size: 0.9rem;
                  font-weight: 800;
                  color: rgba(255, 159, 10, 0.4);
                  margin-bottom: 0.3rem;
                  display: block;
                  text-transform: uppercase;
                }
                .credential-badge {
                  display: inline-flex;
                  padding: 6px 14px;
                  background: rgba(255,255,255,0.08); /* Slightly more opaque */
                  border: 1px solid rgba(255,255,255,0.15);
                  border-radius: 8px;
                  font-size: 0.95rem; /* Increased from 0.75rem */
                  font-weight: 800;
                  color: #fff; /* Maximum contrast */
                  margin-right: 8px;
                  margin-bottom: 8px;
                  backdrop-filter: blur(8px);
                }
                .badge-container {
                   display: flex;
                   flex-wrap: wrap;
                   margin-bottom: 0.5rem;
                }
                .precision-desc {
                  font-size: 1.25rem;
                  color: #e5e5e7; /* Increased brightness */
                  line-height: 1.6;
                  font-weight: 600; /* Increased weight */
                }
                @media (max-width: 1200px) {
                  .precision-content { width: 320px; }
                }
                @media (max-width: 1024px) {
                  .precision-node { width: 110px; height: 110px; font-size: 2rem; }
                  .precision-content { width: 240px; }
                  .precision-content.left { right: 90px; }
                  .precision-content.right { left: 90px; }
                }
                @media (max-width: 768px) {
                  /* On mobile, simplified layout might be better but let's keep it responsive */
                  .precision-content { width: 180px; }
                  .precision-desc { font-size: 1.05rem; }
                }
              `}} />

              {[
                {
                  id: "01", x: "20%", y: "14.285%",
                  title: "Foundation", period: "2010 - 2018",
                  badges: ["성악전공", "실용음악보컬 전공"],
                  desc: "클래식 성악과 실용음악을 함께 훈련한 이유는 하나입니다. 어떤 장르를 부르더라도 흔들리지 않는 발성의 중심을 만들기 위해서입니다. <span style='color: #FF9F0A;'>수강생은 여기서 목으로 버티지 않는 기본기를 가져갑니다.</span>",
                  side: "left"
                },
                {
                  id: "02", x: "80%", y: "14.285%",
                  title: "Science of Voice", period: "2016 - 2018",
                  badges: ["한국발성교정협회 발성교정사", "남도현교수 직접사사"],
                  desc: "감으로만 설명하지 않습니다. 음성학과 해부학 원리로 왜 막히는지, 어디서 힘이 새는지 명확하게 설명합니다. <span style='color: #FF9F0A;'>수강생은 여기서 혼자 연습해도 다시 무너지지 않는 기준을 가져갑니다.</span>",
                  side: "right"
                },
                {
                  id: "03", x: "20%", y: "35.714%",
                  title: "Artistic Depth", period: "2018 - 2023",
                  badges: ["뮤지컬극단 메인배우", "찬스라인 전속작곡가"],
                  desc: "잘 부르는 것만으로는 충분하지 않습니다. 가사 전달, 감정선, 다이내믹까지 설계해야 노래가 사람에게 닿습니다. <span style='color: #FF9F0A;'>수강생은 여기서 정확한 소리 너머의 표현력을 가져갑니다.</span>",
                  side: "right"
                },
                {
                  id: "04", x: "80%", y: "57.142%",
                  title: "Practical Experience", period: "2020 - 2024",
                  badges: ["클라우딘뮤직 대표역임"],
                  desc: "레슨실에서만 되는 소리는 실력이 아닙니다. 녹음실과 무대, 실제 상황에서도 유지되는 호흡과 톤, 집중력을 훈련합니다. <span style='color: #FF9F0A;'>수강생은 여기서 실전에서 버티는 컨트롤을 가져갑니다.</span>",
                  side: "left"
                },
                {
                  id: "05", x: "20%", y: "78.571%",
                  title: "Genre Expansion", period: "Current",
                  badges: ["Current Focus"],
                  desc: "좋은 트레이닝은 모두를 같은 소리로 만들지 않습니다. 각자의 장르 성향에 맞게 방향을 잡아야 자기만의 소리가 생깁니다. <span style='color: #FF9F0A;'>수강생은 여기서 남을 복제하지 않는 자기 음색을 가져갑니다.</span>",
                  side: "right"
                }
              ].map((m, idx) => (
                <div
                  key={idx}
                  className="precision-anchor"
                  style={{
                    left: m.x,
                    top: m.y
                  }}
                  ref={addToRefs}
                >
                  <div className="precision-node">{m.id}</div>
                  <div className={`precision-content ${m.side}`}>
                    <span className="precision-period">{m.period}</span>
                    <div className="badge-container">
                      {m.badges?.map((b: string, i: number) => (
                        <span key={i} className="credential-badge">{b}</span>
                      ))}
                    </div>
                    <h3>{m.title}</h3>
                    <p className="precision-desc" dangerouslySetInnerHTML={{ __html: m.desc }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Trust-Building Footer Section */}
            <div style={{ marginTop: "6rem", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "6rem" }} ref={addToRefs}>
              <div style={{ textAlign: "center", marginBottom: "5rem" }}>
                <p style={{ color: "#FF9F0A", fontSize: "1.2rem", fontWeight: 800, marginBottom: "1rem" }}>TRUST & EVIDENCE</p>
                <h3 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.2 }}>
                  이 14년의 축적은 경력 소개가 아니라,<br />
                  당신이 더 빨리 바뀌기 위한 <span style={{ color: "#FF9F0A" }}>압축된 지도</span>입니다.
                </h3>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem" }}>
                {/* Target Audience */}
                <div style={{ background: "rgba(255,255,255,0.03)", padding: "2.5rem", borderRadius: "30px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <h4 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "1.5rem", color: "#FF9F0A" }}>이런 분께 추천합니다</h4>
                  <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {["고음이 막혀 답답함을 느끼는 분", "목이 자주 잠겨 노래를 오래 못하는 분", "레슨실에선 되는데 실전에서 무너지는 분", "나만의 음색과 스타일을 찾고 싶은 분"].map((item, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "center", gap: "0.8rem", color: "#d1d1d6", fontWeight: 600 }}>
                        <span style={{ color: "#FF9F0A", fontSize: "1.2rem" }}>✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Lesson Process */}
                <div style={{ background: "rgba(255,255,255,0.03)", padding: "2.5rem", borderRadius: "30px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <h4 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "1.5rem", color: "#FF9F0A" }}>검증된 수업 방식</h4>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
                    {["진단", "교정", "적용", "피드백"].map((step, i) => (
                      <div key={i} style={{ textAlign: "center", flex: 1 }}>
                        <div style={{ width: "45px", height: "45px", borderRadius: "50%", background: "rgba(255, 159, 10, 0.15)", border: "1px solid #FF9F0A", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.8rem", color: "#FF9F0A", fontWeight: 900 }}>{i + 1}</div>
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
              <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 700, letterSpacing: "-0.04em", marginTop: "0.5rem" }}>
                보다 자세히 들여다보기.
              </h2>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", minHeight: "600px" }}>
              {/* Left: Interactive Buttons */}
              <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "0.5rem", padding: "2rem 0" }}>
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
              <div style={{ flex: "1 1 500px", position: "relative", borderRadius: "30px", background: "#0a0a0c", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>

                {/* Dynamic Background Glow Based on Active Step */}
                <div style={{
                  position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                  width: "120%", height: "120%",
                  background:
                    activeOntology === 0 ? "radial-gradient(circle, rgba(255,159,10,0.4) 0%, rgba(0,0,0,0) 60%)" :
                      activeOntology === 1 ? "radial-gradient(circle, rgba(255,59,48,0.4) 0%, rgba(0,0,0,0) 60%)" :
                        activeOntology === 2 ? "radial-gradient(circle, rgba(10,132,255,0.4) 0%, rgba(0,0,0,0) 60%)" :
                          "radial-gradient(circle, rgba(191,90,242,0.4) 0%, rgba(0,0,0,0) 60%)",
                  transition: "background 0.8s ease",
                  filter: "blur(50px)", zIndex: 0
                }}></div>

                {/* Abstract Visual Elements / Images */}
                <div style={{ position: "relative", zIndex: 1, textAlign: "center", transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)", transform: `scale(${activeOntology === 0 ? 1 : 1.05})`, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {activeOntology === 0 && (
                    <img src="/step1.jpg" alt="Step 1" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }} />
                  )}
                  {activeOntology === 1 && (
                    <img src="/step2.jpg" alt="Step 2" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }} />
                  )}
                  {activeOntology === 2 && (
                    <img src="/step3.jpg" alt="Step 3" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }} />
                  )}
                  {activeOntology === 3 && (
                    <div style={{ fontSize: "6rem", filter: "drop-shadow(0 0 20px rgba(255,159,10,0.5))" }}>✨</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section >

        {/* [OFFER] Pricing / Track Cards: Stack the value and state the price */}
        < section style={{ padding: "8rem 2rem", background: "#f5f5f7" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }} ref={addToRefs}>
            <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 3.8rem)", fontWeight: 800, letterSpacing: "-0.04em", color: "#111", marginTop: "0.5rem", lineHeight: 1.1 }}>
              당신에게 맞는 프로그램은?
            </h2>
            <p style={{ color: "#666", fontSize: "1.2rem", marginTop: "1rem", fontWeight: 500 }}>오직 당신만을 위한 맞춤형 클래스. 업그레이드하기 딱 좋은 때는 바로 지금.</p>
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
              border: 2px solid #FF9F0A;
              box-shadow: 0 15px 40px rgba(255,159,10,0.1);
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

            {/* Tier 1: 시선 스파크 (Spark) */}
            <Link href="/studio" className="t-card" style={{ textDecoration: "none", color: "#111", wordBreak: "keep-all" }} ref={addToRefs}>
              <div style={{ marginBottom: "2rem" }}>
                <span style={{ fontSize: "0.8rem", background: "rgba(0,0,0,0.05)", padding: "4px 10px", borderRadius: "4px", fontWeight: 700 }}>ESSENTIAL STARTER</span>
                <h3 style={{ fontSize: "1.8rem", fontWeight: 700, marginTop: "1rem", marginBottom: "0.5rem" }}>시선 스파크</h3>
                <p style={{ color: "#86868b", fontSize: "0.95rem", lineHeight: 1.5, minHeight: "65px" }}>
                  <span style={{ color: "#111", fontWeight: 700 }}>30일 발성 습관 리셋 챌린지.</span><br />
                  가장 가볍고 빠르게 시작하는 시선의 입문자용 데일리 트레이닝.
                </p>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem 0", color: "#333", fontSize: "0.95rem", flexGrow: 1, wordBreak: "keep-all" }}>
                <li style={{ marginBottom: "12px", borderBottom: "1px dashed rgba(0,0,0,0.1)", paddingBottom: "12px" }}>매일 연습 가이드라인 제공</li>
                <li style={{ marginBottom: "12px", borderBottom: "1px dashed rgba(0,0,0,0.1)", paddingBottom: "12px" }}>주간 온라인 보컬 피드백</li>
                <li style={{ paddingBottom: "12px" }}>기초 호흡 및 코어 확립</li>
              </ul>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1.5rem", textAlign: "center" }}>100,000 <span style={{ fontSize: "0.9rem", color: "#888", fontWeight: 500 }}>KRW / 월</span></div>
              <div style={{ background: "#f5f5f7", color: "#111", textAlign: "center", padding: "15px", borderRadius: "12px", fontWeight: 700, border: "1px solid rgba(0,0,0,0.05)" }}>스파크 시작하기</div>
            </Link>

            {/* Tier 2: 시선 시그니처 (Signature) - HERO */}
            <Link href="/signature" className="t-card signature" style={{ textDecoration: "none", color: "#111", wordBreak: "keep-all" }} ref={addToRefs}>
              <div style={{ position: "absolute", top: "-15px", left: "50%", transform: "translateX(-50%)", background: "#FF9F0A", color: "#111", padding: "6px 20px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: 800, letterSpacing: "0.1em", boxShadow: "0 4px 10px rgba(255,159,10,0.3)", wordBreak: "keep-all" }}>
                추천 프로그램
              </div>
              <div style={{ marginBottom: "2rem", paddingTop: "1rem" }}>
                <h3 style={{ fontSize: "2.4rem", fontWeight: 800, marginTop: "0.5rem", marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>시선 시그니처</h3>
                <p style={{ color: "#86868b", fontSize: "1.05rem", lineHeight: 1.6, fontWeight: 500 }}>
                  주변을 압도하는 보컬 실력의 퀀텀 점프. <br /><span style={{ color: "#111", fontWeight: 700 }}>노래하는 몸으로의 튜닝, 보컬 부스터 멤버십.</span>
                </p>
              </div>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2.5rem 0", color: "#111", fontSize: "1rem", flexGrow: 1, lineHeight: 1.4, wordBreak: "keep-all" }}>
                <li style={{ marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid rgba(0,0,0,0.05)", fontWeight: 700, display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <span style={{ color: "#FF9F0A", fontSize: "1.2rem" }}>✓</span>
                  <div>1:1 오프라인 밀착 세션 (50분)<br /><span style={{ fontSize: "0.85rem", color: "#666", fontWeight: 400, marginTop: "4px", display: "inline-block" }}>성대의 한계를 넘는 피지컬 세팅</span></div>
                </li>
                <li style={{ marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid rgba(0,0,0,0.05)", fontWeight: 700, display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <span style={{ color: "#FF9F0A", fontSize: "1.2rem" }}>✓</span>
                  <div>48시간 내 개인 맞춤 피드백<br /><span style={{ fontSize: "0.85rem", color: "#666", fontWeight: 400, marginTop: "4px", display: "inline-block" }}>수업 후에도 나를 놓치지 않는 밀착 관리</span></div>
                </li>
                <li style={{ marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid rgba(0,0,0,0.05)", fontWeight: 700, display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <span style={{ color: "#FF9F0A", fontSize: "1.2rem" }}>✓</span>
                  <div>4회 세션 멤버십 (5주 내 권장)<br /><span style={{ fontSize: "0.85rem", color: "#FF9F0A", fontWeight: 600, marginTop: "4px", display: "inline-block", background: "rgba(255,159,10,0.1)", padding: "2px 8px", borderRadius: "4px" }}>소진 시 간편 연장으로 끊김 없는 성장</span></div>
                </li>
                <li style={{ marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid rgba(0,0,0,0.05)", fontWeight: 700, display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <span style={{ color: "#FF9F0A", fontSize: "1.2rem" }}>✓</span>
                  <div>성장 아카이브 제공<br /><span style={{ fontSize: "0.85rem", color: "#666", fontWeight: 400, marginTop: "4px", display: "inline-block" }}>이전 기록 비교 및 성장 과정 데이터화</span></div>
                </li>
                <li style={{ fontWeight: 700, display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <span style={{ color: "#FF9F0A", fontSize: "1.2rem" }}>+</span>
                  <div style={{ color: "#FF9F0A" }}>시선 스파크(10만 원 상당) 전면 무상 포함<br /><span style={{ fontSize: "0.85rem", color: "#888", fontWeight: 400, marginTop: "4px", display: "inline-block" }}>멤버십 기간 내 데일리 루틴 무제한 제공</span></div>
                </li>
              </ul>

              <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#111", letterSpacing: "-0.02em", textAlign: "center", marginBottom: "0.5rem" }}>
                400,000<span style={{ fontSize: "1.1rem", fontWeight: 600 }}>KRW</span>
              </div>
              <div style={{ fontSize: "0.9rem", color: "#666", fontWeight: 600, textAlign: "center", marginBottom: "1.5rem" }}>4회 레슨 (회당 10만원)</div>

              <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <span style={{ display: "inline-block", background: "#f5f5f7", color: "#555", padding: "6px 14px", borderRadius: "8px", fontSize: "0.9rem", fontWeight: 600 }}>
                  보컬 부스터 4회 세션 패스
                </span>
              </div>

              <div style={{ background: "#FF9F0A", color: "#111", textAlign: "center", padding: "18px", borderRadius: "14px", fontWeight: 800, fontSize: "1.15rem", boxShadow: "0 4px 15px rgba(255,159,10,0.3)" }}>시그니처 코스 혜택 보기</div>
            </Link>

            {/* Tier 3: 시선 리저브 (Reserve) */}
            <Link href="/reserve" className="t-card reserve" style={{ textDecoration: "none", wordBreak: "keep-all" }} ref={addToRefs}>
              <div style={{ marginBottom: "2rem" }}>
                <span style={{ fontSize: "0.8rem", background: "rgba(255,255,255,0.1)", color: "#aaa", padding: "4px 10px", borderRadius: "4px", fontWeight: 700 }}>VVIP ONLY</span>
                <h3 style={{ fontSize: "2rem", fontWeight: 700, marginTop: "1rem", marginBottom: "0.5rem" }}>시선 리저브</h3>
                <p style={{ color: "#aaa", fontSize: "0.95rem", lineHeight: 1.5, minHeight: "65px" }}>
                  당신의 시간과 체면까지 설계하는 최고밀착 프라이빗 코칭. 분기별 한정 인원.
                </p>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem 0", color: "#e5e5ea", fontSize: "0.95rem", flexGrow: 1, wordBreak: "keep-all" }}>
                <li style={{ marginBottom: "12px", borderBottom: "1px dashed rgba(255,255,255,0.1)", paddingBottom: "12px", fontWeight: 600 }}>🌟 시그니처 코스 모든 혜택 포함</li>
                <li style={{ marginBottom: "12px", borderBottom: "1px dashed rgba(255,255,255,0.1)", paddingBottom: "12px" }}>지정 장소/시간 유연성 출장 레슨</li>
                <li style={{ marginBottom: "12px", borderBottom: "1px dashed rgba(255,255,255,0.1)", paddingBottom: "12px" }}>철저한 신분 보호 비밀 보장</li>
                <li style={{ paddingBottom: "12px" }}>목표 미달성 시 4주 연장 (성과 보증)</li>
              </ul>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem", textAlign: "center" }}>12주 마스터 프로토콜</div>
              <div style={{ fontSize: "0.9rem", color: "#a1a1a6", textAlign: "center", marginBottom: "1.5rem" }}>분기별 선착순 5명 TO 운영</div>
              <div style={{ background: "#fff", color: "#111", textAlign: "center", padding: "15px", borderRadius: "12px", fontWeight: 700, transition: "background 0.2s" }} className="hover:bg-gray-200">킥오프 상담 예약</div>
            </Link>

          </div>
        </section >

      </main >

      {/* Footer */}
      < footer style={{ background: "#f5f5f7", padding: "4rem 2rem", borderTop: "1px solid rgba(0,0,0,0.05)", color: "#86868b", fontSize: "0.85rem", textAlign: "center" }}>
        <p>&copy; 2026 SEE:SUN MUSIC All Rights Reserved.</p>
      </footer >
    </div >
  );
}
