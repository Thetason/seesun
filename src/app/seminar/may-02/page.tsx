import { prisma } from "@/lib/prisma";
import SeminarSignupForm from "./SeminarSignupForm";
import {
    MAY_02_SEMINAR_DATE_LABEL,
    MAY_02_SEMINAR_DURATION_LABEL,
    MAY_02_SEMINAR_EARLY_BIRD_LIMIT,
    MAY_02_SEMINAR_EARLY_BIRD_PRICE,
    MAY_02_SEMINAR_REGULAR_PRICE,
    MAY_02_SEMINAR_TYPE,
    formatWon,
    getMay02SeminarPricing,
} from "@/lib/seminar-may-02";

export const dynamic = "force-dynamic";

export default async function May02SeminarPage() {
    const applicationCount = await prisma.consultation.count({
        where: {
            type: MAY_02_SEMINAR_TYPE,
        },
    });
    const pricing = getMay02SeminarPricing(applicationCount);

    return (
        <main
            style={{
                minHeight: "100vh",
                background: "linear-gradient(180deg, #fbfbfd 0%, #f1f2f5 100%)",
                color: "#111217",
                padding: "56px 20px 96px",
            }}
        >
            <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
                <section
                    className="seminar-hero-grid"
                    style={{
                        display: "grid",
                        gap: "28px",
                        gridTemplateColumns: "minmax(0, 1.02fr) minmax(360px, 0.98fr)",
                        alignItems: "start",
                    }}
                >
                    <div
                        className="seminar-hero-copy"
                        style={{
                            padding: "20px 4px 0 4px",
                        }}
                    >
                        <div style={{ fontSize: "0.92rem", fontWeight: 800, letterSpacing: "0.12em", color: "#ff9f0a" }}>
                            SEE:SUN SEMINAR
                        </div>
                        <h1
                            style={{
                                marginTop: "18px",
                                fontSize: "clamp(3.2rem, 8vw, 6.2rem)",
                                lineHeight: 0.93,
                                letterSpacing: "-0.06em",
                                fontWeight: 900,
                            }}
                        >
                            여러분들은 지금
                            <br />
                            중요한 걸
                            <br />
                            놓치고 계실 수도 있어요.
                        </h1>
                        <p
                            style={{
                                marginTop: "26px",
                                fontSize: "1.12rem",
                                lineHeight: 1.9,
                                color: "#62636b",
                                maxWidth: "620px",
                            }}
                        >
                            혼자 노래 연습하실 때에도 정확하게 연습할 수 있는 방법들.
                            <br />
                            이번에 종합선물세트처럼 한 번에 정리해드립니다.
                        </p>
                        <div className="seminar-hero-chips" style={{ marginTop: "24px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                            {[
                                MAY_02_SEMINAR_DATE_LABEL,
                                MAY_02_SEMINAR_DURATION_LABEL,
                                pricing.priceLabel,
                            ].map((item) => (
                                <span
                                    key={item}
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        borderRadius: "999px",
                                        padding: "12px 16px",
                                        background: "rgba(255,255,255,0.7)",
                                        border: "1px solid rgba(17,18,23,0.06)",
                                        color: "#35363c",
                                        fontSize: "0.94rem",
                                        fontWeight: 700,
                                        backdropFilter: "blur(10px)",
                                    }}
                                >
                                    {item}
                                </span>
                            ))}
                        </div>

                        <div className="seminar-hero-notes" style={{ marginTop: "42px", display: "grid", gap: "16px", maxWidth: "680px" }}>
                            <div
                                className="seminar-note-card"
                                style={{
                                    borderRadius: "30px",
                                    background: "rgba(255,255,255,0.82)",
                                    border: "1px solid rgba(17,18,23,0.06)",
                                    padding: "24px 26px",
                                    boxShadow: "0 18px 40px rgba(17,18,23,0.05)",
                                }}
                            >
                                <div style={{ fontSize: "0.82rem", fontWeight: 800, letterSpacing: "0.1em", color: "#ff9f0a" }}>
                                    WHY NOW
                                </div>
                                <p style={{ marginTop: "12px", fontSize: "1.04rem", lineHeight: 1.82, color: "#55565c" }}>
                                    10만 명이 제 컨텐츠를 보셨고, 천 명이 넘는 분들이 자료를 받아가셨지만
                                    혼자 연습하실 때 진짜 중요한 걸 놓치고 계신 경우를 정말 많이 봤어요.
                                </p>
                            </div>
                            <div
                                className="seminar-note-card seminar-note-card-dark"
                                style={{
                                    borderRadius: "30px",
                                    background: "#111217",
                                    color: "#ffffff",
                                    padding: "28px 30px",
                                    boxShadow: "0 24px 60px rgba(17,18,23,0.14)",
                                }}
                            >
                                <div style={{ fontSize: "0.82rem", fontWeight: 800, letterSpacing: "0.1em", color: "#ffb84d" }}>
                                    KEY MESSAGE
                                </div>
                                <p style={{ marginTop: "12px", fontSize: "1.3rem", lineHeight: 1.55, fontWeight: 700 }}>
                                    메시지로 여러 번 묻는 것보다,
                                    <br />
                                    이번 한 번의 세미나가
                                    <br />
                                    오히려 시간을 더 아껴드릴 수 있어요.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="seminar-signup-shell">
                        <SeminarSignupForm
                            priceLabel={pricing.priceLabel}
                            remainingEarlyBirdSpots={pricing.remainingEarlyBirdSpots}
                        />
                    </div>
                </section>

                <section
                    className="seminar-benefit-grid"
                    style={{
                        marginTop: "36px",
                        display: "grid",
                        gap: "18px",
                        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    }}
                >
                    {[
                        {
                            title: "컨텐츠를 봐도 여전히 헷갈리는 분",
                            body: "내 몸에 어떻게 적용해야 하는지 모르겠고, 혼자 연습할수록 더 막막한 분들께 맞습니다.",
                        },
                        {
                            title: "한 번쯤 체크받아보고 싶었던 분",
                            body: "내가 지금 맞게 하고 있는지, 무엇부터 먼저 고쳐야 하는지 기준을 잡고 싶은 분들께 도움이 됩니다.",
                        },
                        {
                            title: "오히려 시간을 아끼고 싶은 분",
                            body: "메시지로 여러 번 묻는 것보다, 이번 한 번의 세미나로 핵심을 빠르게 정리하고 싶은 분들을 위한 자리입니다.",
                        },
                    ].map((item) => (
                        <article
                            key={item.title}
                            style={{
                                borderRadius: "30px",
                                background: "rgba(255,255,255,0.78)",
                                padding: "26px",
                                border: "1px solid rgba(17,18,23,0.06)",
                                boxShadow: "0 16px 40px rgba(17,18,23,0.05)",
                            }}
                        >
                            <h3 style={{ fontSize: "1.18rem", fontWeight: 800, lineHeight: 1.35, letterSpacing: "-0.03em" }}>{item.title}</h3>
                            <p style={{ marginTop: "12px", color: "#686970", lineHeight: 1.78 }}>{item.body}</p>
                        </article>
                    ))}
                </section>

                <section
                    style={{
                        marginTop: "20px",
                        borderRadius: "40px",
                        background: "rgba(255,255,255,0.8)",
                        padding: "38px clamp(24px, 4vw, 48px)",
                        border: "1px solid rgba(17,18,23,0.06)",
                        boxShadow: "0 20px 60px rgba(17,18,23,0.05)",
                    }}
                >
                    <div style={{ fontSize: "0.9rem", fontWeight: 800, letterSpacing: "0.1em", color: "#ff9f0a" }}>
                        WHY THIS SEMINAR
                    </div>
                    <h2 style={{ marginTop: "14px", fontSize: "clamp(2rem, 4vw, 3.2rem)", lineHeight: 1.05, fontWeight: 900, letterSpacing: "-0.05em" }}>
                        오히려 이게 시간을 아끼시는 방법이에요
                    </h2>
                    <div style={{ marginTop: "22px", display: "grid", gap: "18px", color: "#4f5056", lineHeight: 1.9, fontSize: "1.04rem" }}>
                        <p>
                            컨텐츠를 보고 따라하셔도 노래가 잘 안 늘거나, 여전히 잘 모르겠다고 하시는 분들.
                            “아 내가 잘하고 있는지 체크 한번 받고 싶다”, “늘 보컬트레이닝 한번 받아보고 싶었다” 하시는 분들께 아주 도움 될 세미나입니다.
                        </p>
                        <p>
                            이미 10만 명이 제 컨텐츠를 보셨고, 천 명이 넘는 분들이 자료를 받아가셨는데 혼자 연습하실 때 진짜 중요한 걸 놓치고 계신 걸 많이 봤어요.
                            그래서 직접 오셨을 때 한두 가지만 짚어드려도 소리가 확 바뀌는 경우가 많습니다.
                        </p>
                        <p style={{ fontWeight: 800, color: "#111217" }}>
                            이번 세미나에서는 여러분들이 혼자 연습하실 때 어떻게 연습할 수 있을지, 자가발전 하실 수 있는 연습 방법들과 놓치고 계셨던 핵심까지 같이 잡아드리는 완전 알짜배기 실전 세미나로 진행됩니다.
                        </p>
                    </div>

                    <div
                        className="seminar-meta-grid"
                        style={{
                            marginTop: "28px",
                            display: "grid",
                            gap: "16px",
                            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                        }}
                    >
                        {[
                            {
                                label: "참가비",
                                value: `선착순 ${MAY_02_SEMINAR_EARLY_BIRD_LIMIT}명 ${formatWon(MAY_02_SEMINAR_EARLY_BIRD_PRICE)}`,
                            },
                            {
                                label: "정상가",
                                value: formatWon(MAY_02_SEMINAR_REGULAR_PRICE),
                            },
                            {
                                label: "보너스",
                                value: "추첨 1명 4회 서포트",
                            },
                        ].map((item) => (
                            <div
                                key={item.label}
                                style={{
                                    borderRadius: "24px",
                                    background: "#f6f6f8",
                                    padding: "20px 22px",
                                    border: "1px solid rgba(17,18,23,0.05)",
                                }}
                            >
                                <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "#8b8c93", letterSpacing: "0.08em" }}>
                                    {item.label}
                                </div>
                                <div style={{ marginTop: "10px", fontSize: "1.12rem", fontWeight: 800, letterSpacing: "-0.03em" }}>
                                    {item.value}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <style>{`
                    @media (max-width: 1200px) {
                        .seminar-hero-copy h1 {
                            font-size: clamp(2.9rem, 8vw, 5.1rem) !important;
                        }
                    }

                    @media (max-width: 980px) {
                        main {
                            padding: 26px 14px 72px !important;
                        }

                        .seminar-hero-grid {
                            grid-template-columns: 1fr !important;
                            gap: 18px !important;
                        }

                        .seminar-signup-shell {
                            order: -1;
                        }

                        .seminar-hero-copy {
                            padding-top: 0 !important;
                        }

                        .seminar-hero-copy h1 {
                            margin-top: 12px !important;
                            font-size: clamp(2.25rem, 11vw, 3.4rem) !important;
                            line-height: 0.98 !important;
                            letter-spacing: -0.07em !important;
                        }

                        .seminar-hero-copy p {
                            font-size: 0.98rem !important;
                            line-height: 1.72 !important;
                        }

                        .seminar-hero-chips {
                            gap: 8px !important;
                        }

                        .seminar-hero-chips span {
                            width: 100%;
                            justify-content: center;
                            padding: 11px 14px !important;
                            font-size: 0.88rem !important;
                        }

                        .seminar-hero-notes {
                            margin-top: 24px !important;
                            gap: 12px !important;
                        }

                        .seminar-note-card {
                            border-radius: 24px !important;
                            padding: 20px 18px !important;
                        }

                        .seminar-note-card-dark p {
                            font-size: 1.08rem !important;
                            line-height: 1.5 !important;
                        }

                        .seminar-benefit-grid {
                            margin-top: 20px !important;
                            gap: 12px !important;
                        }

                        .seminar-benefit-grid article {
                            border-radius: 24px !important;
                            padding: 20px 18px !important;
                        }

                        .seminar-meta-grid {
                            gap: 12px !important;
                        }
                    }

                    @media (max-width: 640px) {
                        .seminar-hero-copy h1 {
                            font-size: 2.1rem !important;
                        }

                        .seminar-hero-copy p br {
                            display: none;
                        }

                        .seminar-meta-grid > div {
                            border-radius: 20px !important;
                            padding: 18px 16px !important;
                        }
                    }
                `}</style>
            </div>
        </main>
    );
}
