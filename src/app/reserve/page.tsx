"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../../styles/reserve.css";
import TrackComparison from "@/components/TrackComparison";
import { buildDiagnosisPath } from "@/lib/consultation-intake";
import { openKickoff } from "@/lib/kickoff";

export default function ConciergePage() {
    const router = useRouter();
    const [showStickyCTA, setShowStickyCTA] = useState(false);
    const [modalActive, setModalActive] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [formValues, setFormValues] = useState({
        name: "",
        email: "",
        phone: "",
        notes: ""
    });
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

    const openModal = () => openKickoff("protocol");
    const closeModal = () => {
        setModalActive(false);
        setIsRedirecting(false);
        setFormValues({ name: "", email: "", phone: "", notes: "" });
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsRedirecting(true);
        router.push(
            buildDiagnosisPath({
                type: "Reserve",
                name: formValues.name,
                email: formValues.email,
                phone: formValues.phone,
                notes: formValues.notes,
            })
        );
    };

    return (
        <div className="reserve-page" style={{ color: "#ffffff", backgroundColor: "#050507", minHeight: "100vh", fontFamily: "var(--font-suit), sans-serif" }}>
            <header className="header-reserve reserve-header" style={{ position: "fixed", top: 0, width: "100%", padding: "1.5rem 0", zIndex: 100, backgroundColor: "rgba(5, 5, 7, 0.8)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="container reserve-header__inner" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Link href="/" style={{ color: "#fff", fontWeight: 800, fontSize: "1.2rem", textDecoration: "none", letterSpacing: "0.1em" }}>SEE:SUN PROTOCOL</Link>
                    <button onClick={openModal} style={{ background: "#FE7502", color: "#000", padding: "8px 24px", borderRadius: "100px", fontWeight: 700, border: "none", cursor: "pointer", fontSize: "0.9rem" }}>무료 킥오프 상담 예약</button>
                </div>
            </header>

            <main>
                {/* 1. Hero Section */}
                <section ref={heroRef} className="reserve-hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", paddingTop: "80px" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}>
                        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(90deg, #050507 38%, rgba(5,5,7,0.72) 58%, rgba(5,5,7,0.1) 100%)", zIndex: 1 }} />
                        <Image
                            src="/images/signature/hero_bg.png"
                            alt="A microphone waiting in a warm-lit recording studio"
                            fill
                            priority
                            sizes="100vw"
                            style={{ objectFit: "cover", objectPosition: "62% center", opacity: 0.85 }}
                        />
                    </div>

                    <div className="container" style={{ position: "relative", zIndex: 2, maxWidth: "1200px" }}>
                        <div style={{ maxWidth: "700px" }}>
                            <span style={{ color: "#FE7502", fontWeight: 800, letterSpacing: "0.3em", fontSize: "0.85rem", display: "block", marginBottom: "2rem" }}>15-WEEK PRIVATE TRANSFORMATION PROGRAM</span>
                            <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 900, lineHeight: 1.15, marginBottom: "2.5rem", letterSpacing: "-0.04em" }}>
                                노래 한 곡 때문에<br />
                                <span style={{ color: "#FE7502" }}>마음 졸이는 순간</span>을<br />
                                끝내드립니다.
                            </h1>
                            <p style={{ fontSize: "1.25rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: "3.5rem" }}>
                                직원들과의 회식, 거래처 모임, 대표들끼리의 자리.<br />
                                노래 한 곡이 부담스러워 그 순간만 마음이 조여오셨다면,<br />
                                마스터 프로토콜은 바로 그 순간을 끝내기 위해 설계된, 15주 프라이빗 실전 프로그램입니다.
                            </p>
                            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: "3rem", borderLeft: "2px solid #FE7502", paddingLeft: "1.5rem" }}>
                                단순히 노래를 배우는 과정이 아닙니다. 매주 1회의 트레이닝과 1회의 실전 세션을 통해<br />
                                안전한 공간에서 무대 감각을 익히고, 15주 후에는 졸업공연까지 경험하도록 설계했습니다.
                            </p>
                            <button onClick={openModal} style={{ background: "#FE7502", color: "#000", padding: "1.2rem 3.5rem", borderRadius: "100px", fontWeight: 800, fontSize: "1.15rem", border: "none", cursor: "pointer", boxShadow: "0 10px 30px rgba(254, 117, 2,0.2)" }}>무료 킥오프 상담 예약</button>
                        </div>
                    </div>
                </section>

                {/* 2. One Line Desc Section */}
                <section style={{ padding: "10rem 0", background: "#0a0a0c", textAlign: "center" }}>
                    <div className="container" ref={addToRefs}>
                        <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, marginBottom: "2rem" }}>배우고, 익히고, 실제로 해내는 15주.</h2>
                        <p style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, maxWidth: "800px", margin: "0 auto" }}>
                            마스터 프로토콜이 만드는 건 노래를 아는 척하는 요령이 아닙니다. 사람들 앞에서 <span style={{ color: "#fff", fontWeight: 700 }}>실제로 한 곡을 해내는 상태</span> — 거기까지 데려가는 과정입니다. 매주 한 번은 개인 트레이닝으로 목소리와 곡을 정리하고, 또 한 번은 안전한 공간에서의 소규모 실전으로 무대 감각과 자신감을 붙여갑니다.
                        </p>
                    </div>
                </section>

                {/* 3. Empathy Situation Section - TACTILE CARDS */}
                <section style={{ padding: "10rem 0", background: "#050507" }}>
                    <div className="container" style={{ textAlign: "center" }}>
                        <h2 ref={addToRefs} className="reserve-empathy-title" style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "5rem" }}>이런 순간이 유독 부담스러우셨다면.</h2>

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
                                background: rgba(254, 117, 2, 0.03);
                                border-color: rgba(254, 117, 2, 0.2);
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
                                { num: "01", title: "회식 자리", desc: "회식이 잡히면 노래방으로 이어질까 봐 그 순간부터 마음이 조여오기 시작한다" },
                                { num: "02", title: "비즈니스 모임", desc: "대표들끼리, 거래처와의 자리에서 노래 한 곡으로 내 이미지가 결정될 것 같은 압박" },
                                { num: "03", title: "갑작스러운 요청", desc: "분위기를 망치고 싶지 않아 마지못해 마이크를 잡고, 끝나고 나서도 오래 찜찜하다" }
                            ].map((item, i) => (
                                <div key={i} ref={addToRefs} className="reserve-tactile-card">
                                    <div className="icon-box" style={{ fontSize: "0.78rem", fontWeight: 900, color: "rgba(254, 117, 2,0.5)", letterSpacing: "0.1em", marginBottom: "2rem" }}>{item.num}</div>
                                    <h3 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: "1.2rem" }}>{item.title}</h3>
                                    <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontSize: "1.05rem" }}>{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4. Problem Definition */}
                <section style={{ padding: "10rem 0", background: "linear-gradient(to bottom, #050507, #0a0a0c)" }}>
                    <div className="container reserve-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
                        <div ref={addToRefs}>
                            <h2 style={{ fontSize: "3rem", fontWeight: 900, lineHeight: 1.2, letterSpacing: "-0.03em" }}>문제는 노래 실력보다<br /><span style={{ color: "#FE7502" }}>그 순간의 불안</span>일 수 있습니다.</h2>
                        </div>
                        <div ref={addToRefs} style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.15rem", lineHeight: 1.8 }}>
                            <p style={{ marginBottom: "2rem" }}>노래를 못한다는 사실보다 더 힘든 건, 그 상황을 피하고 싶어지는 마음일 수 있습니다. 사람들 앞에서 불러야 한다는 부담, 체면을 지키고 싶다는 압박, 괜히 분위기를 망치고 싶지 않은 긴장감.</p>
                            <p style={{ color: "#fff", fontWeight: 700 }}>마스터 프로토콜은 그 순간을 견디게 하는 게 아니라, 조금씩 익숙해지고 실제로 해낼 수 있도록 몸과 감각을 바꿔가는 과정입니다.</p>
                        </div>
                    </div>
                </section>

                {/* 5. Program Structure Structure - VERTICAL TIMELINE */}
                <section style={{ padding: "12rem 0", background: "#0a0a0c", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}>
                        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(90deg, rgba(10,10,12,0.96) 0%, rgba(10,10,12,0.75) 50%, rgba(10,10,12,0.88) 100%)", zIndex: 1 }} />
                        <Image
                            src="/images/signature/reserve_session.png"
                            alt="Session Visual"
                            fill
                            sizes="100vw"
                            style={{ objectFit: "cover", objectPosition: "center 20%", opacity: 0.55 }}
                        />
                    </div>
                    <div className="container" style={{ position: "relative", zIndex: 1 }}>
                        <div className="reserve-sec-head" style={{ textAlign: "center", marginBottom: "7rem" }}>
                            <span style={{ color: "#FE7502", fontWeight: 800, letterSpacing: "0.2em", fontSize: "0.85rem", display: "block", marginBottom: "1rem" }}>TRANSFORMATION JOURNEY</span>
                            <h2 ref={addToRefs} style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.03em" }}>15주 동안 이렇게 바뀝니다</h2>
                        </div>

                        <div className="reserve-timeline" style={{ position: "relative", maxWidth: "900px", margin: "0 auto" }}>
                            {/* Central Line */}
                            <div className="reserve-timeline-line" style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "1px", background: "rgba(255,255,255,0.1)", transform: "translateX(-50%)" }} />

                            {[
                                { step: "STEP 1", title: "프라이빗 트레이닝", desc: "당신의 음역, 톤을 고려해 가장 현실적으로 소화할 수 있는 한 곡을 정리합니다." },
                                { step: "STEP 2", title: "실전 감각 세션", desc: "안전한 공간에서의 소규모 공연 세션을 통해 무대 감각을 반복적으로 익힙니다." },
                                { step: "STEP 3", title: "실전 적응 훈련", desc: "표정, 시작 태도, 마이크 사용 등 실제 상황에서 덜 부담스럽도록 조정합니다." },
                                { step: "STEP 4", title: "졸업공연", desc: "마지막에는 한 곡을 끝까지 완성해, '해낼 수 있다'는 감각을 몸에 새깁니다." }
                            ].map((item, i) => (
                                <div key={i} ref={addToRefs} className="reserve-timeline-item" style={{
                                    display: "flex",
                                    justifyContent: i % 2 === 0 ? "flex-end" : "flex-start",
                                    marginBottom: "4rem",
                                    position: "relative",
                                    width: "100%"
                                }}>
                                    {/* Dot */}
                                    <div className="reserve-timeline-dot" style={{
                                        position: "absolute",
                                        left: "50%",
                                        top: "20px",
                                        width: "12px",
                                        height: "12px",
                                        background: "#FE7502",
                                        borderRadius: "50%",
                                        transform: "translateX(-50%)",
                                        boxShadow: "0 0 15px #FE7502",
                                        zIndex: 2
                                    }} />

                                    <div className="reserve-timeline-card" style={{
                                        width: "42%",
                                        background: "rgba(255,255,255,0.03)",
                                        padding: "2.5rem",
                                        borderRadius: "24px",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        backdropFilter: "blur(10px)",
                                        textAlign: i % 2 === 0 ? "right" : "left"
                                    }}>
                                        <span style={{ color: "#FE7502", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.1em", display: "block", marginBottom: "1rem" }}>{item.step}</span>
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
                    <div className="container grid-2 reserve-two-col" style={{ gap: "4rem", alignItems: "center" }}>
                        <div ref={addToRefs}>
                            <h2 style={{ fontSize: "2.8rem", fontWeight: 900, marginBottom: "2rem" }}>마스터 프로토콜은 레슨이 아니라<br /><span style={{ color: "#FE7502" }}>변화의 구조</span>입니다.</h2>
                            <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.8, fontSize: "1.1rem" }}>
                                한 번 배우고 끝나는 레슨으로는 두려움이 쉽게 바뀌지 않습니다. 마스터 프로토콜은 배운 것을 바로 적용하고, 안전한 환경에서 반복하고, 마지막엔 실제로 완성해보는 구조를 통해 그 두려움을 점점 줄여갑니다. 그래서 더 현실적이고 오래 남습니다.
                            </p>
                        </div>
                        <div ref={addToRefs} className="reserve-benefit-card" style={{ background: "rgba(254, 117, 2,0.03)", padding: "4rem", borderRadius: "40px", border: "1px solid rgba(254, 117, 2,0.1)" }}>
                            <h3 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "3rem", color: "#FE7502" }}>당신이 얻게 될 것</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                                {[
                                    "회식과 모임 자리에서의 부담 감소",
                                    "사람들 앞에서 노래할 때의 긴장 완화",
                                    "내 목소리에 맞는 실전용 한 곡 확보",
                                    "무대와 노래방 상황에서 덜 얼어붙는 감각",
                                    "작아지지 않는 여유와 자신감"
                                ].map((item, i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem", fontWeight: 700, fontSize: "1.1rem" }}>
                                        <div style={{ color: "#FE7502" }}>✓</div>
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
                                마스터 프로토콜은 누군가 앞에서 평가받으며 버티는 수업이 아닙니다. 노래에 대한 민망함, 체면의 부담을 굳이 드러내지 않아도 되는 환경에서 천천히 바꿔가는 프라이빗 프로그램입니다.
                            </p>
                        </div>
                        <div ref={addToRefs} className="reserve-target-card" style={{ background: "#fff", padding: "3rem", borderRadius: "32px", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 10px 30px rgba(0,0,0,0.02)" }}>
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
                                        <div style={{ width: "6px", height: "6px", background: "#FE7502", borderRadius: "50%" }}></div>
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
                                    rgba(254, 117, 2, 0.05),
                                    transparent
                                );
                                animation: shimmer 4s infinite;
                                pointer-events: none;
                            }
                        ` }} />
                        <div ref={addToRefs} className="reserve-pricing-card" style={{
                            background: "rgba(255,255,255,0.02)",
                            padding: "5rem",
                            borderRadius: "56px",
                            border: "1px solid rgba(254, 117, 2,0.2)",
                            position: "relative",
                            overflow: "hidden",
                            boxShadow: "0 40px 100px -10px rgba(0,0,0,0.8), 0 0 60px rgba(254, 117, 2,0.05)"
                        }}>
                            <div className="reserve-pricing-shimmer" />
                            <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(254, 117, 2,0.12) 0%, transparent 70%)", filter: "blur(80px)" }} />

                            <span style={{ display: "inline-block", background: "rgba(254, 117, 2,0.1)", color: "#FE7502", padding: "8px 24px", borderRadius: "30px", fontSize: "0.9rem", fontWeight: 800, marginBottom: "3rem" }}>15-WEEK PRIVATE PROGRAM</span>

                            <div className="reserve-stats-row" style={{ display: "flex", justifyContent: "center", gap: "4rem", marginBottom: "4rem" }}>
                                <div>
                                    <div style={{ fontSize: "3rem", fontWeight: 900 }}>15주</div>
                                    <div style={{ color: "rgba(255,255,255,0.4)", marginTop: "0.5rem" }}>Duration</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: "3rem", fontWeight: 900 }}>주 2회</div>
                                    <div style={{ color: "rgba(255,255,255,0.4)", marginTop: "0.5rem" }}>Sessions</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: "3rem", fontWeight: 900, color: "#FE7502" }}>₩3,800,000</div>
                                    <div style={{ color: "rgba(255,255,255,0.4)", marginTop: "0.5rem" }}>15주 전체 프로그램 (VAT 포함)</div>
                                </div>
                            </div>

                            <div className="reserve-pricing-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", textAlign: "left", marginBottom: "3rem", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "3rem" }}>
                                <div style={{ color: "rgba(255,255,255,0.7)", lineHeight: 2, fontSize: "1.1rem" }}>
                                    <p>• 프라이빗 트레이닝 15회</p>
                                    <p>• 실전 감각 세션 15회</p>
                                    <p>• 졸업공연 세션 포함</p>
                                    <p>• OB1 마스터리(월 29,000원) — 분석 무제한</p>
                                    <p>• 총 <strong style={{ color: "#fff" }}>30회+ 세션</strong></p>
                                </div>
                                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem", lineHeight: 1.7 }}>
                                    회차를 나열한 상품이 아니라,<br />
                                    노래 한 곡 앞에서 마음 졸이던 상태를<br />
                                    실제로 바꿔내기 위한 집중 프로그램입니다.
                                </div>
                            </div>

                            <div style={{ background: "rgba(254, 117, 2,0.05)", border: "1px solid rgba(254, 117, 2,0.18)", borderRadius: "20px", padding: "1.8rem 2rem", textAlign: "left", marginBottom: "1.5rem" }}>
                                <div style={{ color: "#FE7502", fontWeight: 800, fontSize: "0.82rem", letterSpacing: "0.12em", marginBottom: "0.8rem" }}>성과 보장</div>
                                <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.7, fontSize: "1.02rem", margin: 0 }}>
                                    출석률 90% 이상, 주간 과제를 이행했음에도 킥오프에서 합의한 목표에 도달하지 못하면 4주를 무상으로 연장합니다.
                                </p>
                            </div>

                            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.98rem", lineHeight: 1.7, marginBottom: "1.5rem", textAlign: "left" }}>
                                프로토콜의 킥오프와 분기 정원 5명이 곧 선발입니다. 크루 합류는 별도로 지원하고, 선발됩니다 (회비 월 40,000원).
                            </p>

                            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.9rem", marginBottom: "2.5rem", textAlign: "left" }}>
                                3회 분할 결제 가능 · <a href="/refund" style={{ color: "rgba(255,255,255,0.65)", textDecoration: "underline" }}>환불 규정</a>
                            </p>

                            <button onClick={openModal} style={{ width: "100%", padding: "1.8rem", background: "#FE7502", color: "#000", borderRadius: "20px", fontSize: "1.3rem", fontWeight: 900, cursor: "pointer", border: "none", boxShadow: "0 15px 30px rgba(254, 117, 2,0.2)" }}>무료 킥오프 상담 예약</button>

                            <p style={{ marginTop: "2rem", color: "#FE7502", fontWeight: 700, fontSize: "0.95rem" }}>
                                * 한 사람의 변화를 깊게 다루기 위해 분기 정원 5명으로 제한합니다. 무료 킥오프 상담을 거친 분만 합류할 수 있습니다.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Reviews */}
                <section style={{ padding: "10rem 0", background: "#f5f5f7", color: "#1d1d1f" }}>
                    <div className="container" style={{ maxWidth: "1000px" }}>
                        <div className="reserve-sec-head" style={{ textAlign: "center", marginBottom: "5rem" }} ref={addToRefs}>
                            <p style={{ fontSize: "0.85rem", fontWeight: 800, color: "#FE7502", letterSpacing: "0.2em", marginBottom: "1rem" }}>REAL RESULTS</p>
                            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.15, color: "#111" }}>
                                실제로 해낸 사람들의 이야기
                            </h2>
                        </div>

                        <div className="reserve-review-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>

                            {/* Review 1 - Colin KOO */}
                            <div ref={addToRefs} style={{ background: "#fff", borderRadius: "28px", padding: "2.5rem", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 8px 30px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                                <div style={{ display: "flex", gap: "4px" }}>
                                    {[1,2,3,4,5].map(s => <span key={s} style={{ color: "#FE7502", fontSize: "1rem" }}>★</span>)}
                                </div>
                                <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#FE7502", letterSpacing: "0.1em" }}>SITUATION — 20년지기 친구 축가</div>
                                <p style={{ fontSize: "1.1rem", lineHeight: 1.75, color: "#333", fontWeight: 500, flex: 1 }}>
                                    &ldquo;생애 첫 축가를 앞두고 부족한 부분을 느껴 찾아뵈었는데, 제 부족한 부분을 콕콕 집어 트레이닝 해주셨어요.
                                    <strong style={{ color: "#111" }}> 당일 잘불렀다는 칭찬도 들었고, 친구에게 너무 고맙다는 말도 들었습니다.</strong>&rdquo;
                                </p>
                                <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "1.2rem" }}>
                                    <p style={{ fontWeight: 800, fontSize: "0.95rem", color: "#111" }}>Colin KOO</p>
                                    <p style={{ fontSize: "0.82rem", color: "#888", marginTop: "2px" }}>Re:cord 인증 리뷰</p>
                                </div>
                            </div>

                            {/* Review 2 - 멜로디민 */}
                            <div ref={addToRefs} style={{ background: "#111", borderRadius: "28px", padding: "2.5rem", border: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                                <div style={{ display: "flex", gap: "4px" }}>
                                    {[1,2,3,4,5].map(s => <span key={s} style={{ color: "#FE7502", fontSize: "1rem" }}>★</span>)}
                                </div>
                                <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#FE7502", letterSpacing: "0.1em" }}>SITUATION — 무대에서 무너지는 타입</div>
                                <p style={{ fontSize: "1.1rem", lineHeight: 1.75, color: "rgba(255,255,255,0.7)", fontWeight: 500, flex: 1 }}>
                                    &ldquo;긴장이 높아서 평소 연습에 비해 무대 위에서 많이 흔들리는 타입인데,
                                    <strong style={{ color: "#fff" }}> 무대 위에서 필요한 마음가짐과 훈련 방법까지 함께 알려주셔서</strong>
                                    , 보컬 레슨을 넘어 공연을 준비하는 사람에게 꼭 필요한 방향성을 제시해주신 느낌이었습니다.&rdquo;
                                </p>
                                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.2rem" }}>
                                    <p style={{ fontWeight: 800, fontSize: "0.95rem", color: "#fff" }}>멜로디민</p>
                                    <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>Re:cord 인증 리뷰</p>
                                </div>
                            </div>

                        </div>

                        <div ref={addToRefs} style={{ marginTop: "3rem", textAlign: "center" }}>
                            <p style={{ color: "#888", fontSize: "0.92rem", fontWeight: 600 }}>
                                Re:cord 인증 리뷰 25개 · 평균 별점 5.0
                            </p>
                        </div>
                    </div>
                </section>

                {/* Track Comparison */}
                <TrackComparison currentTrack="High-End" />

                {/* 12. Final CTA Section */}
                <section style={{ padding: "15vh 0", background: "linear-gradient(to bottom, #050507, #000)", textAlign: "center", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}>
                        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(to bottom, rgba(5,5,7,0.82) 0%, rgba(5,5,7,0.55) 40%, rgba(0,0,0,0.82) 100%)", zIndex: 1 }} />
                        <Image
                            src="/images/signature/reserve_graduation.png"
                            alt="Confident performance"
                            fill
                            sizes="100vw"
                            style={{ objectFit: "cover", objectPosition: "60% center", opacity: 0.75 }}
                        />
                    </div>
                    <div className="container" style={{ position: "relative", zIndex: 1 }}>
                        <h2 ref={addToRefs} style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: 900, marginBottom: "3rem", letterSpacing: "-0.04em" }}>
                            더 이상 그 순간을<br />피하지 않으셔도 됩니다.
                        </h2>
                        <p ref={addToRefs} style={{ fontSize: "1.4rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, maxWidth: "700px", margin: "0 auto 4rem" }}>
                            노래 한 곡 때문에 마음 졸이던 시간을 지나,<br />
                            이제는 자연스럽고 당당하게 그 자리에 서실 수 있도록.
                        </p>
                        <button onClick={openModal} style={{ padding: "1.5rem 5rem", background: "#FE7502", color: "#000", borderRadius: "100px", fontWeight: 800, fontSize: "1.3rem", border: "none", cursor: "pointer" }}>
                            무료 킥오프 상담 예약
                        </button>
                    </div>
                </section>
            </main>

            {/* Sticky CTA */}
            {showStickyCTA && (
                <div className="reserve-sticky-cta" style={{ position: "fixed", bottom: "2rem", left: "50%", transform: "translateX(-50%)", zIndex: 100, width: "calc(100% - 4rem)", maxWidth: "500px" }}>
                    <button onClick={openModal} style={{ width: "100%", padding: "1.2rem", background: "#FE7502", color: "#000", borderRadius: "100px", fontWeight: 800, fontSize: "1.1rem", border: "none", cursor: "pointer", boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}>무료 킥오프 상담 예약</button>
                </div>
            )}

            <div
                className={`reserve-modal-shell ${modalActive ? "active" : ""}`}
                style={{
                    background: "rgba(0,0,0,0.7)",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backdropFilter: "blur(16px)",
                    zIndex: 1000,
                    display: modalActive ? "flex" : "none",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "1.25rem"
                }}
            >
                <div
                    className="reserve-modal-card"
                    style={{ width: "100%", maxWidth: "540px", background: "#111217", borderRadius: "28px", padding: "2rem", position: "relative", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 24px 80px rgba(0,0,0,0.35)" }}
                >
                    <button onClick={closeModal} style={{ color: "#fff", position: "absolute", top: "14px", right: "18px", background: "none", border: "none", fontSize: "2rem", cursor: "pointer", lineHeight: 1 }}>&times;</button>
                    <div>
                        <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
                            <div style={{ fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.12em", color: "#FE7502", marginBottom: "10px" }}>RESERVE — PRIVATE TRACK</div>
                            <h3 style={{ fontSize: "1.7rem", marginBottom: "10px", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em" }}>지금 바로 상담 연결하기</h3>
                            <p style={{ color: "rgba(255,255,255,0.62)", fontSize: "0.95rem", lineHeight: 1.6 }}>
                                정보를 남겨주시면 24시간 이내 연락드립니다.<br />분기 정원 5명으로 운영되어 자리가 제한됩니다.
                            </p>
                        </div>
                        <form onSubmit={handleFormSubmit}>
                            <div style={{ marginBottom: "14px" }}>
                                <label style={{ display: "block", marginBottom: "6px", color: "#d1d1d6", fontSize: "0.9rem", fontWeight: 700 }}>성함 또는 직함</label>
                                <input type="text" placeholder="예: 시선그룹 김대표" required value={formValues.name} onChange={(e) => setFormValues({ ...formValues, name: e.target.value })} style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#fff" }} />
                            </div>
                            <div style={{ marginBottom: "14px" }}>
                                <label style={{ display: "block", marginBottom: "6px", color: "#d1d1d6", fontSize: "0.9rem", fontWeight: 700 }}>연락처</label>
                                <input type="tel" placeholder="010-0000-0000" required value={formValues.phone} onChange={(e) => setFormValues({ ...formValues, phone: e.target.value })} style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#fff" }} />
                            </div>
                            <div style={{ marginBottom: "14px" }}>
                                <label style={{ display: "block", marginBottom: "6px", color: "#d1d1d6", fontSize: "0.9rem", fontWeight: 700 }}>이메일</label>
                                <input type="email" placeholder="example@email.com" required value={formValues.email} onChange={(e) => setFormValues({ ...formValues, email: e.target.value })} style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#fff" }} />
                            </div>
                            <div style={{ marginBottom: "18px" }}>
                                <label style={{ display: "block", marginBottom: "6px", color: "#d1d1d6", fontSize: "0.9rem", fontWeight: 700 }}>현재 가장 부담스러운 상황</label>
                                <textarea placeholder="예: 회식/모임에서 노래 요청이 들어오면 부담이 큽니다." value={formValues.notes} onChange={(e) => setFormValues({ ...formValues, notes: e.target.value })} style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#fff", minHeight: "110px", resize: "vertical" }} />
                            </div>
                            <button type="submit" disabled={isRedirecting} style={{ width: "100%", padding: "1rem", background: isRedirecting ? "#3a3a3c" : "#FE7502", color: isRedirecting ? "#8e8e93" : "#111", borderRadius: "14px", fontSize: "1.05rem", fontWeight: 900, border: "none", cursor: isRedirecting ? "wait" : "pointer" }}>
                                {isRedirecting ? "진단 페이지로 이동 중..." : "다음 단계로 이어가기"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @media (max-width: 768px) {
                    .reserve-page .container {
                        padding: 0 1.25rem !important;
                    }

                    .reserve-page .reserve-header {
                        padding: 0.9rem 0 !important;
                    }

                    .reserve-page .reserve-header__inner a {
                        font-size: 0.95rem !important;
                    }

                    .reserve-page .reserve-header__inner button {
                        font-size: 0.82rem !important;
                        padding: 0.7rem 1rem !important;
                    }

                    .reserve-page main > section:not(.reserve-hero) {
                        padding-top: 4rem !important;
                        padding-bottom: 4rem !important;
                    }

                    .reserve-page .reserve-hero {
                        min-height: auto !important;
                        padding-top: 6rem !important;
                        padding-bottom: 3.5rem !important;
                    }

                    .reserve-page .reserve-sec-head {
                        margin-bottom: 2.25rem !important;
                    }

                    .reserve-page .reserve-empathy-title {
                        margin-bottom: 2rem !important;
                    }

                    .reserve-page .reserve-empathy-grid {
                        gap: 1rem !important;
                    }

                    .reserve-page .reserve-tactile-card {
                        padding: 1.6rem !important;
                    }

                    .reserve-page .reserve-benefit-card,
                    .reserve-page .reserve-target-card {
                        padding: 1.6rem !important;
                        border-radius: 24px !important;
                    }

                    .reserve-page .reserve-benefit-card h3 {
                        margin-bottom: 1.5rem !important;
                    }

                    .reserve-page .reserve-pricing-card {
                        padding: 2rem 1.35rem !important;
                        border-radius: 32px !important;
                    }

                    .reserve-page .reserve-review-grid {
                        grid-template-columns: 1fr !important;
                        gap: 1rem !important;
                    }

                    .reserve-page .reserve-review-grid > div {
                        padding: 1.6rem !important;
                    }

                    .reserve-page .reserve-hero h1 {
                        font-size: clamp(2.35rem, 10vw, 3.2rem) !important;
                        line-height: 1.06 !important;
                    }

                    .reserve-page .reserve-hero p {
                        font-size: 1rem !important;
                    }

                    .reserve-page .reserve-two-col,
                    .reserve-page .grid-2,
                    .reserve-page .reserve-pricing-grid {
                        grid-template-columns: 1fr !important;
                        gap: 1.5rem !important;
                    }

                    .reserve-page .reserve-timeline {
                        max-width: 100% !important;
                        padding-left: 2.25rem;
                    }

                    .reserve-page .reserve-timeline-line {
                        left: 0.5rem !important;
                        transform: none !important;
                    }

                    .reserve-page .reserve-timeline-item {
                        justify-content: flex-start !important;
                        margin-bottom: 1.5rem !important;
                    }

                    .reserve-page .reserve-timeline-dot {
                        left: 0.5rem !important;
                        top: 1.25rem !important;
                        transform: translateX(-50%) !important;
                    }

                    .reserve-page .reserve-timeline-card {
                        width: 100% !important;
                        text-align: left !important;
                        padding: 1.5rem !important;
                        border-radius: 22px !important;
                    }

                    .reserve-page .reserve-stats-row {
                        display: grid !important;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 1rem !important;
                        margin-bottom: 2rem !important;
                    }

                    .reserve-page .reserve-sticky-cta {
                        width: calc(100% - 2rem) !important;
                        bottom: calc(1rem + env(safe-area-inset-bottom)) !important;
                    }

                    .reserve-page .reserve-modal-card {
                        padding: 1.4rem !important;
                        border-radius: 24px !important;
                    }
                }

                @media (max-width: 430px) {
                    .reserve-page section {
                        padding: 4.5rem 0 !important;
                    }

                    .reserve-page main > section:not(.reserve-hero) {
                        padding-top: 3.25rem !important;
                        padding-bottom: 3.25rem !important;
                    }

                    .reserve-page h2 {
                        font-size: clamp(2rem, 9vw, 2.7rem) !important;
                        line-height: 1.1 !important;
                    }

                    .reserve-page p {
                        line-height: 1.65 !important;
                    }

                    .reserve-page .reserve-stats-row {
                        grid-template-columns: 1fr !important;
                    }

                    .reserve-page .reserve-review-grid {
                        grid-template-columns: 1fr !important;
                    }

                    .reserve-page .reserve-pricing-grid > div,
                    .reserve-page .reserve-timeline-card,
                    .reserve-page .reserve-empathy-grid .reserve-tactile-card {
                        padding: 1.25rem !important;
                    }

                    .reserve-page .reserve-header__inner {
                        gap: 0.75rem !important;
                    }

                    .reserve-page .reserve-modal-shell {
                        align-items: flex-end !important;
                    }

                    .reserve-page .reserve-modal-card {
                        max-height: min(88vh, 760px) !important;
                        overflow-y: auto !important;
                        border-bottom-left-radius: 18px !important;
                        border-bottom-right-radius: 18px !important;
                    }
                }
            `}</style>
        </div>
    );
}
