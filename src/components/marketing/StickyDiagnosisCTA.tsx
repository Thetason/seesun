"use client";

import { usePathname } from "next/navigation";
import { KICKOFF_CTA_LABEL, SMARTPLACE_URL } from "@/lib/site";
import { trackKickoff } from "@/lib/kickoff";

export default function StickyDiagnosisCTA() {
    const pathname = usePathname() || "/";

    if (["/dashboard", "/admin", "/login", "/register", "/mission", "/diagnosis"].some((prefix) => pathname.startsWith(prefix))) {
        return null;
    }

    if (pathname === "/") {
        return null;
    }

    return (
        <>
            <div className="sticky-kickoff-cta">
                <a href={SMARTPLACE_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackKickoff("sticky")} className="sticky-kickoff-cta__button">
                    {KICKOFF_CTA_LABEL}
                </a>
            </div>
            <style jsx>{`
                .sticky-kickoff-cta {
                    position: fixed;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
                    background: linear-gradient(180deg, rgba(24, 24, 24, 0), rgba(24, 24, 24, 0.88) 38%);
                    z-index: 140;
                    display: none;
                }

                .sticky-kickoff-cta__button {
                    display: block;
                    width: 100%;
                    max-width: 620px;
                    margin: 0 auto;
                    text-align: center;
                    text-decoration: none;
                    background: #FE7502;
                    color: #181818;
                    font-weight: 700;
                    padding: 14px 18px;
                    border-radius: 999px;
                    box-shadow: 0 14px 30px rgba(254, 117, 2, 0.24);
                }

                @media (max-width: 768px) {
                    .sticky-kickoff-cta {
                        display: block;
                    }
                }
            `}</style>
        </>
    );
}
