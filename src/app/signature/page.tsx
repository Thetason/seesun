"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../../styles/styles.css";
import TrackComparison from "@/components/TrackComparison";
import { buildDiagnosisPath } from "@/lib/consultation-intake";
import { openKickoff } from "@/lib/kickoff";
import { KICKOFF_CTA_LABEL } from "@/lib/site";

export default function ProPage() {
    const router = useRouter();
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
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [activeOntology, setActiveOntology] = useState(0);
    const [formValues, setFormValues] = useState({
        name: "",
        email: "",
        phone: "",
        notes: ""
    });

    const openModal = () => openKickoff("signature");
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
                type: "Signature",
                name: formValues.name,
                email: formValues.email,
                phone: formValues.phone,
                notes: formValues.notes,
            })
        );
    };

    return (
        <div className="signature-page" style={{ minHeight: "100vh", position: "relative", overflow: "hidden", backgroundColor: "#050507", color: "#ffffff", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>

            {/* Navigation */}
            <header className="signature-header" style={{ position: "fixed", top: 0, left: 0, width: "100%", padding: "1.5rem 0", zIndex: 100, backdropFilter: "blur(20px)", background: "rgba(5,5,7,0.7)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="container signature-header__inner" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
                        <span style={{ fontWeight: 800, letterSpacing: "0.05em", color: "#fff", fontSize: "1.1rem" }}>SEE:SUN <span style={{ color: "#FE7502" }}>SIGNATURE</span></span>
                    </Link>
                    <button onClick={openModal} style={{ background: "#FE7502", color: "#000", fontSize: "0.85rem", fontWeight: 700, padding: "10px 20px", borderRadius: "30px", border: "none", cursor: "pointer" }}>
                        {KICKOFF_CTA_LABEL}
                    </button>
                </div>
            </header>

            <main>
                {/* 1. Hero Section */}
                <section className="signature-hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", paddingTop: "80px", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}>
                        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "radial-gradient(circle at center, rgba(5,5,7,0.45) 0%, rgba(5,5,7,0.9) 100%)", zIndex: 1 }} />
                        <Image
                            src="/images/signature/anatomy_bg.png"
                            alt="Inner core anatomy — the body as a vocal engine"
                            fill
                            priority
                            sizes="100vw"
                            style={{ objectFit: "cover", objectPosition: "center 28%", opacity: 0.55 }}
                        />
                    </div>

                    <div className="container" ref={heroContentRef} style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: "1000px" }}>
                        <span className="gsap-reveal" style={{ display: "inline-block", color: "#FE7502", fontWeight: 800, letterSpacing: "0.2em", fontSize: "0.85rem", marginBottom: "2rem" }}>DAP TRAINING + ADVANCED INTENSIVE</span>
                        <h1 className="gsap-reveal" style={{ fontSize: "clamp(3.5rem, 9vw, 6.5rem)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: "2.5rem" }}>
                            당신의 목소리에,<br />
                            <span style={{ color: "#FE7502" }}>몸이라는 엔진을.</span>
                        </h1>
                        <div className="gsap-reveal" style={{ maxWidth: "700px", margin: "0 auto" }}>
                            <p style={{ fontSize: "1.4rem", fontWeight: 500, color: "#e1e1e6", marginBottom: "1.5rem", lineHeight: 1.4 }}>
                                시그니처의 중심이 되는 <span style={{ color: "#FE7502", fontWeight: 800 }}>DAP(Diaphragm Automatic Program)</span> 트레이닝.
                            </p>
                            <p style={{ fontSize: "1.15rem", color: "#e1e1e6", lineHeight: 1.8, marginBottom: "1.5rem", fontWeight: 700 }}>
                                시그니처는 단순한 레슨 4회가 아닙니다. 클럽의 정식 멤버십입니다.
                            </p>
                            <p style={{ fontSize: "1.15rem", color: "#a1a1a6", lineHeight: 1.8, marginBottom: "3rem" }}>
                                주 1회, 코치와 몸을 다시 설계하고 — 매일, AI와 그 감각을 몸에 새기고 — 시즌이 오면, 크루로 지원할 자격이 열립니다.
                            </p>
                        </div>
                        <div className="gsap-reveal signature-hero-actions" style={{ display: "flex", justifyContent: "center", gap: "1.5rem" }}>
                            <button onClick={openModal} style={{ padding: "1.2rem 3rem", background: "#FE7502", color: "#000", borderRadius: "40px", fontWeight: 700, fontSize: "1.1rem", border: "none" }}>{KICKOFF_CTA_LABEL}</button>
                        </div>
                    </div>
                </section>

                {/* 2. Philosophy Section - 몸은 버티게 만드는 것이 아니라 */}
                <section style={{ padding: "10rem 0", background: "#f5f5f7", color: "#1d1d1f" }}>
                    <div className="container" style={{ maxWidth: "1000px", textAlign: "center" }}>
                        <h2 ref={addToRefs} style={{ fontSize: "clamp(2.5rem, 5vw, 3.8rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: "3rem", color: "#111", letterSpacing: "-0.03em" }}>
                            몸은 버티게 만드는 것이 아니라,<br /><span style={{ color: "#FE7502" }}>제대로 쓰이게</span> 만드는 것입니다.
                        </h2>
                        <div ref={addToRefs} style={{
                            position: "relative",
                            width: "100%",
                            maxWidth: "800px",
                            aspectRatio: "16/9",
                            margin: "0 auto 4rem",
                            borderRadius: "32px",
                            overflow: "hidden",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
                            background: "#000"
                        }}>
                            <video autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }}>
                                <source src="/videos/philosophy-bg.mp4" type="video/mp4" />
                            </video>
                            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", boxShadow: "inset 0 0 40px rgba(0,0,0,0.4)", pointerEvents: "none" }} />
                        </div>
                        <div ref={addToRefs} style={{ fontSize: "1.25rem", lineHeight: 1.8, color: "#424245", maxWidth: "700px", margin: "0 auto" }}>
                            <p>누군가는 같은 발성기법으로도 노래를 잘하게 되고, 누군가는 몇 개월, 몇 년째 제자리인 경우를 수도 없이 봤습니다.</p>
                            <p style={{ marginTop: "1.5rem" }}>저도 그런 사람 중 하나였습니다. 많은 연구 끝에 결국 <span style={{ color: "#FE7502", fontWeight: 800 }}>노래는 몸으로 하는 거고</span>, 그 <span style={{ color: "#FE7502", fontWeight: 800 }}>몸이 바뀌어 나가면 노래 자체가 바뀐다는 걸</span> 깨달았습니다.</p>
                        </div>
                    </div>
                </section>

                {/* 3. Problem Statement Section */}
                <section style={{ padding: "10rem 0", background: "#0a0a0c" }}>
                    <div className="container signature-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
                        <div ref={addToRefs}>
                            <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 3.8rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: "2rem", letterSpacing: "-0.03em" }}>
                                성대만 다룬다고<br />노래가 달라지지는 않습니다.
                            </h2>
                        </div>
                        <div ref={addToRefs} style={{ color: "#a1a1a6", fontSize: "1.2rem", lineHeight: 1.8 }}>
                            <p style={{ marginBottom: "2rem" }}>노래는 성대 하나로 해결되지 않습니다. 횡격막, 복횡근, 골반저근 — 이런 이너코어 근육들의 협응이 되어야 비로소 소리가 안정되고, 고음이 편해지고, 표현이 자유로워집니다.</p>
                            <p>해외 음성과학 연구에서는 전문 가수의 발성에서 횡격막과 흉곽의 정교한 협응이 성문하압과 음성 안정성 조절에 핵심적이라는 점이 보고되어 왔습니다. 대표적으로 독일 프라이부르크 대학교 연구진은 실시간 MRI를 통해 이 메커니즘을 시각적으로 보여주었습니다.</p>
                            <p style={{ marginTop: "2rem", color: "#FE7502", fontWeight: 700 }}>DAP는 이 이너코어를 집중적으로 깨워, 노래할 수 있는 몸부터 만들어드립니다.</p>
                        </div>
                    </div>
                </section>



                {/* 5. Summary & 6. Value Expansion - LIGHT BREAK CONTINUED */}
                <section style={{ padding: "8rem 0", background: "#f5f5f7", borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                    <div className="container grid-2 signature-summary-grid" style={{ gap: "4rem" }}>
                        <div ref={addToRefs} style={{ background: "#fff", padding: "4rem", borderRadius: "32px", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
                            <h3 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "1.5rem", color: "#FE7502" }}>분명히 다른 몸쓰임새</h3>
                            <p style={{ color: "#424245", lineHeight: 1.7 }}>노래를 정말 잘하는 사람들은 단지 성대 컨트롤이 좋은 것이 아닙니다. 압력을 다루는 감각, 표현을 연결하는 흐름이 다릅니다. 그 차이를 기술이 아닌 당신의 몸에 붙여드립니다.</p>
                        </div>
                        <div ref={addToRefs} style={{ background: "#fff", padding: "4rem", borderRadius: "32px", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
                            <h3 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "1.5rem", color: "#FE7502" }}>노래 밖에서도 남는 변화</h3>
                            <p style={{ color: "#424245", lineHeight: 1.7 }}>이 변화는 노래에만 머무르지 않습니다. 말할 때의 울림, 발표할 때의 전달력, 감정을 표현하는 방식까지. 목소리를 다루는 방식 자체를 바꾸는 일입니다.</p>
                        </div>
                    </div>
                </section>



                {/* 7. Interactive Curriculum (moved from home) */}
                <section style={{ padding: "8rem 2rem", background: "#050505", color: "#fff" }}>
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
                </section>

                {/* 8. Course Infrastructure - Bento Grid */}
                <section style={{ padding: "10rem 0", background: "#0a0a0c" }}>
                    <div className="container">
                        <div style={{ marginBottom: "5rem", textAlign: "center" }}>
                            <span style={{ color: "#FE7502", fontWeight: 800, letterSpacing: "0.2em", fontSize: "0.85rem", display: "block", marginBottom: "1rem" }}>COURSE INFRASTRUCTURE</span>
                            <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>변화를 완성하는 인프라</h2>
                        </div>

                        <style dangerouslySetInnerHTML={{
                            __html: `
                            .signature-bento-card {
                                background: rgba(255,255,255,0.02);
                                border-radius: 32px;
                                border: 1px solid rgba(255,255,255,0.06);
                                transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                                position: relative;
                                overflow: hidden;
                            }
                            .signature-bento-card:hover {
                                transform: translateY(-10px) scale(1.02);
                                border-color: rgba(254, 117, 2, 0.3);
                                box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(254, 117, 2,0.1);
                                background: rgba(255,255,255,0.04);
                            }
                            .signature-bento-card span { transition: color 0.3s ease; }
                            .signature-bento-card:hover span { color: #fff !important; }
                        ` }} />

                        <div className="signature-bento-grid" style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(12, 1fr)",
                            gridAutoRows: "minmax(280px, auto)",
                            gap: "1.5rem",
                        }}>
                            {/* Card 1: DAP Training (Large Feature — CORE DIFFERENTIATOR) */}
                            <div ref={addToRefs} className="signature-bento-card signature-bento-feature" style={{
                                gridColumn: "span 7",
                                gridRow: "span 2",
                                padding: "4rem",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "flex-end",
                                background: "linear-gradient(180deg, rgba(254, 117, 2,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                                border: "1px solid rgba(254, 117, 2,0.15)"
                            }}>
                                <Image
                                    src="/images/signature/dap-inner-core.png"
                                    alt="DAP Inner Core Activation"
                                    fill
                                    sizes="(max-width: 900px) 100vw, 58vw"
                                    style={{ objectFit: "cover", opacity: 0.25, zIndex: 0 }}
                                />
                                <div style={{ position: "relative", zIndex: 1 }}>
                                    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(254, 117, 2,0.15)", padding: "6px 16px", borderRadius: "30px", marginBottom: "1.5rem" }}>
                                        <span style={{ color: "#FE7502", fontWeight: 900, fontSize: "0.8rem", letterSpacing: "0.1em" }}>SIGNATURE ONLY</span>
                                    </div>
                                    <h4 style={{ fontSize: "2.2rem", fontWeight: 900, marginBottom: "1rem" }}>DAP 트레이닝</h4>
                                    <p style={{ color: "#FE7502", fontWeight: 700, fontSize: "1rem", marginBottom: "1rem" }}>Diaphragm Automatic Program — 호흡근과 이너코어를 깨워, 노래할 수 있는 몸을 만들어드립니다</p>
                                    <p style={{ color: "#86868b", fontSize: "1.1rem", lineHeight: 1.7 }}>
                                        호흡근과 이너코어를 먼저 깨운 후 발성 트레이닝에 들어가면, 노래가 정말 빨리 늡니다. 트레이닝을 받는 멤버분들이 가장 빠르게 체감하시는 부분이기도 합니다. DAP는 소리의 근본적 작동 원리를 몸으로 체화하는 SEE:SUN의 핵심 메소드입니다.
                                    </p>
                                </div>
                            </div>

                            {/* Card 2: Tone */}
                            <div ref={addToRefs} className="signature-bento-card signature-bento-card--half" style={{
                                gridColumn: "span 5",
                                padding: "3rem",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center"
                            }}>
                                <span style={{ color: "#FE7502", fontWeight: 800, fontSize: "1.1rem", display: "block", marginBottom: "1rem" }}>02</span>
                                <h4 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: "1rem" }}>보컬 톤 & 음색 디렉팅</h4>
                                <p style={{ color: "#86868b", fontSize: "1rem", lineHeight: 1.6 }}>당신 안에 이미 있는 가장 좋은 결을 찾아 더 선명하고 더 매력적인 톤으로 정교하게 다듬어갑니다.</p>
                            </div>

                            {/* Card 3: Directing */}
                            <div ref={addToRefs} className="signature-bento-card signature-bento-card--half" style={{
                                gridColumn: "span 5",
                                padding: "3rem",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center"
                            }}>
                                <span style={{ color: "#FE7502", fontWeight: 800, fontSize: "1.1rem", display: "block", marginBottom: "1rem" }}>03</span>
                                <h4 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: "1rem" }}>곡 적용 & 표현 연결</h4>
                                <p style={{ color: "#86868b", fontSize: "1rem", lineHeight: 1.6 }}>훈련한 몸과 소리를 실제 곡에 적용해 노래 안에서 전달력과 표현력이 자연스럽게 이어지도록 돕습니다.</p>
                            </div>

                            {/* Card 4: Recording & growth archive (full width) */}
                            <div ref={addToRefs} className="signature-bento-card signature-bento-wide" style={{
                                gridColumn: "span 12",
                                background: "linear-gradient(90deg, rgba(254, 117, 2,0.08) 0%, rgba(5,5,7,0.02) 100%)",
                                padding: "4rem",
                                border: "1px solid rgba(254, 117, 2,0.15)",
                                display: "flex",
                                alignItems: "center",
                                gap: "4rem"
                            }}>
                                <div style={{ flex: 1 }}>
                                    <span style={{ color: "#FE7502", fontWeight: 800, fontSize: "1.2rem", display: "block", marginBottom: "1rem" }}>04</span>
                                    <h4 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1.5rem" }}>성장기록 & 피드백 음원 제작</h4>
                                    <p style={{ color: "#86868b", fontSize: "1.1rem", lineHeight: 1.7 }}>변화는 감각으로만 남기지 않습니다. 코치가 직접 제작한 피드백 음원과 레코딩을 내 전용 페이지에 기록으로 남겨, 언제든 돌려보며 성장의 흐름을 확인할 수 있습니다.</p>
                                </div>
                                <div style={{ background: "rgba(0,0,0,0.3)", padding: "2.5rem", borderRadius: "24px", border: "1px solid rgba(254, 117, 2,0.15)", textAlign: "center", minWidth: "300px" }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "0.8rem" }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FE7502" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                                        <span style={{ color: "#FE7502", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.1em" }}>INCLUDED</span>
                                    </div>
                                    <h5 style={{ fontSize: "1.5rem", fontWeight: 900, marginBottom: "0.8rem" }}>OB1 — AI 보컬 코치</h5>
                                    <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>트레이닝 사이의 매일도 훈련이 이어지도록.<br />AI 무제한 분석 + 코치 피드백 1일 1회(영업일 기준).</p>
                                    <div style={{ marginTop: "1rem", padding: "8px 16px", background: "rgba(254, 117, 2,0.1)", borderRadius: "20px", display: "inline-block" }}>
                                        <span style={{ color: "#FE7502", fontSize: "0.85rem", fontWeight: 700 }}>마스터리 플랜(월 29,000원), 멤버에게는 기본입니다</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 9. Recommendations & 10. Changes */}
                <section style={{ padding: "10rem 0", background: "#050507" }}>
                    <div className="container">
                        <div className="signature-benefit-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", alignItems: "stretch" }}>
                            {/* Recommendations Card */}
                            <div ref={addToRefs} style={{
                                background: "rgba(255,255,255,0.02)",
                                padding: "4rem",
                                borderRadius: "40px",
                                border: "1px solid rgba(255,255,255,0.06)",
                                display: "flex",
                                flexDirection: "column"
                            }}>
                                <h2 style={{ fontSize: "2.2rem", fontWeight: 900, marginBottom: "3rem", letterSpacing: "-0.02em" }}>이런 분들에게 추천합니다</h2>
                                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                                    {[
                                        "성대만 조절하는 방식의 한계를 느끼고 있는 분",
                                        "노래할수록 몸이 더 힘들고 어려워지는 분",
                                        "잘하는 사람들의 몸쓰임새를 제대로 배우고 싶은 분",
                                        "내 음색과 표현을 더 자연스럽고 깊게 만들고 싶은 분",
                                        "노래뿐 아니라 말, 발표까지 바뀌는 변화를 원하는 분",
                                        "짧더라도 밀도 높은 집중 코칭이 필요한 분"
                                    ].map((item, i) => (
                                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "1.2rem", fontSize: "1.1rem", fontWeight: 600, color: "#e1e1e6" }}>
                                            <div style={{ minWidth: "24px", height: "24px", background: "rgba(254, 117, 2,0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px" }}>
                                                <div style={{ width: "8px", height: "8px", background: "#FE7502", borderRadius: "50%" }}></div>
                                            </div>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Changes Card */}
                            <div ref={addToRefs} style={{
                                background: "#fff",
                                color: "#000",
                                padding: "4rem",
                                borderRadius: "40px",
                                position: "relative",
                                overflow: "hidden",
                                boxShadow: "0 30px 60px rgba(0,0,0,0.4)"
                            }}>
                                <div style={{ position: "relative", zIndex: 1 }}>
                                    <h2 style={{ fontSize: "2.2rem", fontWeight: 900, marginBottom: "3rem", letterSpacing: "-0.02em" }}>당신이 가져가게 될 것</h2>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                                        {[
                                            { title: "본질적 피지컬", desc: "노래를 위한 몸 전체의 올바른 사용감과 압력 조절" },
                                            { title: "자유로운 표현", desc: "더 편안하고 자연스러운 고음과 내 목소리만의 기준" },
                                            { title: "무대 위 전달력", desc: "곡 안에서 실제로 살아나는 선명한 가사 전달과 감정" },
                                            { title: "확장된 목소리", desc: "말, 발표, 감정표현까지 이어지는 목소리의 근본적 재설계" }
                                        ].map((item, i) => (
                                            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "1.2rem" }}>
                                                <div style={{ fontSize: "1.5rem", color: "#FE7502", fontWeight: 900, marginTop: "-4px" }}>✓</div>
                                                <div>
                                                    <p style={{ fontWeight: 900, fontSize: "1.2rem", marginBottom: "0.2rem" }}>{item.title}</p>
                                                    <p style={{ color: "#52525b", fontSize: "0.95rem", fontWeight: 600 }}>{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ position: "absolute", bottom: "-30px", right: "-30px", fontSize: "10rem", fontWeight: 900, color: "rgba(254, 117, 2,0.05)", zIndex: 0, userSelect: "none" }}>S</div>
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

                        <style dangerouslySetInnerHTML={{
                            __html: `
                            @keyframes shimmer {
                                0% { transform: translateX(-100%); }
                                100% { transform: translateX(100%); }
                            }
                            .pricing-shimmer {
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
                                animation: shimmer 3s infinite;
                                pointer-events: none;
                            }
                            .pricing-card-hover {
                                transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                            }
                            .pricing-card-hover:hover {
                                transform: translateY(-15px) scale(1.01);
                                border-color: rgba(254, 117, 2, 0.4) !important;
                                box-shadow: 0 50px 120px -20px rgba(0,0,0,0.9), 0 0 60px rgba(254, 117, 2,0.1) !important;
                            }
                        ` }} />

                        <div ref={addToRefs} className="pricing-card-hover signature-pricing-card" style={{
                            background: "rgba(255,255,255,0.02)",
                            padding: "5rem",
                            borderRadius: "56px",
                            border: "1px solid rgba(254, 117, 2,0.15)",
                            backdropFilter: "blur(30px)",
                            boxShadow: "0 40px 100px -10px rgba(0,0,0,0.8), 0 0 80px rgba(254, 117, 2,0.05)",
                            position: "relative",
                            overflow: "hidden"
                        }}>
                            <div className="pricing-shimmer" />
                            <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(254, 117, 2,0.08) 0%, transparent 70%)", filter: "blur(60px)", zIndex: 0 }}></div>

                            <div style={{ position: "relative", zIndex: 1 }}>
                                <span style={{ display: "inline-block", background: "rgba(254, 117, 2,0.1)", color: "#FE7502", padding: "8px 24px", borderRadius: "30px", fontSize: "0.9rem", fontWeight: 800, marginBottom: "2.5rem" }}>SEE:SUN SIGNATURE MEMBERSHIP</span>
                                <h3 style={{ fontSize: "2.8rem", fontWeight: 900, marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>단순한 레슨 4회가 아닌,<br />클럽의 정식 멤버십</h3>
                                <div className="signature-pricing-intro" style={{ maxWidth: "760px", margin: "0 auto 3rem" }}>
                                    <p className="signature-pricing-kicker" style={{ color: "#fff", fontSize: "1rem", fontWeight: 800, marginBottom: "0.85rem", letterSpacing: "-0.02em" }}>
                                        50분 DAP + 보컬 트레이닝. 주 1회 1:1, 월 4회 멤버십.
                                    </p>
                                    <p className="signature-pricing-summary signature-pricing-summary--desktop" style={{ color: "#b7b7bd", fontSize: "1.08rem", lineHeight: 1.85, margin: 0 }}>
                                        시그니처의 중심이 되는 DAP(Diaphragm Automatic Program) 트레이닝과
                                        1:1 보컬 코칭을 50분 동안 집중적으로 진행합니다.
                                    </p>
                                    <p className="signature-pricing-summary signature-pricing-summary--mobile" style={{ color: "#b7b7bd", fontSize: "1rem", lineHeight: 1.75, margin: 0, display: "none" }}>
                                        시그니처의 중심 DAP 트레이닝 + 1:1 보컬 코칭. 주 1회 50분, 월 4회.
                                    </p>
                                </div>

                                {/* Phase 1: Core product pricing */}
                                <div style={{ margin: "3.5rem 0 2rem" }}>
                                    <div style={{ fontSize: "5rem", fontWeight: 900, color: "#fff", lineHeight: 1 }}>
                                        480,000 <span style={{ fontSize: "1.8rem", color: "#a1a1a6", fontWeight: 700 }}>KRW / 월</span>
                                    </div>
                                    <div className="signature-pricing-subcopy signature-pricing-subcopy--desktop" style={{ fontSize: "1.05rem", color: "#a1a1a6", fontWeight: 600, marginTop: "1rem" }}>
                                        월 480,000원 (VAT 포함) · 3개월 정기결제 시 월 460,000원
                                    </div>
                                    <div className="signature-pricing-subcopy signature-pricing-subcopy--mobile" style={{ display: "none", marginTop: "1rem" }}>
                                        <div style={{ fontSize: "0.98rem", color: "#a1a1a6", fontWeight: 600 }}>월 480,000원 (VAT 포함)<br />3개월 정기결제 시 월 460,000원</div>
                                    </div>
                                </div>

                                {/* Phase 2: Full membership composition */}
                                <div style={{ margin: "3rem 0", textAlign: "center" }}>
                                    <div style={{ display: "inline-block", width: "40px", height: "1px", background: "rgba(255,255,255,0.15)", marginBottom: "2rem" }} />
                                    <p style={{ color: "#FE7502", fontSize: "1.3rem", fontWeight: 900, marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
                                        주 1회의 트레이닝이 전부가 아닙니다.
                                    </p>
                                    <p style={{ color: "#86868b", fontSize: "1rem", lineHeight: 1.7 }}>
                                        시그니처 멤버십에는 아래 구성이 전부 포함되어 있습니다.
                                    </p>
                                </div>

                                <div style={{ background: "rgba(254, 117, 2,0.04)", borderRadius: "24px", border: "1px solid rgba(254, 117, 2,0.12)", padding: "2.5rem", marginBottom: "1.5rem" }}>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                                        {[
                                            { name: "주 1회 50분 1:1 트레이닝", detail: "월 4회", emoji: "🎤" },
                                            { name: "OB1 마스터리", detail: "월 29,000원 플랜 · 분석 무제한", emoji: "⚡" },
                                            { name: "코치 피드백", detail: "1일 1회 (영업일 기준)", emoji: "💬" },
                                            { name: "녹음+믹싱", detail: "분기 1곡", emoji: "🎧" },
                                            { name: "아티스트웨이 크루 지원 자격", detail: "시그니처 멤버 전용", emoji: "🎫" },
                                            { name: "성장 아카이브", detail: "모든 기록 보관", emoji: "📁" },
                                        ].map((item, i) => (
                                            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 0", borderBottom: i === 5 ? "none" : "1px solid rgba(254, 117, 2,0.08)" }}>
                                                <span style={{ color: "#fff", fontSize: "1rem", fontWeight: 700, textAlign: "left" }}>
                                                    <span style={{ marginRight: "0.6rem" }}>{item.emoji}</span>
                                                    {item.name}
                                                </span>
                                                <span style={{ color: "#FE7502", fontSize: "1rem", fontWeight: 800, whiteSpace: "nowrap", marginLeft: "1rem" }}>{item.detail}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.08)", padding: "2.5rem", marginBottom: "1.5rem" }}>
                                    <p style={{ color: "#FE7502", fontSize: "0.85rem", fontWeight: 800, letterSpacing: "0.15em", marginBottom: "0.8rem" }}>VALUE</p>
                                    <h4 style={{ color: "#fff", fontSize: "1.5rem", fontWeight: 900, marginBottom: "1.8rem", letterSpacing: "-0.02em", wordBreak: "keep-all" }}>따로 모으면, 월 650,000원이 넘습니다.</h4>
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        {[
                                            { name: "1:1 트레이닝 주 1회 50분 (월 4회)", market: "전문 코치 시세 월 320,000~480,000원" },
                                            { name: "OB1 마스터리", market: "앱 정가 월 29,000원" },
                                            { name: "코치 피드백 1일 1회(영업일 기준)", market: "피드백 멤버십 단품 월 200,000원" },
                                            { name: "녹음+믹싱 분기 1곡", market: "스튜디오 시세 월 환산 100,000~160,000원" },
                                        ].map((row, i) => (
                                            <div key={i} style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "baseline", gap: "0.3rem 1rem", padding: "0.9rem 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                                <span style={{ color: "#d1d1d6", fontSize: "0.95rem", fontWeight: 600, textAlign: "left" }}>{row.name}</span>
                                                <span style={{ color: "#a1a1a6", fontSize: "0.92rem", fontWeight: 600, marginLeft: "auto" }}>{row.market}</span>
                                            </div>
                                        ))}
                                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "baseline", gap: "0.3rem 1rem", padding: "1.2rem 0 0.4rem" }}>
                                            <span style={{ color: "#fff", fontSize: "1.02rem", fontWeight: 800 }}>따로 모으면</span>
                                            <span style={{ color: "#fff", fontSize: "1.02rem", fontWeight: 800, marginLeft: "auto" }}>월 649,000~869,000원</span>
                                        </div>
                                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "baseline", gap: "0.3rem 1rem", padding: "0.4rem 0" }}>
                                            <span style={{ color: "#FE7502", fontSize: "1.1rem", fontWeight: 900 }}>시그니처는</span>
                                            <span style={{ color: "#FE7502", fontSize: "1.1rem", fontWeight: 900, marginLeft: "auto" }}>월 480,000원 (VAT 포함)</span>
                                        </div>
                                    </div>
                                    <p style={{ color: "#86868b", fontSize: "0.9rem", lineHeight: 1.7, marginTop: "1.4rem", wordBreak: "keep-all" }}>
                                        아티스트웨이 크루 지원 자격과 성장 아카이브는 이 표에 없습니다. 가격이 없기 때문입니다 — 멤버에게만 열립니다.
                                    </p>
                                    <p style={{ color: "#5f5f66", fontSize: "0.78rem", marginTop: "0.6rem" }}>* 시세는 분당·수도권 전문 보컬 코치·스튜디오 기준 범위입니다.</p>
                                </div>

                                <div style={{ textAlign: "center", padding: "1.5rem 0 3rem" }}>
                                    <p style={{ color: "#FE7502", fontSize: "1.4rem", fontWeight: 900 }}>아티스트웨이 크루 지원 자격은<br />시그니처 멤버에게만 열립니다.</p>
                                    <p style={{ color: "#86868b", fontSize: "0.95rem", marginTop: "0.8rem", lineHeight: 1.7 }}>크루는 결제로 가입하는 팀이 아닙니다. 지원하고, 선발됩니다.<br />그 문이 시그니처에서 열립니다.</p>
                                </div>

                                <div className="signature-pricing-badges" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.8rem", marginBottom: "3rem" }}>
                                    <span className="signature-pricing-badge" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0.6rem 1rem", borderRadius: "999px", border: "1px solid rgba(254, 117, 2,0.22)", background: "rgba(254, 117, 2,0.08)", color: "#FFB347", fontSize: "0.88rem", fontWeight: 800 }}>DAP 트레이닝 월 4회</span>
                                    <span className="signature-pricing-badge" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0.6rem 1rem", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "#f6f6f7", fontSize: "0.88rem", fontWeight: 700 }}>OB1 무제한 분석</span>
                                    <span className="signature-pricing-badge" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0.6rem 1rem", borderRadius: "999px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)", color: "#f6f6f7", fontSize: "0.88rem", fontWeight: 700 }}>녹음+믹싱 분기 1곡</span>
                                    <span className="signature-pricing-badge" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0.6rem 1rem", borderRadius: "999px", border: "1px solid rgba(254, 117, 2,0.22)", background: "rgba(254, 117, 2,0.08)", color: "#FFB347", fontSize: "0.88rem", fontWeight: 800 }}>크루 지원 자격</span>
                                </div>

                                <button onClick={openModal} style={{ width: "100%", padding: "1.8rem", background: "#FE7502", color: "#000", borderRadius: "24px", fontSize: "1.3rem", fontWeight: 900, cursor: "pointer", border: "none", boxShadow: "0 15px 30px rgba(254, 117, 2,0.2)", transition: "all 0.3s ease" }}>{KICKOFF_CTA_LABEL}</button>
                                <p style={{ marginTop: "1.5rem", color: "#52525b", fontSize: "0.85rem", fontWeight: 600 }}>
                                    * 책임 있는 트레이닝을 위해 정원을 제한해 운영합니다. · <Link href="/refund" style={{ color: "#86868b", textDecoration: "underline" }}>환불 규정</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Track Comparison */}
                <TrackComparison currentTrack="Signature" />

                {/* 13. Final Persuasion & 14. Last CTA */}
                <section style={{ padding: "12rem 0", background: "linear-gradient(to bottom, #0a0a0c, #050507)", textAlign: "center" }}>
                    <div className="container" style={{ maxWidth: "900px" }}>
                        <div ref={addToRefs}>
                            <h2 style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: "3rem", letterSpacing: "-0.04em" }}>
                                당신의 목소리를<br /><span style={{ color: "#FE7502" }}>더 본질적인 방향으로.</span>
                            </h2>
                            <p style={{ fontSize: "1.3rem", color: "#a1a1a6", lineHeight: 1.8, maxWidth: "700px", margin: "0 auto 4rem" }}>
                                정확한 코칭과 올바른 몸의 사용법은 당신의 목소리를 더 자유롭고 더 오래 남는 방식으로 바꿔놓을 수 있습니다.
                            </p>
                        </div>

                        <div ref={addToRefs}>
                            <button onClick={openModal} style={{ padding: "1.5rem 5rem", background: "#FE7502", color: "#000", borderRadius: "50px", fontWeight: 800, fontSize: "1.3rem", border: "none" }}>
                                {KICKOFF_CTA_LABEL}
                            </button>
                            <p style={{ marginTop: "2rem", color: "#52525b", fontSize: "0.95rem", fontWeight: 600 }}>책임 있는 트레이닝을 위해 정원을 제한해 운영합니다.</p>
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
                    <div>
                        <h3 style={{ fontSize: "1.8rem", marginBottom: "10px", textAlign: "center", fontWeight: 800 }}>시그니처 상담 연결</h3>
                        <p style={{ textAlign: "center", color: "#86868b", marginBottom: "35px", lineHeight: 1.6 }}>
                            기본 정보를 남겨주시면 다음 단계에서 진단 체크를 이어서 작성할 수 있습니다.
                        </p>
                        <form onSubmit={handleFormSubmit}>
                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", marginBottom: "8px", color: "#fff", fontSize: "0.9rem", fontWeight: 700 }}>성함</label>
                                <input 
                                    type="text" 
                                    placeholder="홍길동" 
                                    required 
                                    value={formValues.name}
                                    onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                                    style={{ width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid #333", background: "#1a1a1a", color: "#fff" }} 
                                />
                            </div>
                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", marginBottom: "8px", color: "#fff", fontSize: "0.9rem", fontWeight: 700 }}>연락처</label>
                                <input 
                                    type="tel" 
                                    placeholder="010-0000-0000" 
                                    required 
                                    value={formValues.phone}
                                    onChange={(e) => setFormValues({ ...formValues, phone: e.target.value })}
                                    style={{ width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid #333", background: "#1a1a1a", color: "#fff" }} 
                                />
                            </div>
                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", marginBottom: "8px", color: "#fff", fontSize: "0.9rem", fontWeight: 700 }}>이메일</label>
                                <input 
                                    type="email" 
                                    placeholder="example@email.com" 
                                    required 
                                    value={formValues.email}
                                    onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                                    style={{ width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid #333", background: "#1a1a1a", color: "#fff" }} 
                                />
                            </div>
                            <div style={{ marginBottom: "30px" }}>
                                <label style={{ display: "block", marginBottom: "8px", color: "#fff", fontSize: "0.9rem", fontWeight: 700 }}>현재 가장 큰 보컬 고민</label>
                                <textarea 
                                    placeholder="예: 고음에서의 압력 부족, 음색 불안정 등" 
                                    value={formValues.notes}
                                    onChange={(e) => setFormValues({ ...formValues, notes: e.target.value })}
                                    style={{ width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid #333", background: "#1a1a1a", color: "#fff", height: "100px", resize: "none" }}
                                ></textarea>
                            </div>
                            <button 
                                type="submit" 
                                disabled={isRedirecting}
                                style={{ 
                                    width: "100%", 
                                    padding: "1.2rem", 
                                    background: isRedirecting ? "#333" : "#FE7502", 
                                    color: isRedirecting ? "#666" : "#000", 
                                    borderRadius: "16px", 
                                    fontSize: "1.1rem", 
                                    fontWeight: 800, 
                                    border: "none",
                                    cursor: isRedirecting ? "wait" : "pointer"
                                }}
                            >
                                {isRedirecting ? "진단 페이지로 이동 중..." : "다음 단계로 이어가기"}
                            </button>
                        </form>
                    </div>
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
            <style jsx global>{`
                .signature-page .signature-pricing-intro {
                    text-wrap: balance;
                }

                .signature-page .signature-pricing-summary,
                .signature-page .signature-pricing-subcopy {
                    text-wrap: pretty;
                }

                .signature-page .signature-pricing-summary--mobile,
                .signature-page .signature-pricing-subcopy--mobile {
                    display: none;
                }

                .signature-page .signature-pricing-badge {
                    backdrop-filter: blur(16px);
                    box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
                }

                @media (max-width: 1024px) {
                    .signature-page .signature-bento-grid {
                        grid-template-columns: 1fr 1fr !important;
                    }

                    .signature-page .signature-bento-feature,
                    .signature-page .signature-bento-wide {
                        grid-column: span 2 !important;
                    }
                }

                @media (max-width: 768px) {
                    .signature-page .container {
                        padding: 0 1.25rem !important;
                    }

                    .signature-page .signature-header {
                        padding: 0.9rem 0 !important;
                    }

                    .signature-page .signature-header__inner span {
                        font-size: 0.92rem !important;
                    }

                    .signature-page .signature-header__inner button {
                        font-size: 0.82rem !important;
                        padding: 0.7rem 1rem !important;
                    }

                    .signature-page .signature-hero {
                        min-height: auto !important;
                        padding-top: 6.5rem !important;
                        padding-bottom: 4.25rem !important;
                    }

                    .signature-page .signature-hero h1 {
                        font-size: clamp(2.5rem, 11vw, 3.5rem) !important;
                        line-height: 1.04 !important;
                    }

                    .signature-page .signature-hero p {
                        font-size: 1rem !important;
                    }

                    .signature-page .signature-hero-actions {
                        flex-direction: column !important;
                        width: min(100%, 340px);
                        margin-left: auto;
                        margin-right: auto;
                    }

                    .signature-page .signature-hero-actions > button {
                        width: 100%;
                    }

                    .signature-page .signature-two-col,
                    .signature-page .signature-summary-grid,
                    .signature-page .signature-benefit-grid,
                    .signature-page .signature-pricing-grid {
                        grid-template-columns: 1fr !important;
                        gap: 1.5rem !important;
                    }

                    .signature-page .signature-bento-grid {
                        grid-template-columns: 1fr !important;
                        gap: 1rem !important;
                    }

                    .signature-page .signature-bento-feature,
                    .signature-page .signature-bento-card--half,
                    .signature-page .signature-bento-wide {
                        grid-column: span 1 !important;
                        grid-row: auto !important;
                        padding: 1.5rem !important;
                    }

                    .signature-page .signature-bento-wide {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                        gap: 1.5rem !important;
                    }

                    .signature-page .signature-bento-wide > div:last-child {
                        min-width: 0 !important;
                        width: 100% !important;
                    }

                    .signature-page .signature-pricing-card {
                        padding: 2rem 1.35rem !important;
                        border-radius: 32px !important;
                    }

                    .signature-page .signature-pricing-intro {
                        margin-bottom: 2.25rem !important;
                    }

                    .signature-page .signature-pricing-kicker {
                        font-size: 0.95rem !important;
                        margin-bottom: 0.65rem !important;
                    }

                    .signature-page .signature-pricing-summary--desktop,
                    .signature-page .signature-pricing-subcopy--desktop {
                        display: none !important;
                    }

                    .signature-page .signature-pricing-summary--mobile,
                    .signature-page .signature-pricing-subcopy--mobile {
                        display: block !important;
                    }

                    .signature-page .signature-pricing-summary {
                        font-size: 0.98rem !important;
                        line-height: 1.7 !important;
                    }

                    .signature-page .signature-pricing-badges {
                        gap: 0.6rem !important;
                    }

                    .signature-page .signature-pricing-badge {
                        font-size: 0.76rem !important;
                        padding: 0.52rem 0.85rem !important;
                    }

                    .signature-page .signature-pricing-card [style*="font-size: 5rem"] {
                        font-size: 3.2rem !important;
                    }
                }

                @media (max-width: 430px) {
                    .signature-page section {
                        padding: 4.5rem 0 !important;
                    }

                    .signature-page .signature-hero {
                        padding-top: 6rem !important;
                    }

                    .signature-page .signature-hero h1,
                    .signature-page h2 {
                        font-size: clamp(2rem, 9vw, 2.8rem) !important;
                    }

                    .signature-page h3 {
                        line-height: 1.15 !important;
                    }

                    .signature-page p {
                        line-height: 1.65 !important;
                    }

                    .signature-page .signature-bento-feature,
                    .signature-page .signature-bento-card--half,
                    .signature-page .signature-bento-wide,
                    .signature-page .signature-pricing-card,
                    .signature-page .modal-overlay > div {
                        padding: 1.25rem !important;
                        border-radius: 24px !important;
                    }

                    .signature-page .signature-bento-wide h4,
                    .signature-page .signature-pricing-card h3 {
                        font-size: 1.5rem !important;
                    }

                    .signature-page .signature-pricing-grid {
                        padding: 0 !important;
                    }

                    .signature-page .signature-pricing-intro {
                        margin-bottom: 2rem !important;
                    }

                    .signature-page .signature-pricing-badges {
                        justify-content: center !important;
                    }

                    .signature-page .signature-pricing-badge {
                        width: fit-content !important;
                    }
                }
            `}</style>
        </div>
    );
}
