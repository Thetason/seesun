"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ANALYTICS_EVENT_TYPES, isTrackableAnalyticsPath, normalizeAnalyticsPath } from "@/lib/site-analytics";
import { sendAnalyticsEvent } from "@/lib/site-analytics-client";

export default function SiteAnalyticsTracker() {
    const pathname = usePathname();

    useEffect(() => {
        const normalizedPath = normalizeAnalyticsPath(pathname);

        if (!isTrackableAnalyticsPath(normalizedPath)) {
            return;
        }

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
