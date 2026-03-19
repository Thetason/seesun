"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TrackComparison from "@/components/TrackComparison";

export default function FocusPage() {
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

        document.body.style.backgroundColor = "#f5f5f7";
        document.body.style.color = "#1d1d1f";

        if (heroContentRef.current) {
            gsap.fromTo(
                heroContentRef.current.children,
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power4.out", delay: 0.2 }
            );
        }

        textRevealRefs.current.forEach((el) => {
            gsap.fromTo(el, { y: 50, opacity: 0 }, {
                scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" },
                y: 0, opacity: 1, duration: 1, ease: "power3.out",
            });
        });

        return () => {
            ScrollTrigger.getAll().forEach((t) => t.kill());
            document.body.style.backgroundColor = "";
            document.body.style.color = "";
        };
    }, []);

    const [modalActive, setModalActive] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isError, setIsError] = useState(false);
    const [formValues, setFormValues] = useState({ name: "", email: "", phone: "", notes: "" });

    const openModal = () => setModalActive(true);
    const closeModal = () => {
        setModalActive(false);
        setIsSubmitted(false);
        setIsSubmitting(false);
        setIsError(false);
        setFormValues({ name: "", email: "", phone: "", notes: "" });
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setIsError(false);
        try {
            const res = await fetch("/api/consultations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: formValues.name, email: formValues.email, phone: formValues.phone, notes: formValues.notes, type: "Focus" })
            });
            if (res.ok) { setIsSubmitted(true); } else { setIsError(true); }
        } catch { setIsError(true); } finally { setIsSubmitting(false); }
    };

    return (
        <div className="focus-page" style={{ minHeight: "100vh", backgroundColor: "#f5f5f7", color: "#1d1d1f", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>

            {/* Navigation */}
            <header style={{ position: "fixed", top: 0, left: 0, width: "100%", padding: "1.2rem 0", zIndex: 100, backdropFilter: "saturate(180%) blur(20px)", background: "rgba(245,245,247,0.8)", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                <div style={{ maxWidth: "1200px", width: "100%", margin: "0 auto", padding: "0 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
                        <span style={{ fontWeight: 800, letterSpacing: "0.05em", color: "#111", fontSize: "1.1rem" }}>SEE:SUN <span style={{ color: "#FF9F0A" }}>ESSENTIAL</span></span>
                    </Link>
                    <button onClick={openModal} style={{ background: "#FF9F0A", color: "#000", fontSize: "0.85rem", fontWeight: 700, padding: "10px 20px", borderRadius: "30px", border: "none", cursor: "pointer" }}>
                        에센셜 상담 신청
                    </button>
                </div>
            </header>

            <main>
                {/* Hero */}
                <section style={{ minHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "80px", textAlign: "center" }}>
                    <div ref={heroContentRef} style={{ maxWidth: "900px", padding: "0 2rem" }}>
                        <span style={{ display: "inline-block", color: "#FF9F0A", fontWeight: 800, letterSpacing: "0.2em", fontSize: "0.85rem", marginBottom: "2rem" }}>30-MINUTE VOCAL COACHING</span>
                        <h1 style={{ fontSize: "clamp(3rem, 8vw, 5.5rem)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: "2rem" }}>
                            우선은 시작해보세요.<br />
                            <span style={{ color: "#FF9F0A" }}>인풋이 달라지면<br />아웃풋이 달라집니다.</span>
                        </h1>
                        <p style={{ fontSize: "1.15rem", color: "#86868b", maxWidth: "620px", margin: "0 auto 3rem", lineHeight: 1.7 }}>
                            보컬 트레이닝과 노래에 대한 큰 그림을 알아가고 싶으시다면,<br />
                            우선은 가장 기본을 익혀가며<br />
                            노래가 주는 즐거움을 느껴가고 싶으시다면.
                        </p>
                        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
                            <button onClick={openModal} style={{ padding: "1.1rem 2.8rem", background: "#FF9F0A", color: "#000", borderRadius: "40px", fontWeight: 700, fontSize: "1.05rem", border: "none", cursor: "pointer" }}>에센셜 상담 신청</button>
                            <Link href="/signature" style={{ padding: "1.1rem 2.8rem", background: "rgba(0,0,0,0.05)", color: "#1d1d1f", borderRadius: "40px", fontWeight: 700, fontSize: "1.05rem", border: "1px solid rgba(0,0,0,0.1)", textDecoration: "none", display: "inline-flex", alignItems: "center" }}>풀 코스 보러가기 →</Link>
                        </div>
                    </div>
                </section>

                {/* What You Get */}
                <section style={{ padding: "8rem 0", background: "#fff" }}>
                    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 2rem" }}>
                        <h2 ref={addToRefs} style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, textAlign: "center", marginBottom: "1.5rem", letterSpacing: "-0.03em" }}>
                            30분 안에<br /><span style={{ color: "#FF9F0A" }}>이것들을 담았습니다.</span>
                        </h2>
                        <p ref={addToRefs} style={{ textAlign: "center", color: "#86868b", fontSize: "1.15rem", maxWidth: "650px", margin: "0 auto 4rem", lineHeight: 1.7 }}>
                            발성교정사의 음성학 기반, 헐리우드 팝가수들의 SLS 발성 코칭,<br />
                            그리고 실제 음악과 가창에서의 핵심 팁들을 30분에 녹여냈습니다.
                        </p>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
                            <div ref={addToRefs} style={{ background: "#f5f5f7", padding: "2.5rem", borderRadius: "28px", border: "1px solid rgba(0,0,0,0.04)" }}>
                                <span style={{ color: "#FF9F0A", fontWeight: 900, fontSize: "1.1rem", display: "block", marginBottom: "1rem" }}>01</span>
                                <h4 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "1rem" }}>음성학 기반 발성 교정</h4>
                                <p style={{ color: "#86868b", fontSize: "0.92rem", lineHeight: 1.6 }}>단순한 감으로 가르치지 않습니다. 성대와 호흡의 작동 원리를 이해하고, 당신의 소리가 왜 그렇게 나오는지 정확히 짚어드립니다.</p>
                            </div>
                            <div ref={addToRefs} style={{ background: "#f5f5f7", padding: "2.5rem", borderRadius: "28px", border: "1px solid rgba(0,0,0,0.04)" }}>
                                <span style={{ color: "#FF9F0A", fontWeight: 900, fontSize: "1.1rem", display: "block", marginBottom: "1rem" }}>02</span>
                                <h4 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "1rem" }}>SLS 기반 보컬 코칭</h4>
                                <p style={{ color: "#86868b", fontSize: "0.92rem", lineHeight: 1.6 }}>헐리우드 팝가수들이 실제로 훈련받는 Speech Level Singing 메소드를 기반으로, 자연스럽고 효율적인 소리 사용법을 달아드립니다.</p>
                            </div>
                            <div ref={addToRefs} style={{ background: "#f5f5f7", padding: "2.5rem", borderRadius: "28px", border: "1px solid rgba(0,0,0,0.04)" }}>
                                <span style={{ color: "#FF9F0A", fontWeight: 900, fontSize: "1.1rem", display: "block", marginBottom: "1rem" }}>03</span>
                                <h4 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "1rem" }}>실전 가창 핵심 팁</h4>
                                <p style={{ color: "#86868b", fontSize: "0.92rem", lineHeight: 1.6 }}>이론이 아닌 실제 노래에서 바로 쓸 수 있는 핵심 팁을 전달합니다. 발성과 노래를 연결하는 감각을 30분 안에 체험하세요.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing */}
                <section style={{ padding: "8rem 0", background: "#f5f5f7", textAlign: "center" }}>
                    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 2rem" }}>
                        <h2 ref={addToRefs} style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "1rem" }}>가장 부담 없는 시작.</h2>
                        <p ref={addToRefs} style={{ color: "#86868b", marginBottom: "3rem", fontSize: "1.1rem" }}>배울 마음만 있다면, 여기서 시작하세요.</p>

                        <div ref={addToRefs} style={{ background: "#fff", padding: "3.5rem", borderRadius: "32px", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 10px 40px rgba(0,0,0,0.04)" }}>
                            <span style={{ color: "#FF9F0A", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.1em" }}>ESSENTIAL</span>
                            <h3 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0.8rem 0 1.2rem" }}>30분 1:1 보컬 코칭</h3>
                            <div style={{ fontSize: "3.5rem", fontWeight: 900, margin: "1.5rem 0", color: "#1d1d1f" }}>₩300,000 <span style={{ fontSize: "1rem", fontWeight: 400, color: "#888" }}>/ 4회</span></div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem", textAlign: "left", margin: "2rem 0", fontSize: "0.95rem", color: "#424245" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}><span style={{ color: "#34C759" }}>✓</span> 30분 1:1 보컬 코칭 4회</div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}><span style={{ color: "#34C759" }}>✓</span> 보컬 디렉팅 포함</div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", color: "#ccc" }}><span>✕</span> DAP 트레이닝 미포함</div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", color: "#ccc" }}><span>✕</span> 피드백 음원 제작 미포함</div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", color: "#ccc" }}><span>✕</span> 음원 녹음 / 믹마 미포함</div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", color: "#ccc" }}><span>✕</span> 스파크 코스 미포함</div>
                            </div>
                            <button onClick={openModal} style={{ width: "100%", padding: "1.1rem", background: "#FF9F0A", color: "#000", borderRadius: "16px", fontWeight: 800, fontSize: "1.05rem", border: "none", cursor: "pointer" }}>에센셜 상담 신청하기</button>
                        </div>
                    </div>
                </section>

                {/* Upsell to Signature */}
                <section style={{ padding: "6rem 0", background: "#111", color: "#fff" }}>
                    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 2rem" }}>
                        <div ref={addToRefs} style={{ background: "linear-gradient(135deg, rgba(255,159,10,0.12) 0%, rgba(255,159,10,0.03) 100%)", borderRadius: "32px", border: "1px solid rgba(255,159,10,0.2)", padding: "4rem", position: "relative", overflow: "hidden" }}>
                            <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "200px", height: "200px", background: "radial-gradient(circle, rgba(255,159,10,0.15) 0%, transparent 70%)", filter: "blur(40px)" }} />
                            <div style={{ position: "relative", zIndex: 1 }}>
                                <span style={{ color: "#FF9F0A", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.15em" }}>WANT MORE?</span>
                                <h3 style={{ fontSize: "2rem", fontWeight: 900, marginTop: "1rem", marginBottom: "1.2rem", letterSpacing: "-0.02em" }}>
                                    진짜 변화를 원한다면,<br />
                                    <span style={{ color: "#FF9F0A" }}>시그니처가 기다리고 있습니다.</span>
                                </h3>
                                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "1.5rem", maxWidth: "600px" }}>
                                    에센셜에서 경험한 코칭의 기본기에 <strong style={{ color: "#fff" }}>DAP 트레이닝</strong>, <strong style={{ color: "#fff" }}>음원 녹음</strong>, <strong style={{ color: "#fff" }}>믹스/마스터링</strong>, <strong style={{ color: "#fff" }}>스파크 무제한 피드백</strong>까지 더해진 풀 멤버십. 에센셜을 경험한 후 진수를 원한다면 시그니처로 넘어오세요.
                                </p>
                                <Link href="/signature" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#FF9F0A", color: "#000", padding: "1rem 2.5rem", borderRadius: "40px", fontWeight: 700, fontSize: "1rem", textDecoration: "none" }}>
                                    시그니처 코스 자세히 보기 →
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Recommendations */}
                <section style={{ padding: "8rem 0", background: "#fff" }}>
                    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 2rem" }}>
                        <h2 ref={addToRefs} style={{ fontSize: "2.5rem", fontWeight: 800, textAlign: "center", marginBottom: "3rem" }}>이런 분들에게 추천합니다</h2>
                        <div ref={addToRefs} style={{ background: "#f5f5f7", padding: "3rem", borderRadius: "28px" }}>
                            {[
                                "보컬 레슨을 처음 받아보는 분",
                                "풀 코스 전에 코칭 스타일을 먼저 경험하고 싶은 분",
                                "가격 부담 없이 전문 코칭을 시작하고 싶은 분",
                                "내 목소리의 문제점을 정확히 짚어줄 전문가가 필요한 분",
                                "배울 마음은 있는데, 어디서부터 시작할지 모르겠는 분"
                            ].map((item, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 0", borderBottom: i === 4 ? "none" : "1px solid rgba(0,0,0,0.05)", fontSize: "1.05rem", fontWeight: 600 }}>
                                    <span style={{ color: "#FF9F0A" }}>✓</span>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Track Comparison */}
                <TrackComparison currentTrack="Essential" />

                {/* CTA */}
                <section style={{ padding: "10rem 0", textAlign: "center", background: "#f5f5f7" }}>
                    <div ref={addToRefs} style={{ maxWidth: "800px", margin: "0 auto", padding: "0 2rem" }}>
                        <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 900, marginBottom: "2rem", letterSpacing: "-0.04em" }}>
                            배울 마음만 있다면,<br />여기서 시작하세요.
                        </h2>
                        <p style={{ color: "#86868b", fontSize: "1.2rem", lineHeight: 1.6, maxWidth: "600px", margin: "0 auto 3rem" }}>
                            30분의 기본기가 마음에 들면, 그때 시그니처의 진수를 경험해도 늦지 않습니다.
                        </p>
                        <button onClick={openModal} style={{ padding: "1.3rem 4rem", background: "#FF9F0A", color: "#000", borderRadius: "40px", fontWeight: 700, fontSize: "1.15rem", border: "none", cursor: "pointer" }}>
                            에센셜 상담 신청하기
                        </button>
                    </div>
                </section>
            </main>

            {/* Modal */}
            <div style={{
                background: "rgba(0,0,0,0.6)", position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                backdropFilter: "blur(15px)", zIndex: 1000, display: modalActive ? "flex" : "none",
                justifyContent: "center", alignItems: "center", transition: "all 0.3s"
            }}>
                <div style={{ width: "90%", maxWidth: "500px", background: "#fff", borderRadius: "24px", padding: "35px", position: "relative" }}>
                    <button onClick={closeModal} style={{ color: "#111", position: "absolute", top: "15px", right: "20px", background: "none", border: "none", fontSize: "2rem", cursor: "pointer" }}>&times;</button>
                    {!isSubmitted ? (
                        <div>
                            <h3 style={{ fontSize: "1.5rem", marginBottom: "10px", textAlign: "center", fontWeight: 800 }}>에센셜 상담 신청</h3>
                            <p style={{ textAlign: "center", color: "#86868b", marginBottom: "30px", fontSize: "0.95rem" }}>정보를 남겨주시면 담당 코치가 안내드립니다.</p>
                            <form onSubmit={handleFormSubmit}>
                                <div style={{ marginBottom: "15px" }}>
                                    <label style={{ display: "block", marginBottom: "5px", color: "#333", fontSize: "0.9rem", fontWeight: 600 }}>성함</label>
                                    <input type="text" placeholder="홍길동" required value={formValues.name} onChange={(e) => setFormValues({ ...formValues, name: e.target.value })} style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid #ddd", background: "#f9f9f9", color: "#000" }} />
                                </div>
                                <div style={{ marginBottom: "15px" }}>
                                    <label style={{ display: "block", marginBottom: "5px", color: "#333", fontSize: "0.9rem", fontWeight: 600 }}>연락처</label>
                                    <input type="tel" placeholder="010-0000-0000" required value={formValues.phone} onChange={(e) => setFormValues({ ...formValues, phone: e.target.value })} style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid #ddd", background: "#f9f9f9", color: "#000" }} />
                                </div>
                                <div style={{ marginBottom: "15px" }}>
                                    <label style={{ display: "block", marginBottom: "5px", color: "#333", fontSize: "0.9rem", fontWeight: 600 }}>이메일</label>
                                    <input type="email" placeholder="example@email.com" required value={formValues.email} onChange={(e) => setFormValues({ ...formValues, email: e.target.value })} style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid #ddd", background: "#f9f9f9", color: "#000" }} />
                                </div>
                                <div style={{ marginBottom: "25px" }}>
                                    <label style={{ display: "block", marginBottom: "5px", color: "#333", fontSize: "0.9rem", fontWeight: 600 }}>현재 가장 큰 보컬 고민</label>
                                    <textarea placeholder="예: 고음에서의 압력 부족, 음색 불안정 등" value={formValues.notes} onChange={(e) => setFormValues({ ...formValues, notes: e.target.value })} style={{ width: "100%", padding: "14px", borderRadius: "10px", border: "1px solid #ddd", background: "#f9f9f9", color: "#000", height: "90px", resize: "none" }}></textarea>
                                </div>
                                {isError && (
                                    <div style={{ background: "rgba(255,59,48,0.06)", padding: "15px", borderRadius: "12px", border: "1px solid rgba(255,59,48,0.15)", textAlign: "center", marginBottom: "15px" }}>
                                        <p style={{ color: "#FF3B30", fontWeight: 700, fontSize: "0.9rem" }}>오류가 발생했습니다. 다시 시도해주세요.</p>
                                    </div>
                                )}
                                <button type="submit" disabled={isSubmitting} style={{ width: "100%", padding: "1rem", background: isSubmitting ? "#ccc" : "#FF9F0A", color: isSubmitting ? "#888" : "#000", borderRadius: "12px", fontSize: "1.05rem", fontWeight: 800, border: "none", cursor: isSubmitting ? "not-allowed" : "pointer" }}>
                                    {isSubmitting ? "처리 중..." : "상담 신청 완료"}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div style={{ textAlign: "center", padding: "30px 0" }}>
                            <div style={{ width: "60px", height: "60px", background: "rgba(255,159,10,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "#FF9F0A" }}>
                                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
                            </div>
                            <h3 style={{ fontSize: "1.5rem", marginBottom: "10px", fontWeight: 800 }}>상담 신청이 접수되었습니다!</h3>
                            <p style={{ color: "#86868b", lineHeight: 1.6 }}>담당 코치가 확인 후 연락드리겠습니다.</p>
                            <button onClick={closeModal} style={{ marginTop: "25px", padding: "12px 30px", borderRadius: "10px", background: "#FF9F0A", color: "#000", border: "none", fontWeight: 700, cursor: "pointer" }}>확인</button>
                        </div>
                    )}
                </div>
            </div>

            <style jsx global>{`
                @media (max-width: 768px) {
                    .focus-page section { padding: 5rem 0 !important; }
                    .focus-page h1 { font-size: clamp(2.5rem, 10vw, 3.5rem) !important; }
                    .focus-page section > div > div[style*="grid-template-columns: 1fr 1fr"] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
}
