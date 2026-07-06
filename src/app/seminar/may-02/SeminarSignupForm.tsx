"use client";

import type { CSSProperties, FormEvent } from "react";
import { useMemo, useState } from "react";
import {
    MAY_02_SEMINAR_DATE_LABEL,
    MAY_02_SEMINAR_DURATION_LABEL,
    MAY_02_SEMINAR_TITLE,
    MAY_02_SEMINAR_TYPE,
} from "@/lib/seminar-may-02";

type SeminarSignupFormProps = {
    priceLabel: string;
    remainingEarlyBirdSpots: number;
};

type FormState = {
    name: string;
    phone: string;
    email: string;
    bottleneck: string;
    depositorName: string;
};

const EMPTY_FORM: FormState = {
    name: "",
    phone: "",
    email: "",
    bottleneck: "",
    depositorName: "",
};

export default function SeminarSignupForm({
    priceLabel,
    remainingEarlyBirdSpots,
}: SeminarSignupFormProps) {
    const [formData, setFormData] = useState<FormState>(EMPTY_FORM);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const canSubmit = useMemo(() => {
        return Boolean(
            formData.name.trim() &&
            formData.phone.trim() &&
            formData.email.trim() &&
            formData.bottleneck.trim()
        );
    }, [formData]);

    const updateField = (key: keyof FormState, value: string) => {
        setFormData((current) => ({
            ...current,
            [key]: value,
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!canSubmit) {
            setErrorMessage("이름, 연락처, 이메일, 고민 내용은 꼭 입력해 주세요.");
            return;
        }

        setIsSubmitting(true);
        setErrorMessage("");

        try {
            const response = await fetch("/api/consultations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    phone: formData.phone.trim(),
                    email: formData.email.trim(),
                    type: MAY_02_SEMINAR_TYPE,
                    notes: [
                        `세미나명: ${MAY_02_SEMINAR_TITLE}`,
                        `진행 일시: ${MAY_02_SEMINAR_DATE_LABEL}`,
                        `예상 소요: ${MAY_02_SEMINAR_DURATION_LABEL}`,
                        `신청 경로: 공개 세미나 신청 링크`,
                        `참가비 안내 문구: ${priceLabel}`,
                    ].join("\n"),
                    bottleneck: formData.bottleneck.trim(),
                    timeline: MAY_02_SEMINAR_DATE_LABEL,
                    reference: formData.depositorName.trim() || undefined,
                    preferredTime: "세미나 신청 링크",
                }),
            });

            if (!response.ok) {
                setErrorMessage("신청 저장 중 문제가 생겼습니다. 잠시 후 다시 시도해 주세요.");
                return;
            }

            setIsSubmitted(true);
            setFormData(EMPTY_FORM);
        } catch (error) {
            console.error("[Seminar] Signup failed", error);
            setErrorMessage("신청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <section
                className="seminar-signup-card seminar-signup-success"
                style={{
                    padding: "30px",
                    borderRadius: "32px",
                    background: "linear-gradient(180deg, #ffffff 0%, #f8f8fa 100%)",
                    color: "#111217",
                    border: "1px solid rgba(17,18,23,0.08)",
                    boxShadow: "0 24px 64px rgba(17,18,23,0.08)",
                }}
            >
                <div style={{ fontSize: "0.82rem", fontWeight: 800, letterSpacing: "0.08em", color: "#ff9f0a" }}>
                    신청 완료
                </div>
                <h2 style={{ marginTop: "12px", fontSize: "2rem", fontWeight: 800, lineHeight: 1.15 }}>
                    세미나 신청이 접수되었습니다
                </h2>
                <p style={{ marginTop: "14px", color: "#5c5d63", lineHeight: 1.75, fontSize: "1rem" }}>
                    입력해주신 연락처 기준으로 참여 안내를 도와드릴게요.
                    <br />
                    현재 안내 참가비는 <strong style={{ color: "#111217" }}>{priceLabel}</strong> 입니다.
                </p>
            </section>
        );
    }

    return (
        <section
            id="seminar-signup"
            className="seminar-signup-card"
            style={{
                padding: "32px",
                borderRadius: "32px",
                background: "linear-gradient(180deg, #ffffff 0%, #fafafc 100%)",
                color: "#111217",
                border: "1px solid rgba(17,18,23,0.08)",
                boxShadow: "0 24px 64px rgba(17,18,23,0.08)",
            }}
        >
            <div className="seminar-form-header" style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                <div className="seminar-form-heading">
                    <div style={{ fontSize: "0.82rem", fontWeight: 800, letterSpacing: "0.08em", color: "#ff9f0a" }}>
                        SEMINAR SIGNUP
                    </div>
                    <h2 style={{ marginTop: "12px", fontSize: "2rem", fontWeight: 800, lineHeight: 1.15 }}>
                        지금 세미나 신청하기
                    </h2>
                </div>
                <div
                    className="seminar-early-badge"
                    style={{
                        alignSelf: "flex-start",
                        padding: "12px 14px",
                        borderRadius: "16px",
                        background: "rgba(255,159,10,0.12)",
                        color: "#a66000",
                        fontWeight: 700,
                        fontSize: "0.92rem",
                    }}
                >
                    {remainingEarlyBirdSpots > 0 ? `특별가 잔여 ${remainingEarlyBirdSpots}자리` : "특별가 마감"}
                </div>
            </div>

            <p style={{ marginTop: "14px", color: "#6c6d74", lineHeight: 1.72 }}>
                좌석 확보와 안내를 위해 아래 정보를 남겨주세요. 신청 후 참여 안내를 도와드립니다.
            </p>

            <form className="seminar-form" onSubmit={handleSubmit} style={{ marginTop: "24px", display: "grid", gap: "16px" }}>
                <div className="seminar-form-row" style={{ display: "grid", gap: "14px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                    <label style={{ display: "grid", gap: "8px" }}>
                        <span style={{ fontSize: "0.92rem", fontWeight: 700 }}>이름</span>
                        <input
                            value={formData.name}
                            onChange={(event) => updateField("name", event.target.value)}
                            placeholder="홍길동"
                            style={inputStyle}
                        />
                    </label>
                    <label style={{ display: "grid", gap: "8px" }}>
                        <span style={{ fontSize: "0.92rem", fontWeight: 700 }}>연락처</span>
                        <input
                            value={formData.phone}
                            onChange={(event) => updateField("phone", event.target.value)}
                            placeholder="010-1234-5678"
                            style={inputStyle}
                        />
                    </label>
                </div>

                <label style={{ display: "grid", gap: "8px" }}>
                    <span style={{ fontSize: "0.92rem", fontWeight: 700 }}>이메일</span>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(event) => updateField("email", event.target.value)}
                        placeholder="you@example.com"
                        style={inputStyle}
                    />
                </label>

                <label style={{ display: "grid", gap: "8px" }}>
                    <span style={{ fontSize: "0.92rem", fontWeight: 700 }}>지금 가장 답답한 노래 고민</span>
                    <textarea
                        value={formData.bottleneck}
                        onChange={(event) => updateField("bottleneck", event.target.value)}
                        placeholder="예: 고음에서 힘이 많이 들어가고, 혼자 연습할 때 맞게 하고 있는지 모르겠어요."
                        rows={5}
                        style={{ ...inputStyle, resize: "vertical", minHeight: "132px" }}
                    />
                </label>

                <label style={{ display: "grid", gap: "8px" }}>
                    <span style={{ fontSize: "0.92rem", fontWeight: 700 }}>입금자명 (선택)</span>
                    <input
                        value={formData.depositorName}
                        onChange={(event) => updateField("depositorName", event.target.value)}
                        placeholder="입금자명이 다르면 적어주세요"
                        style={inputStyle}
                    />
                </label>

                <div
                    className="seminar-submit-row"
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "12px",
                        alignItems: "center",
                        flexWrap: "wrap",
                        padding: "16px 18px",
                        borderRadius: "20px",
                        background: "#f4f4f7",
                        border: "1px solid rgba(17,18,23,0.06)",
                    }}
                >
                    <div className="seminar-price-copy">
                        <div style={{ fontSize: "0.84rem", color: "#7b7c84", fontWeight: 700 }}>
                            현재 참가비 안내
                        </div>
                        <div style={{ marginTop: "6px", fontSize: "1.1rem", fontWeight: 800 }}>{priceLabel}</div>
                    </div>
                    <button
                        type="submit"
                        disabled={!canSubmit || isSubmitting}
                        className="seminar-submit-button"
                        style={{
                            border: "none",
                            borderRadius: "999px",
                            background: !canSubmit || isSubmitting ? "#d6d7dd" : "#111217",
                            color: !canSubmit || isSubmitting ? "#7c7d84" : "#ffffff",
                            padding: "15px 24px",
                            fontSize: "1rem",
                            fontWeight: 800,
                            cursor: !canSubmit || isSubmitting ? "not-allowed" : "pointer",
                            minWidth: "220px",
                        }}
                    >
                        {isSubmitting ? "신청 저장 중..." : "종합선물세트 보컬세미나 신청하기"}
                    </button>
                </div>

                {errorMessage ? (
                    <p style={{ margin: 0, color: "#ff8b8b", fontWeight: 700 }}>{errorMessage}</p>
                ) : null}
            </form>

            <style>{`
                @media (max-width: 980px) {
                    .seminar-signup-card {
                        padding: 24px 18px !important;
                        border-radius: 24px !important;
                        box-shadow: 0 18px 42px rgba(17,18,23,0.08) !important;
                    }

                    .seminar-form-header {
                        gap: 10px !important;
                    }

                    .seminar-form-heading h2 {
                        margin-top: 10px !important;
                        font-size: 1.7rem !important;
                    }

                    .seminar-early-badge {
                        width: 100%;
                        text-align: center;
                        justify-content: center;
                    }

                    .seminar-form {
                        margin-top: 18px !important;
                        gap: 14px !important;
                    }

                    .seminar-form-row {
                        grid-template-columns: 1fr !important;
                        gap: 12px !important;
                    }

                    .seminar-submit-row {
                        padding: 14px !important;
                        border-radius: 18px !important;
                        align-items: stretch !important;
                    }

                    .seminar-price-copy {
                        width: 100%;
                    }

                    .seminar-submit-button {
                        width: 100%;
                        min-width: 0 !important;
                        padding: 16px 18px !important;
                    }
                }

                @media (max-width: 640px) {
                    .seminar-signup-card {
                        padding: 20px 16px !important;
                    }

                    .seminar-signup-success h2,
                    .seminar-form-heading h2 {
                        font-size: 1.5rem !important;
                        line-height: 1.16 !important;
                    }

                    .seminar-submit-row {
                        gap: 14px !important;
                    }
                }
            `}</style>
        </section>
    );
}

const inputStyle: CSSProperties = {
    width: "100%",
    borderRadius: "16px",
    border: "1px solid rgba(17,18,23,0.12)",
    background: "#ffffff",
    color: "#111217",
    padding: "14px 16px",
    fontSize: "1rem",
    outline: "none",
};
