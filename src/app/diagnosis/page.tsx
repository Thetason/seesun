"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
    DEFAULT_CONSULTATION_TYPE,
    normalizeConsultationType,
} from "@/lib/consultation-intake";

const KAKAO_CHANNEL_URL = "http://pf.kakao.com/_dLEUn";
const KAKAO_CHAT_URL = "http://pf.kakao.com/_dLEUn/chat";
const DIAGNOSIS_FOCUS_OPTIONS = [
    "고음에서 자주 막힌다",
    "음정이 불안하다",
    "목에 힘이 많이 들어간다",
    "음색이 밋밋하다",
    "표현력이 부족하다",
    "무대 자신감이 떨어진다",
];

type DiagnosisFormData = {
    bottlenecks: string[];
    motivation: string;
    timeline: string;
    level: string;
    timeInvestment: string;
    reference: string;
    phone: string;
    email: string;
    type: string;
};

function toggleOption(options: string[], value: string) {
    if (options.includes(value)) {
        return options.filter((item) => item !== value);
    }

    return [...options, value];
}

function DiagnosisPageContent() {
    const searchParams = useSearchParams();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<DiagnosisFormData>(() => ({
        bottlenecks: [],
        motivation: "",
        timeline: "",
        level: "",
        timeInvestment: "",
        reference: "",
        phone: searchParams.get("phone") ?? "",
        email: searchParams.get("email") ?? "",
        type: normalizeConsultationType(searchParams.get("type") ?? DEFAULT_CONSULTATION_TYPE),
    }));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isError, setIsError] = useState(false);

    const nextSubStep = () => setCurrentStep(currentStep + 0.5);
    const nextStep = () => setCurrentStep(Math.floor(currentStep + 1));
    const prevStep = () => setCurrentStep(Math.max(1, currentStep - 0.5));
    const selectedFocusSummary = formData.bottlenecks.join(", ");
    const canAdvancePrimary = formData.bottlenecks.length > 0 && formData.motivation && formData.timeline;
    const canAdvanceSecondary = formData.level && formData.timeInvestment;
    const reportHeadline = formData.bottlenecks.length === 1
        ? `"${formData.bottlenecks[0]}" 영역에서 변화를 만들고 싶으시군요.`
        : `선택하신 ${formData.bottlenecks.length}개 영역에서 성장을 만들고 싶으시군요.`;

    async function handleKakaoConsultation() {
        if (!formData.email) {
            return;
        }

        setIsError(false);
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/consultations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    phone: formData.phone || undefined,
                    type: normalizeConsultationType(formData.type || DEFAULT_CONSULTATION_TYPE),
                    bottleneck: selectedFocusSummary,
                    motivation: formData.motivation,
                    timeline: formData.timeline,
                    level: formData.level,
                    timeInvestment: formData.timeInvestment,
                    reference: formData.reference,
                    notes: "진단 완료 후 카카오톡 상담으로 연결된 이메일 리드",
                    preferredTime: "카카오톡 채팅 연결",
                }),
            });

            if (!response.ok) {
                setIsError(true);
                window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                return;
            }

            window.location.href = KAKAO_CHAT_URL;
        } catch (error) {
            console.error("[Diagnosis] Submission error:", error);
            setIsError(true);
            window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="diagnosis-page" style={{ color: "#ffffff", backgroundColor: "#030304", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <header className="diagnosis-header" style={{ padding: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="diagnosis-header__inner" style={{ maxWidth: "800px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", color: "#86868b", fontSize: "0.9rem", fontWeight: 600 }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "8px" }}>
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                        돌아가기
                    </Link>
                    <span style={{ fontWeight: 700, letterSpacing: "0.1em", color: "#fff", fontSize: "0.8rem" }}>SEE:SUN VOCAL DIAGNOSIS</span>
                </div>
            </header>

            <main className="diagnosis-main" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
                <div className="diagnosis-card" style={{ maxWidth: "600px", width: "100%", background: "rgba(255,255,255,0.02)", padding: "3rem", borderRadius: "32px", border: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(20px)" }}>
                    {currentStep === 1 && (
                        <div>
                            <div style={{ marginBottom: "2.5rem" }}>
                                <span style={{ fontSize: "0.8rem", color: "#FF9F0A", fontWeight: 700, letterSpacing: "0.1em" }}>STEP 01 / 02</span>
                                <h3 style={{ fontSize: "2rem", marginTop: "0.5rem", fontWeight: 700, letterSpacing: "-0.02em" }}>보컬 진단 (1~3)</h3>
                                <p style={{ color: "#86868b", fontSize: "1rem", marginTop: "0.5rem" }}>당신에게 꼭 맞는 로드맵을 설계하기 위한 필수 체크입니다.</p>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                                <div className="form-group">
                                    <label style={{ marginBottom: "1rem", display: "block", color: "#fff", fontWeight: 600, fontSize: "1.1rem" }}>1. 성장&변화 하고 싶은 부분은 어떤 영역이세요?</label>
                                    <p style={{ marginBottom: "0.9rem", color: "#86868b", fontSize: "0.9rem" }}>복수 선택 가능</p>
                                    <div className="diagnosis-option-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.7rem" }}>
                                        {DIAGNOSIS_FOCUS_OPTIONS.map((option) => {
                                            const isSelected = formData.bottlenecks.includes(option);

                                            return (
                                                <button
                                                    key={option}
                                                    type="button"
                                                    onClick={() => setFormData((current) => ({
                                                        ...current,
                                                        bottlenecks: toggleOption(current.bottlenecks, option),
                                                    }))}
                                                    style={{
                                                        padding: "1rem",
                                                        borderRadius: "12px",
                                                        border: isSelected ? "1px solid #FF9F0A" : "1px solid #333",
                                                        background: isSelected ? "rgba(255,159,10,0.1)" : "transparent",
                                                        color: isSelected ? "#FF9F0A" : "#86868b",
                                                        textAlign: "left",
                                                        fontSize: "0.9rem",
                                                        cursor: "pointer",
                                                        transition: "all 0.2s",
                                                    }}
                                                >
                                                    {option}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label style={{ marginBottom: "1rem", display: "block", color: "#fff", fontWeight: 600, fontSize: "1.1rem" }}>2. 왜 지금 이 변화를 만들고 싶으신가요?</label>
                                    <select value={formData.motivation} onChange={(event) => setFormData({ ...formData, motivation: event.target.value })} style={{ background: "#111", border: "1px solid #333", color: "#fff", padding: "1rem", width: "100%", borderRadius: "12px", fontSize: "1rem" }}>
                                        <option value="">상황 선택</option>
                                        <option>취미로 제대로 배우고 싶다</option>
                                        <option>콘텐츠/녹음 퀄리티를 올리고 싶다</option>
                                        <option>공연/오디션/입시 준비</option>
                                        <option>나만의 보컬 정체성 구축</option>
                                        <option>독학의 한계를 느낌</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label style={{ marginBottom: "1rem", display: "block", color: "#fff", fontWeight: 600, fontSize: "1.1rem" }}>3. 원하는 변화는 언제까지 필요하신가요?</label>
                                    <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap" }}>
                                        {["최대한 빨리", "1~3개월 안", "3~6개월 안", "특정 일정 있음"].map((option) => (
                                            <button key={option} type="button" onClick={() => setFormData({ ...formData, timeline: option })} style={{ padding: "0.7rem 1.2rem", borderRadius: "30px", border: formData.timeline === option ? "1px solid #FF9F0A" : "1px solid #333", background: formData.timeline === option ? "#FF9F0A" : "transparent", color: formData.timeline === option ? "#000" : "#86868b", fontSize: "0.9rem", cursor: "pointer", transition: "all 0.2s" }}>{option}</button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    style={{
                                        background: canAdvancePrimary ? "#fff" : "#333",
                                        color: canAdvancePrimary ? "#000" : "#666",
                                        marginTop: "1.5rem",
                                        padding: "1.2rem",
                                        borderRadius: "16px",
                                        fontWeight: 700,
                                        fontSize: "1.1rem",
                                        border: "none",
                                        cursor: canAdvancePrimary ? "pointer" : "not-allowed",
                                    }}
                                    onClick={nextSubStep}
                                    disabled={!canAdvancePrimary}
                                >
                                    다음 단계 (4~6)
                                </button>
                            </div>
                        </div>
                    )}

                    {currentStep === 1.5 && (
                        <div>
                            <div style={{ marginBottom: "2.5rem" }}>
                                <span style={{ fontSize: "0.8rem", color: "#FF9F0A", fontWeight: 700, letterSpacing: "0.1em" }}>STEP 01 / 02</span>
                                <h3 style={{ fontSize: "2rem", marginTop: "0.5rem", fontWeight: 700, letterSpacing: "-0.02em" }}>보컬 진단 (4~6)</h3>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                                <div className="form-group">
                                    <label style={{ marginBottom: "1rem", display: "block", color: "#fff", fontWeight: 600, fontSize: "1.1rem" }}>4. 현재 본인의 상태는?</label>
                                    <div className="diagnosis-option-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.7rem" }}>
                                        {["완전 초보", "독학 경험", "레슨 경험 있음", "공연/녹음 경험 있음"].map((option) => (
                                            <button key={option} type="button" onClick={() => setFormData({ ...formData, level: option })} style={{ padding: "1rem", borderRadius: "12px", border: formData.level === option ? "1px solid #FF9F0A" : "1px solid #333", background: formData.level === option ? "rgba(255,159,10,0.1)" : "transparent", color: formData.level === option ? "#FF9F0A" : "#86868b", cursor: "pointer", fontSize: "0.9rem" }}>{option}</button>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label style={{ marginBottom: "1rem", display: "block", color: "#fff", fontWeight: 600, fontSize: "1.1rem" }}>5. 주당 연습 투자 가능 시간?</label>
                                    <select value={formData.timeInvestment} onChange={(event) => setFormData({ ...formData, timeInvestment: event.target.value })} style={{ background: "#111", border: "1px solid #333", color: "#fff", padding: "1rem", width: "100%", borderRadius: "12px", fontSize: "1rem" }}>
                                        <option value="">시간 선택</option>
                                        <option>주 1시간 미만</option>
                                        <option>주 1~3시간</option>
                                        <option>주 3~5시간</option>
                                        <option>주 5시간 이상</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label style={{ marginBottom: "1rem", display: "block", color: "#fff", fontWeight: 600, fontSize: "1.1rem" }}>6. 참고하는 아티스트 또는 곡 (선택)</label>
                                    <input type="text" placeholder="예: 박효신 - 야생화" value={formData.reference} onChange={(event) => setFormData({ ...formData, reference: event.target.value })} style={{ background: "#111", border: "1px solid #333", color: "#fff", padding: "1rem", width: "100%", borderRadius: "12px", fontSize: "1rem" }} />
                                </div>

                                <div className="diagnosis-actions-row" style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                                    <button type="button" onClick={prevStep} style={{ flex: 1, padding: "1.2rem", borderRadius: "16px", background: "rgba(255,255,255,0.05)", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer" }}>이전</button>
                                    <button
                                        type="button"
                                        style={{
                                            flex: 2,
                                            background: canAdvanceSecondary ? "#fff" : "#333",
                                            color: canAdvanceSecondary ? "#000" : "#666",
                                            padding: "1.2rem",
                                            borderRadius: "16px",
                                            fontWeight: 700,
                                            fontSize: "1.1rem",
                                            border: "none",
                                            cursor: canAdvanceSecondary ? "pointer" : "not-allowed",
                                        }}
                                        onClick={nextStep}
                                        disabled={!canAdvanceSecondary}
                                    >
                                        진단 결과 보기
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div>
                            <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
                                <span style={{ display: "inline-block", fontSize: "0.8rem", color: "#FF9F0A", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "1rem" }}>STEP 02 / 02</span>
                                <div style={{ width: "64px", height: "64px", background: "rgba(255,159,10,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF9F0A" strokeWidth="2.5">
                                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                    </svg>
                                </div>
                                <h3 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.02em" }}>진단 분석 리포트</h3>
                                <p style={{ color: "#FF9F0A", fontWeight: 700, marginTop: "0.7rem", fontSize: "1.1rem" }}>
                                    {reportHeadline}
                                </p>
                                <p style={{ color: "#86868b", lineHeight: 1.6, marginTop: "0.9rem" }}>
                                    선택 영역: <span style={{ color: "#fff" }}>{selectedFocusSummary}</span>
                                </p>
                            </div>

                            <div style={{ background: "rgba(255,255,255,0.03)", padding: "2rem", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)", marginBottom: "2rem" }}>
                                <p style={{ color: "#86868b", fontSize: "1.05rem", lineHeight: 1.7 }}>
                                    분석 결과, 킥오프 상담에서는 다음 <span style={{ color: "#fff", fontWeight: 700 }}>3가지 핵심 전략</span>을 도출하게 됩니다:
                                </p>
                                <ul style={{ color: "#fff", marginTop: "1.5rem", listStyle: "none", padding: 0 }}>
                                    <li style={{ marginBottom: "1.2rem", display: "flex", alignItems: "flex-start", gap: "12px", fontSize: "1.1rem" }}>
                                        <span style={{ color: "#FF9F0A", fontWeight: 900 }}>✓</span>
                                        <span><strong style={{ color: "#FF9F0A" }}>선택하신 핵심 영역</strong>의 해결방법</span>
                                    </li>
                                    <li style={{ marginBottom: "1.2rem", display: "flex", alignItems: "flex-start", gap: "12px", fontSize: "1.1rem" }}>
                                        <span style={{ color: "#FF9F0A", fontWeight: 900 }}>✓</span>
                                        <span><strong style={{ color: "#fff" }}>{formData.timeline}</strong> 내 달성 가능한 압축 로드맵</span>
                                    </li>
                                    <li style={{ display: "flex", alignItems: "flex-start", gap: "12px", fontSize: "1.1rem" }}>
                                        <span style={{ color: "#FF9F0A", fontWeight: 900 }}>✓</span>
                                        <span><strong style={{ color: "#fff" }}>{formData.timeInvestment}</strong> 최적화 연습 프로토콜</span>
                                    </li>
                                </ul>
                            </div>

                            <div style={{ background: "rgba(255,255,255,0.03)", padding: "1.8rem", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)", marginBottom: "1.5rem" }}>
                                <h4 style={{ fontSize: "1.2rem", marginBottom: "0.8rem", color: "#fff" }}>이메일만 남기면 바로 카카오톡 상담으로 이어집니다</h4>
                                <p style={{ color: "#86868b", lineHeight: 1.6, marginBottom: "1.2rem", fontSize: "0.95rem" }}>
                                    진단 기록을 저장하고, 필요한 경우 리포트 요약을 보내드릴 수 있도록 이메일만 받고 있어요.
                                </p>

                                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                    <div>
                                        <label style={{ display: "block", marginBottom: "0.6rem", color: "#86868b", fontSize: "0.95rem" }}>이메일 주소</label>
                                        <input
                                            type="email"
                                            placeholder="example@email.com"
                                            value={formData.email}
                                            onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                                            style={{ background: "#111", border: "1px solid #333", color: "#fff", padding: "1rem", width: "100%", borderRadius: "12px", fontSize: "1rem" }}
                                        />
                                    </div>

                                    <div style={{ background: "rgba(255,159,10,0.05)", padding: "1.2rem", borderRadius: "12px", border: "1px solid rgba(255,159,10,0.1)", fontSize: "0.9rem", color: "#86868b", lineHeight: 1.6 }}>
                                        <strong style={{ color: "#FF9F0A" }}>[비공개 운영 안내]</strong><br />
                                        모든 진단 기록은 비공개로 관리되며, 이메일 저장 후 카카오톡 채팅으로 바로 연결됩니다.
                                    </div>

                                    {isError && (
                                        <div style={{ background: "rgba(255,59,48,0.1)", padding: "1.2rem", borderRadius: "16px", border: "1px solid rgba(255,59,48,0.2)", textAlign: "center" }}>
                                            <p style={{ color: "#FF3B30", fontWeight: 700, marginBottom: "0.6rem" }}>일시적인 오류로 자동 연결이 되지 않았습니다.</p>
                                            <p style={{ color: "#86868b", fontSize: "0.9rem", marginBottom: "1rem" }}>아래 버튼으로 바로 카카오톡 상담을 이어가실 수 있습니다.</p>
                                            <a href={KAKAO_CHAT_URL} target="_blank" rel="noreferrer" style={{ display: "inline-block", background: "#FEE500", padding: "12px 16px", borderRadius: "12px", color: "#000", textDecoration: "none", fontSize: "0.95rem", fontWeight: 800 }}>💬 카카오톡으로 바로 문의하기</a>
                                        </div>
                                    )}

                                    <div className="diagnosis-actions-row" style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                                        <button type="button" onClick={prevStep} style={{ flex: 1, padding: "1.2rem", borderRadius: "16px", background: "rgba(255,255,255,0.05)", color: "#fff", border: "none", fontWeight: 600, cursor: "pointer" }}>이전</button>
                                        <button
                                            type="button"
                                            style={{
                                                flex: 2,
                                                padding: "1.2rem",
                                                borderRadius: "16px",
                                                background: formData.email ? "#FEE500" : "#333",
                                                color: formData.email ? "#000" : "#666",
                                                border: "none",
                                                fontWeight: 800,
                                                fontSize: "1.05rem",
                                                cursor: formData.email ? "pointer" : "not-allowed",
                                            }}
                                            onClick={handleKakaoConsultation}
                                            disabled={!formData.email || isSubmitting}
                                        >
                                            {isSubmitting ? "카카오톡 연결 중..." : "이메일 남기고 카카오톡 상담 이어가기"}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                                <a
                                    href={KAKAO_CHAT_URL}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        display: "block",
                                        width: "100%",
                                        padding: "1rem 1.2rem",
                                        borderRadius: "16px",
                                        background: "rgba(255,255,255,0.05)",
                                        color: "#fff",
                                        textDecoration: "none",
                                        fontWeight: 700,
                                        fontSize: "0.98rem",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                    }}
                                >
                                    이메일 없이 바로 카카오톡으로 문의하기
                                </a>
                                <a
                                    href={KAKAO_CHANNEL_URL}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        display: "inline-block",
                                        color: "#86868b",
                                        textDecoration: "none",
                                        fontSize: "0.9rem",
                                        fontWeight: 600,
                                    }}
                                >
                                    채널 먼저 보기
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <style jsx global>{`
                .diagnosis-page input,
                .diagnosis-page select,
                .diagnosis-page textarea,
                .diagnosis-page button {
                    box-sizing: border-box;
                }

                @media (max-width: 768px) {
                    .diagnosis-page .diagnosis-header {
                        padding: 1rem !important;
                    }

                    .diagnosis-page .diagnosis-header__inner {
                        gap: 0.75rem !important;
                        align-items: flex-start !important;
                    }

                    .diagnosis-page .diagnosis-header__inner span {
                        font-size: 0.72rem !important;
                        text-align: right;
                        line-height: 1.4;
                    }

                    .diagnosis-page .diagnosis-main {
                        padding: 1rem !important;
                        align-items: flex-start !important;
                    }

                    .diagnosis-page .diagnosis-card {
                        padding: 1.5rem !important;
                        border-radius: 24px !important;
                    }

                    .diagnosis-page .diagnosis-option-grid,
                    .diagnosis-page .diagnosis-actions-row {
                        grid-template-columns: 1fr !important;
                        display: grid !important;
                    }

                    .diagnosis-page h3 {
                        font-size: 1.7rem !important;
                    }

                    .diagnosis-page p,
                    .diagnosis-page li,
                    .diagnosis-page label,
                    .diagnosis-page input,
                    .diagnosis-page select,
                    .diagnosis-page textarea,
                    .diagnosis-page button {
                        font-size: 0.95rem !important;
                    }
                }

                @media (max-width: 430px) {
                    .diagnosis-page .diagnosis-card {
                        padding: 1.15rem !important;
                        border-radius: 20px !important;
                    }

                    .diagnosis-page h3 {
                        font-size: 1.45rem !important;
                        line-height: 1.15 !important;
                    }

                    .diagnosis-page .diagnosis-header__inner a {
                        font-size: 0.82rem !important;
                    }
                }
            `}</style>
        </div>
    );
}

function DiagnosisPageFallback() {
    return (
        <div className="diagnosis-page" style={{ color: "#ffffff", backgroundColor: "#030304", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px", padding: "2rem 2.5rem", color: "#86868b" }}>
                진단 페이지를 준비하고 있습니다...
            </div>
        </div>
    );
}

export default function DiagnosisPage() {
    return (
        <Suspense fallback={<DiagnosisPageFallback />}>
            <DiagnosisPageContent />
        </Suspense>
    );
}
