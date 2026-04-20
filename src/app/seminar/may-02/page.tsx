import { prisma } from "@/lib/prisma";
import SeminarSignupForm from "./SeminarSignupForm";
import {
    MAY_02_SEMINAR_DATE_LABEL,
    MAY_02_SEMINAR_DURATION_LABEL,
    MAY_02_SEMINAR_EARLY_BIRD_LIMIT,
    MAY_02_SEMINAR_EARLY_BIRD_PRICE,
    MAY_02_SEMINAR_REGULAR_PRICE,
    MAY_02_SEMINAR_TITLE,
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
                background: "#f5f5f7",
                color: "#111217",
                padding: "64px 20px 96px",
            }}
        >
            <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
                <section
                    style={{
                        display: "grid",
                        gap: "24px",
                        gridTemplateColumns: "minmax(0, 1.25fr) minmax(300px, 0.75fr)",
                        alignItems: "stretch",
                    }}
                >
                    <div
                        style={{
                            borderRadius: "36px",
                            background: "#ffffff",
                            padding: "40px clamp(24px, 4vw, 52px)",
                            boxShadow: "0 20px 60px rgba(17,18,23,0.08)",
                        }}
                    >
                        <div style={{ fontSize: "0.92rem", fontWeight: 800, letterSpacing: "0.12em", color: "#ff9f0a" }}>
                            SEE:SUN SEMINAR
                        </div>
                        <h1
                            style={{
                                marginTop: "18px",
                                fontSize: "clamp(2.8rem, 7vw, 5.8rem)",
                                lineHeight: 0.95,
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
                                marginTop: "22px",
                                fontSize: "1.08rem",
                                lineHeight: 1.85,
                                color: "#55565c",
                                maxWidth: "760px",
                            }}
                        >
                            혼자 노래 연습하실 때에도 정확하게 연습할 수 있는 방법들.
                            <br />
                            이번에 종합선물세트처럼 한 번에 정리해드립니다.
                        </p>
                        <div style={{ marginTop: "26px", display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center" }}>
                            <a
                                href="#seminar-signup"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "999px",
                                    background: "#111217",
                                    color: "#fff",
                                    padding: "16px 28px",
                                    fontWeight: 800,
                                    textDecoration: "none",
                                }}
                            >
                                지금 세미나 신청하기
                            </a>
                            <div style={{ color: "#86868b", fontWeight: 700 }}>
                                {pricing.isEarlyBird
                                    ? `선착순 ${pricing.remainingEarlyBirdSpots}자리 남았습니다`
                                    : "현재 일반 참가비 구간입니다"}
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            borderRadius: "36px",
                            background: "#ff9f0a",
                            color: "#111217",
                            padding: "34px 30px",
                            boxShadow: "0 20px 60px rgba(255,159,10,0.22)",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            minHeight: "100%",
                        }}
                    >
                        <div>
                            <div style={{ fontSize: "0.9rem", fontWeight: 900, letterSpacing: "0.1em" }}>SPECIAL OFFER</div>
                            <h2 style={{ marginTop: "18px", fontSize: "2.1rem", lineHeight: 1.1, fontWeight: 900 }}>
                                {MAY_02_SEMINAR_TITLE}
                            </h2>
                        </div>
                        <div style={{ display: "grid", gap: "14px", marginTop: "28px" }}>
                            <div>
                                <div style={{ fontSize: "0.82rem", fontWeight: 800, opacity: 0.66 }}>일시</div>
                                <div style={{ marginTop: "4px", fontSize: "1.08rem", fontWeight: 800 }}>{MAY_02_SEMINAR_DATE_LABEL}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: "0.82rem", fontWeight: 800, opacity: 0.66 }}>진행 시간</div>
                                <div style={{ marginTop: "4px", fontSize: "1.08rem", fontWeight: 800 }}>{MAY_02_SEMINAR_DURATION_LABEL}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: "0.82rem", fontWeight: 800, opacity: 0.66 }}>참가비</div>
                                <div style={{ marginTop: "4px", fontSize: "1.08rem", fontWeight: 800 }}>
                                    선착순 {MAY_02_SEMINAR_EARLY_BIRD_LIMIT}명 {formatWon(MAY_02_SEMINAR_EARLY_BIRD_PRICE)}
                                    <br />
                                    이후 {formatWon(MAY_02_SEMINAR_REGULAR_PRICE)}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: "0.82rem", fontWeight: 800, opacity: 0.66 }}>세미나 특전</div>
                                <div style={{ marginTop: "4px", fontSize: "1.08rem", fontWeight: 800 }}>
                                    추첨 1명
                                    <br />
                                    세타쓴 보컬트레이닝 4회 서포트
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    style={{
                        marginTop: "24px",
                        display: "grid",
                        gap: "24px",
                        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
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
                                borderRadius: "28px",
                                background: "#fff",
                                padding: "28px",
                                boxShadow: "0 20px 60px rgba(17,18,23,0.06)",
                            }}
                        >
                            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, lineHeight: 1.3 }}>{item.title}</h3>
                            <p style={{ marginTop: "14px", color: "#66676d", lineHeight: 1.75 }}>{item.body}</p>
                        </article>
                    ))}
                </section>

                <section
                    style={{
                        marginTop: "24px",
                        borderRadius: "36px",
                        background: "#fff",
                        padding: "36px clamp(24px, 4vw, 42px)",
                        boxShadow: "0 20px 60px rgba(17,18,23,0.06)",
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
                </section>

                <SeminarSignupForm
                    priceLabel={pricing.priceLabel}
                    remainingEarlyBirdSpots={pricing.remainingEarlyBirdSpots}
                />
            </div>
        </main>
    );
}
