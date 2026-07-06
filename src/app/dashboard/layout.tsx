import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const isCoach = session.user.role === "COACH";

    return (
        <div className="dashboard-shell" style={{ minHeight: "100vh", background: "#f5f5f7", color: "#1d1d1f" }}>
            <header className="dashboard-shell__header" style={{ background: "#fff", padding: "1rem 1.25rem", borderBottom: "1px solid rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.9rem", flexWrap: "wrap" }}>
                <div className="dashboard-shell__brand" style={{ fontWeight: 700, fontSize: "1.2rem", letterSpacing: "-0.02em" }}>
                    SEE:SUN App <span style={{ color: "#FF9F0A" }}>{isCoach ? "Coach" : "Member"}</span>
                </div>
                <nav className="dashboard-shell__nav" style={{ display: "flex", gap: "16px", fontSize: "0.95rem", color: "#86868b", alignItems: "center", flexWrap: "wrap" }}>
                    <a href="/dashboard" style={{ color: "#1d1d1f", fontWeight: 600, textDecoration: "none" }}>
                        {isCoach ? "학생 관리" : "내 학습 공간"}
                    </a>
                    <a href="/dashboard/archive" style={{ color: "#86868b", textDecoration: "none" }}>
                        {isCoach ? "전체 피드백 기록" : "음성 피드백 보관함"}
                    </a>
                    <LogoutButton style={{ background: "none", border: "none", color: "#ff3b30", cursor: "pointer", fontSize: "0.95rem", fontWeight: 600 }} />
                </nav>
            </header>
            <main className="dashboard-shell__main" style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
                {children}
            </main>
        </div>
    );
}
