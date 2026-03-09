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
                    <h1 className="hero-title gsap-reveal" style={{ fontSize: "clamp(2.2rem, 4vw, 4rem)", lineHeight: 1.25 }}>매일의 기록이 만드는<br />경이로운 성장.</h1>
                    <p className="hero-subtitle gsap-reveal" style={{ marginTop: "1.5rem", maxWidth: "600px", fontWeight: 400, color: "#86868b", lineHeight: 1.6 }}>
                        하루 10분이 우리의 삶을 바꿉니다. 정말요. 더 자주 행동하실 수 있도록! 30일간의 데일리 온라인 루틴과 전문가의 1:1 피드백으로 일상의 목소리를 예술로 바꾸세요.
                    </p>

                    <button className="btn btn-primary-light" style={{ marginTop: "2rem", fontSize: "1.05rem", padding: "1.1rem 2.5rem", background: "#FF9F0A", color: "#000", border: "none" }} onClick={openModal}>
                        지금 바로 시작하기
                    </button>
                </section>

                {/* 2. Spark Value Section */}
                <section className="container" style={{ background: "#f5f5f7", borderRadius: "var(--radius-lg)", padding: "var(--space-lg)" }}>
                    <div className="section-header gsap-reveal">
                        <h2 className="section-title" style={{ fontSize: "2.2rem" }}>온라인으로 누리는 압도적 케어</h2>
                    </div>

                    <div className="grid-3">
                        <div className="target-card gsap-reveal">
                            <div className="target-card__icon" style={{ background: "rgba(255,159,10,0.1)", color: "#FF9F0A" }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                </svg>
                            </div>
                            <h3>데일리 루틴 가이드</h3>
                            <p style={{ color: "var(--color-studio-text-sec)", fontSize: "0.9rem" }}>매일 아침 전송되는 10분 발성 루틴으로 성대 근육의 기초 체력을 단단하게 다집니다.</p>
                        </div>

                        <div className="target-card gsap-reveal">
                            <div className="target-card__icon" style={{ background: "rgba(255,159,10,0.1)", color: "#FF9F0A" }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 15a4 4 0 004-4V6a4 4 0 00-8 0v5a4 4 0 004 4z"></path>
                                    <path d="M19 10v1a7 7 0 01-14 0v-1M12 18.5v3M8 21.5h8"></path>
                                </svg>
                            </div>
                            <h3>1:1 음성 피드백</h3>
                            <p style={{ color: "var(--color-studio-text-sec)", fontSize: "0.9rem" }}>녹음한 파일을 업로드하면 24시간 이내에 전문 코치의 정교한 교정 가이드를 받습니다.</p>
                        </div>

                        <div className="target-card gsap-reveal">
                            <div className="target-card__icon" style={{ background: "rgba(255,159,10,0.1)", color: "#FF9F0A" }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7"></path>
                                    <path d="M3 7l9 6 9-6"></path>
                                    <path d="M15 19l2 2 4-4"></path>
                                </svg>
                            </div>
                            <h3>어디서나 트레이닝</h3>
                            <p style={{ color: "var(--color-studio-text-sec)", fontSize: "0.9rem" }}>스마트폰만 있다면 집, 차 안, 사무실 어디서든 최고의 보컬 코칭을 경험할 수 있습니다.</p>
                        </div>
                    </div>
                </section>

                {/* 3. Spark Membership Sections */}
                <section className="container">
                    <div className="section-header gsap-reveal">
                        <h2 className="section-title">스파크 이용권 안내</h2>
                        <p className="section-subtitle">합리적인 비용으로 시작하는 매일의 변화.</p>
                    </div>

                    <div className="grid-2" style={{ maxWidth: "800px", margin: "0 auto" }}>
                        <div className="program-card gsap-reveal">
                            <div className="program-card__content">
                                <span style={{ color: "#FF9F0A", fontWeight: 700, fontSize: "0.8rem" }}>BASIC</span>
                                <h3 style={{ marginTop: "0.5rem" }}>30일 데일리 패스</h3>
                                <p>30일간의 발성 루틴 가이드와 주 1회 전문가 음성 피드백이 포함된 입문용 이용권.</p>
                                <div style={{ fontSize: "1.8rem", fontWeight: 700, margin: "1.5rem 0", color: "#111" }}>₩100,000</div>
                                <button className="btn btn-primary-light" style={{ width: "100%", borderRadius: "var(--radius-sm)", background: "#111", color: "#fff" }} onClick={openModal}>이용권 선택하기</button>
                            </div>
                        </div>

                        <div className="program-card gsap-reveal" style={{ border: "2px solid #FF9F0A" }}>
                            <div className="program-card__content">
                                <span style={{ background: "#FF9F0A", color: "#000", padding: "2px 8px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: 700 }}>MOST POPULAR</span>
                                <h3 style={{ marginTop: "0.5rem" }}>무제한 피드백 멤버십</h3>
                                <p>데일리 루틴은 물론, 언제든 업로드한 음성에 대해 무제한으로 피드백을 받는 올케어 이용권.</p>
                                <div style={{ fontSize: "1.8rem", fontWeight: 700, margin: "1.5rem 0", color: "#111" }}>₩200,000 <span style={{ fontSize: "1rem", fontWeight: 400, color: "#888" }}>/ 월</span></div>
                                <button className="btn btn-primary-light" style={{ width: "100%", borderRadius: "var(--radius-sm)", background: "#FF9F0A", color: "#000", border: "none" }} onClick={openModal}>멤버십 구독하기</button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Process Section */}
                <section className="container" style={{ paddingTop: "var(--space-md)", paddingBottom: "var(--space-md)" }}>
                    <div className="section-header gsap-reveal">
                        <h2 className="section-title">스파크 성장 프로세스</h2>
                    </div>
                    <div className="grid-4" style={{ textAlign: "center" }}>
                        <div className="gsap-reveal">
                            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#111", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", fontWeight: 700 }}>1</div>
                            <h4>루틴 전송</h4>
                            <p style={{ fontSize: "0.85rem", color: "#666" }}>매일 아침 맞춤형 트레이닝 가이드 수령</p>
                        </div>
                        <div className="gsap-reveal">
                            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#111", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", fontWeight: 700 }}>2</div>
                            <h4>개인 연습</h4>
                            <p style={{ fontSize: "0.85rem", color: "#666" }}>제시된 가이드에 따라 10분간 집중 훈련</p>
                        </div>
                        <div className="gsap-reveal">
                            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#111", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", fontWeight: 700 }}>3</div>
                            <h4>음성 업로드</h4>
                            <p style={{ fontSize: "0.85rem", color: "#666" }}>연습한 결과물을 대시보드에 간편하게 녹음/업로드</p>
                        </div>
                        <div className="gsap-reveal">
                            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#FF9F0A", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", fontWeight: 700 }}>4</div>
                            <h4>코치 피드백</h4>
                            <p style={{ fontSize: "0.85rem", color: "#666" }}>전문가의 1:1 맞춤 피드백으로 다음 단계 준비</p>
                        </div>
                    </div>
                </section>

                {/* 5. Neuroscience Section: Myelin */}
                <section className="container" style={{ background: "#000", borderRadius: "36px", padding: "6rem 3rem", color: "#fff", border: "1px solid rgba(255,159,10,0.1)" }}>
                    <div className="grid-2" style={{ alignItems: "center", gap: "4rem" }}>
                        <div className="gsap-reveal">
                            <span style={{ color: "#FF9F0A", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.15em", display: "block", marginBottom: "1.5rem" }}>NEUROSCIENCE</span>
                            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: "2rem" }}>
                                왜 단순한 연습이 아닌<br />
                                <span style={{ color: "#FF9F0A" }}>올바른 반복</span>이어야 하는가?
                            </h2>
                            <div style={{ color: "#a1a1a6", lineHeight: 1.6, fontSize: "1.2rem", fontWeight: 500 }}>
                                <p style={{ marginBottom: "1.5rem" }}>
                                    뇌과학에 따르면, 우리가 특정 동작을 반복할 때 신경 회로를 감싸는 절연 물질인 <span style={{ color: "#fff", fontWeight: 700 }}>미엘린(Myelin)</span>이 두꺼워집니다. 미엘린이 두꺼워질수록 신경 신호는 <span style={{ color: "#fff", fontWeight: 700 }}>100배 더 빠르고 정확하게</span> 전달되죠.
                                </p>
                                <p>
                                    잘못된 반복은 오작동하는 회로를 강화할 뿐입니다. 전문가의 정교한 피드백과 함께하는 하루 10분의 <span style={{ color: "#fff", fontWeight: 700 }}>심층 연습(Deep Practice)</span>만이 당신의 발성 지능을 비약적으로 높이는 유일한 비결입니다.
                                </p>
                            </div>
                        </div>
                        <div className="gsap-reveal" style={{ position: "relative", textAlign: "center" }}>
                            <div style={{
                                width: "100%",
                                maxWidth: "420px",
                                height: "320px",
                                margin: "0 auto",
                                background: "radial-gradient(circle at center, rgba(255,159,10,0.15) 0%, transparent 70%)",
                                borderRadius: "40px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "1px solid rgba(255,255,255,0.05)",
                                position: "relative",
                                overflow: "hidden"
                            }}>
                                {/* Subtle animated glow effect simulation with static CSS */}
                                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(135deg, rgba(255,159,10,0.05) 0%, transparent 50%, rgba(255,159,10,0.05) 100%)" }}></div>
                                <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                                    <div style={{ fontSize: "4rem", marginBottom: "15px", filter: "drop-shadow(0 0 20px rgba(255,159,10,0.3))" }}>🧠</div>
                                    <div style={{ fontWeight: 800, fontSize: "1.4rem", color: "#fff", letterSpacing: "0.05em" }}>MYELIN ENHANCEMENT</div>
                                    <div style={{ fontSize: "1rem", color: "#FF9F0A", fontWeight: 600, marginTop: "5px" }}>Neural Speed x100</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="container" style={{ background: "#111112", padding: "var(--space-xl) 5%", borderRadius: "var(--radius-lg)", color: "#fff", marginBottom: "var(--space-xl)", textAlign: "center" }}>
                    <div className="gsap-reveal">
                        <h2 className="section-title" style={{ color: "#fff", fontSize: "2.2rem", marginBottom: "20px" }}>변화는 생각보다 가까운 곳에 있습니다.</h2>
                        <p style={{ color: "#a1a1a6", fontSize: "1.1rem", lineHeight: 1.6, maxWidth: "600px", margin: "0 auto 30px" }}>
                            지금 이 순간에도 당신의 목소리는 성장할 준비가 되어 있습니다.<br />시선 스파크와 함께 매일의 변화를 즐겨보세요.
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <div style={{ display: "flex", gap: "1rem" }}>
                                <Link href="/reserve" style={{ padding: "1.2rem 2.5rem", background: "#FF9F0A", color: "#000", borderRadius: "40px", fontWeight: 700, textDecoration: "none" }}>
                                    보컬 진단 시작
                                </Link>
                            </div>
                            <p style={{ color: "#86868b", fontSize: "0.9rem", fontWeight: 500 }}>
                                3분 사전 체크 후, 현재 발성의 병목과 시작 방향을 안내합니다.
                            </p>
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
