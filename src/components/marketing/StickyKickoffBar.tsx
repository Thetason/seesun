"use client";

import { useEffect, useState } from "react";
import { KICKOFF_CTA_LABEL } from "@/lib/site";
import { openKickoff } from "@/lib/kickoff";

const HERO_SCROLL_THRESHOLD = 900;

export default function StickyKickoffBar() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        let pastHero = false;
        let atClosing = false;
        let nearBottom = false;

        const update = () => setVisible(pastHero && !atClosing && !nearBottom);

        const onScroll = () => {
            pastHero = window.scrollY > HERO_SCROLL_THRESHOLD;
            nearBottom = window.scrollY + window.innerHeight > document.documentElement.scrollHeight - 160;
            update();
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();

        const closing = document.getElementById("home-closing");
        let observer: IntersectionObserver | null = null;
        if (closing) {
            observer = new IntersectionObserver(
                (entries) => {
                    atClosing = entries[0]?.isIntersecting ?? false;
                    update();
                },
                { threshold: 0.15 }
            );
            observer.observe(closing);
        }

        return () => {
            window.removeEventListener("scroll", onScroll);
            observer?.disconnect();
        };
    }, []);

    return (
        <>
            <div className={`sticky-kickoff-bar${visible ? " is-visible" : ""}`} aria-hidden={!visible}>
                <button type="button" className="sticky-kickoff-bar__button" onClick={() => openKickoff("sticky")} tabIndex={visible ? 0 : -1}>
                    {KICKOFF_CTA_LABEL}
                </button>
            </div>
            <style jsx>{`
                .sticky-kickoff-bar {
                    position: fixed;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 150;
                    padding: 10px 16px calc(10px + env(safe-area-inset-bottom));
                    background: rgba(255, 255, 255, 0.85);
                    backdrop-filter: saturate(180%) blur(20px);
                    -webkit-backdrop-filter: saturate(180%) blur(20px);
                    border-top: 1px solid rgba(0, 0, 0, 0.06);
                    transform: translateY(110%);
                    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
                    display: none;
                }

                .sticky-kickoff-bar.is-visible {
                    transform: translateY(0);
                }

                .sticky-kickoff-bar__button {
                    display: block;
                    width: 100%;
                    max-width: 620px;
                    margin: 0 auto;
                    border: none;
                    cursor: pointer;
                    font-family: inherit;
                    text-align: center;
                    background: #111;
                    color: #fff;
                    font-weight: 700;
                    font-size: 1rem;
                    padding: 14px 18px;
                    border-radius: 999px;
                }

                @media (max-width: 768px) {
                    .sticky-kickoff-bar {
                        display: block;
                    }
                }
            `}</style>
        </>
    );
}
