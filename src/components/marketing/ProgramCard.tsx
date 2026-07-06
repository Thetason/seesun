import Link from "next/link";

type ProgramCardProps = {
    name: string;
    tag: string;
    headline: string;
    price: string;
    body: string;
    href: string;
    cta: string;
    featured?: boolean;
};

export default function ProgramCard({
    name,
    tag,
    headline,
    price,
    body,
    href,
    cta,
    featured = false,
}: ProgramCardProps) {
    return (
        <article
            style={{
                padding: "28px",
                borderRadius: "8px",
                background: featured ? "linear-gradient(180deg, rgba(255,107,0,0.12), rgba(255,255,255,0.03))" : "rgba(255,255,255,0.03)",
                border: featured ? "1px solid rgba(255,107,0,0.28)" : "1px solid rgba(255,255,255,0.08)",
                display: "grid",
                gap: "16px",
                minHeight: "100%",
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#ffffff" }}>{name}</div>
                <span
                    style={{
                        fontSize: "0.75rem",
                        fontWeight: 800,
                        color: featured ? "#050507" : "#ff6b00",
                        background: featured ? "#ff6b00" : "rgba(255,107,0,0.12)",
                        padding: "6px 10px",
                        borderRadius: "999px",
                        letterSpacing: 0,
                    }}
                >
                    {tag}
                </span>
            </div>

            <div style={{ fontSize: "1.5rem", lineHeight: 1.3, fontWeight: 900, color: "#ffffff", whiteSpace: "pre-line" }}>{headline}</div>
            <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "#ff6b00" }}>{price}</div>
            <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.7, margin: 0 }}>{body}</p>
            <div style={{ marginTop: "6px" }}>
                <Link
                    href={href}
                    style={{
                        display: "inline-block",
                        textDecoration: "none",
                        background: featured ? "#ff6b00" : "rgba(255,255,255,0.08)",
                        color: featured ? "#050507" : "#ffffff",
                        padding: "12px 16px",
                        borderRadius: "999px",
                        fontWeight: 800,
                    }}
                >
                    {cta}
                </Link>
            </div>
        </article>
    );
}
