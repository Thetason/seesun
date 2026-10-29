"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
    ANALYTICS_EVENT_TYPES,
    classifyTrafficChannel,
    isTrackableAnalyticsPath,
    normalizeAnalyticsPath,
} from "@/lib/site-analytics";
import { sendAnalyticsEvent } from "@/lib/site-analytics-client";

const SESSION_CHANNEL_KEY = "seesun.analytics.channel";

// Records where this browser session came from (search, AI, SNS, direct) exactly once.
function recordSessionChannel(path: string) {
    try {
        if (window.sessionStorage.getItem(SESSION_CHANNEL_KEY)) return;
        const channel = classifyTrafficChannel(document.referrer, window.location.search, window.location.hostname);
        window.sessionStorage.setItem(SESSION_CHANNEL_KEY, channel ?? "internal");
        if (!channel) return;
        sendAnalyticsEvent({ eventType: ANALYTICS_EVENT_TYPES.sessionStart, path, label: channel });
    } catch {
        // Storage can be blocked; skipping attribution is better than breaking the page.
    }
}

export default function SiteAnalyticsTracker() {
    const pathname = usePathname();

    useEffect(() => {
        const normalizedPath = normalizeAnalyticsPath(pathname);

        if (!isTrackableAnalyticsPath(normalizedPath)) {
            return;
        }

        recordSessionChannel(normalizedPath);

        sendAnalyticsEvent({
            eventType: ANALYTICS_EVENT_TYPES.pageView,
            path: normalizedPath,
        });

        const startedAt = Date.now();
        let hasSentExit = false;

        const sendExitEvent = () => {
            if (hasSentExit) {
                return;
            }

            hasSentExit = true;

            sendAnalyticsEvent(
                {
                    eventType: ANALYTICS_EVENT_TYPES.pageExit,
                    path: normalizedPath,
                    durationMs: Date.now() - startedAt,
                },
                { useBeacon: true }
            );
        };

        const handlePageHide = () => {
            sendExitEvent();
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                sendExitEvent();
            }
        };

        window.addEventListener("pagehide", handlePageHide);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            window.removeEventListener("pagehide", handlePageHide);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            sendExitEvent();
        };
    }, [pathname]);

    return null;
}
