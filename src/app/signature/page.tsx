"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../../styles/styles.css";

export default function ProPage() {
    const heroContentRef = useRef<HTMLDivElement>(null);
    const textRevealRefs = useRef<(HTMLHeadingElement | HTMLParagraphElement | null)[]>([]);

    const addToRefs = (el: HTMLHeadingElement | HTMLParagraphElement | null) => {
        if (el && !textRevealRefs.current.includes(el)) {
            textRevealRefs.current.push(el);
        }
    };

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        window.scrollTo(0, 0);

        // Dark theme for PRO
        document.body.style.backgroundColor = "#050507";
        document.body.style.color = "#ffffff";

        // Hero Entrance
        if (heroContentRef.current) {
            gsap.fromTo(
                heroContentRef.current.children,
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.15,
                    ease: "power4.out",
                    delay: 0.2,
                }
            );
        }

        // Scroll Reveal Triggers
        textRevealRefs.current.forEach((el) => {
            gsap.fromTo(
                el,
                { y: 50, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out",
                }
            );
        });

        return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
            document.body.style.backgroundColor = "";
            document.body.style.color = "";
        };
    }, []);

    return (
        <main style={{ minHeight: "100vh", position: "relative", overflow: "hidden", backgroundColor: "#050507", color: "#ffffff" }}>

            {/* Header */}
            <header style={{ position: "fixed", top: 0, left: 0, width: "100%", padding: "1.5rem 0", zIndex: 100, backdropFilter: "blur(10px)", background: "rgba(5,5,7,0.8)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="container flex-center" style={{ justifyContent: "space-between" }}>
                    <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ marginRight: "10px" }}>
                            <circle cx="12" cy="12" r="10" stroke="#FF9F0A" strokeWidth="2" />
                            <path d="M12 6v12M6 12h12" stroke="#FF9F0A" strokeWidth="2" />
                        </svg>
                        <span style={{ fontWeight: 700, letterSpacing: "0.1em", color: "#fff" }}>SEE:SUN SIGNATURE</span>
                    </Link>
                    <Link href="/login" style={{ color: "#fff", fontSize: "0.9rem", fontWeight: 600, border: "1px solid rgba(255,159,10,0.5)", padding: "8px 16px", borderRadius: "20px", transition: "all 0.2s" }} className="hover:bg-[#FF9F0A] hover:text-black hover:border-[#FF9F0A]">
                        대시보드 로그인
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", position: "relative" }}>
                {/* Background Glow */}
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "80vw", height: "80vw", background: "radial-gradient(circle, rgba(255,159,10,0.15) 0%, rgba(5,5,7,0) 60%)", filter: "blur(60px)", zIndex: 0 }}></div>

                <div className="container" ref={heroContentRef} style={{ position: "relative", zIndex: 1, maxWidth: "900px" }}>
                    <span style={{ display: "inline-block", background: "rgba(255,159,10,0.15)", color: "#FF9F0A", padding: "6px 16px", borderRadius: "30px", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "2rem", border: "1px solid rgba(255,159,10,0.3)" }}>
                        ADVANCED INTENSIVE COURSE
                    </span>
                    <h1 style={{ fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: "1.5rem", color: "#fff" }}>
                        당신의 목소리에<br />
                        <span style={{ color: "#FF9F0A" }}>부스터를.</span>
                    </h1>
                    <p style={{ fontSize: "1.3rem", color: "#86868b", lineHeight: 1.6, maxWidth: "600px", margin: "0 auto 3rem" }}>
                        단순한 레슨이 아닙니다. D.A.P 시스템을 통해 <span style={{ color: "#fff", fontWeight: 700 }}>노래하는 몸으로의 완벽한 튜닝</span>과 실전 적용을 돕는 보컬 부스터 멤버십.
                    </p>
                </div>
            </section>

            {/* Philosophical Story Section (Moved from Studio) */}
            <section style={{ padding: "8rem 0", background: "#050507", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="container" style={{ maxWidth: "800px" }}>
                    <div ref={addToRefs} style={{ textAlign: "center", marginBottom: "4rem" }}>
                        <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#fff", marginBottom: "2rem", lineHeight: 1.3 }}>
                            목소리가 온전히 내 것이 될 때의<br />
                            <span style={{ color: "#FF9F0A" }}>그 고요한 해방감.</span>
                        </h2>
                        <p style={{ color: "#86868b", fontSize: "1.2rem", lineHeight: 1.8 }}>
                            잘 부르기 위한 흉내가 아닙니다. <span style={{ color: "#fff", fontWeight: 700 }}>내 목소리의 진짜 결</span>을 발견하고,<br />
                            타인의 시선에서 완전히 자유로워지는 <span style={{ color: "#fff", fontWeight: 700 }}>압도적인 감각</span>.<br />
                            시선뮤직 시그니처가 지향하는 본질적인 변화입니다.
                        </p>
                    </div>

                    <div ref={addToRefs} style={{ background: "rgba(255,255,255,0.02)", padding: "3rem", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <h3 style={{ fontSize: "1.5rem", marginBottom: "20px", color: "#fff", fontWeight: 600 }}>
                            &quot;성대를 열고 닫는 법만 배운다고 노래가 늘까요?&quot;
                        </h3>
                        <div style={{ color: "#86868b", fontSize: "1.1rem", lineHeight: 1.8 }}>
                            <p style={{ marginBottom: "15px" }}>
                                많은 분들이 성대를 단순한 밸브로 착각하고 부분적인 컨트롤에만 집착합니다. 하지만 <span style={{ color: "#fff", fontWeight: 700 }}>노래는 성대로만 하는 것이 아닙니다.</span> 몸 전체의 협응(Coordination)을 써서 소리를 내야 합니다.
                            </p>
                            <p>
                                우리 코치진 역시 평범한 사람들이었습니다. 수년의 시행착오 끝에 고음의 두려움을 쫓아내는 것은 타고난 성대가 아니라 <span style={{ color: "#fff", fontWeight: 700 }}>스스로 압력을 버티는 몸</span>이라는 사실을 깨달았습니다. 그 간결한 공식만을 시그니처 커리큘럼에 눌러 담았습니다.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Curriculum & Pricing */}
            <section style={{ padding: "8rem 0", background: "#0a0a0c" }}>
                <div className="container" style={{ maxWidth: "1200px" }}>
                    <div style={{ textAlign: "center", marginBottom: "5rem" }}>
                        <h2 ref={addToRefs} style={{ fontSize: "2.5rem", fontWeight: 700, color: "#fff", marginBottom: "1rem" }}>
                            글로벌 스탠다드, 고효율 바디 튜닝
                        </h2>
                        <p ref={addToRefs} style={{ color: "#888", fontSize: "1.1rem" }}>할리우드의 SLS와 유럽의 벨칸토를 관통하는 최상위 원칙. <br />발성을 노래에 즉각 이식하는 4회 세션의 압축적인 부스팅 프로세스입니다.</p>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
                        <div style={{ background: "rgba(255,255,255,0.03)", padding: "3rem", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)" }}>
                            <h3 style={{ fontSize: "1.5rem", color: "#FF9F0A", marginBottom: "2rem", fontWeight: 700 }}>코스 인프라스트럭처</h3>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0, color: "#ddd" }}>
                                <li style={{ marginBottom: "1.5rem", paddingLeft: "2rem", position: "relative", color: "#86868b" }}>
                                    <span style={{ position: "absolute", left: 0, color: "#FF9F0A", fontWeight: 700 }}>01</span>
                                    <span style={{ color: "#fff", display: "block", marginBottom: "0.3rem", fontWeight: 700 }}>D.A.P. 바디 시스템 튜닝 (1세션)</span>
                                    성대라는 밸브에 의존하던 습관을 버리고, 몸 전체의 압력을 견고하게 컨트롤하는 노래하는 전용 신체를 구축합니다.
                                </li>
                                <li style={{ marginBottom: "1.5rem", paddingLeft: "2rem", position: "relative", color: "#86868b" }}>
                                    <span style={{ position: "absolute", left: 0, color: "#FF9F0A", fontWeight: 700 }}>02</span>
                                    <span style={{ color: "#fff", display: "block", marginBottom: "0.3rem", fontWeight: 700 }}>보컬 아키텍처 및 톤 메이킹 (2세션)</span>
                                    당신이 가진 가장 매력적인 음색을 발굴하고, 실전 무대에 맞게 고유의 보컬 톤을 정교하게 다듬어 증폭(Boost)시킵니다.
                                </li>
                                <li style={{ marginBottom: "1.5rem", paddingLeft: "2rem", position: "relative", color: "#86868b" }}>
                                    <span style={{ position: "absolute", left: 0, color: "#FF9F0A", fontWeight: 700 }}>03</span>
                                    <span style={{ color: "#fff", display: "block", marginBottom: "0.3rem", fontWeight: 700 }}>실전 보컬 디렉팅 및 적용 (3세션)</span>
                                    훈련된 몸과 톤을 실제 곡에 완벽하게 이식합니다. 어떤 상황에서도 무너지지 않는 여유와 실전 감각을 완성합니다.
                                </li>
                                <li style={{ marginBottom: "1.5rem", paddingLeft: "2rem", position: "relative", color: "#86868b" }}>
                                    <span style={{ position: "absolute", left: 0, color: "#FF9F0A", fontWeight: 700 }}>04</span>
                                    <span style={{ color: "#fff", display: "block", marginBottom: "0.3rem", fontWeight: 700 }}>퍼펙트 레코딩 및 아카이빙 (4세션)</span>
                                    완성된 소리를 영구적으로 기록하고, LMS 대시보드를 통해 성장 데이터를 축적합니다.
                                </li>
                                <li style={{ paddingLeft: "2rem", position: "relative" }}>
                                    <span style={{ position: "absolute", left: 0, color: "#FF9F0A", fontWeight: 700 }}>+A</span>
                                    <strong style={{ color: "#FF9F0A", display: "block", marginBottom: "0.3rem" }}>데일리 습관 리셋 패키지 (Spark) 포함</strong>
                                    세션 사이사이의 공백을 메우는 30일 데일리 루틴 가이드와 온라인 피드백 인프라가 전면 무상 제공됩니다.
                                </li>
                            </ul>
                        </div>

                        {/* Pricing Card */}
                        <div style={{ background: "linear-gradient(145deg, #FF9F0A 0%, #E88B00 100%)", padding: "3rem", borderRadius: "24px", color: "#000", textAlign: "center", boxShadow: "0 20px 50px rgba(255,159,10,0.15)" }}>
                            <h3 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "1rem" }}>SEE:SUN 보컬 부스터</h3>
                            <p style={{ opacity: 0.8, fontWeight: 600, marginBottom: "2rem" }}>4회 세션 멤버십 (회차 소진 시 연장)</p>

                            <div style={{ fontSize: "3.5rem", fontWeight: 800, letterSpacing: "-0.05em", marginBottom: "0.5rem" }}>
                                400,000<span style={{ fontSize: "1.5rem", fontWeight: 600 }}>KRW</span>
                            </div>
                            <p style={{ fontSize: "1rem", color: "#000", fontWeight: 700, marginBottom: "0.5rem", opacity: 0.6 }}>회당 100,000원</p>
                            <p style={{ fontSize: "0.9rem", color: "#000", fontWeight: 800, marginBottom: "2rem", background: "rgba(0,0,0,0.06)", padding: "10px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.1)" }}>시선 스파크(10만 원 상당) 전면 프리패스 포함</p>

                            <button style={{ width: "100%", padding: "1.2rem", background: "#000", color: "#fff", border: "none", borderRadius: "12px", fontSize: "1.1rem", fontWeight: 700, cursor: "pointer", transition: "transform 0.2s" }} className="hover:scale-105">
                                코스 시작 전 상담 신청하기
                            </button>
                            <p style={{ fontSize: "0.8rem", opacity: 0.7, marginTop: "1rem" }}>
                                * 책임감 있는 지도를 위해 기수별 한정 인원만 모집합니다.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
}
