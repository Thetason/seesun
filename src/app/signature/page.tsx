"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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

    const [modalActive, setModalActive] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const openModal = () => setModalActive(true);
    const closeModal = () => {
        setModalActive(false);
        setIsSubmitted(false);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
    };

    return (
        <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden", backgroundColor: "#050507", color: "#ffffff", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>

            {/* Navigation */}
            <header style={{ position: "fixed", top: 0, left: 0, width: "100%", padding: "1.5rem 0", zIndex: 100, backdropFilter: "blur(20px)", background: "rgba(5,5,7,0.7)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
                        <span style={{ fontWeight: 800, letterSpacing: "0.05em", color: "#fff", fontSize: "1.1rem" }}>SEE:SUN <span style={{ color: "#FF9F0A" }}>SIGNATURE</span></span>
                    </Link>
                    <button onClick={openModal} style={{ background: "#FF9F0A", color: "#000", fontSize: "0.85rem", fontWeight: 700, padding: "10px 20px", borderRadius: "30px", border: "none", cursor: "pointer" }}>
                        상담 신청하기
                    </button>
                </div>
            </header>

            <main>
                {/* 1. Hero Section */}
                <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", paddingTop: "80px" }}>
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "70vw", height: "70vw", background: "radial-gradient(circle, rgba(255,159,10,0.12) 0%, transparent 70%)", filter: "blur(80px)", zIndex: 0 }}></div>

                    <div className="container" ref={heroContentRef} style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: "1000px" }}>
                        <span className="gsap-reveal" style={{ display: "inline-block", color: "#FF9F0A", fontWeight: 800, letterSpacing: "0.2em", fontSize: "0.85rem", marginBottom: "2rem" }}>ADVANCED INTENSIVE COURSE</span>
                        <h1 className="gsap-reveal" style={{ fontSize: "clamp(3.5rem, 9vw, 6.5rem)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: "2.5rem" }}>
                            당신의 목소리에<br />
                            <span style={{ color: "#FF9F0A" }}>부스터를.</span>
                        </h1>
                        <div className="gsap-reveal" style={{ maxWidth: "700px", margin: "0 auto" }}>
                            <p style={{ fontSize: "1.4rem", fontWeight: 500, color: "#e1e1e6", marginBottom: "1.5rem", lineHeight: 1.4 }}>
                                단순히 성대만 다루는 레슨이 아닙니다.
                            </p>
                            <p style={{ fontSize: "1.15rem", color: "#a1a1a6", lineHeight: 1.8, marginBottom: "3rem" }}>
                                SEE:SUN SIGNATURE는 노래를 정말 잘하는 사람들이 실제로 쓰는 몸의 사용방식과 소리의 흐름을 당신에게 정확하게 붙여드리는 집중형 보컬 멤버십입니다.
                            </p>
                        </div>
                        <div className="gsap-reveal" style={{ display: "flex", justifyContent: "center", gap: "1.5rem" }}>
                            <button onClick={openModal} style={{ padding: "1.2rem 3rem", background: "#FF9F0A", color: "#000", borderRadius: "40px", fontWeight: 700, fontSize: "1.1rem", border: "none" }}>시그니처 상담 신청하기</button>
                            <button style={{ padding: "1.2rem 3rem", background: "rgba(255,255,255,0.05)", color: "#fff", borderRadius: "40px", fontWeight: 700, fontSize: "1.1rem", border: "1px solid rgba(255,255,255,0.1)" }}>프로그램 자세히 보기</button>
                        </div>
                    </div>
                </section>

                {/* 2. Emotional Transition Section */}
                <section style={{ padding: "12rem 0", textAlign: "center", background: "linear-gradient(to bottom, #050507, #0a0a0c)" }}>
                    <div className="container" style={{ maxWidth: "800px" }}>
                        <h2 ref={addToRefs} style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.2, marginBottom: "3rem", letterSpacing: "-0.02em" }}>
                            목소리가 온전히 내 것이 될 때의<br />
                            <span style={{ color: "#FF9F0A" }}>그 고요한 해방감.</span>
                        </h2>
                        <div ref={addToRefs} style={{ fontSize: "1.25rem", lineHeight: 1.9, color: "#a1a1a6", fontWeight: 500 }}>
                            <p>억지로 만드는 소리가 아닙니다. 흉내 내는 창법도 아닙니다.</p>
                            <p style={{ marginTop: "1rem" }}>내 몸에서 자연스럽게 나오는 소리, 내 감정이 더 정확하게 실리는 표현, <br />내 목소리가 비로소 내 것이 되는 감각.</p>
                            <p style={{ marginTop: "2rem", color: "#fff", fontWeight: 700 }}>시그니처는 그 감각을 우연이 아니라 <br />반복 가능한 변화로 만들기 위해 설계되었습니다.</p>
                        </div>
                    </div>
                </section>

                {/* 3. Problem Statement Section */}
                <section style={{ padding: "10rem 0", background: "#0a0a0c" }}>
                    <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
                        <div ref={addToRefs}>
                            <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 3.8rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: "2rem", letterSpacing: "-0.03em" }}>
                                성대만 다룬다고<br />노래가 달라지지는 않습니다.
                            </h2>
                        </div>
                        <div ref={addToRefs} style={{ color: "#a1a1a6", fontSize: "1.2rem", lineHeight: 1.8 }}>
                            <p style={{ marginBottom: "2rem" }}>노래는 성대로만 하는 것이 아닙니다. 정말 잘하는 가수들은 소리를 내는 기술 이전에 몸 전체를 쓰는 방식부터 다릅니다.</p>
                            <p>호흡, 압력, 공명, 움직임, 감각의 연결이 달라질 때 소리는 비로소 더 편안해지고 더 멀리 가고 더 자유로워집니다.</p>
                            <p style={{ marginTop: "2rem", color: "#FF9F0A", fontWeight: 700 }}>SEE:SUN SIGNATURE는 몸의 사용방식을 당신에게 붙여드리는 코스입니다.</p>
                        </div>
                    </div>
                </section>

                {/* 4. Philosophy Section */}
                <section style={{ padding: "10rem 0", background: "#050507" }}>
                    <div className="container" style={{ maxWidth: "900px", textAlign: "center" }}>
                        <h2 ref={addToRefs} style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, marginBottom: "3rem" }}>
                            몸은 버티게 만드는 것이 아니라,<br /><span style={{ color: "#FF9F0A" }}>제대로 쓰이게</span> 만드는 것입니다.
                        </h2>
                        <div ref={addToRefs} style={{ fontSize: "1.2rem", lineHeight: 1.8, color: "#a1a1a6" }}>
                            <p>우리는 몸을 억지로 버티게 만들지 않습니다. 몸이 원래 디자인된 기능대로 올바르게 작동할 수 있도록 돕습니다.</p>
                            <p style={{ marginTop: "1.5rem" }}>좋은 소리는 억지 힘으로 만들어지지 않습니다. 몸의 흐름이 풀리고, 필요한 곳이 제 역할을 하기 시작할 때 소리는 훨씬 더 자연스럽고 안정적으로 달라집니다.</p>
                        </div>
                    </div>
                </section>

                {/* 5. Summary & 6. Value Expansion */}
                <section style={{ padding: "8rem 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="container grid-2" style={{ gap: "4rem" }}>
                        <div ref={addToRefs} style={{ background: "rgba(255,255,255,0.02)", padding: "4rem", borderRadius: "32px", border: "1px solid rgba(255,255,255,0.05)" }}>
                            <h3 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "1.5rem", color: "#FF9F0A" }}>분명히 다른 몸쓰임새</h3>
                            <p style={{ color: "#a1a1a6", lineHeight: 1.7 }}>노래를 정말 잘하는 사람들은 단지 성대 컨트롤이 좋은 것이 아닙니다. 압력을 다루는 감각, 표현을 연결하는 흐름이 다릅니다. 그 차이를 기술이 아닌 당신의 몸에 붙여드립니다.</p>
                        </div>
                        <div ref={addToRefs} style={{ background: "rgba(255,255,255,0.02)", padding: "4rem", borderRadius: "32px", border: "1px solid rgba(255,255,255,0.05)" }}>
                            <h3 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "1.5rem", color: "#FF9F0A" }}>노래 밖에서도 남는 변화</h3>
                            <p style={{ color: "#a1a1a6", lineHeight: 1.7 }}>이 변화는 노래에만 머무르지 않습니다. 말할 때의 울림, 발표할 때의 전달력, 감정을 표현하는 방식까지. 목소리를 다루는 방식 자체를 바꾸는 일입니다.</p>
                        </div>
                    </div>
                </section>

                {/* 7. Core Value Section */}
                <section style={{ padding: "10rem 0", textAlign: "center" }}>
                    <div className="container" style={{ maxWidth: "800px" }}>
                        <h2 ref={addToRefs} style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "2rem" }}>본질적인 변화는 올바른 사용법에서 시작됩니다.</h2>
                        <p ref={addToRefs} style={{ fontSize: "1.15rem", lineHeight: 1.8, color: "#a1a1a6" }}>
                            SEE:SUN SIGNATURE는 더 세게 밀어붙이는 훈련이 아닙니다. 몸과 소리의 관계를 더 정확하게 이해하고, 원래의 기능을 제대로 사용할 수 있도록 돕습니다. 고음은 편안해지고, 음색은 선명해지며, 표현은 자연스럽게 살아납니다.
                        </p>
                    </div>
                </section>

                {/* 8. Course Infrastructure */}
                <section style={{ padding: "10rem 0", background: "#0a0a0c" }}>
                    <div className="container">
                        <div style={{ marginBottom: "5rem" }}>
                            <span style={{ color: "#FF9F0A", fontWeight: 800, letterSpacing: "0.2em", fontSize: "0.8rem" }}>COURSE INFRASTRUCTURE</span>
                            <h2 style={{ fontSize: "3rem", fontWeight: 800, marginTop: "1rem" }}>압도적 성장의 인프라</h2>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
                            {[
                                { id: "01", title: "노래하는 몸의 사용법 교정", desc: "성대만 조절하던 습관에서 벗어나, 노래를 정말 잘하는 사람들이 실제로 쓰는 몸의 흐름과 사용방식을 당신의 몸에 맞게 다시 붙여드립니다." },
                                { id: "02", title: "보컬 톤 & 음색 디렉팅", desc: "당신 안에 이미 있는 가장 좋은 결을 찾아 더 선명하고 더 매력적인 톤으로 정교하게 다듬어갑니다." },
                                { id: "03", title: "곡 적용 & 표현 연결", desc: "훈련한 몸과 소리를 실제 곡에 적용해 노래 안에서 전달력과 표현력이 자연스럽게 이어지도록 돕습니다." },
                                { id: "04", title: "레코딩 & 성장 아카이빙", desc: "변화는 감각으로만 남기지 않습니다. 완성된 소리를 기록하고 LMS 대시보드를 통해 성장의 흐름을 축적합니다." }
                            ].map((item, i) => (
                                <div key={i} ref={addToRefs} style={{ background: "rgba(255,255,255,0.03)", padding: "2.5rem", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.06)" }}>
                                    <span style={{ color: "#FF9F0A", fontWeight: 800, fontSize: "1.2rem", display: "block", marginBottom: "1.5rem" }}>{item.id}</span>
                                    <h4 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "1rem" }}>{item.title}</h4>
                                    <p style={{ color: "#86868b", fontSize: "1rem", lineHeight: 1.6 }}>{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div ref={addToRefs} style={{ marginTop: "2rem", background: "rgba(255,159,10,0.08)", padding: "2rem", borderRadius: "24px", border: "1px solid rgba(255,159,10,0.2)", display: "flex", alignItems: "center", gap: "1.5rem" }}>
                            <div style={{ background: "#FF9F0A", color: "#000", padding: "4px 12px", borderRadius: "4px", fontWeight: 900 }}>+A</div>
                            <p style={{ fontWeight: 700, fontSize: "1.1rem" }}>세션 사이의 공백까지 성장의 일부가 되도록, 30일 데일리 루틴과 온라인 피드백 시스템(Spark)이 함께 제공됩니다.</p>
                        </div>
                    </div>
                </section>

                {/* 9. Recommendations & 10. Changes */}
                <section style={{ padding: "10rem 0", background: "#050507" }}>
                    <div className="container grid-2" style={{ gap: "6rem", alignItems: "start" }}>
                        <div ref={addToRefs}>
                            <h2 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "3rem" }}>이런 분들에게 추천합니다</h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                                {[
                                    "성대만 조절하는 방식의 한계를 느끼고 있는 분",
                                    "노래할수록 몸이 더 힘들고 어려워지는 분",
                                    "잘하는 사람들의 몸쓰임새를 제대로 배우고 싶은 분",
                                    "내 음색과 표현을 더 자연스럽고 깊게 만들고 싶은 분",
                                    "노래뿐 아니라 말, 발표까지 바뀌는 변화를 원하는 분",
                                    "짧더라도 밀도 높은 집중 코칭이 필요한 분"
                                ].map((item, i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "1.1rem", fontWeight: 500, color: "#e1e1e6" }}>
                                        <div style={{ width: "6px", height: "6px", background: "#FF9F0A", borderRadius: "50%" }}></div>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div ref={addToRefs} style={{ background: "#fff", color: "#000", padding: "4rem", borderRadius: "40px" }}>
                            <h2 style={{ fontSize: "2.2rem", fontWeight: 900, marginBottom: "2rem", letterSpacing: "-0.02em" }}>당신이 가져가게 될 것</h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                                {[
                                    "노래를 위한 몸 전체의 올바른 사용감",
                                    "더 편안하고 자연스러운 고음의 방향",
                                    "내 목소리에 맞는 음색과 표현의 기준",
                                    "곡 안에서 실제로 살아나는 전달력",
                                    "말, 발표, 감정표현까지 이어지는 확장성"
                                ].map((item, i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem", fontWeight: 700, fontSize: "1.1rem" }}>
                                        <span style={{ color: "#FF9F0A" }}>✓</span> {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 11. Pricing & 12. Product Block */}
                <section style={{ padding: "10rem 0", textAlign: "center", background: "#0a0a0c" }}>
                    <div className="container" style={{ maxWidth: "800px" }}>
                        <h2 ref={addToRefs} style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "2rem" }}>짧지만, 오래 남는 변화.</h2>
                        <p ref={addToRefs} style={{ fontSize: "1.25rem", lineHeight: 1.8, color: "#a1a1a6", marginBottom: "5rem" }}>
                            시그니처는 SEE:SUN의 핵심 메소드를 가장 밀도 높게 경험하는 코스입니다. 한 번 익히면 그 이후의 노래와 목소리를 대하는 기준 자체가 달라집니다.
                        </p>

                        <div ref={addToRefs} style={{ background: "linear-gradient(145deg, #18181b 0%, #09090b 100%)", padding: "4rem", borderRadius: "48px", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 40px 100px rgba(0,0,0,0.5)" }}>
                            <span style={{ display: "inline-block", background: "rgba(255,159,10,0.1)", color: "#FF9F0A", padding: "6px 16px", borderRadius: "30px", fontSize: "0.85rem", fontWeight: 800, marginBottom: "1.5rem" }}>SEE:SUN SIGNATURE</span>
                            <h3 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "1rem" }}>4회 집중 세션 멤버십</h3>
                            <p style={{ color: "#86868b", fontSize: "1.1rem", marginBottom: "2rem" }}>회차 소진 시 연장 가능 · SPARK 30일 루틴 프리패스 포함</p>

                            <div style={{ margin: "3rem 0" }}>
                                <div style={{ fontSize: "4.5rem", fontWeight: 900, color: "#fff", lineHeight: 1.1 }}>400,000 <span style={{ fontSize: "1.5rem", color: "#86868b" }}>KRW</span></div>
                                <div style={{ fontSize: "1.1rem", color: "#FF9F0A", fontWeight: 700, marginTop: "1rem" }}>회당 100,000원</div>
                            </div>

                            <p style={{ background: "rgba(255,255,255,0.03)", padding: "1.2rem", borderRadius: "16px", fontSize: "0.95rem", color: "#a1a1a6", marginBottom: "3rem" }}>
                                세션 사이의 공백까지 성장으로 이어지도록 <br />시선 스파크 30일 루틴이 함께 제공됩니다.
                            </p>

                            <button onClick={openModal} style={{ width: "100%", padding: "1.5rem", background: "#FF9F0A", color: "#000", borderRadius: "20px", fontSize: "1.2rem", fontWeight: 800, cursor: "pointer", border: "none" }}>시그니처 상담 신청하기</button>
                        </div>
                    </div>
                </section>

                {/* 13. Final Persuasion & 14. Last CTA */}
                <section style={{ padding: "12rem 0", background: "linear-gradient(to bottom, #0a0a0c, #050507)", textAlign: "center" }}>
                    <div className="container" style={{ maxWidth: "900px" }}>
                        <div ref={addToRefs}>
                            <h2 style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: "3rem", letterSpacing: "-0.04em" }}>
                                당신의 목소리를<br /><span style={{ color: "#FF9F0A" }}>더 본질적인 방향으로.</span>
                            </h2>
                            <p style={{ fontSize: "1.3rem", color: "#a1a1a6", lineHeight: 1.8, maxWidth: "700px", margin: "0 auto 4rem" }}>
                                정확한 코칭과 올바른 몸의 사용법은 당신의 목소리를 더 자유롭고 더 오래 남는 방식으로 바꿔놓을 수 있습니다.
                            </p>
                        </div>

                        <div ref={addToRefs}>
                            <button onClick={openModal} style={{ padding: "1.5rem 5rem", background: "#FF9F0A", color: "#000", borderRadius: "50px", fontWeight: 800, fontSize: "1.3rem", border: "none" }}>
                                코스 시작 전 상담 신청하기
                            </button>
                            <p style={{ marginTop: "2rem", color: "#52525b", fontSize: "0.95rem", fontWeight: 600 }}>책임감 있는 지도를 위해 기수별 한정 인원만 모집합니다.</p>
                        </div>
                    </div>
                </section>
            </main>

            {/* Modal - Unified Style */}
            <div className={`modal-overlay ${modalActive ? 'active' : ''}`} style={{
                background: "rgba(0,0,0,0.85)",
                position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                backdropFilter: "blur(15px)", zIndex: 1000,
                display: modalActive ? "flex" : "none",
                justifyContent: "center", alignItems: "center",
                opacity: modalActive ? 1 : 0, transition: "opacity 0.3s ease"
            }}>
                <div style={{ width: "95%", maxWidth: "500px", background: "#111", borderRadius: "32px", padding: "40px", position: "relative", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <button onClick={closeModal} style={{ color: "#fff", position: "absolute", top: "25px", right: "25px", background: "none", border: "none", fontSize: "2rem", cursor: "pointer", opacity: 0.5 }}>&times;</button>
                    {!isSubmitted ? (
                        <div>
                            <h3 style={{ fontSize: "1.8rem", marginBottom: "10px", textAlign: "center", fontWeight: 800 }}>시그니처 상담 신청</h3>
                            <p style={{ textAlign: "center", color: "#86868b", marginBottom: "35px" }}>정보를 남겨주시면 담당 코치가 개별 안내를 드립니다.</p>
                            <form onSubmit={handleFormSubmit}>
                                <div style={{ marginBottom: "20px" }}>
                                    <label style={{ display: "block", marginBottom: "8px", color: "#fff", fontSize: "0.9rem", fontWeight: 700 }}>성함</label>
                                    <input type="text" placeholder="홍길동" required style={{ width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid #333", background: "#1a1a1a", color: "#fff" }} />
                                </div>
                                <div style={{ marginBottom: "20px" }}>
                                    <label style={{ display: "block", marginBottom: "8px", color: "#fff", fontSize: "0.9rem", fontWeight: 700 }}>연락처</label>
                                    <input type="tel" placeholder="010-0000-0000" required style={{ width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid #333", background: "#1a1a1a", color: "#fff" }} />
                                </div>
                                <div style={{ marginBottom: "30px" }}>
                                    <label style={{ display: "block", marginBottom: "8px", color: "#fff", fontSize: "0.9rem", fontWeight: 700 }}>현재 가장 큰 보컬 병목</label>
                                    <textarea placeholder="예: 고음에서의 압력 부족, 음색 불안정 등" style={{ width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid #333", background: "#1a1a1a", color: "#fff", height: "100px", resize: "none" }}></textarea>
                                </div>
                                <button type="submit" style={{ width: "100%", padding: "1.2rem", background: "#FF9F0A", color: "#000", borderRadius: "16px", fontSize: "1.1rem", fontWeight: 800, border: "none" }}>상담 신청 완료</button>
                            </form>
                        </div>
                    ) : (
                        <div style={{ textAlign: "center", padding: "40px 0" }}>
                            <div style={{ width: "80px", height: "80px", background: "rgba(255,159,10,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 25px", color: "#FF9F0A" }}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <path d="M20 6L9 17l-5-5" />
                                </svg>
                            </div>
                            <h3 style={{ fontSize: "1.8rem", marginBottom: "15px", fontWeight: 800 }}>상담 신청 접수 완료</h3>
                            <p style={{ color: "#86868b", lineHeight: 1.6 }}>당신의 목소리를 위한 본질적인 여정, <br />담당 코치가 확인 후 곧 연락드리겠습니다.</p>
                            <button onClick={closeModal} style={{ marginTop: "40px", padding: "12px 40px", borderRadius: "12px", background: "#FF9F0A", color: "#000", fontWeight: 800, border: "none" }}>확인</button>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .container {
                    width: 100%;
                    max-width: 1280px;
                    margin: 0 auto;
                    padding: 0 2rem;
                }
                .grid-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                }
                @media (max-width: 768px) {
                    .grid-2 {
                        grid-template-columns: 1fr;
                    }
                    .container {
                        padding: 0 1.5rem;
                    }
                }
            `}</style>
        </div>
    );
}
