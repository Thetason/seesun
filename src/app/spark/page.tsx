"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../../styles/studio.css";
import TrackComparison from "@/components/TrackComparison";
import { buildDiagnosisPath } from "@/lib/consultation-intake";
import { openKickoff } from "@/lib/kickoff";

export default function SparkPage() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        option: "데일리 멤버십 (월 120,000원)"
    });

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        document.body.style.backgroundColor = 'var(--color-studio-bg)';
        document.body.style.color = 'var(--color-studio-text)';

        const reveals = document.querySelectorAll(".gsap-reveal");
        reveals.forEach((element) => {
            const isHeroElement = element.closest(".studio-hero");

            if (isHeroElement) {
                gsap.to(element, {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power3.out",
                    delay: 0.15,
                });
                return;
            }

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

    const openModal = () => openKickoff("daily");

    const closeModal = () => {
        setIsModalOpen(false);
        setIsRedirecting(false);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsRedirecting(true);
        router.push(
            buildDiagnosisPath({
                type: formData.option,
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                notes: `데일리 랜딩에서 선택한 이용권: ${formData.option}`,
            })
        );
    };

    return (
        <div className="studio-page" style={{ backgroundColor: 'var(--color-studio-bg)', color: 'var(--color-studio-text)', minHeight: '100vh' }}>
            <header
                className="header-studio studio-header"
                style={{ position: "fixed", top: 0, left: 0, width: "100%", padding: "1rem 0", zIndex: 100 }}
            >
                <div className="container studio-header__inner" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Link href="/" style={{ display: "flex", alignItems: "center", opacity: 0.7, transition: "opacity 0.2s", color: "var(--color-studio-text)" }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </Link>
                        <span style={{ fontWeight: 700, letterSpacing: "0.1em", color: "var(--color-studio-text)", marginLeft: "10px" }}>SEE:SUN DAILY</span>
                    </div>
                    <button className="nav-cta studio-nav-cta" style={{ background: "#FE7502", color: "#000" }} onClick={openModal}>무료 킥오프 상담</button>
                </div>
            </header>

            <main>
                {/* 1. Hero Section */}
                <section className="s-hero container studio-hero">
                    <span className="gsap-reveal" style={{ color: "#FE7502", fontWeight: 700, letterSpacing: "0.1em", fontSize: "0.9rem", display: "block", marginBottom: "1rem" }}>ONLINE DAILY TRAINING</span>
                    <h1 className="hero-title gsap-reveal" style={{ fontSize: "clamp(2.2rem, 4.5vw, 4.5rem)", lineHeight: 1.15, fontWeight: 800 }}>매일의 작은 반복이<br />당신의 소리를 바꿉니다.</h1>
                    <div className="gsap-reveal" style={{ marginTop: "2rem", maxWidth: "650px" }}>
                        <p style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1d1d1f", marginBottom: "1rem" }}>독학의 한계를 느꼈다면,<br /><span style={{ color: "#FE7502" }}>이제 혼자가 아닙니다.</span></p>
                        <p style={{ color: "#86868b", lineHeight: 1.6, fontSize: "1.1rem" }}>
                            맞는 방향인지 확신 없이 혼자 연습하던 시간. 그 불안함을 끝내는 건 더 열심히 하는 것이 아니라, 정확한 기준과 피드백이 있는 시스템입니다.
                        </p>
                        <p style={{ marginTop: "1rem", color: "#86868b", lineHeight: 1.6, fontSize: "1.1rem" }}>
                            SEE:SUN DAILY는 매일 당신 옆에서 방향을 잡아주는 온라인 보컬 트레이닝입니다.
                        </p>
                    </div>

                    <div className="gsap-reveal studio-hero-actions" style={{ display: "flex", gap: "1rem", marginTop: "3rem" }}>
                        <button className="btn btn-primary-light" style={{ fontSize: "1.05rem", padding: "1.1rem 2.8rem", background: "#FE7502", color: "#000", border: "none", fontWeight: 700, borderRadius: "40px" }} onClick={openModal}>
                            무료 킥오프 상담 예약
                        </button>
                        <button className="btn" style={{ fontSize: "1.05rem", padding: "1.1rem 2.8rem", background: "rgba(0,0,0,0.05)", color: "#1d1d1f", border: "1px solid rgba(0,0,0,0.1)", fontWeight: 600, borderRadius: "40px" }}>
                            프로그램 자세히 보기
                        </button>
                    </div>
                </section>

                {/* 2. Intro Section */}
                <section className="container" style={{ textAlign: "center", padding: "6rem 0" }}>
                    <div className="gsap-reveal" style={{ maxWidth: "800px", margin: "0 auto" }}>
                        <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 800, marginBottom: "2rem", letterSpacing: "-0.03em" }}>연습은 하고 있는데,<br /><span style={{ color: "#FE7502" }}>이게 맞는 건지 모르겠다면.</span></h2>
                        <div style={{ fontSize: "1.2rem", lineHeight: 1.7, color: "#424245", fontWeight: 500 }}>
                            <p>유튜브를 보고 따라해도, 녹음해서 들어봐도, 뭐가 문제인지 정확히 모르겠는 그 답답함.<br />데일리는 바로 그 순간, 당신 옆에 전문가를 세워드립니다.</p>
                            <p style={{ marginTop: "1.5rem" }}>매일 전송되는 루틴으로 기준을 잡고,<br />업로드한 발성에 대한 <strong>전문가의 정확한 피드백</strong>으로 방향을 교정합니다.<br />더 이상 혼자 헤매지 않아도 됩니다.</p>
                        </div>
                    </div>
                </section>

                {/* 3. 10 Min Section */}
                <section style={{ background: "#f5f5f7", padding: "8rem 0" }}>
                    <div className="container studio-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
                        <div className="gsap-reveal">
                            <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 800, marginBottom: "2rem", letterSpacing: "-0.03em" }}>짧아도 달라야 합니다.</h2>
                            <div style={{ fontSize: "1.15rem", lineHeight: 1.7, color: "#424245", fontWeight: 500 }}>
                                <p>좋은 연습은 오래 하는 연습이 아닙니다.<br />몸이 기억할 수 있도록, 정확한 방향으로 반복하는 연습입니다.</p>
                                <p style={{ marginTop: "1.5rem" }}>데일리는 짧지만 밀도 높은 루틴과 개인 피드백, 그리고 지속 가능한 반복을 통해 당신의 소리에 더 분명한 기준을 만들어갑니다.</p>
                            </div>
                        </div>
                        <div className="gsap-reveal" style={{ background: "#fff", padding: "3rem", borderRadius: "30px", boxShadow: "0 20px 40px rgba(0,0,0,0.05)" }}>
                            <div style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(254, 117, 2,0.03)", borderRadius: "20px", border: "1px dashed rgba(254, 117, 2,0.2)" }}>
                                <div style={{ textAlign: "center" }}>
                                    <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏱️</div>
                                    <div style={{ fontWeight: 800, fontSize: "2rem", color: "#FE7502" }}>10:00</div>
                                    <div style={{ fontSize: "0.9rem", color: "#86868b", marginTop: "0.5rem" }}>Daily Sharp Training</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Myelin / 100x Section */}
                <section className="container" style={{ background: "#000", borderRadius: "36px", padding: "6rem 3rem", color: "#fff", border: "1px solid rgba(254, 117, 2,0.1)", margin: "4rem auto" }}>
                    <div className="grid-2 studio-two-col" style={{ alignItems: "center", gap: "4rem" }}>
                        <div className="gsap-reveal">
                            <span style={{ color: "#FE7502", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.15em", display: "block", marginBottom: "1.5rem" }}>NEURAL EFFICIENCY x100</span>
                            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "2rem" }}>
                                많이 하는 연습보다,<br />
                                <span style={{ color: "#FE7502" }}>정확하게 반복</span>하는 훈련.
                            </h2>
                            <div style={{ color: "#d1d1d6", lineHeight: 1.6, fontSize: "1.15rem", fontWeight: 500 }}>
                                <p style={{ marginBottom: "1.5rem" }}>
                                    몸은 반복을 기억합니다. <br />하지만 잘못된 반복은 잘못된 습관까지 남깁니다.
                                </p>
                                <p style={{ marginBottom: "1.5rem" }}>
                                    데일리는 무작정 오래 하는 연습이 아니라, 전문가가 설계한 루틴과 피드백을 통해 <span style={{ color: "#fff", fontWeight: 700 }}>당신의 몸이 더 빠르게 기준을 익히도록</span> 돕습니다.
                                </p>
                                <p>
                                    짧은 시간도 방향이 정확하면 성장의 밀도는 분명히 달라집니다.
                                </p>
                            </div>
                            <p style={{ marginTop: "2rem", fontSize: "1rem", color: "#FE7502", fontWeight: 700 }}>짧게. 정확하게. 매일 다르게 쌓이도록.</p>
                        </div>
                        <div className="gsap-reveal" style={{ position: "relative", textAlign: "center" }}>
                            <div style={{
                                width: "100%",
                                maxWidth: "420px",
                                height: "320px",
                                margin: "0 auto",
                                background: "radial-gradient(circle at center, rgba(254, 117, 2,0.2) 0%, transparent 70%)",
                                borderRadius: "40px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "1px solid rgba(255,255,255,0.08)",
                                position: "relative",
                                overflow: "hidden"
                            }}>
                                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(135deg, rgba(254, 117, 2,0.08) 0%, transparent 50%, rgba(254, 117, 2,0.08) 100%)" }}></div>
                                <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                                    <div style={{ fontSize: "4.5rem", marginBottom: "15px", filter: "drop-shadow(0 0 25px rgba(254, 117, 2,0.4))" }}>🧠</div>
                                    <div style={{ fontWeight: 900, fontSize: "1.6rem", color: "#fff", letterSpacing: "0.05em" }}>습관이 되는 연습 시스템</div>
                                    <div style={{ fontSize: "1.1rem", color: "#FE7502", fontWeight: 700, marginTop: "8px" }}>Efficiency x100</div>
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
                            <p>데일리는 일상 속에서도 정확한 훈련이 이어지도록 설계된 온라인 클래스입니다.</p>
                        </div>
                    </div>
                    <div className="grid-3">
                        <div className="target-card gsap-reveal">
                            <div className="target-card__icon" style={{ background: "rgba(254, 117, 2,0.1)", color: "#FE7502" }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                </svg>
                            </div>
                            <h3 style={{ fontWeight: 800 }}>매일의 기준을 세우는 루틴</h3>
                            <p style={{ color: "var(--color-studio-text-sec)", fontSize: "0.95rem", lineHeight: 1.5 }}>매일 아침 전송되는 10분 루틴으로, 흔들리기 쉬운 발성의 기준을 일상 속에서 차분히 세워갑니다.</p>
                        </div>

                        <div className="target-card gsap-reveal">
                            <div className="target-card__icon" style={{ background: "rgba(254, 117, 2,0.1)", color: "#FE7502" }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 15a4 4 0 004-4V6a4 4 0 00-8 0v5a4 4 0 004 4z"></path>
                                    <path d="M19 10v1a7 7 0 01-14 0v-1M12 18.5v3M8 21.5h8"></path>
                                </svg>
                            </div>
                            <h3 style={{ fontWeight: 800 }}>정확하게 짚어주는 1:1 피드백</h3>
                            <p style={{ color: "var(--color-studio-text-sec)", fontSize: "0.95rem", lineHeight: 1.5 }}>녹음 파일을 업로드하면 24시간 이내, 당신에게 필요한 교정 포인트를 정확히 짚은 개인 피드백을 받습니다.</p>
                        </div>

                        <div className="target-card gsap-reveal">
                            <div className="target-card__icon" style={{ background: "rgba(254, 117, 2,0.1)", color: "#FE7502" }}>
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
                                    <span style={{ color: "#FE7502" }}>✓</span>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 8. Changes Section */}
                <section className="container" style={{ padding: "8rem 0" }}>
                    <div className="grid-2 studio-two-col" style={{ alignItems: "center", gap: "5rem" }}>
                        <div className="gsap-reveal">
                            <h2 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "2rem", letterSpacing: "-0.03em" }}>당신이 가져가게 될 것</h2>
                            <p style={{ fontSize: "1.2rem", lineHeight: 1.7, color: "#424245", fontWeight: 500 }}>
                                데일리를 통해 당신은 막연한 연습이 아니라 기준 있는 반복을 배우게 됩니다. 무엇을 더 해야 하는지보다 무엇을 바로잡아야 하는지가 선명해지고, 짧은 시간 안에서도 성장하고 있다는 감각을 분명히 체감하게 됩니다.
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
                                    <div key={i} style={{ background: "rgba(254, 117, 2,0.05)", padding: "1.5rem", borderRadius: "20px", display: "flex", alignItems: "center", gap: "1.2rem", fontWeight: 700, fontSize: "1.05rem" }}>
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
                        <h2 className="section-title" style={{ fontSize: "3rem", fontWeight: 800 }}>DAILY PROGRAM</h2>
                    </div>
                    <div className="grid-4 studio-program-grid" style={{ textAlign: "center", marginTop: "4rem" }}>
                        {[
                            { id: "01", title: "30일 데일리 루틴 제공", desc: "매일 10분, 부담 없이 이어갈 수 있는 발성 루틴" },
                            { id: "02", title: "1:1 음성 피드백", desc: "업로드한 음성에 대한 개인 맞춤 교정 가이드" },
                            { id: "03", title: "온라인 전용 성장 설계", desc: "시간과 장소에 구애받지 않는 훈련 구조" },
                            { id: "04", title: "지속 가능한 보컬 습관 형성", desc: "짧아도 끊기지 않도록 설계된 시스템" }
                        ].map((item, i) => (
                            <div key={i} className="gsap-reveal">
                                <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#FE7502", border: "1px solid #FE7502", padding: "2px 8px", borderRadius: "4px", marginBottom: "1rem", display: "inline-block" }}>{item.id}</span>
                                <h4 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "0.8rem" }}>{item.title}</h4>
                                <p style={{ fontSize: "0.9rem", color: "#666", lineHeight: 1.5 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 10. Pricing Intro */}
                <section className="container" style={{ textAlign: "center", padding: "8rem 0" }}>
                    <div className="gsap-reveal" style={{ maxWidth: "800px", margin: "0 auto" }}>
                        <h2 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "2rem" }}>혼자일 때도<br /><span style={{ color: "#FE7502" }}>성장이 멈추지 않도록.</span></h2>
                        <div style={{ fontSize: "1.2rem", lineHeight: 1.7, color: "#424245", fontWeight: 500 }}>
                            <p>레슨이 없는 날에도, 데일리가 있으면 방향은 흔들리지 않습니다.</p>
                            <p style={{ marginTop: "1.5rem" }}>매일 정확한 루틴이 전달되고, 내 발성에 대한 전문가의 피드백이 돌아옵니다. 혼자서도 무너지지 않는 연습의 기준, 그것이 데일리입니다.</p>
                        </div>
                    </div>

                    <div className="grid-2" style={{ maxWidth: "800px", margin: "4rem auto 0" }}>
                        <div className="program-card gsap-reveal">
                            <div className="program-card__content">
                                <span style={{ color: "#FE7502", fontWeight: 800, fontSize: "0.9rem", letterSpacing: "0.05em" }}>BASIC</span>
                                <h3 style={{ marginTop: "0.8rem", fontWeight: 800 }}>30일 데일리 패스</h3>
                                <p style={{ fontSize: "0.95rem" }}>매일 루틴 + 주 2회 피드백. 혼자 연습하던 불안함을 끝내는 첫 번째 시스템.</p>
                                <div style={{ fontSize: "2.2rem", fontWeight: 900, margin: "1.5rem 0", color: "#1d1d1f" }}>₩120,000</div>
                                <button className="btn btn-primary-light" style={{ width: "100%", borderRadius: "40px", background: "#111", color: "#fff", fontWeight: 700, padding: "1rem" }} onClick={openModal}>무료 킥오프 상담 예약</button>
                            </div>
                        </div>

                        <div className="program-card gsap-reveal" style={{ border: "2px solid #FE7502" }}>
                            <div className="program-card__content">
                                <span style={{ background: "#FE7502", color: "#000", padding: "4px 12px", borderRadius: "40px", fontSize: "0.75rem", fontWeight: 800 }}>MOST POPULAR</span>
                                <h3 style={{ marginTop: "0.8rem", fontWeight: 800 }}>무제한 피드백 멤버십</h3>
                                <p style={{ fontSize: "0.95rem" }}>무제한 피드백 + 달성률 성공 시 <strong>월 1회 오프라인 레슨</strong>까지. 계속하면 직접 만날 수 있습니다.</p>
                                <div style={{ fontSize: "2.2rem", fontWeight: 900, margin: "1.5rem 0", color: "#1d1d1f" }}>₩200,000 <span style={{ fontSize: "1rem", fontWeight: 400, color: "#888" }}>/ 월</span></div>
                                <button className="btn btn-primary-light" style={{ width: "100%", borderRadius: "40px", background: "#FE7502", color: "#000", border: "none", fontWeight: 700, padding: "1rem" }} onClick={openModal}>무료 킥오프 상담 예약</button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Track Comparison */}
                <TrackComparison currentTrack="Spark" />

                {/* 11. Persuasion Section */}
                <section style={{ background: "#000", color: "#fff", padding: "8rem 0" }}>
                    <div className="container gsap-reveal" style={{ maxWidth: "800px", textAlign: "center" }}>
                        <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 800, marginBottom: "2.5rem" }}>변화는 거창하게 시작되지 않습니다.</h2>
                        <div style={{ fontSize: "1.25rem", lineHeight: 1.8, color: "#a1a1a6", fontWeight: 500 }}>
                            <p>하루 10분의 정확한 반복, <br />혼자서는 놓칠 수 있는 지점을 짚어주는 피드백, 그리고 멈추지 않도록 설계된 루틴.</p>
                            <p style={{ marginTop: "1.5rem" }}>데일리는 당신의 목소리를 <br />조금씩, 그러나 분명하게 바꿔나갑니다.</p>
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
                        <div className="studio-final-actions" style={{ display: "flex", justifyContent: "center", gap: "1.5rem" }}>
                            <button className="btn btn-primary-light" style={{ padding: "1.2rem 3.5rem", background: "#FE7502", color: "#000", borderRadius: "40px", fontWeight: 700, fontSize: "1.1rem", border: "none" }} onClick={openModal}>
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
                    <div className="modal-step active">
                        <h3 style={{ fontSize: "1.5rem", marginBottom: "10px", textAlign: "center", color: "#111" }}>데일리 상담 연결</h3>
                        <p style={{ textAlign: "center", color: "#555", marginBottom: "30px", fontSize: "0.95rem", lineHeight: 1.6 }}>
                            기본 정보를 남겨주시면 다음 단계에서 보컬 진단 체크를 이어서 작성할 수 있습니다.
                        </p>
                        <form onSubmit={handleFormSubmit}>
                            <div className="form-group" style={{ marginBottom: "15px" }}>
                                <label style={{ display: "block", marginBottom: "5px", color: "#333", fontSize: "0.9rem", fontWeight: 600 }}>성함</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="홍길동" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required 
                                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", background: "#fff", color: "#000" }} 
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: "15px" }}>
                                <label style={{ display: "block", marginBottom: "5px", color: "#333", fontSize: "0.9rem", fontWeight: 600 }}>연락처</label>
                                <input 
                                    type="tel" 
                                    className="form-control" 
                                    placeholder="010-0000-0000" 
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    required 
                                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", background: "#fff", color: "#000" }} 
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: "15px" }}>
                                <label style={{ display: "block", marginBottom: "5px", color: "#333", fontSize: "0.9rem", fontWeight: 600 }}>이메일</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="example@email.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", background: "#fff", color: "#000" }}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: "15px" }}>
                                <label style={{ display: "block", marginBottom: "5px", color: "#333", fontSize: "0.9rem", fontWeight: 600 }}>구독 희망 이용권</label>
                                <select 
                                    className="form-control" 
                                    value={formData.option}
                                    onChange={(e) => setFormData({...formData, option: e.target.value})}
                                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", background: "#fff", color: "#000" }}
                                >
                                    <option>데일리 멤버십 (월 120,000원)</option>
                                    <option>무제한 피드백 멤버십 (₩200,000/월)</option>
                                </select>
                            </div>
                            <button type="submit" disabled={isRedirecting} className="btn btn-primary-light" style={{ width: "100%", marginTop: "10px", padding: "15px", fontSize: "1.05rem", borderRadius: "8px", background: isRedirecting ? "#c7c7cc" : "#FE7502", color: "#000", border: "none", cursor: isRedirecting ? "wait" : "pointer" }}>
                                {isRedirecting ? "진단 페이지로 이동 중..." : "다음 단계로 이어가기"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .studio-page .grid-4 {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 1.5rem;
                }

                @media (max-width: 768px) {
                    .studio-page .container {
                        padding: 0 1.25rem !important;
                    }

                    .studio-page .studio-header {
                        padding: 0.85rem 0 !important;
                    }

                    .studio-page .studio-header__inner span {
                        font-size: 0.95rem !important;
                    }

                    .studio-page .studio-nav-cta {
                        font-size: 0.82rem !important;
                        padding: 0.65rem 0.9rem !important;
                    }

                    .studio-page .studio-hero {
                        min-height: auto !important;
                        padding-top: 6.5rem !important;
                        padding-bottom: 4rem !important;
                    }

                    .studio-page .studio-hero h1 {
                        font-size: clamp(2.35rem, 11vw, 3.1rem) !important;
                        line-height: 1.06 !important;
                    }

                    .studio-page .studio-hero p {
                        font-size: 1rem !important;
                    }

                    .studio-page .studio-hero-actions,
                    .studio-page .studio-final-actions {
                        flex-direction: column !important;
                        width: min(100%, 340px);
                        margin-left: auto;
                        margin-right: auto;
                    }

                    .studio-page .studio-hero-actions > button,
                    .studio-page .studio-final-actions > button {
                        width: 100%;
                        justify-content: center;
                        padding: 1rem 1.2rem !important;
                    }

                    .studio-page .studio-two-col {
                        grid-template-columns: 1fr !important;
                        gap: 1.75rem !important;
                    }

                    .studio-page .studio-program-grid {
                        grid-template-columns: repeat(2, 1fr) !important;
                    }

                    .studio-page .simple-form {
                        padding: 1.25rem !important;
                    }
                }

                @media (max-width: 430px) {
                    .studio-page section {
                        padding: 4.5rem 0 !important;
                    }

                    .studio-page .studio-hero {
                        padding-top: 6rem !important;
                        padding-bottom: 3.5rem !important;
                    }

                    .studio-page .studio-hero h1,
                    .studio-page h2 {
                        font-size: clamp(2rem, 9vw, 2.6rem) !important;
                    }

                    .studio-page .studio-hero p,
                    .studio-page p {
                        line-height: 1.65 !important;
                    }

                    .studio-page .studio-program-grid {
                        grid-template-columns: 1fr !important;
                        gap: 1.25rem !important;
                    }

                    .studio-page .program-card,
                    .studio-page .target-card {
                        border-radius: 22px !important;
                    }

                    .studio-page .target-card,
                    .studio-page .program-card__content,
                    .studio-page .simple-form {
                        padding: 1.25rem !important;
                    }
                }
            `}</style>
        </div>
    );
}
