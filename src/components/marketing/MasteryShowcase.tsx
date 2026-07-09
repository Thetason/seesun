"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "@studio-freight/react-lenis";
import ShowcaseSideNav from "./ShowcaseSideNav";

const NAV_TIMES = [8, 13, 28, 43, 58, 73, 88];
const NAV_LABELS = [
    "여는 글",
    "01 · Foundation",
    "02 · Science of Voice",
    "03 · Artistic Depth",
    "04 · Practical",
    "05 · Genre Expansion",
    "압축된 지도",
];

function subscribeReducedMotion(callback: () => void) {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    media.addEventListener("change", callback);
    return () => media.removeEventListener("change", callback);
}

function getReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const CHAPTERS = [
    {
        no: "01",
        period: "2010 – 2018",
        title: "Foundation",
        badges: ["성악 전공", "실용음악 보컬 전공"],
        desc: "클래식 성악과 실용음악을 함께 훈련한 이유는 하나입니다. 어떤 장르를 부르더라도 흔들리지 않는 발성의 중심을 만들기 위해서입니다.",
        takeaway: "목으로 버티지 않는 기본기",
    },
    {
        no: "02",
        period: "2016 – 2018",
        title: "Science of Voice",
        badges: ["한국발성교정협회 발성교정사", "남도현 교수 직접 사사"],
        desc: "감으로만 설명하지 않습니다. 음성학과 해부학의 원리로 왜 막히는지, 어디서 힘이 새는지 설명합니다. 목이 상하는 길까지 직접 겪었기에, 무엇이 위험한지도 구별합니다.",
        takeaway: "혼자 연습해도 무너지지 않는 기준",
    },
    {
        no: "03",
        period: "2018 – 2023",
        title: "Artistic Depth",
        badges: ["뮤지컬 극단 메인 배우", "찬스라인 전속 작곡가"],
        desc: "잘 부르는 것만으로는 충분하지 않습니다. 가사 전달, 감정선, 다이내믹까지 설계해야 노래가 사람에게 닿습니다.",
        takeaway: "정확한 소리 너머의 표현력",
    },
    {
        no: "04",
        period: "2020 – 2024",
        title: "Practical Experience",
        badges: ["클라우딘뮤직 대표 역임"],
        desc: "레슨실에서만 되는 소리는 실력이 아닙니다. 녹음실과 무대, 실제 상황에서도 유지되는 호흡과 톤, 집중력을 훈련합니다.",
        takeaway: "실전에서 버티는 컨트롤",
    },
    {
        no: "05",
        period: "Current",
        title: "Genre Expansion",
        badges: ["Current Focus"],
        desc: "좋은 트레이닝은 모두를 같은 소리로 만들지 않습니다. 각자의 장르 성향에 맞게 방향을 잡아야 자기만의 소리가 생깁니다.",
        takeaway: "남을 복제하지 않는 자기 음색",
    },
];

const NODES = [
    { x: 200, y: 505 },
    { x: 118, y: 398 },
    { x: 258, y: 300 },
    { x: 132, y: 196 },
    { x: 200, y: 84 },
];

const PATH_D =
    "M 200 505 C 130 486, 92 448, 118 398 C 142 352, 214 332, 258 300 C 300 268, 212 238, 132 196 C 84 170, 148 118, 200 84";

const NODE_FRACTIONS = [0.02, 0.28, 0.52, 0.76, 0.99];

export default function MasteryShowcase() {
    const rootRef = useRef<HTMLElement | null>(null);
    const stRef = useRef<ScrollTrigger | null>(null);
    const activeRef = useRef(0);
    const [activeIdx, setActiveIdx] = useState(0);
    const [navVisible, setNavVisible] = useState(false);
    const reduced = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);
    const lenis = useLenis();

    const jump = (i: number) => {
        const st = stRef.current;
        if (!st) return;
        const target = st.start + (NAV_TIMES[i] / 100) * (st.end - st.start);
        if (lenis) lenis.scrollTo(target, { duration: 1 });
        else window.scrollTo({ top: target, behavior: "smooth" });
    };

    useEffect(() => {
        if (reduced) return;

        gsap.registerPlugin(ScrollTrigger);
        const root = rootRef.current;
        if (!root) return;

        const q = gsap.utils.selector(root);
        const progressPath = root.querySelector<SVGPathElement>("[data-m-progress]");
        if (!progressPath) return;

        const pathLength = progressPath.getTotalLength();

        gsap.set(q("[data-m-copy]"), { autoAlpha: 0, y: 36 });
        gsap.set(q("[data-m-intro]"), { autoAlpha: 1, y: 0 });
        gsap.set(progressPath, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
        gsap.set(q("[data-m-node]"), { scale: 0, transformOrigin: "50% 50%" });
        gsap.set(q("[data-m-picto]"), { scale: 0, autoAlpha: 0, transformOrigin: "50% 50%" });
        gsap.set(q("[data-m-ray]"), { scale: 0, autoAlpha: 0, transformOrigin: "50% 50%" });

        const tl = gsap.timeline({
            defaults: { ease: "power2.out" },
            scrollTrigger: {
                trigger: root,
                start: "top top",
                end: "+=2900",
                scrub: 0.5,
                pin: true,
                anticipatePin: 1,
                onToggle: (self) => setNavVisible(self.isActive),
                onUpdate: (self) => {
                    const time = self.progress * 100;
                    let idx = 0;
                    NAV_TIMES.forEach((t, i) => {
                        if (time >= t - 2) idx = i;
                    });
                    if (idx !== activeRef.current) {
                        activeRef.current = idx;
                        setActiveIdx(idx);
                    }
                },
            },
        });

        stRef.current = tl.scrollTrigger ?? null;

        const copies = q("[data-m-copy]");
        const nodes = q("[data-m-node]");
        const pictos = q("[data-m-picto]");
        const starts = [13, 28, 43, 58, 73];

        tl.to(q("[data-m-intro]"), { autoAlpha: 0, y: -36, duration: 5 }, 8);

        starts.forEach((s, i) => {
            if (i > 0) {
                tl.to(copies[i - 1], { autoAlpha: 0, y: -36, duration: 4 }, s - 2);
            }
            tl.to(copies[i], { autoAlpha: 1, y: 0, duration: 5 }, s + 1)
                .to(progressPath, { strokeDashoffset: pathLength * (1 - NODE_FRACTIONS[i]), duration: 9 }, s)
                .to(nodes[i], { scale: 1, duration: 3, ease: "back.out(2)" }, s + 5)
                .to(pictos[i], { scale: 1, autoAlpha: 1, duration: 3, ease: "back.out(2)" }, s + 6.5);
        });

        tl.to(copies[4], { autoAlpha: 0, y: -36, duration: 4 }, 85)
            .to(copies[5], { autoAlpha: 1, y: 0, duration: 5 }, 88)
            .to(q("[data-m-ray]"), { scale: 1, autoAlpha: 1, duration: 4, stagger: 0.6 }, 88)
            .to({}, { duration: 5 }, 95);

        return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
        };
    }, [reduced]);

    const rays = Array.from({ length: 8 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 8 - Math.PI / 2;
        const inner = 24;
        const outer = 40;
        return {
            x1: 200 + Math.cos(angle) * inner,
            y1: 84 + Math.sin(angle) * inner,
            x2: 200 + Math.cos(angle) * outer,
            y2: 84 + Math.sin(angle) * outer,
        };
    });

    const visual = (
        <svg viewBox="0 0 400 560" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ width: "100%", height: "100%", display: "block" }}>
            <path d={PATH_D} stroke="rgba(255,255,255,0.14)" strokeWidth="2" strokeLinecap="round" />
            <path data-m-progress="" d={PATH_D} stroke="#FE7502" strokeWidth="4" strokeLinecap="round" />
            {rays.map((r, i) => (
                <line key={i} data-m-ray="" x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke="#FE7502" strokeWidth="3.5" strokeLinecap="round" />
            ))}
            {NODES.map((n, i) => (
                <g key={i} data-m-node="">
                    <circle cx={n.x} cy={n.y} r="14" fill="#050505" stroke="#FE7502" strokeWidth="2.5" />
                    <circle cx={n.x} cy={n.y} r="5.5" fill="#FE7502" />
                    <text x={n.x + (i === 4 ? 50 : 24)} y={n.y + 5} fill="rgba(255,255,255,0.55)" fontSize="13" fontWeight="700" fontFamily="inherit">
                        {CHAPTERS[i].no}
                    </text>
                </g>
            ))}
            <g data-m-picto="" transform="translate(262, 480)" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round">
                <path d="M -14 10 h 28" />
                <path d="M -10 2 h 20" />
                <path d="M -6 -6 h 12" />
                <circle cx="0" cy="-13" r="2.5" fill="#FE7502" stroke="none" />
            </g>
            <g data-m-picto="" transform="translate(64, 394)" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="-3" cy="-3" r="9.5" />
                <path d="M 4 4 L 13 13" />
                <path d="M -8 -3 l 3 -4 l 3 7 l 4 -6" stroke="#FE7502" strokeWidth="2" />
            </g>
            <g data-m-picto="" transform="translate(318, 290)" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round">
                <path d="M -13 0 L 13 -9" />
                <path d="M -13 0 L 13 9" />
                <circle cx="16" cy="0" r="2.5" fill="#FE7502" stroke="none" />
            </g>
            <g data-m-picto="" transform="translate(78, 192)" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round">
                <rect x="-6" y="-15" width="12" height="20" rx="6" />
                <path d="M -11 -2 a 11 11 0 0 0 22 0" />
                <path d="M 0 9 V 15" />
                <path d="M -7 15 h 14" />
            </g>
            <g data-m-picto="" transform="translate(134, 78)" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round">
                <path d="M 0 12 L -12 -7" />
                <path d="M 0 12 L 0 -11" />
                <path d="M 0 12 L 12 -7" />
                <circle cx="-13" cy="-9" r="2.5" fill="#FE7502" stroke="none" />
                <circle cx="0" cy="-13" r="2.5" fill="#FE7502" stroke="none" />
                <circle cx="13" cy="-9" r="2.5" fill="#FE7502" stroke="none" />
            </g>
        </svg>
    );

    if (reduced) {
        return (
            <section id="journey-of-mastery" style={{ background: "#050505", color: "#fff", padding: "8rem 2rem" }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                    <p style={{ color: "#FE7502", fontWeight: 800, letterSpacing: "0.2em", fontSize: "0.8rem" }}>JOURNEY OF MASTERY</p>
                    <h2 style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 900, margin: "0.8rem 0 3rem" }}>
                        당신 안에, 아직 아무도 못 들어본 목소리가 있습니다
                    </h2>
                    <div style={{ display: "grid", gap: "2.5rem" }}>
                        {CHAPTERS.map((c) => (
                            <div key={c.no}>
                                <div style={{ color: "#FE7502", fontWeight: 900 }}>{c.no} · {c.period}</div>
                                <h3 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0.5rem 0" }}>{c.title}</h3>
                                <p style={{ color: "#a1a1a6", lineHeight: 1.7, maxWidth: "560px", wordBreak: "keep-all" }}>{c.desc}</p>
                                <p style={{ color: "#FE7502", fontWeight: 700, marginTop: "0.5rem" }}>→ {c.takeaway}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section ref={rootRef} id="journey-of-mastery" className="mastery-showcase" style={{ position: "relative", background: "#050505", color: "#fff", scrollMarginTop: "60px" }}>
            <ShowcaseSideNav labels={NAV_LABELS} active={activeIdx} visible={navVisible} theme="dark" onJump={jump} />
            <div className="mastery-showcase__stage" style={{ height: "100vh", overflow: "hidden", display: "flex", alignItems: "center" }}>
                <div className="mastery-showcase__inner">

                    <div className="mastery-showcase__copy-area">
                        <div data-m-intro="" className="mastery-showcase__block">
                            <p style={{ color: "#FE7502", fontWeight: 800, letterSpacing: "0.2em", fontSize: "0.8rem", marginBottom: "1.2rem" }}>JOURNEY OF MASTERY</p>
                            <h2 style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", fontWeight: 900, lineHeight: 1.18, letterSpacing: "-0.03em", wordBreak: "keep-all" }}>
                                당신 안에, 아직 아무도<br />못 들어본 목소리가 있습니다
                            </h2>
                            <p style={{ color: "#a1a1a6", fontSize: "1.05rem", fontWeight: 500, marginTop: "1.6rem", lineHeight: 1.7, wordBreak: "keep-all" }}>
                                그걸 꺼내는 데 14년의 탐구가 필요했습니다.
                            </p>
                            <div style={{ marginTop: "1.8rem", display: "inline-block", padding: "0.7rem 1.4rem", background: "rgba(254, 117, 2, 0.1)", border: "1px solid rgba(254, 117, 2, 0.3)", borderRadius: "50px", color: "#FE7502", fontWeight: 800, fontSize: "0.95rem" }}>
                                잘 부르는 법이 아니라, 안 무너지는 소리를 만듭니다.
                            </div>
                        </div>

                        {CHAPTERS.map((c) => (
                            <div key={c.no} data-m-copy="" className="mastery-showcase__block">
                                <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "1rem" }}>
                                    <span style={{ fontSize: "clamp(2.6rem, 5.5vw, 4rem)", fontWeight: 900, color: "#FE7502", letterSpacing: "-0.03em" }}>{c.no}</span>
                                    <span style={{ color: "#86868b", fontWeight: 800, letterSpacing: "0.16em", fontSize: "0.85rem" }}>{c.period}</span>
                                </div>
                                <h3 style={{ fontSize: "clamp(1.9rem, 4.2vw, 3rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.02em" }}>
                                    {c.title}
                                </h3>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "1.2rem" }}>
                                    {c.badges.map((b) => (
                                        <span key={b} style={{ padding: "6px 14px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 700, color: "#fff" }}>
                                            {b}
                                        </span>
                                    ))}
                                </div>
                                <p style={{ color: "#a1a1a6", fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)", fontWeight: 500, marginTop: "1.3rem", lineHeight: 1.75, maxWidth: "480px", wordBreak: "keep-all" }}>
                                    {c.desc}
                                </p>
                                <p style={{ color: "#FE7502", fontWeight: 800, marginTop: "1rem", fontSize: "1rem" }}>
                                    → 수강생은 여기서 {c.takeaway}를 가져갑니다.
                                </p>
                            </div>
                        ))}

                        <div data-m-copy="" className="mastery-showcase__block">
                            <p style={{ color: "#FE7502", fontWeight: 800, letterSpacing: "0.2em", fontSize: "0.8rem", marginBottom: "1.2rem" }}>THE MAP</p>
                            <h3 style={{ fontSize: "clamp(2rem, 4.6vw, 3.2rem)", fontWeight: 900, lineHeight: 1.2, letterSpacing: "-0.03em", wordBreak: "keep-all" }}>
                                이 14년의 축적은 경력 소개가 아니라,<br />
                                당신이 더 빨리 바뀌기 위한 <span style={{ color: "#FE7502" }}>압축된 지도</span>입니다.
                            </h3>
                        </div>
                    </div>

                    <div className="mastery-showcase__visual">{visual}</div>
                </div>
            </div>

            <div className="mastery-showcase__progress" aria-hidden="true">
                {NAV_LABELS.map((label, i) => (
                    <span
                        key={label}
                        className="mastery-showcase__seg"
                        style={{ background: i <= activeIdx ? "#FE7502" : "rgba(255,255,255,0.18)" }}
                    />
                ))}
            </div>

            <style jsx>{`
                .mastery-showcase__inner {
                    width: 100%;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 2rem;
                    display: grid;
                    grid-template-columns: 1.2fr 1fr;
                    align-items: center;
                    gap: 3rem;
                    height: 100%;
                }

                .mastery-showcase__copy-area {
                    position: relative;
                    height: 460px;
                }

                .mastery-showcase__block {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .mastery-showcase__visual {
                    height: min(70vh, 580px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .mastery-showcase__progress {
                    display: none;
                    position: absolute;
                    left: 50%;
                    bottom: 24px;
                    transform: translateX(-50%);
                    gap: 8px;
                    z-index: 6;
                }

                .mastery-showcase__seg {
                    width: 24px;
                    height: 3px;
                    border-radius: 999px;
                    transition: background 0.3s ease;
                }

                @media (max-width: 860px) {
                    .mastery-showcase__inner {
                        grid-template-columns: 1fr;
                        gap: 0.8rem;
                        align-content: start;
                        /* clear fixed header (56px) + subnav (62px) */
                        padding-top: 122px;
                        padding-bottom: 3rem;
                    }

                    .mastery-showcase__visual {
                        order: -1;
                        height: min(18vh, 165px);
                    }

                    .mastery-showcase__copy-area {
                        height: 465px;
                    }

                    .mastery-showcase__block {
                        justify-content: flex-start;
                    }

                    .mastery-showcase__progress {
                        display: flex;
                    }
                }

                @media (max-width: 860px) and (max-height: 740px) {
                    .mastery-showcase__inner {
                        padding-top: 122px;
                        gap: 0.4rem;
                    }
                    .mastery-showcase__visual {
                        display: none;
                    }
                    .mastery-showcase__copy-area {
                        height: 456px;
                    }
                }
            `}</style>
        </section>
    );
}
