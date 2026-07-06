"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function InviteAcceptClient({ token }: { token: string }) {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const acceptInvite = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage("");

        if (password.length < 8) {
            setErrorMessage("비밀번호는 8자 이상으로 설정해 주세요.");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("비밀번호 확인이 일치하지 않습니다.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/invite/accept", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    name,
                    password,
                }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "초대 수락에 실패했습니다.");
            }

            await signIn("credentials", {
                email: data.email,
                password,
                callbackUrl: "/dashboard",
            });
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "초대 수락 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main style={{ minHeight: "100vh", background: "#f5f5f7", display: "grid", placeItems: "center", padding: "24px" }}>
            <section style={{ width: "100%", maxWidth: "460px", background: "#fff", borderRadius: "28px", padding: "2rem", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 24px 70px rgba(0,0,0,0.08)" }}>
                <div style={{ fontSize: "0.78rem", color: "#FF9F0A", fontWeight: 900, letterSpacing: "0.08em", marginBottom: "0.75rem" }}>
                    SEE:SUN App
                </div>
                <h1 style={{ fontSize: "2rem", lineHeight: 1.15, fontWeight: 900, color: "#1d1d1f", letterSpacing: "-0.04em", marginBottom: "0.75rem" }}>
                    회원 공간을 준비합니다.
                </h1>
                <p style={{ color: "#6e6e73", lineHeight: 1.65, marginBottom: "1.5rem" }}>
                    비밀번호를 설정하면 오늘 루틴, 체크인, 코치 리포트를 한 곳에서 확인할 수 있습니다.
                </p>

                <form onSubmit={acceptInvite} style={{ display: "grid", gap: "12px" }}>
                    <label style={{ display: "grid", gap: "6px", color: "#6e6e73", fontSize: "0.82rem", fontWeight: 800 }}>
                        이름
                        <input
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="선택 입력"
                            style={{ padding: "13px 14px", borderRadius: "14px", border: "1px solid #e5e5e7", fontSize: "1rem" }}
                        />
                    </label>
                    <label style={{ display: "grid", gap: "6px", color: "#6e6e73", fontSize: "0.82rem", fontWeight: 800 }}>
                        비밀번호
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="8자 이상"
                            style={{ padding: "13px 14px", borderRadius: "14px", border: "1px solid #e5e5e7", fontSize: "1rem" }}
                        />
                    </label>
                    <label style={{ display: "grid", gap: "6px", color: "#6e6e73", fontSize: "0.82rem", fontWeight: 800 }}>
                        비밀번호 확인
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            placeholder="한 번 더 입력"
                            style={{ padding: "13px 14px", borderRadius: "14px", border: "1px solid #e5e5e7", fontSize: "1rem" }}
                        />
                    </label>

                    {errorMessage && (
                        <div style={{ padding: "12px 14px", borderRadius: "14px", background: "rgba(255,59,48,0.08)", color: "#d70015", fontSize: "0.88rem", fontWeight: 700 }}>
                            {errorMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{ marginTop: "6px", border: "none", borderRadius: "14px", background: "#1d1d1f", color: "#fff", padding: "14px 16px", fontWeight: 900, fontSize: "1rem", cursor: "pointer", opacity: isSubmitting ? 0.7 : 1 }}
                    >
                        {isSubmitting ? "준비 중..." : "비밀번호 설정하고 시작하기"}
                    </button>
                </form>
            </section>
        </main>
    );
}
