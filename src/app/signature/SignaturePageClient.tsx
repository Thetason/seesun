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
import { reviewsForService } from "@/lib/content/reviews";
import { SIGNATURE_FAQ } from "./faq";
import { SiteFooter, SiteHeader } from "@/components/site/SiteChrome";

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

        // Light page body (2026-11 palette)
        document.body.style.backgroundColor = "#ffffff";
        document.body.style.color = "#22221a";

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
        <div className="signature-page" style={{ minHeight: "100vh", position: "relative", overflow: "hidden", backgroundColor: "var(--sun-white)", color: "var(--sun-ink)", fontFamily: "var(--font-family)", wordBreak: "keep-all" }}>

            {/* Navigation */}
            <SiteHeader />

            <main>
                {/* 1. Hero Section */}
                <section className="signature-hero" style={{ minHeight: "calc(100vh - 67px)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", paddingTop: "24px", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}>
                        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "radial-gradient(circle at center, var(--sun-tint) 0%, var(--sun-tint) 100%)", zIndex: 1 }} />
                        <Image
                            src="/images/coach/seo-youngbin-amp.jpg"
                            alt="1:1 레슨을 직접 진행하는 서영빈(세타쓴) 원장"
                            fill
                            priority
                            sizes="100vw"
                            style={{ objectFit: "cover", objectPosition: "center 30%", opacity: 0.5 }}
                        />
                    </div>

                    <div className="container" ref={heroContentRef} style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: "1000px" }}>
                        <h1 className="gsap-reveal" style={{ display: "block", color: "var(--sun-khaki-deep)", fontWeight: 800, letterSpacing: "0.12em", fontSize: "0.85rem", lineHeight: 1.4, margin: "0 0 2rem" }}>분당 1:1 보컬레슨 · 주 1회 50분</h1>
                        <p className="gsap-reveal signature-hero-headline" style={{ fontSize: "clamp(3rem, 7.5vw, 5.6rem)", fontWeight: 800, lineHeight: 1.12, letterSpacing: "-0.04em", marginBottom: "2.5rem", wordBreak: "keep-all" }}>
                            혼자 부르면 돌아오는 소리,<br />
                            <span style={{ color: "var(--sun-khaki-deep)" }}>매주 같이 잡아요.</span>
                        </p>
                        <div className="gsap-reveal" style={{ maxWidth: "700px", margin: "0 auto" }}>
                            <p style={{ fontSize: "1.4rem", fontWeight: 500, color: "var(--sun-ink)", marginBottom: "1.5rem", lineHeight: 1.4 }}>
                                주 1회 50분, 저와 1:1로 <span style={{ color: "var(--sun-khaki-deep)", fontWeight: 800 }}>깊은 발음으로 소리를 잡고, 노래하고, 녹음까지</span> 해 보는 레슨이에요.
                            </p>
                            <p style={{ fontSize: "1.15rem", color: "var(--sun-ink)", lineHeight: 1.8, marginBottom: "1.5rem", fontWeight: 700 }}>
                                영상에서 보신 그 방법을, 목이 조이고 고음이 막히는 이유부터 찾아서 제가 직접 잡아 드려요.
                            </p>
                            <p style={{ fontSize: "1.15rem", color: "var(--sun-muted)", lineHeight: 1.8, marginBottom: "3rem" }}>
                                레슨이 없는 날에는 OB1 앱과 코치 피드백(영업일 하루 1회)이 연습을 이어 주고, 원하시면 시즌마다 아티스트웨이 크루에도 지원할 수 있어요.
                            </p>
                        </div>
                        <div className="gsap-reveal signature-hero-actions" style={{ display: "flex", justifyContent: "center", gap: "1.5rem" }}>
                            <button onClick={openModal} style={{ padding: "1.2rem 3rem", background: "var(--sun-orange)", color: "var(--sun-ink)", borderRadius: "40px", fontWeight: 700, fontSize: "1.1rem", border: "none" }}>{KICKOFF_CTA_LABEL}</button>
                        </div>
                        <p className="gsap-reveal" style={{ marginTop: "1.2rem", fontSize: "0.95rem", fontWeight: 700, color: "var(--sun-khaki-deep)" }}>
                            ✓ 첫 레슨에서 달라지지 않으면 남은 3회분은 전액 환불해 드려요.
                        </p>
                    </div>
                </section>

                {/* 2. Philosophy Section - 몸은 버티게 만드는 것이 아니라 */}
                <section style={{ padding: "10rem 0", background: "var(--sun-tint)", color: "var(--sun-ink)" }}>
                    <div className="container" style={{ maxWidth: "1000px", textAlign: "center" }}>
                        <h2 ref={addToRefs} style={{ fontSize: "clamp(2.5rem, 5vw, 3.8rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: "3rem", color: "var(--sun-ink)", letterSpacing: "-0.03em" }}>
                            고음은 잘 당기고,<br /><span style={{ color: "var(--sun-khaki-deep)" }}>깊은 발음으로 넣으면</span> 따라와요.
                        </h2>
                        <div ref={addToRefs} style={{
                            position: "relative",
                            width: "100%",
                            maxWidth: "800px",
                            aspectRatio: "16/9",
                            margin: "0 auto 4rem",
                            borderRadius: "32px",
                            overflow: "hidden",
                            boxShadow: "0 20px 60px var(--sun-tint)",
                            background: "var(--sun-white)"
                        }}>
                            <Image
                                src="/images/coach/seo-youngbin-og-mic.jpg"
                                alt="마이크 앞에서 시범을 보이는 서영빈(세타쓴) 원장"
                                fill
                                sizes="(max-width: 840px) 100vw, 800px"
                                style={{ objectFit: "cover" }}
                            />
                            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", boxShadow: "inset 0 0 40px var(--sun-tint)", pointerEvents: "none" }} />
                        </div>
                        <div ref={addToRefs} style={{ fontSize: "1.25rem", lineHeight: 1.8, color: "var(--sun-muted)", maxWidth: "700px", margin: "0 auto" }}>
                            <p>같은 방법으로 배워도 누군가는 금방 늘고, 누군가는 몇 년째 그 자리에 있어요. 저도 오래 그 자리에 있었어요.</p>
                            <p style={{ marginTop: "1.5rem" }}>노래방만 가면 마음 졸이고, 고음에서 목부터 잠기던 시간이 길었어요. 그러다 <span style={{ color: "var(--sun-khaki-deep)", fontWeight: 800 }}>깊은 발음으로 소리를 넣는 법</span>을 알고 나서야, 연습실에서 되던 소리가 노래에서도 나기 시작했어요.</p>
                            <p style={{ marginTop: "1.5rem" }}>그래서 막혀 있는 마음을 알아요. 그 소리가 내 노래에서 들릴 때까지 같이 갈게요.</p>
                        </div>
                    </div>
                </section>

                {/* 3. Problem Statement Section */}
                <section style={{ padding: "10rem 0", background: "var(--sun-white)" }}>
                    <div className="container signature-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
                        <div ref={addToRefs}>
                            <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 3.8rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: "2rem", letterSpacing: "-0.03em" }}>
                                스케일은 되는데,<br />노래만 부르면 무너지나요?
                            </h2>
                        </div>
                        <div ref={addToRefs} style={{ color: "var(--sun-muted)", fontSize: "1.2rem", lineHeight: 1.8 }}>
                            <p style={{ marginBottom: "2rem" }}>발성 연습과 노래가 따로 놀아서 그래요. 그래서 레슨 한 번 안에서 소리를 잡고, 그 소리로 바로 곡을 불러요.</p>
                            <p>제가 배운 할리우드 SLS와 유럽 벨칸토는 결국 같은 곳을 가리켜요. 목을 누르지 않고, 깊은 발음으로 소리가 설 자리를 만드는 거예요.</p>
                            <p style={{ marginTop: "2rem", color: "var(--sun-khaki-deep)", fontWeight: 700 }}>그래서 50분은 깊은 발음으로 시작해서, 노래로 이어지고, 녹음으로 끝나요.</p>
                        </div>
                    </div>
                </section>



                {/* 5. Summary & 6. Value Expansion - LIGHT BREAK CONTINUED */}
                <section style={{ padding: "8rem 0", background: "var(--sun-tint)", borderTop: "1px solid var(--sun-line)" }}>
                    <div className="container grid-2 signature-summary-grid" style={{ gap: "4rem" }}>
                        <div ref={addToRefs} style={{ background: "var(--sun-white)", padding: "4rem", borderRadius: "32px", border: "1px solid var(--sun-line)", boxShadow: "0 10px 30px var(--sun-tint)" }}>
                            <h3 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "1.5rem", color: "var(--sun-khaki-deep)" }}>음악적으로 들리는 소리</h3>
                            <p style={{ color: "var(--sun-muted)", lineHeight: 1.7 }}>고음이 “나는” 것과 노래로 “들리는” 것은 달라요. 음이 올라가는 데서 멈추지 않고, 노래로 들리는 내 소리까지 같이 다듬어요.</p>
                        </div>
                        <div ref={addToRefs} style={{ background: "var(--sun-white)", padding: "4rem", borderRadius: "32px", border: "1px solid var(--sun-line)", boxShadow: "0 10px 30px var(--sun-tint)" }}>
                            <h3 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "1.5rem", color: "var(--sun-khaki-deep)" }}>노래 밖에서도 남는 변화</h3>
                            <p style={{ color: "var(--sun-muted)", lineHeight: 1.7 }}>소리를 쓰는 방법이 바뀌면, 말할 때의 울림과 발표할 때의 전달력에도 이어져요.</p>
                        </div>
                    </div>
                </section>



                {/* 7. Interactive Curriculum (moved from home) */}
                <section className="signature-curriculum" style={{ padding: "8rem 2rem", background: "var(--sun-tint)", color: "var(--sun-ink)" }}>
                    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                        <div className="signature-sec-head" style={{ textAlign: "center", marginBottom: "4rem" }} ref={addToRefs}>
                            <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 700, letterSpacing: 0, marginTop: "0.5rem" }}>
                                레슨은 이 네 단계로 가요.
                            </h2>
                            <p style={{ color: "var(--sun-muted)", fontSize: "clamp(1rem, 1.5vw, 1.25rem)", fontWeight: 600, marginTop: "1rem" }}>
                                50분 안에서 앞의 세 단계를 하고, 한 달마다 첫 녹음과 나란히 들어 봐요.
                            </p>
                        </div>

                        <div className="home-curriculum-layout" style={{ display: "flex", flexWrap: "wrap", gap: "2rem", minHeight: "600px" }}>
                            {/* Left: Interactive Buttons */}
                            <div className="home-curriculum-menu" style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "0.5rem", padding: "2rem 0" }}>
                                {[
                                    {
                                        id: 0,
                                        short: "01 깊은 발음",
                                        title: "Deep Vowel",
                                        desc: "목으로 밀어 올리던 습관을 내려놓고, 혀를 뒤로·위로 보내 소리를 깊게 넣어요. 고음이 지나갈 길이 여기서 생겨요."
                                    },
                                    {
                                        id: 1,
                                        short: "02 노래",
                                        title: "Song",
                                        desc: "잡은 소리로 바로 노래해요. 스케일만 하다 끝나는 날은 없고, 가사와 감정이 실린 곡에서도 같은 소리가 날 때까지 불러요."
                                    },
                                    {
                                        id: 2,
                                        short: "03 녹음",
                                        title: "Record",
                                        desc: "레슨 끝에 한 곡을 녹음해서 오늘의 소리를 남겨 둬요. 다음 레슨은 그 파일을 같이 듣는 데서 시작해요."
                                    },
                                    {
                                        id: 3,
                                        short: "04 다시 듣기",
                                        title: "Archive",
                                        desc: "한 달이 지나면 첫 녹음과 나란히 들어 봐요. 얼마나 왔고 어디가 남았는지 귀로 들려서, 다음 한 달을 같이 정할 수 있어요."
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
                                                    background: isActive ? "var(--sun-tint)" : "transparent",
                                                    border: isActive ? "1px solid var(--sun-line)" : "1px solid transparent",
                                                    color: "var(--sun-ink)", cursor: "pointer", transition: "all 0.3s ease",
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
                                                        background: "var(--sun-white)",
                                                        backdropFilter: "blur(10px)",
                                                        padding: "1.5rem", borderRadius: "20px",
                                                        border: "1px solid var(--sun-line)",
                                                        color: "var(--sun-muted)", fontSize: "0.95rem", lineHeight: 1.6
                                                    }}
                                                >
                                                    <strong style={{ display: "block", color: "var(--sun-ink)", marginBottom: "8px", fontSize: "1.05rem" }}>{item.title}</strong>
                                                    {item.desc}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Right: Abstract Dynamic Visual Area */}
                            <div className="home-curriculum-visual" style={{ flex: "1 1 500px", position: "relative", borderRadius: "30px", background: "var(--sun-white)", overflow: "hidden", border: "1px solid var(--sun-line)", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }}>

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
                                        <Image src="/images/coach/seo-youngbin-mic.jpg" alt="깊은 발음으로 소리를 세우는 시범" fill sizes="(max-width: 768px) 100vw, 500px" style={{ objectFit: "cover", objectPosition: "center 30%" }} />
                                    )}
                                    {activeOntology === 1 && (
                                        <Image src="/images/coach/seo-youngbin-guitar.jpg" alt="잡은 소리로 바로 노래하는 장면" fill sizes="(max-width: 768px) 100vw, 500px" style={{ objectFit: "cover", objectPosition: "center 40%" }} />
                                    )}
                                    {activeOntology === 2 && (
                                        <Image src="/images/coach/seo-youngbin-amp.jpg" alt="1:1 레슨을 진행하는 서영빈(세타쓴) 원장" fill sizes="(max-width: 768px) 100vw, 500px" style={{ objectFit: "cover", objectPosition: "center 30%" }} />
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
                <section style={{ padding: "10rem 0", background: "var(--sun-white)" }}>
                    <div className="container">
                        <div className="signature-sec-head" style={{ marginBottom: "5rem", textAlign: "center" }}>
                            <span style={{ color: "var(--sun-khaki-deep)", fontWeight: 800, letterSpacing: "0.2em", fontSize: "0.85rem", display: "block", marginBottom: "1rem" }}>COURSE INFRASTRUCTURE</span>
                            <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.02em" }}>레슨 하나에 들어 있는 것들</h2>
                        </div>

                        <style dangerouslySetInnerHTML={{
                            __html: `
                            .signature-bento-card {
                                background: rgba(244, 244, 236, 0.6);
                                border-radius: 32px;
                                border: 1px solid var(--sun-line);
                                transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                                position: relative;
                                overflow: hidden;
                            }
                            .signature-bento-card:hover {
                                transform: translateY(-10px) scale(1.02);
                                border-color: rgba(118, 118, 72, 0.35);
                                box-shadow: 0 20px 40px var(--sun-tint), 0 0 20px rgba(118, 118, 72, 0.08);
                                background: var(--sun-tint);
                            }
                            .signature-bento-card span { transition: color 0.3s ease; }
                            .signature-bento-card:hover span { color: var(--sun-ink) !important; }
                        ` }} />

                        <div className="signature-bento-grid" style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(12, 1fr)",
                            gridAutoRows: "minmax(280px, auto)",
                            gap: "1.5rem",
                        }}>
                            {/* Card 1: Lesson that ends in a recording (core differentiator) */}
                            <div ref={addToRefs} className="signature-bento-card signature-bento-feature" style={{
                                gridColumn: "span 7",
                                gridRow: "span 2",
                                padding: "4rem",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "flex-end",
                                background: "linear-gradient(180deg, rgba(118, 118, 72, 0.048) 0%, rgba(244, 244, 236, 0.6) 100%)",
                                border: "1px solid rgba(118, 118, 72, 0.35)"
                            }}>
                                <Image
                                    src="/images/coach/seo-youngbin-og-mic.jpg"
                                    alt="마이크 앞에서 노래하는 서영빈(세타쓴) 원장"
                                    fill
                                    sizes="(max-width: 900px) 100vw, 58vw"
                                    style={{ objectFit: "cover", opacity: 0.25, zIndex: 0 }}
                                />
                                <div style={{ position: "relative", zIndex: 1 }}>
                                    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(118, 118, 72, 0.12)", padding: "6px 16px", borderRadius: "30px", marginBottom: "1.5rem" }}>
                                        <span style={{ color: "var(--sun-khaki-deep)", fontWeight: 900, fontSize: "0.8rem", letterSpacing: "0.1em" }}>1:1 레슨에서만</span>
                                    </div>
                                    <h4 style={{ fontSize: "2.2rem", fontWeight: 900, marginBottom: "1rem" }}>녹음으로 끝나는 레슨</h4>
                                    <p style={{ color: "var(--sun-khaki-deep)", fontWeight: 700, fontSize: "1rem", marginBottom: "1rem" }}>깊은 발음에서 시작해, 노래로 이어지고, 녹음으로 끝나는 50분</p>
                                    <p style={{ color: "var(--sun-muted)", fontSize: "1.1rem", lineHeight: 1.7 }}>
                                        레슨실에서는 되는데 혼자 부르면 돌아오는 소리, 그 차이를 알아차리게 해 주는 게 녹음이에요. 잘 불렀는지 매기려는 녹음이 아니라서 부담 없이 남기시면 되고, 쌓인 파일로 내 목소리가 어디까지 왔는지 직접 듣게 돼요.
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
                                <span style={{ color: "var(--sun-khaki-deep)", fontWeight: 800, fontSize: "1.1rem", display: "block", marginBottom: "1rem" }}>02</span>
                                <h4 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: "1rem" }}>보컬 톤 & 음색 디렉팅</h4>
                                <p style={{ color: "var(--sun-muted)", fontSize: "1rem", lineHeight: 1.6 }}>내 목소리에서 가장 좋은 결을 찾아서, 그 결이 노래 전체에 들리도록 다듬어요.</p>
                            </div>

                            {/* Card 3: Directing */}
                            <div ref={addToRefs} className="signature-bento-card signature-bento-card--half" style={{
                                gridColumn: "span 5",
                                padding: "3rem",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center"
                            }}>
                                <span style={{ color: "var(--sun-khaki-deep)", fontWeight: 800, fontSize: "1.1rem", display: "block", marginBottom: "1rem" }}>03</span>
                                <h4 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: "1rem" }}>곡 적용 & 표현 연결</h4>
                                <p style={{ color: "var(--sun-muted)", fontSize: "1rem", lineHeight: 1.6 }}>연습한 소리를 실제로 부르고 싶은 곡에 넣어서, 가사가 또렷하게 들리고 감정이 실리게 해요.</p>
                            </div>

                            {/* Card 4: Recording & growth archive (full width) */}
                            <div ref={addToRefs} className="signature-bento-card signature-bento-wide" style={{
                                gridColumn: "span 12",
                                background: "linear-gradient(90deg, rgba(118, 118, 72, 0.064) 0%, rgba(244, 244, 236, 0.6) 100%)",
                                padding: "4rem",
                                border: "1px solid rgba(118, 118, 72, 0.35)",
                                display: "flex",
                                alignItems: "center",
                                gap: "4rem"
                            }}>
                                <div style={{ flex: 1 }}>
                                    <span style={{ color: "var(--sun-khaki-deep)", fontWeight: 800, fontSize: "1.2rem", display: "block", marginBottom: "1rem" }}>04</span>
                                    <h4 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1.5rem" }}>성장기록 & 피드백 음원 제작</h4>
                                    <p style={{ color: "var(--sun-muted)", fontSize: "1.1rem", lineHeight: 1.7 }}>느낌으로만 남기지 않으려고, 제가 직접 만든 피드백 음원과 녹음을 회원 페이지에 쌓아 둬요. 언제든 다시 들으며 얼마나 왔는지 확인할 수 있어요.</p>
                                </div>
                                <div style={{ background: "var(--sun-tint)", padding: "2.5rem", borderRadius: "24px", border: "1px solid rgba(118, 118, 72, 0.35)", textAlign: "center", minWidth: "300px" }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "0.8rem" }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FE7502" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                                        <span style={{ color: "var(--sun-khaki-deep)", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.1em" }}>INCLUDED</span>
                                    </div>
                                    <h5 style={{ fontSize: "1.5rem", fontWeight: 900, marginBottom: "0.8rem" }}>OB1 — AI 보컬 코치</h5>
                                    <p style={{ fontSize: "0.9rem", color: "var(--sun-muted)", lineHeight: 1.6 }}>트레이닝 사이의 매일도 훈련이 이어지도록.<br />AI 무제한 분석 + 코치 피드백 1일 1회(영업일 기준).</p>
                                    <div style={{ marginTop: "1rem", padding: "8px 16px", background: "rgba(118, 118, 72, 0.08)", borderRadius: "20px", display: "inline-block" }}>
                                        <span style={{ color: "var(--sun-khaki-deep)", fontSize: "0.85rem", fontWeight: 700 }}>마스터리 플랜(월 29,000원), 멤버에게는 기본입니다</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 9. Recommendations & 10. Changes */}
                <section style={{ padding: "10rem 0", background: "var(--sun-white)" }}>
                    <div className="container">
                        <div className="signature-benefit-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", alignItems: "stretch" }}>
                            {/* Recommendations Card */}
                            <div ref={addToRefs} style={{
                                background: "rgba(244, 244, 236, 0.6)",
                                padding: "4rem",
                                borderRadius: "40px",
                                border: "1px solid var(--sun-line)",
                                display: "flex",
                                flexDirection: "column"
                            }}>
                                <h2 style={{ fontSize: "2.2rem", fontWeight: 900, marginBottom: "3rem", letterSpacing: "-0.02em" }}>이런 분들에게 추천합니다</h2>
                                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                                    {[
                                        "발성 연습은 되는데 노래만 하면 무너지는 분",
                                        "고음에서 목으로 밀어 올리는 습관을 끊고 싶은 분",
                                        "내 노래가 실제로 어떻게 들리는지 확인하며 배우고 싶은 분",
                                        "내 음색과 표현을 더 자연스럽고 깊게 만들고 싶은 분",
                                        "노래뿐 아니라 말, 발표까지 바뀌는 변화를 원하는 분",
                                        "짧더라도 밀도 높은 집중 코칭이 필요한 분"
                                    ].map((item, i) => (
                                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "1.2rem", fontSize: "1.1rem", fontWeight: 600, color: "var(--sun-ink)" }}>
                                            <div style={{ minWidth: "24px", height: "24px", background: "rgba(118, 118, 72, 0.12)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px" }}>
                                                <div style={{ width: "8px", height: "8px", background: "var(--sun-orange)", borderRadius: "50%" }}></div>
                                            </div>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Changes Card */}
                            <div ref={addToRefs} style={{
                                background: "var(--sun-white)",
                                color: "var(--sun-ink)",
                                padding: "4rem",
                                borderRadius: "40px",
                                position: "relative",
                                overflow: "hidden",
                                boxShadow: "0 30px 60px var(--sun-tint)"
                            }}>
                                <div style={{ position: "relative", zIndex: 1 }}>
                                    <h2 style={{ fontSize: "2.2rem", fontWeight: 900, marginBottom: "3rem", letterSpacing: "-0.02em" }}>레슨을 이어 가면 생기는 것</h2>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                                        {[
                                            { title: "목을 누르지 않는 소리", desc: "깊은 발음으로 세운, 고음에서도 무너지지 않는 소리" },
                                            { title: "자유로운 표현", desc: "더 편안하고 자연스러운 고음과 내 목소리만의 기준" },
                                            { title: "무대 위 전달력", desc: "곡 안에서 실제로 살아나는 선명한 가사 전달과 감정" },
                                            { title: "확장된 목소리", desc: "노래 밖에서 말하고 발표할 때까지 이어지는 소리" }
                                        ].map((item, i) => (
                                            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "1.2rem" }}>
                                                <div style={{ fontSize: "1.5rem", color: "var(--sun-khaki-deep)", fontWeight: 900, marginTop: "-4px" }}>✓</div>
                                                <div>
                                                    <p style={{ fontWeight: 900, fontSize: "1.2rem", marginBottom: "0.2rem" }}>{item.title}</p>
                                                    <p style={{ color: "#52525b", fontSize: "0.95rem", fontWeight: 600 }}>{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ position: "absolute", bottom: "-30px", right: "-30px", fontSize: "10rem", fontWeight: 900, color: "var(--sun-khaki-deep)", zIndex: 0, userSelect: "none" }}>S</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Proof: real student reviews */}
                <section style={{ padding: "8rem 0", background: "var(--sun-white)" }}>
                    <div className="container" style={{ maxWidth: "800px" }}>
                        <h2 ref={addToRefs} style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800, marginBottom: "1rem", textAlign: "center", wordBreak: "keep-all" }}>먼저 받아 본 분들의 이야기</h2>
                        <p style={{ color: "var(--sun-muted)", textAlign: "center", marginBottom: "3rem", wordBreak: "keep-all" }}>Re:cord에 수강생이 직접 남긴 후기를 그대로 옮겼어요.</p>
                        <div style={{ display: "grid", gap: "1rem" }}>
                            {reviewsForService("/signature").map((review) => (
                                <article key={`${review.author}-${review.date}`} style={{ background: "var(--sun-tint)", border: "1px solid var(--sun-line)", borderRadius: "24px", padding: "2rem", textAlign: "left" }}>
                                    <p style={{ color: "var(--sun-khaki-deep)", fontSize: "0.8rem", fontWeight: 800, letterSpacing: "0.1em", marginBottom: "0.8rem" }}>{review.topic}</p>
                                    <p style={{ color: "var(--sun-ink)", fontSize: "1rem", lineHeight: 1.8, whiteSpace: "pre-line", wordBreak: "keep-all" }}>{review.body}</p>
                                    <p style={{ color: "#6f6f76", fontSize: "0.85rem", marginTop: "1rem" }}>{review.author} · {review.date}</p>
                                </article>
                            ))}
                        </div>
                        <p style={{ textAlign: "center", marginTop: "2rem" }}>
                            <Link href="/reviews" style={{ color: "var(--sun-khaki-deep)", fontWeight: 700, textDecoration: "underline", textUnderlineOffset: "4px" }}>수강생 후기 전체 보기</Link>
                        </p>
                    </div>
                </section>

                {/* Who teaches */}
                <section style={{ padding: "8rem 0", background: "var(--sun-white)" }}>
                    <div className="container signature-two-col" style={{ maxWidth: "1000px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
                        <div style={{ position: "relative", width: "100%", aspectRatio: "2 / 3", borderRadius: "24px", overflow: "hidden" }}>
                            <Image src="/images/coach/seo-youngbin-portrait.jpg" alt="1:1 레슨을 직접 가르치는 서영빈(세타쓴) 원장" fill sizes="(max-width: 900px) 100vw, 480px" style={{ objectFit: "cover" }} />
                        </div>
                        <div style={{ textAlign: "left" }}>
                            <p style={{ color: "var(--sun-khaki-deep)", fontSize: "0.85rem", fontWeight: 800, letterSpacing: "0.15em", marginBottom: "1rem" }}>WHO TEACHES</p>
                            <h2 ref={addToRefs} style={{ fontSize: "clamp(2rem, 4vw, 2.6rem)", fontWeight: 800, lineHeight: 1.2, marginBottom: "1.5rem", wordBreak: "keep-all" }}>모든 레슨은<br />제가 직접 해요</h2>
                            <p style={{ color: "#d1d1d6", fontSize: "1.05rem", lineHeight: 1.8, marginBottom: "1rem", wordBreak: "keep-all" }}>유튜브 세타쓴 채널의 서영빈이에요. 성악과 실용음악을 공부했고, 벨칸토와 SLS의 원리로 가르쳐요.</p>
                            <p style={{ color: "var(--sun-muted)", fontSize: "1.05rem", lineHeight: 1.8, marginBottom: "2rem", wordBreak: "keep-all" }}>상담 때 들은 소리를 수업에서도 같은 사람이 계속 들으니까, 작은 변화도 놓치지 않고 다음으로 이어 갈 수 있어요.</p>
                            <Link href="/coach" style={{ color: "var(--sun-ink)", fontWeight: 700, textDecoration: "underline", textUnderlineOffset: "4px" }}>원장 소개 · 경력 보기</Link>
                        </div>
                    </div>
                </section>

                {/* 11. Pricing & 12. Product Block */}
                <section style={{ padding: "10rem 0", textAlign: "center", background: "var(--sun-white)" }}>
                    <div className="container" style={{ maxWidth: "800px" }}>
                        <h2 ref={addToRefs} style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "2rem" }}>한 번 몸에 붙으면 오래 가요.</h2>
                        <p ref={addToRefs} className="signature-pricing-lead" style={{ fontSize: "1.25rem", lineHeight: 1.8, color: "var(--sun-muted)", marginBottom: "5rem" }}>
                            깊은 발음으로 소리를 넣는 감각은 한 번 몸에 붙으면, 다른 노래를 부를 때도 그대로 따라와요.
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
                                    rgba(118, 118, 72, 0.04),
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
                                border-color: rgba(118, 118, 72, 0.35) !important;
                                box-shadow: 0 50px 120px -20px var(--sun-tint), 0 0 60px rgba(118, 118, 72, 0.08) !important;
                            }
                        ` }} />

                        <div ref={addToRefs} className="pricing-card-hover signature-pricing-card" style={{
                            background: "rgba(244, 244, 236, 0.6)",
                            padding: "5rem",
                            borderRadius: "56px",
                            border: "1px solid rgba(118, 118, 72, 0.35)",
                            backdropFilter: "blur(30px)",
                            boxShadow: "0 40px 100px -10px var(--sun-tint), 0 0 80px rgba(118, 118, 72, 0.04)",
                            position: "relative",
                            overflow: "hidden"
                        }}>
                            <div className="pricing-shimmer" />
                            <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(118, 118, 72, 0.064) 0%, transparent 70%)", filter: "blur(60px)", zIndex: 0 }}></div>

                            <div style={{ position: "relative", zIndex: 1 }}>
                                <span style={{ display: "inline-block", background: "rgba(118, 118, 72, 0.08)", color: "var(--sun-khaki-deep)", padding: "8px 24px", borderRadius: "30px", fontSize: "0.9rem", fontWeight: 800, marginBottom: "2.5rem" }}>시선뮤직 1:1 레슨</span>
                                <h3 style={{ fontSize: "2.8rem", fontWeight: 900, marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>1:1 레슨<br />주 1회 50분</h3>
                                <div className="signature-pricing-intro" style={{ maxWidth: "760px", margin: "0 auto 3rem" }}>
                                    <p className="signature-pricing-kicker" style={{ color: "var(--sun-ink)", fontSize: "1rem", fontWeight: 800, marginBottom: "0.85rem", letterSpacing: "-0.02em" }}>
                                        매주 한 번, 50분 동안 저와 1:1로 만나요. 한 달에 네 번이에요.
                                    </p>
                                    <p className="signature-pricing-summary signature-pricing-summary--desktop" style={{ color: "#b7b7bd", fontSize: "1.08rem", lineHeight: 1.85, margin: 0 }}>
                                        깊은 발음으로 소리를 세우고, 그 소리로 노래하고,
                                        녹음으로 확인하는 50분을 원장과 1:1로 진행합니다.
                                    </p>
                                    <p className="signature-pricing-summary signature-pricing-summary--mobile" style={{ color: "#b7b7bd", fontSize: "1rem", lineHeight: 1.75, margin: 0, display: "none" }}>
                                        깊은 발음 · 노래 · 녹음, 원장과 1:1. 주 1회 50분, 월 4회.
                                    </p>
                                </div>

                                {/* Phase 1: Core product pricing */}
                                <div style={{ margin: "3.5rem 0 2rem" }}>
                                    <div style={{ fontSize: "5rem", fontWeight: 900, color: "var(--sun-ink)", lineHeight: 1 }}>
                                        440,000 <span style={{ fontSize: "1.8rem", color: "var(--sun-muted)", fontWeight: 700 }}>KRW / 월</span>
                                    </div>
                                    <div className="signature-pricing-subcopy signature-pricing-subcopy--desktop" style={{ fontSize: "1.05rem", color: "var(--sun-muted)", fontWeight: 600, marginTop: "1rem" }}>
                                        월 440,000원 (VAT 포함) · 3개월 정기결제 시 월 420,000원
                                    </div>
                                    <div className="signature-pricing-subcopy signature-pricing-subcopy--mobile" style={{ display: "none", marginTop: "1rem" }}>
                                        <div style={{ fontSize: "0.98rem", color: "var(--sun-muted)", fontWeight: 600 }}>월 440,000원 (VAT 포함)<br />3개월 정기결제 시 월 420,000원</div>
                                    </div>
                                </div>

                                <div style={{ margin: "0 auto 2.5rem", maxWidth: "560px", textAlign: "center" }}>
                                    <p style={{ color: "#d1d1d6", fontSize: "1rem", fontWeight: 700, lineHeight: 1.7, wordBreak: "keep-all" }}>
                                        첫 레슨을 받아 보고 정하셔도 돼요.
                                    </p>
                                    <p style={{ color: "var(--sun-muted)", fontSize: "0.95rem", fontWeight: 500, lineHeight: 1.7, marginTop: "0.4rem", wordBreak: "keep-all" }}>
                                        첫 레슨에서 소리가 달라지는 걸 느끼지 못하시면, 남은 3회분은 전액 환불해 드려요.
                                    </p>
                                    <p style={{ color: "#6f6f76", fontSize: "0.88rem", fontWeight: 500, lineHeight: 1.7, marginTop: "1.2rem", wordBreak: "keep-all" }}>
                                        레슨은 매주 같은 시간을 정해 두고 해요. 이번 달에 시작할 수 있는 시간은 상담 때 알려 드려요.<br />
                                        결제하시면 그 주에 첫 레슨 날짜를 잡고, 녹음이 쌓일 회원 페이지가 열려요.
                                    </p>
                                </div>

                                {/* Phase 2: Full membership composition */}
                                <div style={{ margin: "3rem 0", textAlign: "center" }}>
                                    <div style={{ display: "inline-block", width: "40px", height: "1px", background: "var(--sun-tint)", marginBottom: "2rem" }} />
                                    <p style={{ color: "var(--sun-khaki-deep)", fontSize: "1.3rem", fontWeight: 900, marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
                                        주 1회 레슨에 이것까지 들어 있어요.
                                    </p>
                                    <p style={{ color: "var(--sun-muted)", fontSize: "1rem", lineHeight: 1.7 }}>
                                        월 440,000원 안에 아래 구성이 다 포함돼요.
                                    </p>
                                </div>

                                <div className="signature-pricing-box" style={{ background: "rgba(118, 118, 72, 0.032)", borderRadius: "24px", border: "1px solid rgba(118, 118, 72, 0.35)", padding: "2.5rem", marginBottom: "1.5rem" }}>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                                        {[
                                            { name: "주 1회 50분 1:1 트레이닝", detail: "월 4회" },
                                            { name: "OB1 마스터리", detail: "월 29,000원 플랜 · 분석 무제한" },
                                            { name: "코치 피드백", detail: "1일 1회 (영업일 기준)" },
                                            { name: "녹음+믹싱", detail: "분기 1곡" },
                                            { name: "아티스트웨이 크루 지원 자격", detail: "1:1 레슨 회원" },
                                            { name: "성장 아카이브", detail: "모든 기록 보관" },
                                        ].map((item, i) => (
                                            <div key={i} className="signature-included-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 0", borderBottom: i === 5 ? "none" : "1px solid rgba(118, 118, 72, 0.35)" }}>
                                                <span style={{ color: "var(--sun-ink)", fontSize: "1rem", fontWeight: 700, textAlign: "left" }}>
                                                    {item.name}
                                                </span>
                                                <span style={{ color: "var(--sun-khaki-deep)", fontSize: "1rem", fontWeight: 800, whiteSpace: "nowrap", marginLeft: "1rem" }}>{item.detail}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="signature-pricing-box" style={{ background: "rgba(244, 244, 236, 0.6)", borderRadius: "24px", border: "1px solid var(--sun-line)", padding: "2.5rem", marginBottom: "1.5rem" }}>
                                    <p style={{ color: "var(--sun-khaki-deep)", fontSize: "0.85rem", fontWeight: 800, letterSpacing: "0.15em", marginBottom: "0.8rem" }}>VALUE</p>
                                    <h4 style={{ color: "var(--sun-ink)", fontSize: "1.5rem", fontWeight: 900, marginBottom: "1.8rem", letterSpacing: "-0.02em", wordBreak: "keep-all" }}>따로 받으면 월 650,000원이 넘어요.</h4>
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        {[
                                            { name: "1:1 트레이닝 주 1회 50분 (월 4회)", market: "전문 코치 시세 월 320,000~480,000원" },
                                            { name: "OB1 마스터리", market: "앱 정가 월 29,000원" },
                                            { name: "코치 피드백 1일 1회(영업일 기준)", market: "피드백 멤버십 단품 월 200,000원" },
                                            { name: "녹음+믹싱 분기 1곡", market: "스튜디오 시세 월 환산 100,000~160,000원" },
                                        ].map((row, i) => (
                                            <div key={i} className="signature-value-row" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "baseline", gap: "0.3rem 1rem", padding: "0.9rem 0", borderBottom: "1px solid var(--sun-line)" }}>
                                                <span style={{ color: "#d1d1d6", fontSize: "0.95rem", fontWeight: 600, textAlign: "left" }}>{row.name}</span>
                                                <span style={{ color: "var(--sun-muted)", fontSize: "0.92rem", fontWeight: 600, marginLeft: "auto" }}>{row.market}</span>
                                            </div>
                                        ))}
                                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "baseline", gap: "0.3rem 1rem", padding: "1.2rem 0 0.4rem" }}>
                                            <span style={{ color: "var(--sun-ink)", fontSize: "1.02rem", fontWeight: 800 }}>따로 모으면</span>
                                            <span style={{ color: "var(--sun-ink)", fontSize: "1.02rem", fontWeight: 800, marginLeft: "auto" }}>월 649,000~869,000원</span>
                                        </div>
                                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "baseline", gap: "0.3rem 1rem", padding: "0.4rem 0" }}>
                                            <span style={{ color: "var(--sun-khaki-deep)", fontSize: "1.1rem", fontWeight: 900 }}>1:1 레슨은</span>
                                            <span style={{ color: "var(--sun-khaki-deep)", fontSize: "1.1rem", fontWeight: 900, marginLeft: "auto" }}>월 440,000원 (VAT 포함)</span>
                                        </div>
                                    </div>
                                    <p style={{ color: "var(--sun-muted)", fontSize: "0.9rem", lineHeight: 1.7, marginTop: "1.4rem", wordBreak: "keep-all" }}>
                                        크루 지원 자격과 회원 페이지는 따로 팔지 않아서 이 표에는 넣지 않았어요.
                                    </p>
                                    <p style={{ color: "#5f5f66", fontSize: "0.78rem", marginTop: "0.6rem" }}>* 시세는 분당·수도권 전문 보컬 코치·스튜디오 기준 범위입니다.</p>
                                </div>

                                <div style={{ textAlign: "center", padding: "1.5rem 0 3rem" }}>
                                    <p style={{ color: "var(--sun-khaki-deep)", fontSize: "1.4rem", fontWeight: 900 }}>아티스트웨이 크루에는<br />1:1 레슨 회원이 지원할 수 있어요.</p>
                                    <p style={{ color: "var(--sun-muted)", fontSize: "0.95rem", marginTop: "0.8rem", lineHeight: 1.7 }}>크루는 결제만으로 들어오는 모임이 아니라서, 지원서를 받고 함께할 분을 정해요.<br /><br />『아티스트웨이』 책 한 권으로 12주를 같이 걷고, 매일 아침 모닝 페이지를 쓰고, 러닝·요가·미식·영화 같은 아티스트 데이트를 함께해요.<br />크루 활동비는 레슨비에 월 40,000원이 더해져요.</p>
                                </div>

                                <div className="signature-pricing-badges" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.8rem", marginBottom: "3rem" }}>
                                    <span className="signature-pricing-badge" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0.6rem 1rem", borderRadius: "999px", border: "1px solid rgba(118, 118, 72, 0.35)", background: "rgba(118, 118, 72, 0.064)", color: "#FFB347", fontSize: "0.88rem", fontWeight: 800 }}>1:1 트레이닝 월 4회</span>
                                    <span className="signature-pricing-badge" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0.6rem 1rem", borderRadius: "999px", border: "1px solid var(--sun-line)", background: "var(--sun-tint)", color: "#f6f6f7", fontSize: "0.88rem", fontWeight: 700 }}>OB1 무제한 분석</span>
                                    <span className="signature-pricing-badge" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0.6rem 1rem", borderRadius: "999px", border: "1px solid var(--sun-line)", background: "var(--sun-tint)", color: "#f6f6f7", fontSize: "0.88rem", fontWeight: 700 }}>녹음+믹싱 분기 1곡</span>
                                    <span className="signature-pricing-badge" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0.6rem 1rem", borderRadius: "999px", border: "1px solid rgba(118, 118, 72, 0.35)", background: "rgba(118, 118, 72, 0.064)", color: "#FFB347", fontSize: "0.88rem", fontWeight: 800 }}>크루 지원 자격</span>
                                </div>

                                <button onClick={openModal} style={{ width: "100%", padding: "1.8rem", background: "var(--sun-orange)", color: "var(--sun-ink)", borderRadius: "24px", fontSize: "1.3rem", fontWeight: 900, cursor: "pointer", border: "none", boxShadow: "0 15px 30px rgba(118, 118, 72, 0.14)", transition: "all 0.3s ease" }}>{KICKOFF_CTA_LABEL}</button>
                                <p style={{ marginTop: "1.5rem", color: "#52525b", fontSize: "0.85rem", fontWeight: 600 }}>
                                    * 모든 레슨을 제가 직접 하기 때문에 받을 수 있는 인원이 정해져 있어요. · <Link href="/refund" style={{ color: "var(--sun-muted)", textDecoration: "underline" }}>환불 규정</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Track Comparison */}
                <TrackComparison currentTrack="signature" />

                {/* FAQ */}
                <section style={{ padding: "8rem 0", background: "var(--sun-white)" }}>
                    <div className="container" style={{ maxWidth: "800px" }}>
                        <h2 ref={addToRefs} style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 800, marginBottom: "3rem", textAlign: "center" }}>자주 묻는 질문</h2>
                        {SIGNATURE_FAQ.map((item) => (
                            <details key={item.q} style={{ borderBottom: "1px solid var(--sun-line)", padding: "1.4rem 0" }}>
                                <summary style={{ cursor: "pointer", color: "var(--sun-ink)", fontSize: "1.1rem", fontWeight: 700, wordBreak: "keep-all" }}>{item.q}</summary>
                                <p style={{ color: "var(--sun-muted)", fontSize: "1rem", lineHeight: 1.8, marginTop: "1rem", wordBreak: "keep-all" }}>{item.a}</p>
                            </details>
                        ))}
                    </div>
                </section>

                {/* 13. Final Persuasion & 14. Last CTA */}
                <section style={{ padding: "12rem 0", background: "linear-gradient(to bottom, var(--sun-white), var(--sun-white))", textAlign: "center" }}>
                    <div className="container" style={{ maxWidth: "900px" }}>
                        <div ref={addToRefs}>
                            <h2 style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: "3rem", letterSpacing: "-0.04em" }}>
                                “네가 원래 이렇게<br /><span style={{ color: "var(--sun-khaki-deep)" }}>노래를 잘했었나?”</span>
                            </h2>
                            <p style={{ fontSize: "1.3rem", color: "var(--sun-muted)", lineHeight: 1.8, maxWidth: "700px", margin: "0 auto 4rem" }}>
                                그 말을 듣는 날까지 매주 같이 갈게요. 먼저 30분 무료 상담에서 지금 소리를 들려주세요.
                            </p>
                        </div>

                        <div ref={addToRefs}>
                            <button onClick={openModal} style={{ padding: "1.5rem 5rem", background: "var(--sun-orange)", color: "var(--sun-ink)", borderRadius: "50px", fontWeight: 800, fontSize: "1.3rem", border: "none" }}>
                                {KICKOFF_CTA_LABEL}
                            </button>
                            <p style={{ marginTop: "2rem", color: "#52525b", fontSize: "0.95rem", fontWeight: 600 }}>모든 레슨을 제가 직접 하기 때문에 받을 수 있는 인원이 정해져 있어요.</p>
                        </div>
                    </div>
                </section>
            </main>
            <SiteFooter />

            {/* Modal - Unified Style */}
            <div className={`modal-overlay ${modalActive ? 'active' : ''}`} style={{
                background: "var(--sun-tint)",
                position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                backdropFilter: "blur(15px)", zIndex: 1000,
                display: modalActive ? "flex" : "none",
                justifyContent: "center", alignItems: "center",
                opacity: modalActive ? 1 : 0, transition: "opacity 0.3s ease"
            }}>
                <div style={{ width: "95%", maxWidth: "500px", background: "var(--sun-white)", borderRadius: "32px", padding: "40px", position: "relative", border: "1px solid var(--sun-line)" }}>
                    <button onClick={closeModal} style={{ color: "var(--sun-ink)", position: "absolute", top: "25px", right: "25px", background: "none", border: "none", fontSize: "2rem", cursor: "pointer", opacity: 0.5 }}>&times;</button>
                    <div>
                        <h3 style={{ fontSize: "1.8rem", marginBottom: "10px", textAlign: "center", fontWeight: 800 }}>1:1 레슨 상담 연결</h3>
                        <p style={{ textAlign: "center", color: "var(--sun-muted)", marginBottom: "35px", lineHeight: 1.6 }}>
                            기본 정보를 남겨주시면 다음 단계에서 진단 체크를 이어서 작성할 수 있습니다.
                        </p>
                        <form onSubmit={handleFormSubmit}>
                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", marginBottom: "8px", color: "var(--sun-ink)", fontSize: "0.9rem", fontWeight: 700 }}>성함</label>
                                <input 
                                    type="text" 
                                    placeholder="홍길동" 
                                    required 
                                    value={formValues.name}
                                    onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                                    style={{ width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid var(--sun-line)", background: "var(--sun-white)", color: "var(--sun-ink)" }} 
                                />
                            </div>
                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", marginBottom: "8px", color: "var(--sun-ink)", fontSize: "0.9rem", fontWeight: 700 }}>연락처</label>
                                <input 
                                    type="tel" 
                                    placeholder="010-0000-0000" 
                                    required 
                                    value={formValues.phone}
                                    onChange={(e) => setFormValues({ ...formValues, phone: e.target.value })}
                                    style={{ width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid var(--sun-line)", background: "var(--sun-white)", color: "var(--sun-ink)" }} 
                                />
                            </div>
                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", marginBottom: "8px", color: "var(--sun-ink)", fontSize: "0.9rem", fontWeight: 700 }}>이메일</label>
                                <input 
                                    type="email" 
                                    placeholder="example@email.com" 
                                    required 
                                    value={formValues.email}
                                    onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                                    style={{ width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid var(--sun-line)", background: "var(--sun-white)", color: "var(--sun-ink)" }} 
                                />
                            </div>
                            <div style={{ marginBottom: "30px" }}>
                                <label style={{ display: "block", marginBottom: "8px", color: "var(--sun-ink)", fontSize: "0.9rem", fontWeight: 700 }}>현재 가장 큰 보컬 고민</label>
                                <textarea 
                                    placeholder="예: 고음에서의 압력 부족, 음색 불안정 등" 
                                    value={formValues.notes}
                                    onChange={(e) => setFormValues({ ...formValues, notes: e.target.value })}
                                    style={{ width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid var(--sun-line)", background: "var(--sun-white)", color: "var(--sun-ink)", height: "100px", resize: "none" }}
                                ></textarea>
                            </div>
                            <button 
                                type="submit" 
                                disabled={isRedirecting}
                                style={{ 
                                    width: "100%", 
                                    padding: "1.2rem", 
                                    background: isRedirecting ? "var(--sun-tint)" : "var(--sun-orange)", 
                                    color: isRedirecting ? "var(--sun-muted)" : "var(--sun-ink)", 
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
                    box-shadow: inset 0 1px 0 var(--sun-tint);
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

                    .signature-page main > section:not(.signature-hero) {
                        padding-top: 4rem !important;
                        padding-bottom: 4rem !important;
                    }

                    .signature-page .signature-sec-head {
                        margin-bottom: 2rem !important;
                    }

                    .signature-page .signature-hero {
                        min-height: auto !important;
                        padding-top: 6.5rem !important;
                        padding-bottom: 3.5rem !important;
                    }

                    .signature-page .signature-hero .signature-hero-headline {
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

                    .signature-page .signature-summary-grid > div,
                    .signature-page .signature-benefit-grid > div {
                        padding: 1.6rem !important;
                        border-radius: 24px !important;
                    }

                    .signature-page .signature-benefit-grid h2 {
                        margin-bottom: 1.5rem !important;
                    }

                    .signature-page .home-curriculum-layout {
                        min-height: auto !important;
                        gap: 1rem !important;
                    }

                    .signature-page .home-curriculum-menu {
                        padding: 0.5rem 0 !important;
                    }

                    .signature-page .home-curriculum-visual {
                        flex: 1 1 100% !important;
                        min-height: 240px !important;
                    }

                    .signature-page .signature-pricing-lead {
                        margin-bottom: 2.5rem !important;
                    }

                    .signature-page .signature-pricing-box {
                        padding: 1.4rem !important;
                        border-radius: 18px !important;
                    }

                    .signature-page .signature-included-row,
                    .signature-page .signature-value-row {
                        padding: 0.65rem 0 !important;
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

                    .signature-page main > section:not(.signature-hero) {
                        padding-top: 3.25rem !important;
                        padding-bottom: 3.25rem !important;
                    }

                    .signature-page .signature-curriculum {
                        padding-left: 1.25rem !important;
                        padding-right: 1.25rem !important;
                    }

                    .signature-page .signature-hero {
                        padding-top: 6rem !important;
                    }

                    .signature-page .signature-hero .signature-hero-headline,
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
