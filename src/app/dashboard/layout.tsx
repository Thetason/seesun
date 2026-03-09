import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    return (
        <div style={{ minHeight: "100vh", background: "#f5f5f7", color: "#1d1d1f" }}>
            <header style={{ background: "#fff", padding: "1rem 2rem", borderBottom: "1px solid rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 700, fontSize: "1.2rem", letterSpacing: "-0.02em" }}>SEE:SUN STUDIO <span style={{ color: "#FF9F0A" }}>Student</span></div>
                <nav style={{ display: "flex", gap: "25px", fontSize: "0.95rem", color: "#86868b", alignItems: "center" }}>
                    <a href="/dashboard" style={{ color: "#1d1d1f", fontWeight: 600, textDecoration: "none" }}>내 학습 공간</a>
                    <a href="/dashboard/archive" style={{ color: "#86868b", textDecoration: "none" }}>음성 피드백 보관함</a>
                    <LogoutButton style={{ background: "none", border: "none", color: "#ff3b30", cursor: "pointer", fontSize: "0.95rem", fontWeight: 600 }} />
                </nav>
            </header>
            <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
                {children}
            </main>
        </div>
    );
}
