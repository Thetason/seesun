type ProofCardProps = {
    title: string;
    body: string;
    placeholder?: string;
};

export default function ProofCard({ title, body, placeholder }: ProofCardProps) {
    return (
        <article
            style={{
                padding: "24px",
                borderRadius: "8px",
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.06)",
                display: "grid",
                gap: "12px",
                minHeight: "100%",
            }}
        >
            <div
                style={{
                    height: "130px",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, rgba(0,0,0,0.05), rgba(255,107,0,0.10))",
                    border: "1px dashed rgba(0,0,0,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#6e6e73",
                    fontWeight: 700,
                    textAlign: "center",
                    padding: "16px",
                }}
            >
                {placeholder || "콘텐츠 자리"}
            </div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 900, color: "#111111", margin: 0 }}>{title}</h3>
            <p style={{ color: "#5d5d63", lineHeight: 1.7, margin: 0 }}>{body}</p>
        </article>
    );
}
