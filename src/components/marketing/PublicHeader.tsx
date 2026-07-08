import Link from "next/link";
import { BrandLogo } from "@/components/marketing/BrandLogo";
import { KICKOFF_CTA_LABEL, SMARTPLACE_URL } from "@/lib/site";

const navItems = [
    { label: "선언", href: "/#manifesto" },
    { label: "메소드", href: "/#method" },
    { label: "코치", href: "/#coach" },
    { label: "크루", href: "/#crew" },
    { label: "멤버십", href: "/#membership" },
];

export default function PublicHeader({ theme = "dark" }: { theme?: "dark" | "light" }) {
    const isLight = theme === "light";

    return (
        <header
            style={{
                position: "sticky",
                top: 0,
                zIndex: 120,
                backdropFilter: "blur(18px)",
                background: isLight ? "rgba(246, 244, 240, 0.86)" : "rgba(24, 24, 24, 0.82)",
                borderBottom: isLight ? "1px solid rgba(24,24,24,0.08)" : "1px solid rgba(255,255,255,0.08)",
            }}
        >
            <div
                style={{
                    maxWidth: "1180px",
                    margin: "0 auto",
                    padding: "14px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "20px",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "16px", minWidth: 0 }}>
                    <Link href="/" aria-label="시선뮤직 홈" style={{ textDecoration: "none", transition: "transform 0.2s ease" }}>
                        <BrandLogo compact surface={isLight ? "light" : "dark"} />
                    </Link>
                    <nav className="public-header-nav" style={{ display: "flex", gap: "18px", alignItems: "center", flexWrap: "wrap" }}>
                        {navItems.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                style={{
                                    color: isLight ? "rgba(17,17,17,0.62)" : "rgba(255,255,255,0.72)",
                                    textDecoration: "none",
                                    fontSize: "0.92rem",
                                    fontWeight: 600,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <Link
                        href="/login"
                        style={{
                            color: isLight ? "rgba(17,17,17,0.56)" : "rgba(255,255,255,0.56)",
                            textDecoration: "none",
                            fontSize: "0.82rem",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                        }}
                    >
                        로그인
                    </Link>
                    <a
                        href={SMARTPLACE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            background: isLight ? "#181818" : "#FE7502",
                            color: isLight ? "#ffffff" : "#181818",
                            textDecoration: "none",
                            padding: "10px 16px",
                            borderRadius: "999px",
                            fontWeight: 700,
                            fontSize: "0.9rem",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {KICKOFF_CTA_LABEL}
                    </a>
                </div>
            </div>

            <style>{`
                @media (max-width: 920px) {
                    .public-header-nav {
                        display: none !important;
                    }
                }
            `}</style>
        </header>
    );
}
