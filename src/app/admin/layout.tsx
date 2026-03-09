import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    if (session.user.role !== "COACH") {
        redirect("/dashboard");
    }

    return (
        <div style={{ minHeight: "100vh", background: "#111", color: "#fff" }}>
            <header style={{ background: "#050507", padding: "1rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 700, fontSize: "1.2rem", letterSpacing: "-0.02em" }}>SEE:SUN STUDIO <span style={{ color: "#debf8e" }}>Coach Admin</span></div>
                <nav style={{ display: "flex", gap: "20px", fontSize: "0.9rem", color: "#888", alignItems: "center" }}>
                    <a href="#" style={{ color: "#fff", fontWeight: 600 }}>수강생 CRM</a>
                    <a href="#">과제/피드백 센터 <span style={{ background: "#debf8e", color: "#000", padding: "2px 6px", borderRadius: "10px", fontSize: "0.75rem", marginLeft: "5px", fontWeight: 700 }}>3</span></a>
                    <LogoutButton style={{ background: "none", border: "none", color: "#ff453a", cursor: "pointer", fontSize: "0.9rem" }} />
                </nav>
            </header>
            <main style={{ maxWidth: "1400px", margin: "0 auto", padding: "2rem" }}>
                {children}
            </main>
        </div>
    );
}
