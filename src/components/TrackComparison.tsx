"use client";

import Link from "next/link";
import { SMARTPLACE_URL } from "@/lib/site";
import { trackKickoff } from "@/lib/kickoff";

interface TrackComparisonProps {
    currentTrack?: string;
}

export default function TrackComparison({ currentTrack }: TrackComparisonProps) {
    const tracks = [
        {
            name: "Daily",
            label: "ONLINE",
            price: "₩120,000",
            priceNote: "월",
            desc: "혼자일 때도 성장이 멈추지 않는 데일리 루틴",
            href: "/spark",
            color: "var(--sun-khaki-deep)",
            featured: false,
        },
        {
            name: "Signature",
            label: "BEST VALUE",
            price: "₩440,000",
            priceNote: "월",
            desc: "주 1회 50분 1:1 트레이닝 + 아티스트웨이 크루 지원 자격",
            href: "/signature",
            color: "var(--sun-khaki-deep)",
            featured: true,
        },
        {
            name: "Compression 15",
            label: "COMPRESSION 15",
            price: "15주 · 30회",
            priceNote: "기수제 · 정원 있음",
            desc: "주 2회 70분 × 15주, 30회 전부 1:1 집중 트레이닝",
            href: "https://compression15.seesunmusic.com",
            color: "var(--sun-khaki-deep)",
            featured: false,
        },
    ];

    const features: { label: string; values: string[]; bonusRow?: boolean }[] = [
        { label: "1:1 세션", values: ["—", "주 1회 50분", "주 2회 70분"] },
        { label: "보컬 코칭", values: ["온라인 피드백", "✓", "✓"] },
        { label: "레코딩 디렉팅", values: ["—", "✓", "—"], bonusRow: true },
        { label: "깊은 발음 · 노래 · 녹음", values: ["—", "✓", "✓"] },
        { label: "음원 녹음", values: ["—", "✓", "—"], bonusRow: true },
        { label: "믹스/마스터링 (음원 완성)", values: ["—", "✓", "—"], bonusRow: true },
        { label: "데일리 코스 (온라인)", values: ["본 상품", "포함", "—"], bonusRow: true },
        { label: "아티스트웨이 크루", values: ["—", "지원 자격 (+월 40,000원)", "수료 후 지원 자격"] },
        { label: "완주 후 애프터케어", values: ["—", "—", "시그니처 월 1회 × 6개월"] },
    ];

    return (
        <section style={{ padding: "8rem 0 6rem", background: "var(--sun-tint)" }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem" }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "4rem" }}>
                    <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, marginBottom: "1rem", letterSpacing: "-0.03em", color: "var(--sun-ink)" }}>
                        SEE:SUN 코스 비교하기
                    </h2>
                    <p style={{ color: "var(--sun-muted)", fontSize: "1.1rem" }}>나에게 맞는 코스를 찾아보세요. 모든 가격은 VAT 포함이며, <a href="/refund" style={{ color: "var(--sun-muted)", textDecoration: "underline" }}>환불 규정</a>을 함께 확인하실 수 있습니다.</p>
                </div>

                {/* Track Cards Row */}
                <div className="track-comparison-card-grid" style={{ display: "grid", gridTemplateColumns: `repeat(${tracks.length}, 1fr)`, gap: "1rem", marginBottom: "3rem" }}>
                    {tracks.map((track, i) => {
                        const isCurrent = currentTrack === track.name;
                        return (
                            <div key={i} style={{
                                background: track.featured ? "var(--sun-khaki)" : "var(--sun-white)",
                                color: track.featured ? "#fff" : "var(--sun-ink)",
                                borderRadius: "24px",
                                padding: "2rem 1.5rem",
                                textAlign: "center",
                                border: track.featured ? "none" : "1px solid var(--sun-line)",
                                borderTop: track.featured ? "6px solid var(--sun-orange)" : "6px solid var(--sun-khaki)",
                                position: "relative",
                                boxShadow: track.featured ? "0 15px 40px rgba(118, 118, 72, 0.18)" : "none",
                            }}>
                                {track.featured && (
                                    <span style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: "var(--sun-orange)", color: "var(--sun-ink)", padding: "4px 16px", borderRadius: "20px", fontSize: "0.7rem", fontWeight: 800 }}>BEST VALUE</span>
                                )}
                                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: track.featured ? "#fff" : track.color, letterSpacing: "0.1em" }}>{track.label}</span>
                                <h3 style={{ fontSize: "1.5rem", fontWeight: 900, margin: "0.5rem 0 0.8rem" }}>{track.name}</h3>
                                <div style={{ fontSize: "1.8rem", fontWeight: 900, marginBottom: "0.3rem" }}>{track.price}</div>
                                <div style={{ fontSize: "0.8rem", color: track.featured ? "rgba(255, 255, 255, 0.85)" : "var(--sun-muted)", marginBottom: "1rem" }}>/ {track.priceNote}</div>
                                <p style={{ fontSize: "0.85rem", color: track.featured ? "rgba(255, 255, 255, 0.9)" : "var(--sun-muted)", lineHeight: 1.5, marginBottom: "1.5rem", minHeight: "2.5rem" }}>{track.desc}</p>
                                {isCurrent ? (
                                    <span style={{ display: "inline-block", padding: "0.7rem 1.8rem", borderRadius: "30px", background: track.featured ? "rgba(255, 255, 255, 0.18)" : "var(--sun-tint)", color: track.featured ? "#fff" : "var(--sun-muted)", fontSize: "0.85rem", fontWeight: 700 }}>현재 보고 있는 모델</span>
                                ) : (
                                    <Link href={track.href} style={{ display: "inline-block", padding: "0.7rem 1.8rem", borderRadius: "30px", background: track.featured ? "var(--sun-orange)" : "var(--sun-tint)", color: track.featured ? "#fff" : "var(--sun-ink)", fontSize: "0.85rem", fontWeight: 700, textDecoration: "none" }}>더 알아보기</Link>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Feature Comparison Table */}
                <div style={{ background: "var(--sun-white)", borderRadius: "24px", border: "1px solid var(--sun-line)", overflow: "hidden" }}>
                    <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid var(--sun-line)" }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--sun-ink)" }}>한눈에 보기</h3>
                    </div>
                    <div className="track-comparison-table-scroll" style={{ overflowX: "auto" }}>
                        <div style={{ minWidth: "640px" }}>
                            {features.map((feature, i) => (
                                <div key={i} className="track-comparison-table-row" style={{
                                    display: "grid",
                                    gridTemplateColumns: `200px repeat(${tracks.length}, 1fr)`,
                                    borderBottom: i === features.length - 1 ? "none" : "1px solid var(--sun-line)",
                                    alignItems: "center",
                                }}>
                                    <div style={{ padding: "1rem 2rem", fontWeight: 700, fontSize: "0.9rem", color: "var(--sun-ink)" }}>{feature.label}</div>
                                    {feature.values.map((val, j) => {
                                        const isBonusAndIncluded = feature.bonusRow && val !== "—" && j > 0;
                                        return (
                                            <div key={j} style={{
                                                padding: "1rem",
                                                textAlign: "center",
                                                fontSize: "0.9rem",
                                                fontWeight: val.includes("✓") ? 800 : 500,
                                                color: val === "—" ? "var(--sun-khaki-soft, #c9c9a8)" : val.includes("무제한") ? "var(--sun-khaki-deep)" : "var(--sun-ink)",
                                                background: j === 1 ? "rgba(118, 118, 72, 0.024)" : "transparent",
                                            }}>
                                                {val}
                                                {isBonusAndIncluded && (
                                                    <div style={{ fontSize: "0.65rem", color: "var(--sun-khaki-deep)", fontWeight: 700, marginTop: "2px" }}>멤버십 기간 무료</div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div style={{ textAlign: "center", marginTop: "3rem" }}>
                    <p style={{ color: "var(--sun-muted)", fontSize: "0.95rem", marginBottom: "1rem" }}>어떤 코스가 맞는지 잘 모르겠다면?</p>
                    <a href={SMARTPLACE_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackKickoff("compare_table")} style={{ display: "inline-block", padding: "1rem 3rem", background: "var(--sun-orange)", color: "var(--sun-ink)", borderRadius: "40px", fontWeight: 700, fontSize: "1rem", textDecoration: "none" }}>무료 킥오프 상담 예약</a>
                </div>
            </div>

            <style jsx>{`
                @media (max-width: 768px) {
                    .track-comparison-card-grid {
                        grid-template-columns: repeat(2, 1fr) !important;
                    }

                    .track-comparison-table-row {
                        grid-template-columns: 140px repeat(3, 1fr) !important;
                    }
                }

                @media (max-width: 430px) {
                    .track-comparison-card-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </section>
    );
}
