"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "../../styles/styles.css";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("이메일 또는 비밀번호가 일치하지 않습니다.");
                setIsLoading(false);
            } else {
                router.push("/dashboard"); // Later we can route to /admin based on session role
                router.refresh();
            }
        } catch {
            setError("로그인 중 오류가 발생했습니다. 다시 시도해 주세요.");
            setIsLoading(false);
        }
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#050507" }}>
            <div className="glass-panel" style={{ width: "100%", maxWidth: "400px", padding: "2.5rem", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)", background: "rgba(30,30,32,0.4)", backdropFilter: "blur(20px)" }}>
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="#FF9F0A" strokeWidth="2" />
                            <path d="M12 6v12M6 12h12" stroke="#FF9F0A" strokeWidth="2" />
                        </svg>
                    </div>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff", letterSpacing: "0.05em" }}>SEE:SUN MUSIC</h1>
                    <p style={{ color: "#888891", marginTop: "0.5rem", fontSize: "0.9rem" }}>프라이빗 라운지 로그인</p>
                </div>

                {error && (
                    <div style={{ background: "rgba(255, 59, 48, 0.1)", color: "#ff3b30", padding: "12px", borderRadius: "8px", fontSize: "0.85rem", marginBottom: "1.5rem", textAlign: "center", border: "1px solid rgba(255, 59, 48, 0.2)" }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: "1.2rem" }}>
                        <label style={{ display: "block", color: "#ccc", fontSize: "0.85rem", marginBottom: "0.5rem", fontWeight: 500 }}>
                            이메일
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@seesun.com"
                            required
                            style={{
                                width: "100%",
                                padding: "12px 16px",
                                background: "rgba(0,0,0,0.2)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "12px",
                                color: "#fff",
                                fontSize: "1rem",
                                outline: "none",
                                transition: "border-color 0.2s"
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: "2rem" }}>
                        <label style={{ display: "block", color: "#ccc", fontSize: "0.85rem", marginBottom: "0.5rem", fontWeight: 500 }}>
                            비밀번호
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            style={{
                                width: "100%",
                                padding: "12px 16px",
                                background: "rgba(0,0,0,0.2)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "12px",
                                color: "#fff",
                                fontSize: "1rem",
                                outline: "none",
                                transition: "border-color 0.2s"
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            width: "100%",
                            padding: "14px",
                            background: isLoading ? "#555" : "#FF9F0A",
                            color: isLoading ? "#aaa" : "#111",
                            fontWeight: 700,
                            border: "none",
                            borderRadius: "12px",
                            cursor: isLoading ? "not-allowed" : "pointer",
                            transition: "all 0.2s"
                        }}
                    >
                        {isLoading ? "인증 중..." : "시스템 접속"}
                    </button>
                </form>

                <div style={{ textAlign: "center", marginTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1.5rem" }}>
                    <Link href="/" style={{ color: "#888891", fontSize: "0.85rem", textDecoration: "underline", opacity: 0.7, transition: "opacity 0.2s" }} className="hover:opacity-100">
                        ← 랜딩 페이지로 돌아가기
                    </Link>
                </div>
            </div>
        </div>
    );
}
