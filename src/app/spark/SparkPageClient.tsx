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
import { KICKOFF_CTA_LABEL } from "@/lib/site";

export default function SparkPage() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        option: "데일리(DAILY) 구독 (월 120,000원)"
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
                    <span className="gsap-reveal" style={{ color: "#FE7502", fontWeight: 700, letterSpacing: "0.1em", fontSize: "0.9rem", display: "block", marginBottom: "1rem" }}>데일리(DAILY) · 온라인 멤버십</span>
                    <h1 className="hero-title gsap-reveal" style={{ fontSize: "clamp(2.2rem, 4.5vw, 4.5rem)", lineHeight: 1.15, fontWeight: 800 }}>매일은 AI가 잡아주고,<br />매주 코치가 직접 듣습니다.</h1>
                    <div className="gsap-reveal" style={{ marginTop: "2rem", maxWidth: "650px" }}>
                        <p style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1d1d1f", marginBottom: "1rem" }}>매일 아침 10분,<br /><span style={{ color: "#FE7502" }}>시선뮤직 보컬 트레이닝 루틴이 도착합니다.</span></p>
                        <p style={{ color: "#86868b", lineHeight: 1.6, fontSize: "1.1rem" }}>
                            OB1이 당신의 소리를 즉시, 무제한으로 분석합니다. 그리고 일주일에 한 번 — 코치가 당신의 일주일 치 데이터를 보고 단 하나의 정확한 방향을 줍니다.
                        </p>
                        <p style={{ marginTop: "1.5rem", display: "inline-block", padding: "8px 16px", borderRadius: "30px", border: "1px solid rgba(254, 117, 2, 0.35)", background: "rgba(254, 117, 2, 0.06)", color: "#c45c00", fontWeight: 700, fontSize: "0.9rem" }}>
                            OB1 베타는 대기명단 순서로 열립니다
                        </p>
                    </div>

                    <div className="gsap-reveal studio-hero-actions" style={{ display: "flex", gap: "1rem", marginTop: "3rem" }}>
                        <button className="btn btn-primary-light" style={{ fontSize: "1.05rem", padding: "1.1rem 2.8rem", background: "#FE7502", color: "#000", border: "none", fontWeight: 700, borderRadius: "40px" }} onClick={openModal}>
                            {KICKOFF_CTA_LABEL}
                        </button>
                    </div>
                </section>

                {/* 2. Day Flow Section */}
                <section className="container" style={{ padding: "6rem 0" }}>
                    <div className="section-header gsap-reveal" style={{ textAlign: "left", marginBottom: "4rem" }}>
                        <h2 className="section-title" style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)", fontWeight: 800 }}>데일리의 하루</h2>
                        <div style={{ marginTop: "1.5rem", fontSize: "1.3rem", color: "#86868b", fontWeight: 500, lineHeight: 1.5 }}>
                            <p>루틴이 기준을 세우고, AI가 그 자리에서 잡아주고, 코치가 방향을 확정합니다.</p>
                        </div>
                    </div>
                    <div className="grid-3 studio-day-flow">
                        <div className="target-card gsap-reveal">
                            <div className="target-card__icon" style={{ background: "rgba(254, 117, 2,0.1)", color: "#FE7502" }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="5" />
                                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                                </svg>
                            </div>
                            <h3 style={{ fontWeight: 800 }}>아침 — 10분 보컬 트레이닝 루틴</h3>
                            <p style={{ color: "var(--color-studio-text-sec)", fontSize: "0.95rem", lineHeight: 1.5 }}>매일 아침, 오늘의 루틴이 도착합니다. 흔들리기 쉬운 발성의 기준을 하루 10분으로 세웁니다.</p>
                        </div>

                        <div className="target-card gsap-reveal">
                            <div className="target-card__icon" style={{ background: "rgba(254, 117, 2,0.1)", color: "#FE7502" }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 15a4 4 0 004-4V6a4 4 0 00-8 0v5a4 4 0 004 4z"></path>
                                    <path d="M19 10v1a7 7 0 01-14 0v-1M12 18.5v3M8 21.5h8"></path>
                                </svg>
                            </div>
                            <h3 style={{ fontWeight: 800 }}>연습 직후 — AI 즉시 피드백</h3>
                            <p style={{ color: "var(--color-studio-text-sec)", fontSize: "0.95rem", lineHeight: 1.5 }}>OB1이 녹음을 그 자리에서 분석합니다. 분석 횟수는 무제한 — 궁금할 때마다 확인합니다.</p>
                        </div>

                        <div className="target-card gsap-reveal">
                            <div className="target-card__icon" style={{ background: "rgba(254, 117, 2,0.1)", color: "#FE7502" }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7"></path>
                                    <path d="M3 7l9 6 9-6"></path>
                                    <path d="M15 19l2 2 4-4"></path>
                                </svg>
                            </div>
                            <h3 style={{ fontWeight: 800 }}>일주일에 한 번 — 코치 정밀 진단</h3>
                            <p style={{ color: "var(--color-studio-text-sec)", fontSize: "0.95rem", lineHeight: 1.5 }}>코치가 일주일 치 AI 데이터와 녹음을 직접 듣고, 지금 고칠 단 하나의 정확한 방향을 줍니다.</p>
                        </div>
                    </div>
                </section>

                {/* 3. AI Difference Section */}
                <section className="container" style={{ background: "#000", borderRadius: "36px", padding: "6rem 3rem", color: "#fff", border: "1px solid rgba(254, 117, 2,0.1)", margin: "4rem auto" }}>
                    <div className="grid-2 studio-two-col" style={{ alignItems: "center", gap: "4rem" }}>
                        <div className="gsap-reveal">
                            <span style={{ color: "#FE7502", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.15em", display: "block", marginBottom: "1.5rem" }}>OB1 — AI VOCAL COACH</span>
                            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "2rem" }}>
                                시중의 AI 보컬 앱과<br />
                                <span style={{ color: "#FE7502" }}>다른 세 가지.</span>
                            </h2>
                            <div style={{ color: "#d1d1d6", lineHeight: 1.7, fontSize: "1.15rem", fontWeight: 500 }}>
                                <p style={{ marginBottom: "1.2rem" }}>
                                    하나, OB1은 D.A.P. 시스템 — <span style={{ color: "#fff", fontWeight: 700 }}>코치와 같은 언어로 말합니다.</span>
                                </p>
                                <p style={{ marginBottom: "1.2rem" }}>
                                    둘, 당신의 모든 기록이 <span style={{ color: "#fff", fontWeight: 700 }}>성장 아카이브에 쌓입니다.</span>
                                </p>
                                <p>
                                    셋, AI의 데이터가 <span style={{ color: "#fff", fontWeight: 700 }}>코치의 피드백으로 이어집니다.</span>
                                </p>
                            </div>
                            <p style={{ marginTop: "2rem", fontSize: "1.05rem", color: "#FE7502", fontWeight: 700 }}>OB1은 앱스토어에 출시됩니다. 클럽 멤버에게는 최고 등급인 마스터리 플랜(월 29,000원)이 무제한으로 기본 제공됩니다.</p>
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
                                    <div style={{ fontSize: "4.5rem", marginBottom: "15px", filter: "drop-shadow(0 0 25px rgba(254, 117, 2,0.4))" }}>🎙️</div>
                                    <div style={{ fontWeight: 900, fontSize: "1.6rem", color: "#fff", letterSpacing: "0.05em" }}>클럽 멤버 전용 AI</div>
                                    <div style={{ fontSize: "1.1rem", color: "#FE7502", fontWeight: 700, marginTop: "8px" }}>D.A.P. System</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Program Composition Section */}
                <section className="container" style={{ padding: "6rem 0" }}>
                    <div className="section-header gsap-reveal">
                        <h2 className="section-title" style={{ fontSize: "3rem", fontWeight: 800 }}>데일리(DAILY) 구성</h2>
                    </div>
                    <div className="grid-4 studio-program-grid" style={{ textAlign: "center", marginTop: "4rem" }}>
                        {[
                            { id: "01", title: "OB1 마스터리", desc: "AI 보컬 코치 최고 등급 플랜. 즉시 분석, 분석 횟수 무제한. 베타는 대기명단 순서로 열립니다." },
                            { id: "02", title: "매일 아침 10분 루틴", desc: "보컬 트레이닝 루틴이 매일 아침 도착합니다." },
                            { id: "03", title: "코치 주 1회 큐레이션 피드백", desc: "일주일 치 AI 데이터와 녹음을 보고 1회 정밀 진단" },
                            { id: "04", title: "성장 아카이브", desc: "루틴·분석·피드백의 모든 기록이 쌓입니다." }
                        ].map((item, i) => (
                            <div key={i} className="gsap-reveal">
                                <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#FE7502", border: "1px solid #FE7502", padding: "2px 8px", borderRadius: "4px", marginBottom: "1rem", display: "inline-block" }}>{item.id}</span>
                                <h4 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "0.8rem" }}>{item.title}</h4>
                                <p style={{ fontSize: "0.9rem", color: "#666", lineHeight: 1.5 }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 5. Recommendations Section */}
                <section style={{ background: "#f5f5f7", padding: "6rem 0" }}>
                    <div className="container gsap-reveal" style={{ maxWidth: "800px" }}>
                        <h2 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "3rem", textAlign: "center" }}>이런 분들에게 추천합니다</h2>
                        <div className="studio-list-card" style={{ background: "#fff", padding: "3rem", borderRadius: "30px", border: "1px solid rgba(0,0,0,0.05)" }}>
                            {[
                                "혼자 연습하지만 내 방식이 맞는지 확신이 없는 분",
                                "짧더라도 매일 이어갈 수 있는 훈련 시스템이 필요한 분",
                                "연습한 만큼 늘고 있는지 그 자리에서 확인하고 싶은 분",
                                "무작정 많이 하는 연습보다 정확한 방향이 필요한 분",
                                "목소리의 기준을 다시 세우고 싶은 분"
                            ].map((item, i) => (
                                <div key={i} className="studio-check-row" style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 0", borderBottom: i === 4 ? "none" : "1px solid #f0f0f2", fontSize: "1.1rem", fontWeight: 600 }}>
                                    <span style={{ color: "#FE7502" }}>✓</span>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 6. Pricing Section */}
                <section className="container" style={{ textAlign: "center", padding: "8rem 0" }}>
                    <div className="gsap-reveal" style={{ maxWidth: "800px", margin: "0 auto" }}>
                        <h2 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "2rem" }}>혼자일 때도<br /><span style={{ color: "#FE7502" }}>성장이 멈추지 않도록.</span></h2>
                        <div style={{ fontSize: "1.2rem", lineHeight: 1.7, color: "#424245", fontWeight: 500 }}>
                            <p>데일리는 클럽의 입구입니다.</p>
                            <p style={{ marginTop: "1.5rem" }}>매일 아침 루틴이 도착하고, AI가 그 자리에서 분석하고, 코치가 매주 방향을 확정합니다. 혼자서도 무너지지 않는 연습의 기준, 그것이 데일리입니다.</p>
                        </div>
                    </div>

                    <div style={{ maxWidth: "520px", margin: "4rem auto 0" }}>
                        <div className="program-card gsap-reveal" style={{ border: "2px solid #FE7502" }}>
                            <div className="program-card__content">
                                <span style={{ color: "#FE7502", fontWeight: 800, fontSize: "0.9rem", letterSpacing: "0.05em" }}>DAILY</span>
                                <h3 style={{ marginTop: "0.8rem", fontWeight: 800 }}>데일리(DAILY) 구독</h3>
                                <p style={{ fontSize: "0.95rem" }}>AI 무제한 분석 + 매일 아침 루틴 + 코치 주 1회 큐레이션 피드백 + 성장 아카이브.</p>
                                <div style={{ fontSize: "2.2rem", fontWeight: 900, margin: "1.5rem 0 0.5rem", color: "#1d1d1f" }}>월 120,000원 <span style={{ fontSize: "1rem", fontWeight: 500, color: "#888" }}>(VAT 포함)</span></div>
                                <p style={{ fontSize: "0.9rem", color: "#c45c00", fontWeight: 700, marginBottom: "1.2rem" }}>베타는 대기명단 순서로 열립니다.</p>
                                <div style={{ background: "rgba(254, 117, 2,0.06)", borderRadius: "16px", padding: "1.2rem", marginBottom: "1.5rem", textAlign: "left" }}>
                                    <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1d1d1f", lineHeight: 1.6 }}>데일리에서 보낸 첫 달은 사라지지 않습니다 —<br />첫 30일 안에 시그니처로 입회하면 전액 차감됩니다.</p>
                                </div>
                                <button className="btn btn-primary-light" style={{ width: "100%", borderRadius: "40px", background: "#FE7502", color: "#000", border: "none", fontWeight: 700, padding: "1rem" }} onClick={openModal}>{KICKOFF_CTA_LABEL}</button>
                                <p style={{ marginTop: "1rem", fontSize: "0.85rem", color: "#86868b" }}>
                                    월 단위 구독 · <a href="/refund" style={{ color: "#86868b", textDecoration: "underline" }}>환불 규정</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 7. Feedback Membership Upgrade (single mention) */}
                <section style={{ background: "#f5f5f7", padding: "5rem 0" }}>
                    <div className="container gsap-reveal" style={{ maxWidth: "760px" }}>
                        <div className="studio-list-card" style={{ background: "#fff", padding: "3rem", borderRadius: "30px", border: "1px solid rgba(0,0,0,0.05)" }}>
                            <span style={{ color: "#FE7502", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.08em" }}>더 촘촘한 피드백이 필요하다면</span>
                            <h3 style={{ fontSize: "1.6rem", fontWeight: 800, margin: "0.8rem 0 1rem" }}>데일리 피드백 멤버십 · 월 200,000원 <span style={{ fontSize: "0.95rem", fontWeight: 500, color: "#888" }}>(VAT 포함)</span></h3>
                            <p style={{ color: "#424245", lineHeight: 1.7, fontSize: "1.02rem" }}>
                                데일리 전체 구성에 더해, 코치 피드백을 1일 1회(영업일 기준) 받고 월 1회 오프라인 진단 세션에서 코치를 직접 만납니다. 자세한 안내는 킥오프 상담에서 드립니다.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Track Comparison */}
                <TrackComparison currentTrack="Spark" />

                {/* 8. FAQ Section */}
                <section className="container" style={{ padding: "7rem 0" }}>
                    <h2 className="gsap-reveal" style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "3rem", textAlign: "center" }}>자주 묻는 질문</h2>
                    <div className="studio-faq" style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                        {[
                            {
                                q: "AI만으로도 되나요?",
                                a: <>AI는 매일의 교정을 맡습니다. 방향은 코치가 잡습니다. 일주일 치 데이터를 코치가 직접 보고 정밀 진단을 주기 때문에, 매일의 반복이 잘못된 길로 쌓이지 않습니다.</>
                            },
                            {
                                q: "피드백은 얼마나 자주 받나요?",
                                a: <>데일리는 코치가 주 1회 큐레이션 피드백을 드립니다. 데일리 피드백 멤버십은 1일 1회(영업일 기준)입니다.</>
                            },
                            {
                                q: "해지는 어떻게 하나요?",
                                a: <>월 단위 구독으로 언제든 해지할 수 있습니다. 자세한 기준은 <Link href="/refund" style={{ color: "#FE7502", textDecoration: "underline" }}>환불 규정</Link>에서 확인하실 수 있습니다.</>
                            },
                            {
                                q: "시그니처로 바꾸면 어떻게 되나요?",
                                a: <>데일리에서 보낸 첫 달은 사라지지 않습니다. 구독 첫 30일 안에 시그니처로 입회하면 첫 달 구독료가 전액 차감됩니다.</>
                            }
                        ].map((item, i) => (
                            <details key={i} open={i === 0} className="gsap-reveal studio-faq-item" style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "20px", padding: "0 2rem", textAlign: "left" }}>
                                <summary style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", padding: "1.4rem 0", minHeight: "44px", cursor: "pointer", listStyle: "none", fontSize: "1.15rem", fontWeight: 800 }}>
                                    <span><span style={{ color: "#FE7502", marginRight: "0.5rem" }}>Q.</span>{item.q}</span>
                                    <span className="studio-faq-chevron" aria-hidden="true" style={{ color: "#FE7502", fontWeight: 900, fontSize: "1.2rem", flexShrink: 0 }}>+</span>
                                </summary>
                                <p style={{ color: "#424245", lineHeight: 1.7, fontSize: "1rem", padding: "0 0 1.4rem" }}>{item.a}</p>
                            </details>
                        ))}
                    </div>
                </section>

                {/* 9. Final CTA Section */}
                <section className="container" style={{ padding: "10rem 0", textAlign: "center" }}>
                    <div className="gsap-reveal">
                        <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, marginBottom: "2rem", letterSpacing: "-0.04em" }}>매일이 쌓이면,<br />소리는 달라집니다.</h2>
                        <p style={{ color: "#86868b", fontSize: "1.3rem", lineHeight: 1.6, maxWidth: "600px", margin: "0 auto 3.5rem" }}>
                            하루 10분의 루틴, 그 자리에서 확인하는 AI 분석,<br />그리고 매주 코치가 확정해 주는 방향.
                        </p>
                        <div className="studio-final-actions" style={{ display: "flex", justifyContent: "center", gap: "1.5rem" }}>
                            <button className="btn btn-primary-light" style={{ padding: "1.2rem 3.5rem", background: "#FE7502", color: "#000", borderRadius: "40px", fontWeight: 700, fontSize: "1.1rem", border: "none" }} onClick={openModal}>
                                {KICKOFF_CTA_LABEL}
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
                                    <option>데일리(DAILY) 구독 (월 120,000원)</option>
                                    <option>데일리 피드백 멤버십 (월 200,000원)</option>
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

                .studio-page .studio-faq-item summary::-webkit-details-marker {
                    display: none;
                }

                .studio-page .studio-faq-chevron {
                    transition: transform 0.25s ease;
                }

                .studio-page .studio-faq-item[open] .studio-faq-chevron {
                    transform: rotate(45deg);
                }

                @media (max-width: 768px) {
                    .studio-page main > section:not(.studio-hero),
                    .studio-page main > section.container:not(.studio-hero) {
                        padding-top: 3.75rem !important;
                        padding-bottom: 3.75rem !important;
                    }

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
                        padding-bottom: 3.5rem !important;
                    }

                    .studio-page .section-header {
                        margin-bottom: 2rem !important;
                    }

                    .studio-page .studio-program-grid {
                        margin-top: 2rem !important;
                        gap: 1.25rem !important;
                    }

                    .studio-page .studio-day-flow {
                        display: flex !important;
                        overflow-x: auto;
                        scroll-snap-type: x mandatory;
                        -webkit-overflow-scrolling: touch;
                        gap: 0.9rem !important;
                        margin: 0 -1.25rem;
                        padding: 0 1.25rem 0.75rem;
                    }

                    .studio-page .studio-day-flow > .target-card {
                        flex: 0 0 78%;
                        scroll-snap-align: start;
                    }

                    .studio-page .target-card,
                    .studio-page .program-card__content,
                    .studio-page .studio-list-card {
                        padding: 1.6rem !important;
                    }

                    .studio-page .studio-list-card {
                        border-radius: 22px !important;
                    }

                    .studio-page .studio-check-row {
                        padding: 0.7rem 0 !important;
                        font-size: 1rem !important;
                    }

                    .studio-page .studio-faq {
                        gap: 0.75rem !important;
                    }

                    .studio-page .studio-faq-item {
                        padding: 0 1.25rem !important;
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

                    .studio-page main > section:not(.studio-hero),
                    .studio-page main > section.container:not(.studio-hero) {
                        padding-top: 3.25rem !important;
                        padding-bottom: 3.25rem !important;
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
