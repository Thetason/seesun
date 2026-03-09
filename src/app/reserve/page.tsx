"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../../styles/reserve.css";

export default function ConciergePage() {
    const [showStickyCTA, setShowStickyCTA] = useState(false);
    const heroRef = useRef<HTMLElement>(null);
    const revealRefs = useRef<HTMLElement[]>([]);

    const addToRefs = (el: HTMLElement | null) => {
        if (el && !revealRefs.current.includes(el)) {
            revealRefs.current.push(el);
        }
    };

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        revealRefs.current.forEach((el) => {
            gsap.fromTo(el,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    }
                }
            );
        });

        const handleScroll = () => {
            if (window.scrollY > 800) {
                setShowStickyCTA(true);
            } else {
                setShowStickyCTA(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    const openModal = () => {
        // Since we are referencing the global modal on the diagnosis page or similar, 
        // for this standalone page we'll link to /diagnosis for now or implement a local modal if needed.
        window.location.href = "/diagnosis";
    };

    return (
        <div style={{ color: "#ffffff", backgroundColor: "#050507", minHeight: "100vh", fontFamily: "var(--font-suit), sans-serif" }}>
            <header style={{ position: "fixed", top: 0, width: "100%", padding: "1.5rem 0", zIndex: 100, backgroundColor: "rgba(5, 5, 7, 0.8)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Link href="/" style={{ color: "#fff", fontWeight: 800, fontSize: "1.2rem", textDecoration: "none", letterSpacing: "0.1em" }}>SEE:SUN RESERVE</Link>
                    <button onClick={openModal} style={{ background: "#FF9F0A", color: "#000", padding: "8px 24px", borderRadius: "100px", fontWeight: 700, border: "none", cursor: "pointer", fontSize: "0.9rem" }}>프라이빗 진단 신청</button>
                </div>
            </header>

            <main>
                {/* 1. Hero Section */}
                <section ref={heroRef} style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", paddingTop: "80px" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}>
                        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(90deg, #050507 30%, rgba(5,5,7,0.5) 70%, rgba(5,5,7,0) 100%)", zIndex: 1 }} />
                        <img
                            src="/images/signature/reserve_hero.png"
                            alt="Premium Lounge"
                            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: 0.6 }}
                        />
                    </div>

                    <div className="container" style={{ position: "relative", zIndex: 2, maxWidth: "1200px" }}>
                        <div style={{ maxWidth: "700px" }}>
                            <span style={{ color: "#FF9F0A", fontWeight: 800, letterSpacing: "0.3em", fontSize: "0.85rem", display: "block", marginBottom: "2rem" }}>12-WEEK PRIVATE TRANSFORMATION PROGRAM</span>
                            <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 900, lineHeight: 1.15, marginBottom: "2.5rem", letterSpacing: "-0.04em" }}>
                                노래 한 곡 때문에<br />
                                <span style={{ color: "#FF9F0A" }}>마음 졸이는 순간</span>을<br />
                                끝내드립니다.
                            </h1>
                            <p style={{ fontSize: "1.25rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: "3.5rem" }}>
                                직원들과의 회식, 거래처 모임, 대표들끼리의 자리.<br />
                                노래 한 곡이 부담스러워 그 순간만 마음이 조여오셨다면,<br />
                                SEE:SUN RESERVE는 바로 그 문제를 해결하기 위한 12주 프라이빗 실전 프로그램입니다.
                            </p>
                            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: "3rem", borderLeft: "2px solid #FF9F0A", paddingLeft: "1.5rem" }}>
                                단순히 노래를 배우는 과정이 아닙니다. 매주 1회의 레슨과 1회의 실전 세션을 통해<br />
                                안전한 공간에서 무대 감각을 익히고, 12주 후에는 졸업연주까지 경험하도록 설계했습니다.
                            </p>
                            <button onClick={openModal} style={{ background: "#FF9F0A", color: "#000", padding: "1.2rem 3.5rem", borderRadius: "100px", fontWeight: 800, fontSize: "1.15rem", border: "none", cursor: "pointer", boxShadow: "0 10px 30px rgba(255,159,10,0.2)" }}>프라이빗 진단 신청하기</button>
                        </div>
                    </div>
                </section>

                {/* 2. One Line Desc Section */}
                <section style={{ padding: "10rem 0", background: "#0a0a0c", textAlign: "center" }}>
                    <div className="container" ref={addToRefs}>
                        <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, marginBottom: "2rem" }}>배우고, 익히고, 실제로 해내는 12주.</h2>
                        <p style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, maxWidth: "800px", margin: "0 auto" }}>
                            리저브는 노래를 잘 아는 척하는 법이 아니라, 사람들 앞에서 <span style={{ color: "#fff", fontWeight: 700 }}>실제로 한 곡을 해낼 수 있는 상태</span>까지 가는 프로그램입니다. 매주 한 번은 개인 레슨으로 목소리와 곡을 정리하고, 또 한 번은 안전한 공간에서의 소규모 실전으로 무대 감각과 자신감을 붙여갑니다.
                        </p>
                    </div>
                </section>

                {/* 3. Empathy Situation Section - TACTILE CARDS */}
                <section style={{ padding: "10rem 0", background: "#050507" }}>
                    <div className="container" style={{ textAlign: "center" }}>
                        <h2 ref={addToRefs} style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "5rem" }}>이런 순간이 유독 부담스러우셨다면.</h2>

                        <style dangerouslySetInnerHTML={{
                            __html: `
                            .reserve-empathy-grid {
                                display: grid;
                                grid-template-columns: repeat(3, 1fr);
                                gap: 2rem;
                            }
                            .reserve-tactile-card {
                                background: rgba(255,255,255,0.02);
                                padding: 3.5rem 2.5rem;
                                borderRadius: 32px;
                                border: 1px solid rgba(255,255,255,0.05);
                                text-align: left;
                                transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                                cursor: default;
                            }
                            .reserve-tactile-card:hover {
                                transform: translateY(-15px);
                                background: rgba(255, 159, 10, 0.03);
                                border-color: rgba(255, 159, 10, 0.2);
                                box-shadow: 0 30px 60px rgba(0,0,0,0.5);
                            }
                            .reserve-tactile-card .icon-box {
                                transition: transform 0.3s ease;
                            }
                            .reserve-tactile-card:hover .icon-box {
                                transform: scale(1.2) rotate(5deg);
                            }
                            @media (max-width: 900px) {
                                .reserve-empathy-grid { grid-template-columns: 1fr; }
                            }
                        ` }} />

                        <div className="reserve-empathy-grid">
                            {[
                                { title: "회식 자리", desc: "회식이 잡히면 괜히 신경이 쓰이고 노래방으로 자리가 이어질까 봐 불편한 순간" },
                                { title: "대표들/리더 모임", desc: "비즈니스 친목 자리에서 노래 한 곡으로 내 이미지가 평가될 것 같은 긴장감" },
                                { title: "갑작스러운 노래 요청", desc: "분위기를 망치고 싶지 않지만 그렇다고 마이크를 잡기는 싫어 작아지는 기분" }
                            ].map((item, i) => (
                                <div key={i} ref={addToRefs} className="reserve-tactile-card">
                                    <div className="icon-box" style={{ width: "45px", height: "45px", background: "rgba(255,159,10,0.1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2rem", color: "#FF9F0A", fontWeight: 900, fontSize: "1.2rem" }}>?</div>
                                    <h3 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: "1.2rem" }}>{item.title}</h3>
                                    <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontSize: "1.05rem" }}>{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4. Problem Definition */}
                <section style={{ padding: "10rem 0", background: "linear-gradient(to bottom, #050507, #0a0a0c)" }}>
                    <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
                        <div ref={addToRefs}>
                            <h2 style={{ fontSize: "3rem", fontWeight: 900, lineHeight: 1.2, letterSpacing: "-0.03em" }}>문제는 노래 실력보다<br /><span style={{ color: "#FF9F0A" }}>그 순간의 불안</span>일 수 있습니다.</h2>
                        </div>
                        <div ref={addToRefs} style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.15rem", lineHeight: 1.8 }}>
                            <p style={{ marginBottom: "2rem" }}>노래를 못한다는 사실보다 더 힘든 건, 그 상황을 피하고 싶어지는 마음일 수 있습니다. 사람들 앞에서 불러야 한다는 부담, 체면을 지키고 싶다는 압박, 괜히 분위기를 망치고 싶지 않은 긴장감.</p>
                            <p style={{ color: "#fff", fontWeight: 700 }}>리저브는 그 순간을 견디게 하는 게 아니라, 조금씩 익숙해지고 실제로 해낼 수 있도록 몸과 감각을 바꿔가는 과정입니다.</p>
                        </div>
                    </div>
                </section>

                {/* 5. Program Structure Structure - VERTICAL TIMELINE */}
                <section style={{ padding: "12rem 0", background: "#0a0a0c", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, opacity: 0.1 }}>
                        <img src="/images/signature/reserve_session.png" alt="Session Visual" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div className="container" style={{ position: "relative", zIndex: 1 }}>
                        <div style={{ textAlign: "center", marginBottom: "7rem" }}>
                            <span style={{ color: "#FF9F0A", fontWeight: 800, letterSpacing: "0.2em", fontSize: "0.85rem", display: "block", marginBottom: "1rem" }}>TRANSFORMATION JOURNEY</span>
                            <h2 ref={addToRefs} style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.03em" }}>12주 동안 이렇게 바뀝니다</h2>
                        </div>

                        <div style={{ position: "relative", maxWidth: "900px", margin: "0 auto" }}>
                            {/* Central Line */}
                            <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "1px", background: "rgba(255,255,255,0.1)", transform: "translateX(-50%)" }} />

                            {[
                                { step: "STEP 1", title: "프라이빗 레슨", desc: "당신의 음역, 톤을 고려해 가장 현실적으로 소화할 수 있는 한 곡을 정리합니다." },
                                { step: "STEP 2", title: "실전 감각 세션", desc: "안전한 공간에서의 소규모 공연 세션을 통해 무대 감각을 반복적으로 익힙니다." },
                                { step: "STEP 3", title: "실전 적응 훈련", desc: "표정, 시작 태도, 마이크 사용 등 실제 상황에서 덜 부담스럽도록 조정합니다." },
                                { step: "STEP 4", title: "졸업연주", desc: "마지막에는 완벽한 한 곡을 완성하여 '해낼 수 있다'는 감각을 몸에 남깁니다." }
                            ].map((item, i) => (
                                <div key={i} ref={addToRefs} style={{
                                    display: "flex",
                                    justifyContent: i % 2 === 0 ? "flex-end" : "flex-start",
                                    marginBottom: "4rem",
                                    position: "relative",
                                    width: "100%"
                                }}>
                                    {/* Dot */}
                                    <div style={{
                                        position: "absolute",
                                        left: "50%",
                                        top: "20px",
                                        width: "12px",
                                        height: "12px",
                                        background: "#FF9F0A",
                                        borderRadius: "50%",
                                        transform: "translateX(-50%)",
                                        boxShadow: "0 0 15px #FF9F0A",
                                        zIndex: 2
                                    }} />

                                    <div style={{
                                        width: "42%",
                                        background: "rgba(255,255,255,0.03)",
                                        padding: "2.5rem",
                                        borderRadius: "24px",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        backdropFilter: "blur(10px)",
                                        textAlign: i % 2 === 0 ? "right" : "left"
                                    }}>
                                        <span style={{ color: "#FF9F0A", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.1em", display: "block", marginBottom: "1rem" }}>{item.step}</span>
                                        <h4 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "1.2rem" }}>{item.title}</h4>
                                        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1rem", lineHeight: 1.6 }}>{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 6. Value Proposition & 7. Outcomes */}
                <section style={{ padding: "10rem 0", background: "#050507" }}>
                    <div className="container grid-2" style={{ gap: "4rem", alignItems: "center" }}>
                        <div ref={addToRefs}>
                            <h2 style={{ fontSize: "2.8rem", fontWeight: 900, marginBottom: "2rem" }}>리저브는 레슨이 아니라<br /><span style={{ color: "#FF9F0A" }}>변화의 구조</span>입니다.</h2>
                            <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.8, fontSize: "1.1rem" }}>
                                한 번 배우고 끝나는 레슨으로는 두려움이 쉽게 바뀌지 않습니다. 리저브는 배운 것을 바로 적용하고, 안전한 환경에서 반복하고, 마지막엔 실제로 완성해보는 구조를 통해 그 두려움을 점점 줄여갑니다. 그래서 더 현실적이고 오래 남습니다.
                            </p>
                        </div>
                        <div ref={addToRefs} style={{ background: "rgba(255,159,10,0.03)", padding: "4rem", borderRadius: "40px", border: "1px solid rgba(255,159,10,0.1)" }}>
                            <h3 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "3rem", color: "#FF9F0A" }}>당신이 얻게 될 것</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                                {[
                                    "회식과 모임 자리에서의 부담 감소",
                                    "사람들 앞에서 노래할 때의 긴장 완화",
                                    "내 목소리에 맞는 실전용 한 곡 확보",
                                    "무대와 노래방 상황에서 덜 얼어붙는 감각",
                                    "작아지지 않는 여유와 자신감"
                                ].map((item, i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem", fontWeight: 700, fontSize: "1.1rem" }}>
                                        <div style={{ color: "#FF9F0A" }}>✓</div>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 8. Why Private & 9. Targets - LIGHT BREAK */}
                <section style={{ padding: "10rem 0", background: "#f5f5f7", color: "#1d1d1f" }}>
                    <div className="container grid-2" style={{ gap: "6rem" }}>
                        <div ref={addToRefs}>
                            <h2 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "2rem", color: "#111" }}>이 변화는 조용하고 안전한 환경에서 더 잘 일어납니다.</h2>
                            <p style={{ color: "#424245", lineHeight: 1.8, fontSize: "1.1rem" }}>
                                리저브는 누군가 앞에서 평가받으며 버티는 수업이 아닙니다. 노래에 대한 민망함, 체면의 부담을 굳이 드러내지 않아도 되는 환경에서 천천히 바꿔가는 프라이빗 프로그램입니다.
                            </p>
                        </div>
                        <div ref={addToRefs} style={{ background: "#fff", padding: "3rem", borderRadius: "32px", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 10px 30px rgba(0,0,0,0.02)" }}>
                            <h2 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "2.5rem", color: "#111" }}>이런 분들에게 적합합니다</h2>
                            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                                {[
                                    "회식이나 모임 노래가 늘 부담스러운 분",
                                    "대표, 오너로서 체면이 신경 쓰이는 분",
                                    "짧은 시간 안에 실전용 결과가 필요한 분",
                                    "공개 수업보다 조용한 방식이 편한 분",
                                    "실제로 한 곡을 해내고 싶은 분"
                                ].map((item, i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem", color: "#424245", fontWeight: 600 }}>
                                        <div style={{ width: "6px", height: "6px", background: "#FF9F0A", borderRadius: "50%" }}></div>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 10. Product & 11. Scarcity Section */}
                <section style={{ padding: "10rem 0", background: "#050507", textAlign: "center" }}>
                    <div className="container" style={{ maxWidth: "900px" }}>
                        <style dangerouslySetInnerHTML={{
                            __html: `
                            @keyframes shimmer {
                                0% { transform: translateX(-100%); }
                                100% { transform: translateX(100%); }
                            }
                            .reserve-pricing-shimmer {
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                background: linear-gradient(
                                    90deg,
                                    transparent,
                                    rgba(255, 159, 10, 0.05),
                                    transparent
                                );
                                animation: shimmer 4s infinite;
                                pointer-events: none;
                            }
                        ` }} />
                        <div ref={addToRefs} style={{
                            background: "rgba(255,255,255,0.02)",
                            padding: "5rem",
                            borderRadius: "56px",
                            border: "1px solid rgba(255,159,10,0.2)",
                            position: "relative",
                            overflow: "hidden",
                            boxShadow: "0 40px 100px -10px rgba(0,0,0,0.8), 0 0 60px rgba(255,159,10,0.05)"
                        }}>
                            <div className="reserve-pricing-shimmer" />
                            <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(255,159,10,0.12) 0%, transparent 70%)", filter: "blur(80px)" }} />

                            <span style={{ display: "inline-block", background: "rgba(255,159,10,0.1)", color: "#FF9F0A", padding: "8px 24px", borderRadius: "30px", fontSize: "0.9rem", fontWeight: 800, marginBottom: "3rem" }}>12-WEEK PRIVATE PROGRAM</span>

                            <div style={{ display: "flex", justifyContent: "center", gap: "4rem", marginBottom: "4rem" }}>
                                <div>
                                    <div style={{ fontSize: "3rem", fontWeight: 900 }}>12주</div>
                                    <div style={{ color: "rgba(255,255,255,0.4)", marginTop: "0.5rem" }}>Duration</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: "3rem", fontWeight: 900 }}>주 2회</div>
                                    <div style={{ color: "rgba(255,255,255,0.4)", marginTop: "0.5rem" }}>Sessions</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: "3rem", fontWeight: 900 }}>3.5M</div>
                                    <div style={{ color: "rgba(255,255,255,0.4)", marginTop: "0.5rem" }}>KRW</div>
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", textAlign: "left", marginBottom: "4rem", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "3rem" }}>
                                <div style={{ color: "rgba(255,255,255,0.7)", lineHeight: 2, fontSize: "1.1rem" }}>
                                    <p>• 프라이빗 레슨 12회</p>
                                    <p>• 실전 감각 세션 12회</p>
                                    <p>• 졸업연주 세션 포함</p>
                                </div>
                                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem", lineHeight: 1.7 }}>
                                    회당 수업을 나열한 상품이 아니라,<br />
                                    노래 한 곡 앞에서 마음 졸이던 상태를<br />
                                    실제로 바꿔내기 위한 집중 프로그램입니다.
                                </div>
                            </div>

                            <button onClick={openModal} style={{ width: "100%", padding: "1.8rem", background: "#FF9F0A", color: "#000", borderRadius: "20px", fontSize: "1.3rem", fontWeight: 900, cursor: "pointer", border: "none", boxShadow: "0 15px 30px rgba(255,159,10,0.2)" }}>프라이빗 진단 신청하기</button>

                            <p style={{ marginTop: "2rem", color: "#FF9F0A", fontWeight: 700, fontSize: "0.95rem" }}>
                                * 한 사람의 변화를 깊게 다루기 위해 동시 진행 인원을 엄격히 제한합니다.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 12. Final CTA Section */}
                <section style={{ padding: "15vh 0", background: "linear-gradient(to bottom, #050507, #000)", textAlign: "center", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, opacity: 0.2 }}>
                        <img src="/images/signature/reserve_graduation.png" alt="Spotlight" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div className="container" style={{ position: "relative", zIndex: 1 }}>
                        <h2 ref={addToRefs} style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 900, marginBottom: "3rem", letterSpacing: "-0.04em" }}>
                            더 이상 그 순간을<br />피하지 않으셔도 됩니다.
                        </h2>
                        <p ref={addToRefs} style={{ fontSize: "1.4rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, maxWidth: "700px", margin: "0 auto 4rem" }}>
                            노래 한 곡 때문에 마음 졸이던 시간을 지나,<br />
                            이제는 좀 더 자연스럽고 당당하게 그 자리에 설 수 있도록.
                        </p>
                        <button onClick={openModal} style={{ padding: "1.5rem 5rem", background: "#FF9F0A", color: "#000", borderRadius: "100px", fontWeight: 800, fontSize: "1.3rem", border: "none", cursor: "pointer" }}>
                            리저브 프라이빗 상담 신청
                        </button>
                    </div>
                </section>
            </main>

            {/* Sticky CTA */}
            {showStickyCTA && (
                <div style={{ position: "fixed", bottom: "2rem", left: "50%", transform: "translateX(-50%)", zIndex: 100, width: "calc(100% - 4rem)", maxWidth: "500px" }}>
                    <button onClick={openModal} style={{ width: "100%", padding: "1.2rem", background: "#FF9F0A", color: "#000", borderRadius: "100px", fontWeight: 800, fontSize: "1.1rem", border: "none", cursor: "pointer", boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}>프라이빗 진단 신청하기</button>
                </div>
            )}
        </div>
    );
}
