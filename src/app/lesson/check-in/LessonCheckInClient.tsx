"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type LessonCheckInResult = {
    attendance: {
        attendanceDate: string;
        checkedInAt: string;
        lessonNumber: number | null;
    };
    enrollment: {
        programName?: string | null;
    } | null;
    totalCount: number;
    alreadyCheckedIn: boolean;
};

type LessonCheckInClientProps = {
    dateKey: string | null;
    token: string | null;
    memberName: string;
    initialError?: string;
};

function formatKstDateTime(value: string | Date) {
    return new Intl.DateTimeFormat("ko-KR", {
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Seoul",
    }).format(new Date(value));
}

export default function LessonCheckInClient({
    dateKey,
    token,
    memberName,
    initialError,
}: LessonCheckInClientProps) {
    const [result, setResult] = useState<LessonCheckInResult | null>(null);
    const [error, setError] = useState(initialError || "");
    const [isCheckingIn, setIsCheckingIn] = useState(false);

    const canSubmit = Boolean(dateKey && token && !initialError);

    const submitAttendance = async () => {
        if (!dateKey || !token) {
            setError("출석 QR 정보가 올바르지 않습니다.");
            return;
        }

        setIsCheckingIn(true);
        setError("");

        try {
            const response = await fetch("/api/lesson-attendance/check-in", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ date: dateKey, token }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "출석 기록에 실패했습니다.");
            }

            setResult(data as LessonCheckInResult);
        } catch (caughtError) {
            setError(caughtError instanceof Error ? caughtError.message : "출석 기록 중 오류가 발생했습니다.");
        } finally {
            setIsCheckingIn(false);
        }
    };

    useEffect(() => {
        if (!canSubmit || result || isCheckingIn || error) {
            return;
        }

        void submitAttendance();
        // submitAttendance intentionally captures the initial QR params for this page load.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canSubmit, result, isCheckingIn, error]);

    return (
        <main style={{ minHeight: "100vh", background: "#f5f5f7", color: "#1d1d1f", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
            <section style={{ width: "100%", maxWidth: "440px", background: "#fff", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "28px", padding: "1.35rem", boxShadow: "0 18px 55px rgba(0,0,0,0.08)" }}>
                <div style={{ marginBottom: "1.15rem" }}>
                    <div style={{ fontSize: "0.76rem", fontWeight: 900, letterSpacing: "0.08em", color: "#FF9F0A", marginBottom: "0.45rem" }}>SEE:SUN LESSON</div>
                    <h1 style={{ fontSize: "1.65rem", lineHeight: 1.18, fontWeight: 900, marginBottom: "0.55rem", letterSpacing: "-0.03em" }}>
                        {result ? "출석이 기록됐습니다." : isCheckingIn ? "출석 기록 중입니다." : "레슨 출석 체크"}
                    </h1>
                    <p style={{ color: "#6e6e73", fontSize: "0.95rem", lineHeight: 1.65 }}>
                        {memberName}님, 오늘 레슨 참여 기록을 남기고 있습니다.
                    </p>
                </div>

                <div style={{ borderRadius: "22px", background: result ? "rgba(52,199,89,0.08)" : error ? "rgba(255,59,48,0.08)" : "#f9f9fb", border: `1px solid ${result ? "rgba(52,199,89,0.14)" : error ? "rgba(255,59,48,0.14)" : "rgba(0,0,0,0.05)"}`, padding: "1.15rem", marginBottom: "1rem" }}>
                    {result ? (
                        <div style={{ display: "grid", gap: "0.8rem" }}>
                            <div style={{ fontSize: "0.85rem", color: "#1d8f3f", fontWeight: 900 }}>
                                {result.alreadyCheckedIn ? "이미 오늘 출석이 기록되어 있어요." : "오늘 출석 기록 완료"}
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
                                <div style={{ borderRadius: "16px", background: "#fff", padding: "0.85rem", border: "1px solid rgba(0,0,0,0.04)" }}>
                                    <div style={{ color: "#86868b", fontSize: "0.72rem", fontWeight: 900, marginBottom: "0.35rem" }}>누적 레슨</div>
                                    <div style={{ fontSize: "1.25rem", fontWeight: 900 }}>{result.totalCount}회</div>
                                </div>
                                <div style={{ borderRadius: "16px", background: "#fff", padding: "0.85rem", border: "1px solid rgba(0,0,0,0.04)" }}>
                                    <div style={{ color: "#86868b", fontSize: "0.72rem", fontWeight: 900, marginBottom: "0.35rem" }}>기록 시간</div>
                                    <div style={{ fontSize: "0.9rem", fontWeight: 900 }}>{formatKstDateTime(result.attendance.checkedInAt)}</div>
                                </div>
                            </div>
                            <p style={{ color: "#48484a", fontSize: "0.9rem", lineHeight: 1.6 }}>
                                {result.enrollment?.programName
                                    ? `${result.enrollment.programName} 레슨 기록으로 저장했습니다.`
                                    : "담당 코치의 출석 장부에 저장했습니다."}
                            </p>
                        </div>
                    ) : error ? (
                        <div style={{ display: "grid", gap: "0.75rem" }}>
                            <div style={{ color: "#d70015", fontWeight: 900 }}>기록하지 못했습니다.</div>
                            <p style={{ color: "#48484a", fontSize: "0.9rem", lineHeight: 1.6 }}>{error}</p>
                            {canSubmit && (
                                <button
                                    type="button"
                                    onClick={submitAttendance}
                                    disabled={isCheckingIn}
                                    style={{ border: "none", borderRadius: "14px", padding: "12px 14px", background: "#1d1d1f", color: "#fff", fontWeight: 900, cursor: "pointer", opacity: isCheckingIn ? 0.7 : 1 }}
                                >
                                    다시 기록하기
                                </button>
                            )}
                        </div>
                    ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", color: "#48484a", fontWeight: 800 }}>
                            <span style={{ width: "12px", height: "12px", borderRadius: "999px", background: "#FF9F0A", boxShadow: "0 0 0 6px rgba(255,159,10,0.12)" }} />
                            잠시만 기다려 주세요.
                        </div>
                    )}
                </div>

                <div style={{ display: "grid", gap: "0.65rem" }}>
                    <Link href="/dashboard" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "48px", borderRadius: "15px", background: "#1d1d1f", color: "#fff", fontWeight: 900 }}>
                        내 오늘 루틴 보기
                    </Link>
                    <p style={{ color: "#86868b", textAlign: "center", fontSize: "0.82rem", lineHeight: 1.5 }}>
                        중복 출석은 자동으로 정리됩니다.
                    </p>
                </div>
            </section>
        </main>
    );
}
