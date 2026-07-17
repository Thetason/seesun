"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type ApplyMode = "apply" | "waitlist";
type SubmitStatus = "idle" | "submitting" | "done" | "error";

type CrewFormState = {
    name: string;
    phone: string;
    membership: string;
    song: string;
    goal: string;
    resolve: string;
};

const INITIAL_FORM: CrewFormState = {
    name: "",
    phone: "",
    membership: "시그니처 멤버",
    song: "",
    goal: "",
    resolve: "",
};

const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    color: "#fff",
    fontSize: "1rem",
};

const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "6px",
    color: "#d1d1d6",
    fontSize: "0.9rem",
    fontWeight: 700,
};

export default function CrewPageClient() {
    const [mode, setMode] = useState<ApplyMode>("apply");
    const [status, setStatus] = useState<SubmitStatus>("idle");
    const [form, setForm] = useState<CrewFormState>(INITIAL_FORM);
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
                    },
                }
            );
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    const selectMode = (next: ApplyMode) => {
        setMode(next);
        if (status !== "submitting") setStatus("idle");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (status === "submitting") return;
        setStatus("submitting");

        const body =
            mode === "apply"
                ? {
                      name: form.name,
                      phone: form.phone,
                      type: "아티스트웨이 크루 지원",
                      notes: [
                          `현재 멤버십: ${form.membership}`,
                          `부르고 싶은 곡: ${form.song}`,
                          `이번 시즌의 목표: ${form.goal}`,
                          `각오 한 줄: ${form.resolve}`,
                      ].join("\n"),
                  }
                : {
                      name: form.name,
                      phone: form.phone,
                      type: "아티스트웨이 크루 다음 시즌 알림",
                      notes: "크루 다음 시즌 대기 명단 신청",
                  };

        try {
            const res = await fetch("/api/consultations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (!res.ok) {
                throw new Error(`Consultation request failed: ${res.status}`);
            }
            setStatus("done");
            setForm(INITIAL_FORM);
        } catch {
            setStatus("error");
        }
    };

    return (
        <div className="crew-page" style={{ color: "#ffffff", backgroundColor: "#050507", minHeight: "100vh" }}>
            <header style={{ position: "fixed", top: 0, width: "100%", padding: "1.5rem 0", zIndex: 100, backgroundColor: "rgba(5, 5, 7, 0.8)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Link href="/" style={{ color: "#fff", fontWeight: 800, fontSize: "1.2rem", textDecoration: "none", letterSpacing: "0.1em" }}>SEE:SUN CREW</Link>
                    <a href="#apply" onClick={() => selectMode("apply")} style={{ background: "#FE7502", color: "#000", padding: "8px 24px", borderRadius: "100px", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none" }}>이번 시즌 지원하기</a>
                </div>
            </header>

            <main>
                {/* 1. Hero */}
                <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", paddingTop: "80px", background: "radial-gradient(ellipse at 70% 20%, rgba(254,117,2,0.08) 0%, transparent 55%), #050507" }}>
                    <div className="container" style={{ position: "relative", zIndex: 2, maxWidth: "1200px" }}>
                        <div style={{ maxWidth: "760px" }}>
                            <span style={{ color: "#FE7502", fontWeight: 800, letterSpacing: "0.3em", fontSize: "0.85rem", display: "block", marginBottom: "2rem" }}>ARTIST WAY CREW — 12-WEEK SEASON</span>
                            <h1 style={{ fontSize: "clamp(2.4rem, 6vw, 4.2rem)", fontWeight: 900, lineHeight: 1.18, marginBottom: "2.5rem", letterSpacing: "-0.04em" }}>
                                아티스트웨이 크루는<br />
                                시즌마다 <span style={{ color: "#FE7502" }}>지원으로 합류하는</span><br />
                                크리에이티브 클럽입니다.
                            </h1>
                            <p style={{ fontSize: "1.25rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: "2rem" }}>
                                12주의 시즌 동안 매주 모여 아티스트웨이의 여정을 걷고,<br />
                                영화와 책과 철학 — 예술과 영감이 되는 것들을 나눕니다.
                            </p>
                            <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, marginBottom: "2.5rem" }}>
                                크루 지원은 시그니처 멤버와 알럼나이에게만 열립니다.<br />
                                회비는 다과와 운영을 위한 월 50,000원입니다.
                            </p>
                            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.8, marginBottom: "3rem", borderLeft: "2px solid #FE7502", paddingLeft: "1.5rem" }}>
                                첫 번째 기수에게는 &lsquo;파운딩 크루&rsquo;라는 이름이 남습니다. 이 이름은 다시 만들 수 없습니다.<br />
                                아직 자격이 없으시다면, <Link href="/signature" style={{ color: "#FE7502", fontWeight: 700 }}>시그니처에서 시작하십시오.</Link> 크루의 문은 시그니처 멤버와 알럼나이에게만 열립니다.
                            </p>
                            <div className="crew-hero-actions" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                                <a href="#apply" onClick={() => selectMode("apply")} style={{ background: "#FE7502", color: "#000", padding: "1.1rem 2.8rem", borderRadius: "100px", fontWeight: 800, fontSize: "1.05rem", textDecoration: "none", boxShadow: "0 10px 30px rgba(254,117,2,0.2)" }}>이번 시즌 지원하기</a>
                                <a href="#apply" onClick={() => selectMode("waitlist")} style={{ background: "rgba(255,255,255,0.06)", color: "#fff", padding: "1.1rem 2.8rem", borderRadius: "100px", fontWeight: 700, fontSize: "1.05rem", textDecoration: "none", border: "1px solid rgba(255,255,255,0.12)" }}>다음 시즌 알림 받기</a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. What the crew does */}
                <section style={{ padding: "10rem 0", background: "#0a0a0c" }}>
                    <div className="container" style={{ textAlign: "center" }}>
                        <span style={{ color: "#FE7502", fontWeight: 800, letterSpacing: "0.2em", fontSize: "0.85rem", display: "block", marginBottom: "1rem" }}>WHAT THE CREW DOES</span>
                        <h2 ref={addToRefs} style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, marginBottom: "5rem", letterSpacing: "-0.03em" }}>크루가 하는 일</h2>
                        <div className="crew-card-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
                            {[
                                { num: "01", title: "주간 크루 세션", desc: "매주 한 번, 크루가 모여 아티스트웨이 12주의 여정을 함께 걷습니다. 그 주의 발견과 기록을 나누는 시간입니다." },
                                { num: "02", title: "예술과 영감의 나눔", desc: "영화·애니메이션·책·자기개발·철학 — 노래 너머의 것들을 나눕니다. 각자의 취향이 서로의 세계를 넓힙니다." },
                                { num: "03", title: "시즌 기록", desc: "시즌의 발견과 변화가 크루의 기록으로 남습니다. 12주가 끝나면, 자기 세계가 한 뼘 넓어져 있습니다." },
                            ].map((item, i) => (
                                <div key={i} ref={addToRefs} className="crew-tactile-card" style={{ background: "rgba(255,255,255,0.02)", padding: "3.5rem 2.5rem", borderRadius: "32px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "left" }}>
                                    <div style={{ fontSize: "0.78rem", fontWeight: 900, color: "rgba(254,117,2,0.5)", letterSpacing: "0.1em", marginBottom: "2rem" }}>{item.num}</div>
                                    <h3 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: "1.2rem" }}>{item.title}</h3>
                                    <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7, fontSize: "1.05rem" }}>{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 3. Season structure */}
                <section style={{ padding: "10rem 0", background: "#050507", textAlign: "center" }}>
                    <div className="container" style={{ maxWidth: "900px" }}>
                        <span style={{ color: "#FE7502", fontWeight: 800, letterSpacing: "0.2em", fontSize: "0.85rem", display: "block", marginBottom: "1rem" }}>SEASON STRUCTURE</span>
                        <h2 ref={addToRefs} style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, marginBottom: "4rem", letterSpacing: "-0.03em" }}>시즌 구조</h2>
                        <div ref={addToRefs} className="crew-stats-row" style={{ display: "flex", justifyContent: "center", gap: "4rem", marginBottom: "3rem" }}>
                            <div>
                                <div style={{ fontSize: "3rem", fontWeight: 900 }}>12주</div>
                                <div style={{ color: "rgba(255,255,255,0.4)", marginTop: "0.5rem" }}>한 시즌</div>
                            </div>
                            <div>
                                <div style={{ fontSize: "3rem", fontWeight: 900 }}>기수제</div>
                                <div style={{ color: "rgba(255,255,255,0.4)", marginTop: "0.5rem" }}>아티스트웨이 크루 N기</div>
                            </div>
                            <div>
                                <div style={{ fontSize: "3rem", fontWeight: 900, color: "#FE7502" }}>8~12명</div>
                                <div style={{ color: "rgba(255,255,255,0.4)", marginTop: "0.5rem" }}>기수당 정원</div>
                            </div>
                        </div>
                        <p ref={addToRefs} style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.15rem", lineHeight: 1.8 }}>
                            크루는 시즌 단위로 움직입니다. 한 시즌은 12주 — 매주 1회, 12회의 크루 세션으로 아티스트웨이 한 권의 여정을 완주합니다. 코치가 이끄는 주와 멤버가 호스트를 맡는 주가 번갈아 이어집니다. 기수마다 이름이 남습니다. &ldquo;아티스트웨이 크루 1기&rdquo;처럼.
                        </p>
                    </div>
                </section>

                {/* 4. How to join — always in this order: apply, selection, season fee */}
                <section style={{ padding: "10rem 0", background: "#0a0a0c" }}>
                    <div className="container" style={{ maxWidth: "900px" }}>
                        <div style={{ textAlign: "center", marginBottom: "5rem" }}>
                            <span style={{ color: "#FE7502", fontWeight: 800, letterSpacing: "0.2em", fontSize: "0.85rem", display: "block", marginBottom: "1rem" }}>HOW TO JOIN</span>
                            <h2 ref={addToRefs} style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, letterSpacing: "-0.03em" }}>합류하는 방법</h2>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                            {[
                                { step: "STEP 1", title: "지원서", desc: "요즘 나를 움직인 작품, 시즌의 목표, 각오 한 줄을 적어 지원합니다." },
                                { step: "STEP 2", title: "선발", desc: "선발 기준은 실력이 아니라 각오와 시즌 궁합입니다. 선발되지 않으면 다음 시즌 알림을 받아보실 수 있습니다." },
                                { step: "STEP 3", title: "회비 월 50,000원 (VAT 포함)", desc: "회비는 다과와 운영을 위한 운영비입니다. 시즌(12주) 동안 월 단위로 납부합니다." },
                            ].map((item, i) => (
                                <div key={i} ref={addToRefs} style={{ display: "flex", gap: "2rem", alignItems: "flex-start", background: "rgba(255,255,255,0.02)", padding: "2.5rem", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.06)" }}>
                                    <span style={{ color: "#FE7502", fontWeight: 800, fontSize: "0.85rem", letterSpacing: "0.1em", whiteSpace: "nowrap", paddingTop: "0.4rem" }}>{item.step}</span>
                                    <div>
                                        <h3 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "0.8rem" }}>{item.title}</h3>
                                        <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p ref={addToRefs} style={{ marginTop: "2rem", textAlign: "center", color: "rgba(255,255,255,0.45)", fontSize: "0.95rem" }}>
                            회비 관련 <Link href="/refund" style={{ color: "#FE7502", fontWeight: 700 }}>환불 규정</Link>을 확인하실 수 있습니다.
                        </p>
                    </div>
                </section>

                {/* 5. Eligibility */}
                <section style={{ padding: "10rem 0", background: "#050507" }}>
                    <div className="container crew-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center", maxWidth: "1100px" }}>
                        <div ref={addToRefs}>
                            <h2 style={{ fontSize: "clamp(2rem, 4.5vw, 2.8rem)", fontWeight: 900, lineHeight: 1.25, letterSpacing: "-0.03em", marginBottom: "2rem" }}>
                                노래를 배우러 왔다가,<br /><span style={{ color: "#FE7502" }}>자기 세계를 만들고 갑니다.</span>
                            </h2>
                            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.1rem", lineHeight: 1.8 }}>
                                크루는 결제로 가입하는 상품이 아닙니다. 지원하고, 선발됩니다.
                                함께 걷고 싶어지는 순간은, 보통 멤버로 지내는 사이에 옵니다.
                            </p>
                        </div>
                        <div ref={addToRefs} style={{ background: "rgba(254,117,2,0.03)", padding: "3.5rem", borderRadius: "32px", border: "1px solid rgba(254,117,2,0.1)" }}>
                            <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "2rem", color: "#FE7502" }}>지원 자격</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                                {[
                                    "시그니처 멤버 이상",
                                    "알럼나이 (수료자)",
                                ].map((item, i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem", fontWeight: 700, fontSize: "1.1rem" }}>
                                        <div style={{ color: "#FE7502" }}>✓</div>
                                        {item}
                                    </div>
                                ))}
                            </div>
                            <p style={{ marginTop: "2rem", color: "rgba(255,255,255,0.5)", fontSize: "0.95rem", lineHeight: 1.7 }}>
                                아직 자격이 없으시다면, <Link href="/signature" style={{ color: "#FE7502", fontWeight: 700 }}>시그니처에서 시작하십시오</Link>.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 6. Season archive — placeholder until Season 1 wraps */}
                <section style={{ padding: "10rem 0", background: "#0a0a0c", textAlign: "center" }}>
                    <div className="container" style={{ maxWidth: "900px" }}>
                        <span style={{ color: "#FE7502", fontWeight: 800, letterSpacing: "0.2em", fontSize: "0.85rem", display: "block", marginBottom: "1rem" }}>SEASON ARCHIVE</span>
                        <h2 ref={addToRefs} style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, marginBottom: "3rem", letterSpacing: "-0.03em" }}>기수 아카이브</h2>
                        <div ref={addToRefs} style={{ background: "rgba(255,255,255,0.02)", padding: "4rem 3rem", borderRadius: "32px", border: "1px dashed rgba(254,117,2,0.3)" }}>
                            <p style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1rem" }}>첫 시즌이 시작됩니다</p>
                            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.1rem", lineHeight: 1.8 }}>
                                1기는 파운딩 멤버로 구성됩니다.<br />
                                첫 시즌의 기록이 이 자리를 채웁니다.
                            </p>
                            {/* Archive slots — replace with season performance photos/videos after Season 1 */}
                        </div>
                    </div>
                </section>

                {/* 7. Apply / waitlist */}
                <section id="apply" style={{ padding: "10rem 0 12rem", background: "linear-gradient(to bottom, #050507, #000)" }}>
                    <div className="container" style={{ maxWidth: "640px" }}>
                        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                            <h2 ref={addToRefs} style={{ fontSize: "clamp(2rem, 5vw, 2.8rem)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "1.5rem" }}>
                                이번 시즌, 함께 걸으시겠습니까?
                            </h2>
                            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "1.05rem", lineHeight: 1.7 }}>
                                자격이 있다면 지원하고, 아직이라면 다음 시즌 알림을 받아두십시오.
                            </p>
                        </div>

                        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "2rem", justifyContent: "center" }}>
                            <button onClick={() => selectMode("apply")} style={{ padding: "0.9rem 2rem", borderRadius: "100px", fontWeight: 800, fontSize: "0.95rem", border: "none", cursor: "pointer", background: mode === "apply" ? "#FE7502" : "rgba(255,255,255,0.06)", color: mode === "apply" ? "#000" : "rgba(255,255,255,0.7)" }}>이번 시즌 지원하기</button>
                            <button onClick={() => selectMode("waitlist")} style={{ padding: "0.9rem 2rem", borderRadius: "100px", fontWeight: 800, fontSize: "0.95rem", border: "none", cursor: "pointer", background: mode === "waitlist" ? "#FE7502" : "rgba(255,255,255,0.06)", color: mode === "waitlist" ? "#000" : "rgba(255,255,255,0.7)" }}>다음 시즌 알림 받기</button>
                        </div>

                        {status === "done" ? (
                            <div style={{ background: "rgba(254,117,2,0.05)", border: "1px solid rgba(254,117,2,0.2)", borderRadius: "24px", padding: "3rem", textAlign: "center" }}>
                                <p style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "0.8rem" }}>
                                    {mode === "apply" ? "지원서가 접수되었습니다." : "다음 시즌 알림 명단에 올랐습니다."}
                                </p>
                                <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
                                    {mode === "apply"
                                        ? "선발 결과는 개별 연락으로 안내드립니다."
                                        : "다음 시즌 지원이 열리면 가장 먼저 알려드립니다."}
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ background: "#111217", borderRadius: "28px", padding: "2.5rem", border: "1px solid rgba(255,255,255,0.08)" }}>
                                <div style={{ marginBottom: "14px" }}>
                                    <label style={labelStyle}>이름</label>
                                    <input type="text" required placeholder="이름" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
                                </div>
                                <div style={{ marginBottom: "14px" }}>
                                    <label style={labelStyle}>연락처</label>
                                    <input type="tel" required placeholder="010-0000-0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
                                </div>
                                {mode === "apply" && (
                                    <>
                                        <div style={{ marginBottom: "14px" }}>
                                            <label style={labelStyle}>현재 멤버십</label>
                                            <select value={form.membership} onChange={(e) => setForm({ ...form, membership: e.target.value })} style={inputStyle}>
                                                <option value="시그니처 멤버">시그니처 멤버</option>
                                                <option value="마스터 프로토콜">마스터 프로토콜</option>
                                                <option value="알럼나이">알럼나이</option>
                                            </select>
                                        </div>
                                        <div style={{ marginBottom: "14px" }}>
                                            <label style={labelStyle}>요즘 나를 움직인 작품</label>
                                            <input type="text" required placeholder="영화·책·음악 — 무엇이든 좋습니다" value={form.song} onChange={(e) => setForm({ ...form, song: e.target.value })} style={inputStyle} />
                                        </div>
                                        <div style={{ marginBottom: "14px" }}>
                                            <label style={labelStyle}>이번 시즌의 목표</label>
                                            <textarea required placeholder="12주 뒤, 어디까지 가고 싶으신가요?" value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }} />
                                        </div>
                                        <div style={{ marginBottom: "18px" }}>
                                            <label style={labelStyle}>각오 한 줄</label>
                                            <input type="text" required placeholder="한 줄이면 충분합니다" value={form.resolve} onChange={(e) => setForm({ ...form, resolve: e.target.value })} style={inputStyle} />
                                        </div>
                                    </>
                                )}
                                {status === "error" && (
                                    <p style={{ color: "#ff6b6b", fontSize: "0.9rem", marginBottom: "14px" }}>
                                        접수 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.
                                    </p>
                                )}
                                <button type="submit" disabled={status === "submitting"} style={{ width: "100%", padding: "1.1rem", background: status === "submitting" ? "#3a3a3c" : "#FE7502", color: status === "submitting" ? "#8e8e93" : "#000", borderRadius: "14px", fontSize: "1.05rem", fontWeight: 900, border: "none", cursor: status === "submitting" ? "wait" : "pointer" }}>
                                    {status === "submitting"
                                        ? "접수 중..."
                                        : mode === "apply" ? "지원서 제출하기" : "다음 시즌 알림 받기"}
                                </button>
                                {mode === "apply" && (
                                    <p style={{ marginTop: "1.2rem", color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", textAlign: "center", lineHeight: 1.6 }}>
                                        지원 → 선발 → 회비(월 50,000원, VAT 포함) 순서로 진행됩니다. <Link href="/refund" style={{ color: "rgba(254,117,2,0.8)" }}>환불 규정</Link>
                                    </p>
                                )}
                            </form>
                        )}
                    </div>
                </section>
            </main>

            <style jsx global>{`
                @media (max-width: 900px) {
                    .crew-page .crew-card-grid {
                        grid-template-columns: 1fr !important;
                    }
                    .crew-page .crew-two-col {
                        grid-template-columns: 1fr !important;
                        gap: 2rem !important;
                    }
                }

                @media (max-width: 768px) {
                    .crew-page .container {
                        padding: 0 1.25rem !important;
                    }
                    .crew-page section {
                        padding: 5rem 0 !important;
                    }
                    .crew-page .crew-stats-row {
                        display: grid !important;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 1rem !important;
                    }
                }

                @media (max-width: 430px) {
                    .crew-page .crew-stats-row {
                        grid-template-columns: 1fr !important;
                    }
                    .crew-page .crew-hero-actions a {
                        width: 100%;
                        text-align: center;
                    }
                }
            `}</style>
        </div>
    );
}
