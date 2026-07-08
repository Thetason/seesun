"use client";

import { SMARTPLACE_URL } from "@/lib/site";
import { ANALYTICS_EVENT_TYPES } from "@/lib/site-analytics";
import { sendAnalyticsEvent } from "@/lib/site-analytics-client";

export function trackKickoff(source: string) {
    sendAnalyticsEvent(
        { eventType: ANALYTICS_EVENT_TYPES.kickoffClick, path: window.location.pathname, label: source },
        { useBeacon: true }
    );
}

export function openKickoff(source: string) {
    trackKickoff(source);
    window.open(SMARTPLACE_URL, "_blank", "noopener,noreferrer");
}
