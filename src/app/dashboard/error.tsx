"use client";

import { useEffect } from "react";

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("[Dashboard] Unhandled route error:", error);
    }, [error]);

    return (
        <div
            style={{
                minHeight: "60vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem",
            }}
        >
            <div
                style={{
                    maxWidth: "560px",
                    background: "#fff",
                    borderRadius: "24px",
                    padding: "2rem",
                    border: "1px solid rgba(0,0,0,0.08)",
                    boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
                    textAlign: "center",
                }}
            >
                <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1d1d1f", marginBottom: "0.75rem" }}>
                    대시보드를 불러오는 중 문제가 발생했습니다.
                </h2>
                <p style={{ color: "#6e6e73", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                    잠시 후 다시 시도해 주세요. 문제가 계속되면 운영자 설정값과 데이터베이스 연결 상태를 확인해야 합니다.
                </p>
                <button
                    onClick={reset}
                    style={{
                        border: "none",
                        borderRadius: "12px",
                        padding: "12px 20px",
                        background: "#1d1d1f",
                        color: "#fff",
                        fontWeight: 700,
                        cursor: "pointer",
                    }}
                >
                    다시 시도
                </button>
            </div>
        </div>
    );
}
