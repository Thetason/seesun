"use client";

import { useState } from "react";

type FAQItem = {
    question: string;
    answer: string;
};

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <div style={{ display: "grid", gap: "12px" }}>
            {items.map((item, index) => {
                const isOpen = index === openIndex;

                return (
                    <button
                        key={item.question}
                        type="button"
                        onClick={() => setOpenIndex(isOpen ? -1 : index)}
                        style={{
                            textAlign: "left",
                            width: "100%",
                            border: "1px solid rgba(255,255,255,0.08)",
                            background: isOpen ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
                            borderRadius: "8px",
                            padding: "18px 20px",
                            color: "#ffffff",
                            cursor: "pointer",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center" }}>
                            <div style={{ fontWeight: 800, lineHeight: 1.5 }}>{item.question}</div>
                            <span style={{ color: "#ff6b00", fontWeight: 900, fontSize: "1.05rem" }}>{isOpen ? "−" : "+"}</span>
                        </div>
                        {isOpen && (
                            <div style={{ marginTop: "12px", color: "rgba(255,255,255,0.72)", lineHeight: 1.7 }}>
                                {item.answer}
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
