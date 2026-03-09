"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../../styles/studio.css";

export default function SparkPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        document.body.style.backgroundColor = 'var(--color-studio-bg)';
        document.body.style.color = 'var(--color-studio-text)';

        const reveals = document.querySelectorAll(".gsap-reveal");
        reveals.forEach((element) => {
            gsap.to(element, {
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%",
                    toggleActions: "play none none reverse",
                },
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
            });
        });

        return () => {
            document.body.style.backgroundColor = '';
            document.body.style.color = '';
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    const openModal = () => setIsModalOpen(true);

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setIsSubmitted(false), 300);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
    };

    return (
        <div style={{ backgroundColor: 'var(--color-studio-bg)', color: 'var(--color-studio-text)', minHeight: '100vh' }}>
            <header
                className="header-studio"
                style={{ position: "fixed", top: 0, left: 0, width: "100%", padding: "1rem 0", zIndex: 100 }}
            >
                <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Link href="/" style={{ display: "flex", alignItems: "center", opacity: 0.7, transition: "opacity 0.2s", color: "var(--color-studio-text)" }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </Link>
                        <span style={{ fontWeight: 700, letterSpacing: "0.1em", color: "var(--color-studio-text)", marginLeft: "10px" }}>SEE:SUN SPARK</span>
                    </div>
                    <button className="nav-cta" style={{ background: "#FF9F0A", color: "#000" }} onClick={openModal}>스파크 시작하기</button>
                </div>
            </header>

            <main>
                {/* 1. Hero Section */}
                <section className="s-hero container">
                    <span className="gsap-reveal" style={{ color: "#FF9F0A", fontWeight: 700, letterSpacing: "0.1em", fontSize: "0.9rem", display: "block", marginBottom: "1rem" }}>ONLINE DAILY TRAINING</span>
                    <h1 className="hero-title gsap-reveal" style={{ fontSize: "clamp(2.2rem, 4.5vw, 4.5rem)", lineHeight: 1.15, fontWeight: 800 }}>매일의 작은 반복이<br />당신의 소리를 바꿉니다.</h1>
                    <div className="gsap-reveal" style={{ marginTop: "2rem", maxWidth: "650px" }}>
                        <p style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1d1d1f", marginBottom: "1rem" }}>하루 10분. <br />가볍게 시작할 수 있지만, 가볍게 끝나지 않는 변화.</p>
                        <p style={{ color: "#86868b", lineHeight: 1.6, fontSize: "1.1rem" }}>
                            SEE:SUN SPARK는 바쁜 일상 속에서도 당신의 목소리에 기준을 세우는 온라인 보컬 트레이닝입니다.
                        </p>
                        <p style={{ marginTop: "1rem", color: "#86868b", lineHeight: 1.6, fontSize: "1.1rem" }}>
                            단순히 연습량을 늘리는 것이 아니라, 정확한 루틴과 피드백으로 더 선명하고 안정적인 성장을 만들어갑니다.
                        </p>
                    </div>

                    <div className="gsap-reveal" style={{ display: "flex", gap: "1rem", marginTop: "3rem" }}>
                        <button className="btn btn-primary-light" style={{ fontSize: "1.05rem", padding: "1.1rem 2.8rem", background: "#FF9F0A", color: "#000", border: "none", fontWeight: 700, borderRadius: "40px" }} onClick={openModal}>
                            30일 루틴 시작하기
                        </button>
                        <button className="btn" style={{ fontSize: "1.05rem", padding: "1.1rem 2.8rem", background: "rgba(0,0,0,0.05)", color: "#1d1d1f", border: "1px solid rgba(0,0,0,0.1)", fontWeight: 600, borderRadius: "40px" }}>
                            프로그램 자세히 보기
                        </button>
                    </div>
                </section>

                {/* 2. Intro Section */}
                <section className="container" style={{ textAlign: "center", padding: "6rem 0" }}>
                    <div className="gsap-reveal" style={{ maxWidth: "800px", margin: "0 auto" }}>
                        <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 800, marginBottom: "2rem", letterSpacing: "-0.03em" }}>가치 있는 변화는,<br />작은 반복에서 시작됩니다.</h2>
                        <div style={{ fontSize: "1.2rem", lineHeight: 1.7, color: "#424245", fontWeight: 500 }}>
                            <p>스파크는 가장 가볍게 시작하는 SEE:SUN의 클래스입니다. <br />하지만 목표는 가볍지 않습니다.</p>
                            <p style={{ marginTop: "1.5rem" }}>매일의 짧은 루틴을 통해 흔들리기 쉬운 발성의 기준을 세우고, <br />혼자서는 놓치기 쉬운 지점을 정확한 피드백으로 바로잡아 갑니다.</p>
                        </div>
                    </div>
                </section>

                {/* 3. 10 Min Section */}
                <section style={{ background: "#f5f5f7", padding: "8rem 0" }}>
                    <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
                        <div className="gsap-reveal">
                            <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 800, marginBottom: "2rem", letterSpacing: "-0.03em" }}>짧아도 달라야 합니다.</h2>
                            <div style={{ fontSize: "1.15rem", lineHeight: 1.7, color: "#424245", fontWeight: 500 }}>
                                <p>좋은 연습은 오래 하는 연습이 아닙니다.<br />몸이 기억할 수 있도록, 정확한 방향으로 반복하는 연습입니다.</p>
                                <p style={{ marginTop: "1.5rem" }}>스파크는 짧지만 밀도 높은 루틴과 개인 피드백, 그리고 지속 가능한 반복을 통해 당신의 소리에 더 분명한 기준을 만들어갑니다.</p>
                            </div>
                        </div>
                        <div className="gsap-reveal" style={{ background: "#fff", padding: "3rem", borderRadius: "30px", boxShadow: "0 20px 40px rgba(0,0,0,0.05)" }}>
                            <div style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,159,10,0.03)", borderRadius: "20px", border: "1px dashed rgba(255,159,10,0.2)" }}>
                                <div style={{ textAlign: "center" }}>
                                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏱️</div>
                                    <div style={{ fontWeight: 800, fontSize: "2rem", color: "#FF9F0A" }}>10:00</div>
                                    <div style={{ fontSize: "0.9rem", color: "#86868b", marginTop: "0.5rem" }}>Daily Sharp Focus</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Myelin / 100x Section */}
                <section className="container" style={{ background: "#000", borderRadius: "36px", padding: "6rem 3rem", color: "#fff", border: "1px solid rgba(255,159,10,0.1)", margin: "4rem auto" }}>
                    <div className="grid-2" style={{ alignItems: "center", gap: "4rem" }}>
                        <div className="gsap-reveal">
                            <span style={{ color: "#FF9F0A", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.15em", display: "block", marginBottom: "1.5rem" }}>NEURAL EFFICIENCY x100</span>
                            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "2rem" }}>
                                많이 하는 연습보다,<br />
                                <span style={{ color: "#FF9F0A" }}>정확하게 반복</span>하는 훈련.
                            </h2>
                            <div style={{ color: "#d1d1d6", lineHeight: 1.6, fontSize: "1.15rem", fontWeight: 500 }}>
                                <p style={{ marginBottom: "1.5rem" }}>
                                    몸은 반복을 기억합니다. <br />하지만 잘못된 반복은 잘못된 습관까지 남깁니다.
                                </p>
                                <p style={{ marginBottom: "1.5rem" }}>
                                    스파크는 무작정 오래 하는 연습이 아니라, 전문가가 설계한 루틴과 피드백을 통해 <span style={{ color: "#fff", fontWeight: 700 }}>당신의 몸이 더 빠르게 기준을 익히도록</span> 돕습니다.
                                </p>
                                <p>
                                    짧은 시간도 방향이 정확하면 성장의 밀도는 분명히 달라집니다.
                                </p>
                            </div>
                            <p style={{ marginTop: "2rem", fontSize: "1rem", color: "#FF9F0A", fontWeight: 700 }}>짧게. 정확하게. 매일 다르게 쌓이도록.</p>
                        </div>
                        <div className="gsap-reveal" style={{ position: "relative", textAlign: "center" }}>
                            <div style={{
                                width: "100%",
                                maxWidth: "420px",
                                height: "320px",
                                margin: "0 auto",
                                background: "radial-gradient(circle at center, rgba(255,159,10,0.2) 0%, transparent 70%)",
                                borderRadius: "40px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "1px solid rgba(255,255,255,0.08)",
                                position: "relative",
                                overflow: "hidden"
                            }}>
                                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(135deg, rgba(255,159,10,0.08) 0%, transparent 50%, rgba(255,159,10,0.08) 100%)" }}></div>
                                <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                                    <div style={{ fontSize: "4.5rem", marginBottom: "15px", filter: "drop-shadow(0 0 25px rgba(255,159,10,0.4))" }}>🧠</div>
                                    <div style={{ fontWeight: 900, fontSize: "1.6rem", color: "#fff", letterSpacing: "0.05em" }}>NEURAL ADAPTATION</div>
                                    <div style={{ fontSize: "1.1rem", color: "#FF9F0A", fontWeight: 700, marginTop: "8px" }}>Efficiency x100</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. Online Care Section */}
                <section className="container" style={{ padding: "6rem 0" }}>
                    <div className="section-header gsap-reveal" style={{ textAlign: "left", marginBottom: "4rem" }}>
                        <h2 className="section-title" style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)", fontWeight: 800 }}>온라인으로 이어지는 정교한 케어</h2>
                        <div style={{ marginTop: "1.5rem", fontSize: "1.3rem", color: "#86868b", fontWeight: 500, lineHeight: 1.5 }}>
                            <p>시간과 장소의 제약은 줄이고, 성장의 밀도는 더 높였습니다.</p>
                            <p>스파크는 일상 속에서도 정확한 훈련이 이어지도록 설계된 온라인 클래스입니다.</p>
                        </div>
                    </div>
                    <div className="grid-3">
                        <div className="target-card gsap-reveal">
                            <div className="target-card__icon" style={{ background: "rgba(255,159,10,0.1)", color: "#FF9F0A" }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                </svg>
                            </div>
                            <h3 style={{ fontWeight: 800 }}>매일의 기준을 세우는 루틴</h3>
                            <p style={{ color: "var(--color-studio-text-sec)", fontSize: "0.95rem", lineHeight: 1.5 }}>매일 아침 전송되는 10분 루틴으로, 흔들리기 쉬운 발성의 기준을 일상 속에서 차분히 세워갑니다.</p>
                        </div>

                        <div className="target-card gsap-reveal">
                            <div className="target-card__icon" style={{ background: "rgba(255,159,10,0.1)", color: "#FF9F0A" }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 15a4 4 0 004-4V6a4 4 0 00-8 0v5a4 4 0 004 4z"></path>
                                    <path d="M19 10v1a7 7 0 01-14 0v-1M12 18.5v3M8 21.5h8"></path>
                                </svg>
                            </div>
                            <h3 style={{ fontWeight: 800 }}>정확하게 짚어주는 1:1 피드백</h3>
                            <p style={{ color: "var(--color-studio-text-sec)", fontSize: "0.95rem", lineHeight: 1.5 }}>녹음 파일을 업로드하면 24시간 이내, 당신에게 필요한 교정 포인트를 정확히 짚은 개인 피드백을 받습니다.</p>
                        </div>

                        <div className="target-card gsap-reveal">
                            <div className="target-card__icon" style={{ background: "rgba(255,159,10,0.1)", color: "#FF9F0A" }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7"></path>
                                    <path d="M3 7l9 6 9-6"></path>
                                    <path d="M15 19l2 2 4-4"></path>
                                </svg>
                            </div>
                            <h3 style={{ fontWeight: 800 }}>일상 어디서든 이어지는 성장</h3>
                            <p style={{ color: "var(--color-studio-text-sec)", fontSize: "0.95rem", lineHeight: 1.5 }}>집에서도, 차 안에서도, 일과 사이의 짧은 틈에서도. 성장이 멈추지 않도록 온라인에 최적화된 방식으로 설계했습니다.</p>
                        </div>
                    </div>
                </section>

                {/* 7. Recommendations Section */}
                <section style={{ background: "#f5f5f7", padding: "6rem 0" }}>
                    <div className="container gsap-reveal" style={{ maxWidth: "800px" }}>
                        <h2 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "3rem", textAlign: "center" }}>이런 분들에게 추천합니다</h2>
                        <div style={{ background: "#fff", padding: "3rem", borderRadius: "30px", border: "1px solid rgba(0,0,0,0.05)" }}>
                            {[
                                "혼자 연습하지만 내 방식이 맞는지 확신이 없는 분",
                                "짧더라도 매일 이어갈 수 있는 훈련 시스템이 필요한 분",
                                "보컬 레슨을 꾸준히 받기엔 시간과 비용이 부담되는 분",
                                "무작정 많이 하는 연습보다 정확한 방향이 필요한 분",
                                "목소리의 기준을 다시 세우고 싶은 분"
                            ].map((item, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 0", borderBottom: i === 4 ? "none" : "1px solid #f0f0f2", fontSize: "1.1rem", fontWeight: 600 }}>
                                    <span style={{ color: "#FF9F0A" }}>✓</span>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 8. Changes Section */}
                <section className="container" style={{ padding: "8rem 0" }}>
                    <div className="grid-2" style={{ alignItems: "center", gap: "5rem" }}>
                        <div className="gsap-reveal">
                            <h2 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "2rem", letterSpacing: "-0.03em" }}>당신이 가져가게 될 것</h2>
                            <p style={{ fontSize: "1.2rem", lineHeight: 1.7, color: "#424245", fontWeight: 500 }}>
                                스파크를 통해 당신은 막연한 연습이 아니라 기준 있는 반복을 배우게 됩니다. 무엇을 더 해야 하는지보다 무엇을 바로잡아야 하는지가 선명해지고, 짧은 시간 안에서도 성장하고 있다는 감각을 분명히 체감하게 됩니다.
                            </p>
                        </div>
                        <div className="gsap-reveal">
                            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                                {[
                                    { title: "매일 흔들리지 않고 이어갈 수 있는 훈련 습관", emoji: "🔥" },
                                    { title: "혼자서도 무너지지 않는 연습 기준", emoji: "📐" },
                                    { title: "지금 내 발성에서 무엇을 고쳐야 하는지에 대한 명확한 감각", emoji: "⚡" },
                                    { title: "짧은 시간 안에서도 성장하고 있다는 체감", emoji: "📈" },
                                    { title: "목소리를 더 안정적으로 다룰 수 있는 기본 체력", emoji: "💎" }
                                ].map((step, i) => (
                                    <div key={i} style={{ background: "rgba(255,159,10,0.05)", padding: "1.5rem", borderRadius: "20px", display: "flex", alignItems: "center", gap: "1.2rem", fontWeight: 700, fontSize: "1.05rem" }}>
                                        <span style={{ fontSize: "1.5rem" }}>{step.emoji}</span>
                                        {step.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 9. Program Section */}
                <section className="container" style={{ padding: "6rem 0" }}>
                    <div className="section-header gsap-reveal">
                        <h2 className="section-title" style={{ fontSize: "3rem", fontWeight: 800 }}>SPARK PROGRAM</h2>
                    </div>
                    <div className="grid-4" style={{ textAlign: "center", marginTop: "4rem" }}>
                        {[
                            { id: "01", title: "30일 데일리 루틴 제공", desc: "매일 10분, 부담 없이 이어갈 수 있는 발성 루틴" },
                            { id: "02", title: "1:1 음성 피드백", desc: "업로드한 음성에 대한 개인 맞춤 교정 가이드" },
                            { id: "03", title: "온라인 전용 성장 설계", desc: "시간과 장소에 구애받지 않는 훈련 구조" },
                            { id: "04", title: "지속 가능한 보컬 습관 형성", desc: "짧아도 끊기지 않도록 설계된 시스템" }
                        ].map((item, i) => (
                            <div key={i} className="gsap-reveal">
                                <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#FF9F0A", border: "1px solid #FF9F0A", padding: "2px 8px", borderRadius: "4px", marginBottom: "1rem", display: "inline-block" }}>{item.id}</span>
                                <h4 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "0.8rem" }}>{item.title}</h4>
                                <p style={{ fontSize: "0.9rem", color: "#666", lineHeight: 1.5 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 10. Pricing Intro */}
                <section className="container" style={{ textAlign: "center", padding: "8rem 0" }}>
                    <div className="gsap-reveal" style={{ maxWidth: "800px", margin: "0 auto" }}>
                        <h2 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "2rem" }}>가볍게 시작해도,<br />성장의 방향은 가볍지 않게.</h2>
                        <div style={{ fontSize: "1.2rem", lineHeight: 1.7, color: "#424245", fontWeight: 500 }}>
                            <p>스파크는 SEE:SUN에서 가장 부담 없이 시작할 수 있는 클래스입니다.</p>
                            <p style={{ marginTop: "1.5rem" }}>하지만 단순한 입문형 상품은 아닙니다. 당신의 목소리에 기준을 세우고, 올바른 반복을 일상 속에 정착시키는 가장 현실적이고도 정교한 시작입니다.</p>
                        </div>
                    </div>

                    <div className="grid-2" style={{ maxWidth: "800px", margin: "4rem auto 0" }}>
                        <div className="program-card gsap-reveal">
                            <div className="program-card__content">
                                <span style={{ color: "#FF9F0A", fontWeight: 800, fontSize: "0.9rem", letterSpacing: "0.05em" }}>BASIC</span>
                                <h3 style={{ marginTop: "0.8rem", fontWeight: 800 }}>30일 데일리 패스</h3>
                                <p style={{ fontSize: "0.95rem" }}>30일간의 발성 루틴 가이드와 주 1회 전문가 음성 피드백이 포함된 입문용 이용권.</p>
                                <div style={{ fontSize: "2.2rem", fontWeight: 900, margin: "1.5rem 0", color: "#1d1d1f" }}>₩100,000</div>
                                <button className="btn btn-primary-light" style={{ width: "100%", borderRadius: "40px", background: "#111", color: "#fff", fontWeight: 700, padding: "1rem" }} onClick={openModal}>이용권 선택하기</button>
                            </div>
                        </div>

                        <div className="program-card gsap-reveal" style={{ border: "2px solid #FF9F0A" }}>
                            <div className="program-card__content">
                                <span style={{ background: "#FF9F0A", color: "#000", padding: "4px 12px", borderRadius: "40px", fontSize: "0.75rem", fontWeight: 800 }}>MOST POPULAR</span>
                                <h3 style={{ marginTop: "0.8rem", fontWeight: 800 }}>무제한 피드백 멤버십</h3>
                                <p style={{ fontSize: "0.95rem" }}>데일리 루틴은 물론, 언제든 업로드한 음성에 대해 무제한으로 피드백을 받는 올케어 이용권.</p>
                                <div style={{ fontSize: "2.2rem", fontWeight: 900, margin: "1.5rem 0", color: "#1d1d1f" }}>₩200,000 <span style={{ fontSize: "1rem", fontWeight: 400, color: "#888" }}>/ 월</span></div>
                                <button className="btn btn-primary-light" style={{ width: "100%", borderRadius: "40px", background: "#FF9F0A", color: "#000", border: "none", fontWeight: 700, padding: "1rem" }} onClick={openModal}>멤버십 구독하기</button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 11. Persuasion Section */}
                <section style={{ background: "#000", color: "#fff", padding: "8rem 0" }}>
                    <div className="container gsap-reveal" style={{ maxWidth: "800px", textAlign: "center" }}>
                        <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 800, marginBottom: "2.5rem" }}>변화는 거창하게 시작되지 않습니다.</h2>
                        <div style={{ fontSize: "1.25rem", lineHeight: 1.8, color: "#a1a1a6", fontWeight: 500 }}>
                            <p>하루 10분의 정확한 반복, <br />혼자서는 놓칠 수 있는 지점을 짚어주는 피드백, 그리고 멈추지 않도록 설계된 루틴.</p>
                            <p style={{ marginTop: "1.5rem" }}>스파크는 당신의 목소리를 <br />조금씩, 그러나 분명하게 바꿔나갑니다.</p>
                        </div>
                    </div>
                </section>

                {/* 12. Final CTA Section */}
                <section className="container" style={{ padding: "10rem 0", textAlign: "center" }}>
                    <div className="gsap-reveal">
                        <h2 style={{ fontSize: "4rem", fontWeight: 900, marginBottom: "2rem", letterSpacing: "-0.04em" }}>지금, 당신의 기준을 세우세요.</h2>
                        <p style={{ color: "#86868b", fontSize: "1.3rem", lineHeight: 1.6, maxWidth: "600px", margin: "0 auto 3.5rem" }}>
                            가볍게 시작할 수 있는 30일. <br />하지만 그 30일은 당신의 목소리를 대하는 방식을 바꿔놓을 수 있습니다.
                        </p>
                        <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem" }}>
                            <button className="btn btn-primary-light" style={{ padding: "1.2rem 3.5rem", background: "#FF9F0A", color: "#000", borderRadius: "40px", fontWeight: 700, fontSize: "1.1rem", border: "none" }} onClick={openModal}>
                                SPARK 시작하기
                            </button>
                            <button className="btn" style={{ padding: "1.2rem 3.5rem", background: "rgba(0,0,0,0.05)", color: "#1d1d1f", borderRadius: "40px", fontWeight: 700, fontSize: "1.1rem", border: "1px solid rgba(0,0,0,0.1)" }}>
                                먼저 자세히 보기
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Modal */}
            <div className={`modal-overlay ${isModalOpen ? 'active' : ''}`} style={{ background: "rgba(0,0,0,0.8)", position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backdropFilter: "blur(10px)", zIndex: 1000, display: isModalOpen ? "flex" : "none", justifyContent: "center", alignItems: "center", transition: "all 0.3s" }}>
                <div className="simple-form" style={{ width: "90%", maxWidth: "500px", background: "#f5f5f7", borderRadius: "16px", padding: "30px", position: "relative" }}>
                    <button className="modal-close" style={{ color: "#000", position: "absolute", top: "15px", right: "20px", background: "none", border: "none", fontSize: "2rem", cursor: "pointer" }} onClick={closeModal}>&times;</button>
                    {!isSubmitted ? (
                        <div className="modal-step active">
                            <h3 style={{ fontSize: "1.5rem", marginBottom: "10px", textAlign: "center", color: "#111" }}>스파크 이용 신청</h3>
                            <p style={{ textAlign: "center", color: "#555", marginBottom: "30px", fontSize: "0.95rem" }}>신청 정보를 남겨주시면 담당 코치가 연락을 드립니다.</p>
                            <form onSubmit={handleFormSubmit}>
                                <div className="form-group" style={{ marginBottom: "15px" }}>
                                    <label style={{ display: "block", marginBottom: "5px", color: "#333", fontSize: "0.9rem", fontWeight: 600 }}>성함</label>
                                    <input type="text" className="form-control" placeholder="홍길동" required style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", background: "#fff", color: "#000" }} />
                                </div>
                                <div className="form-group" style={{ marginBottom: "15px" }}>
                                    <label style={{ display: "block", marginBottom: "5px", color: "#333", fontSize: "0.9rem", fontWeight: 600 }}>연락처</label>
                                    <input type="tel" className="form-control" placeholder="010-0000-0000" required style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", background: "#fff", color: "#000" }} />
                                </div>
                                <div className="form-group" style={{ marginBottom: "15px" }}>
                                    <label style={{ display: "block", marginBottom: "5px", color: "#333", fontSize: "0.9rem", fontWeight: 600 }}>구독 희망 이용권</label>
                                    <select className="form-control" style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", background: "#fff", color: "#000" }}>
                                        <option>30일 데일리 패스 (₩100,000)</option>
                                        <option>무제한 피드백 멤버십 (₩200,000/월)</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary-light" style={{ width: "100%", marginTop: "10px", padding: "15px", fontSize: "1.05rem", borderRadius: "8px", background: "#FF9F0A", color: "#000", border: "none" }}>신청 완료하기</button>
                            </form>
                        </div>
                    ) : (
                        <div className="modal-step active" style={{ textAlign: "center", padding: "30px 0" }}>
                            <div style={{ width: "60px", height: "60px", background: "rgba(255, 159, 10, 0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "#FF9F0A" }}>
                                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 6L9 17l-5-5" />
                                </svg>
                            </div>
                            <h3 style={{ fontSize: "1.5rem", marginBottom: "10px", color: "#111" }}>성공적으로 접수되었습니다!</h3>
                            <p style={{ color: "#555", lineHeight: 1.6 }}>담당 코치가 내용 확인 후, 기재해주신 연락처로 안내 연락을 드리겠습니다.</p>
                            <button className="btn btn-primary-light" style={{ marginTop: "30px", padding: "12px 30px", borderRadius: "8px", background: "#FF9F0A", color: "#000", border: "none" }} onClick={closeModal}>창 닫기</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
