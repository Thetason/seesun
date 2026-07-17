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
            color: "#FE7502",
            featured: false,
        },
        {
            name: "Signature",
            label: "BEST VALUE",
            price: "₩480,000",
            priceNote: "월",
            desc: "주 1회 50분 1:1 트레이닝 + 아티스트웨이 크루 지원 자격",
            href: "/signature",
            color: "#FE7502",
            featured: true,
        },
        {
            name: "Protocol",
            label: "MASTER TRACK",
            price: "₩3,800,000",
            priceNote: "15주 · 분기 5명",
            desc: "80분 코칭 + 세이프존 싱잉 트레이닝",
            href: "/reserve",
            color: "#a78bfa",
            featured: false,
        },
    ];

    const features: { label: string; values: string[]; bonusRow?: boolean }[] = [
        { label: "세션 시간", values: ["—", "50분", "80분"] },
        { label: "보컬 코칭", values: ["온라인 피드백", "✓", "✓"] },
        { label: "레코딩 디렉팅", values: ["—", "✓", "✓"], bonusRow: true },
        { label: "DAP 트레이닝", values: ["—", "✓", "✓"] },
        { label: "음원 녹음", values: ["—", "✓", "✓"], bonusRow: true },
        { label: "믹스/마스터링 (음원 완성)", values: ["—", "✓", "✓"], bonusRow: true },
        { label: "데일리 코스 (온라인)", values: ["본 상품", "포함", "—"], bonusRow: true },
        { label: "아티스트웨이 크루", values: ["—", "지원 자격", "시즌 합류 확정"] },
        { label: "세이프존 싱잉 (실전 경험)", values: ["—", "—", "주 1회"] },
        { label: "졸업연주", values: ["—", "—", "✓"] },
    ];

    return (
        <section style={{ padding: "8rem 0 6rem", background: "#f5f5f7" }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem" }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "4rem" }}>
                    <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, marginBottom: "1rem", letterSpacing: "-0.03em", color: "#1d1d1f" }}>
                        SEE:SUN 코스 비교하기
                    </h2>
                    <p style={{ color: "#86868b", fontSize: "1.1rem" }}>나에게 맞는 코스를 찾아보세요. 모든 가격은 VAT 포함이며, <a href="/refund" style={{ color: "#86868b", textDecoration: "underline" }}>환불 규정</a>을 함께 확인하실 수 있습니다.</p>
                </div>

                {/* Track Cards Row */}
                <div className="track-comparison-card-grid" style={{ display: "grid", gridTemplateColumns: `repeat(${tracks.length}, 1fr)`, gap: "1rem", marginBottom: "3rem" }}>
                    {tracks.map((track, i) => {
                        const isCurrent = currentTrack === track.name;
                        return (
                            <div key={i} style={{
                                background: track.featured ? "#111" : "#fff",
                                color: track.featured ? "#fff" : "#1d1d1f",
                                borderRadius: "24px",
                                padding: "2rem 1.5rem",
                                textAlign: "center",
                                border: track.featured ? "2px solid #FE7502" : "1px solid rgba(0,0,0,0.06)",
                                position: "relative",
                                boxShadow: track.featured ? "0 15px 40px rgba(254, 117, 2,0.15)" : "0 4px 15px rgba(0,0,0,0.04)",
                            }}>
                                {track.featured && (
                                    <span style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: "#FE7502", color: "#000", padding: "4px 16px", borderRadius: "20px", fontSize: "0.7rem", fontWeight: 800 }}>BEST VALUE</span>
                                )}
                                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: track.color, letterSpacing: "0.1em" }}>{track.label}</span>
                                <h3 style={{ fontSize: "1.5rem", fontWeight: 900, margin: "0.5rem 0 0.8rem" }}>{track.name}</h3>
                                <div style={{ fontSize: "1.8rem", fontWeight: 900, marginBottom: "0.3rem" }}>{track.price}</div>
                                <div style={{ fontSize: "0.8rem", color: track.featured ? "rgba(255,255,255,0.5)" : "#86868b", marginBottom: "1rem" }}>/ {track.priceNote}</div>
                                <p style={{ fontSize: "0.85rem", color: track.featured ? "rgba(255,255,255,0.6)" : "#86868b", lineHeight: 1.5, marginBottom: "1.5rem", minHeight: "2.5rem" }}>{track.desc}</p>
                                {isCurrent ? (
                                    <span style={{ display: "inline-block", padding: "0.7rem 1.8rem", borderRadius: "30px", background: "rgba(0,0,0,0.05)", color: "#86868b", fontSize: "0.85rem", fontWeight: 700 }}>현재 보고 있는 모델</span>
                                ) : (
                                    <Link href={track.href} style={{ display: "inline-block", padding: "0.7rem 1.8rem", borderRadius: "30px", background: track.featured ? "#FE7502" : "rgba(0,0,0,0.06)", color: track.featured ? "#000" : "#1d1d1f", fontSize: "0.85rem", fontWeight: 700, textDecoration: "none" }}>더 알아보기</Link>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Feature Comparison Table */}
                <div style={{ background: "#fff", borderRadius: "24px", border: "1px solid rgba(0,0,0,0.06)", overflow: "hidden" }}>
                    <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1d1d1f" }}>한눈에 보기</h3>
                    </div>
                    <div className="track-comparison-table-scroll" style={{ overflowX: "auto" }}>
                        <div style={{ minWidth: "640px" }}>
                            {features.map((feature, i) => (
                                <div key={i} className="track-comparison-table-row" style={{
                                    display: "grid",
                                    gridTemplateColumns: `200px repeat(${tracks.length}, 1fr)`,
                                    borderBottom: i === features.length - 1 ? "none" : "1px solid rgba(0,0,0,0.04)",
                                    alignItems: "center",
                                }}>
                                    <div style={{ padding: "1rem 2rem", fontWeight: 700, fontSize: "0.9rem", color: "#1d1d1f" }}>{feature.label}</div>
                                    {feature.values.map((val, j) => {
                                        const isBonusAndIncluded = feature.bonusRow && val !== "—" && j > 0;
                                        return (
                                            <div key={j} style={{
                                                padding: "1rem",
                                                textAlign: "center",
                                                fontSize: "0.9rem",
                                                fontWeight: val.includes("✓") ? 800 : 500,
                                                color: val === "—" ? "#d1d1d6" : val.includes("무제한") ? "#FE7502" : "#1d1d1f",
                                                background: j === 1 ? "rgba(254, 117, 2,0.03)" : "transparent",
                                            }}>
                                                {val}
                                                {isBonusAndIncluded && (
                                                    <div style={{ fontSize: "0.65rem", color: "#FE7502", fontWeight: 700, marginTop: "2px" }}>멤버십 기간 무료</div>
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
                    <p style={{ color: "#86868b", fontSize: "0.95rem", marginBottom: "1rem" }}>어떤 코스가 맞는지 잘 모르겠다면?</p>
                    <a href={SMARTPLACE_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackKickoff("compare_table")} style={{ display: "inline-block", padding: "1rem 3rem", background: "#1d1d1f", color: "#fff", borderRadius: "40px", fontWeight: 700, fontSize: "1rem", textDecoration: "none" }}>무료 킥오프 상담 예약</a>
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
