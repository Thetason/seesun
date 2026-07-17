// TODO: final wording pending tax/legal review before publication
import type { Metadata } from "next";
import Link from "next/link";
import { KICKOFF_CTA_LABEL, SMARTPLACE_URL } from "@/lib/site";

export const metadata: Metadata = {
    title: "환불 규정",
    description: "시선뮤직 아티스트클럽 멤버십·크루 회비·마스터 프로토콜의 해지 및 환불 기준을 안내합니다.",
};

const sections = [
    {
        label: "01 — 월 구독 멤버십 (데일리 · 시그니처)",
        title: "결제일 기준 해지, 잔여 이용분 정산",
        items: [
            "멤버십은 결제일 기준 1개월 단위로 이용하며, 해지는 언제든 신청할 수 있습니다. 해지 신청 시 다음 결제일부터 결제가 발생하지 않습니다.",
            "이용 중 환불을 요청하시는 경우, 해당 결제 건에서 이용일수(또는 진행된 회차)에 해당하는 금액을 공제한 잔액을 환불합니다.",
            "시그니처 3개월 정기결제는 매월 결제되는 각 결제 건을 기준으로 위와 동일하게 정산합니다.",
        ],
    },
    {
        label: "02 — 아티스트웨이 크루 회비",
        title: "월 단위 납부와 하차 기준",
        items: [
            "시즌 개시 전 하차 시 납부한 회비 전액을 환불합니다.",
            "회비는 월 단위로 납부하며, 중도 하차 시 다음 달 회비부터 발생하지 않습니다. 이용 중인 달은 진행된 모임 기준으로 정산합니다.",
            "회비는 다과·운영을 위한 운영비로, 선발 이후에만 납부가 진행됩니다.",
        ],
    },
    {
        label: "03 — 마스터 프로토콜",
        title: "회차 기준 중도 해지 환불",
        items: [
            "중도 해지 시, 전체 30회 회차 중 진행된 회차에 해당하는 금액을 공제한 잔액을 환불합니다.",
            "3회 분할 결제의 경우에도 동일한 회차 기준으로 정산하며, 기수령 금액이 진행 회차분보다 많으면 차액을 환불하고 적으면 차액이 청구될 수 있습니다.",
            "성과 보장(출석률 90% 이상·주간 과제 이행 시 목표 미달에 대한 4주 무상 연장)은 환불이 아닌 기간 연장으로 제공됩니다.",
        ],
    },
    {
        label: "04 — 공통 기준",
        title: "준거 기준과 신청 방법",
        items: [
            "본 환불 규정은 소비자분쟁해결기준(공정거래위원회 고시)을 준거로 합니다.",
            "환불·해지 신청은 담당 코치 또는 공식 채널을 통해 접수해 주세요. 접수일을 기준으로 정산합니다.",
            "환불 금액은 접수 확인 후 영업일 기준 순차적으로 결제 수단 원복 또는 계좌 이체로 지급됩니다.",
        ],
    },
];

export default function RefundPage() {
    return (
        <div style={{ color: "#ffffff", backgroundColor: "#050507", minHeight: "100vh", fontFamily: "var(--font-suit), sans-serif" }}>
            <header style={{ padding: "1.5rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "900px", margin: "0 auto", padding: "0 1.25rem" }}>
                    <Link href="/" style={{ color: "#fff", fontWeight: 800, fontSize: "1.1rem", textDecoration: "none", letterSpacing: "0.1em" }}>SEE:SUN</Link>
                    <span style={{ fontSize: "0.8rem", fontWeight: 900, letterSpacing: "0.12em", color: "rgba(255,255,255,0.6)" }}>환불 규정</span>
                </div>
            </header>

            <main style={{ padding: "5rem 1.25rem 7rem" }}>
                <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                    <span style={{ color: "#FE7502", fontWeight: 800, letterSpacing: "0.3em", fontSize: "0.82rem", display: "block", marginBottom: "1.5rem" }}>REFUND POLICY</span>
                    <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.04em", marginBottom: "1.5rem" }}>
                        환불 규정
                    </h1>
                    <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.8, fontSize: "1.05rem", maxWidth: "640px", marginBottom: "4rem" }}>
                        모든 표시 가격은 VAT 포함 총액입니다. 아래 기준은 상품별 해지·환불의 원칙이며,
                        개별 상황은 접수 시 함께 확인해 드립니다.
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        {sections.map((section) => (
                            <section
                                key={section.label}
                                style={{
                                    background: "rgba(255,255,255,0.02)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    borderRadius: "28px",
                                    padding: "2.5rem",
                                }}
                            >
                                <div style={{ color: "#FE7502", fontWeight: 800, fontSize: "0.8rem", letterSpacing: "0.12em", marginBottom: "1rem" }}>
                                    {section.label}
                                </div>
                                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "1.5rem" }}>
                                    {section.title}
                                </h2>
                                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "1rem" }}>
                                    {section.items.map((item) => (
                                        <li key={item} style={{ display: "flex", gap: "0.9rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.75, fontSize: "1rem" }}>
                                            <span style={{ color: "#FE7502", flexShrink: 0 }} aria-hidden="true">•</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        ))}
                    </div>

                    <div
                        style={{
                            marginTop: "4rem",
                            background: "rgba(254, 117, 2,0.04)",
                            border: "1px solid rgba(254, 117, 2,0.15)",
                            borderRadius: "28px",
                            padding: "2.5rem",
                            textAlign: "center",
                        }}
                    >
                        <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: "1.8rem" }}>
                            환불·해지와 멤버십에 대해 더 궁금한 점이 있다면,
                            <br />
                            무료 킥오프 상담에서 함께 확인해 드립니다.
                        </p>
                        <a
                            href={SMARTPLACE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: "inline-block",
                                background: "#FE7502",
                                color: "#000",
                                padding: "1rem 2.5rem",
                                borderRadius: "100px",
                                fontWeight: 800,
                                fontSize: "1.05rem",
                                textDecoration: "none",
                            }}
                        >
                            {KICKOFF_CTA_LABEL}
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}
