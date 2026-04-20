"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buildDiagnosisPath } from "@/lib/consultation-intake";

function getDiagnosisHref(pathname: string) {
    if (pathname === "/spark") {
        return buildDiagnosisPath({ type: "Spark" });
    }

    if (pathname === "/signature") {
        return buildDiagnosisPath({ type: "Signature" });
    }

    if (pathname === "/reserve") {
        return buildDiagnosisPath({ type: "Reserve" });
    }

    return "/diagnosis";
}

export default function StickyDiagnosisCTA() {
    const pathname = usePathname() || "/";

    if (["/dashboard", "/admin", "/login", "/register", "/mission"].some((prefix) => pathname.startsWith(prefix))) {
        return null;
    }

    if (pathname === "/diagnosis") {
        return null;
    }

    return (
        <>
            <div className="sticky-diagnosis-cta">
                <Link href={getDiagnosisHref(pathname)} className="sticky-diagnosis-cta__button">
                    무료 보컬 진단 받기
                </Link>
            </div>
            <style jsx>{`
                .sticky-diagnosis-cta {
                    position: fixed;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
                    background: linear-gradient(180deg, rgba(5,5,7,0), rgba(5,5,7,0.88) 38%);
                    z-index: 140;
                    display: none;
                }

                .sticky-diagnosis-cta__button {
                    display: block;
                    width: 100%;
                    max-width: 620px;
                    margin: 0 auto;
                    text-align: center;
                    text-decoration: none;
                    background: #f5b33f;
                    color: #050507;
                    font-weight: 900;
                    padding: 14px 18px;
                    border-radius: 999px;
                    box-shadow: 0 14px 30px rgba(245, 179, 63, 0.24);
                }

                @media (max-width: 768px) {
                    .sticky-diagnosis-cta {
                        display: block;
                    }
                }
            `}</style>
        </>
    );
}
