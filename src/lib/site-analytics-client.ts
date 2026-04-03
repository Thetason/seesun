"use client";

import { normalizeAnalyticsPath } from "@/lib/site-analytics";

const VISITOR_STORAGE_KEY = "seesun.analytics.visitor";
const SESSION_STORAGE_KEY = "seesun.analytics.session";

type ClientAnalyticsPayload = {
    eventType: string;
    path: string;
    durationMs?: number;
    label?: string;
};

function createKey() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getOrCreateVisitorKey() {
    if (typeof window === "undefined") {
        return "server";
    }

    try {
        const stored = window.localStorage.getItem(VISITOR_STORAGE_KEY);

        if (stored) {
            return stored;
        }

        const nextKey = createKey();
        window.localStorage.setItem(VISITOR_STORAGE_KEY, nextKey);
        return nextKey;
    } catch {
        return createKey();
    }
}

export function getOrCreateSessionKey() {
    if (typeof window === "undefined") {
        return "server";
    }

    try {
        const stored = window.sessionStorage.getItem(SESSION_STORAGE_KEY);

        if (stored) {
            return stored;
        }

        const nextKey = createKey();
        window.sessionStorage.setItem(SESSION_STORAGE_KEY, nextKey);
        return nextKey;
    } catch {
        return createKey();
    }
}

export function sendAnalyticsEvent(
    payload: ClientAnalyticsPayload,
    options?: { useBeacon?: boolean }
) {
    if (typeof window === "undefined") {
        return;
    }

    const body = JSON.stringify({
        eventType: payload.eventType,
        path: normalizeAnalyticsPath(payload.path),
        durationMs: payload.durationMs,
        label: payload.label,
        visitorKey: getOrCreateVisitorKey(),
        sessionKey: getOrCreateSessionKey(),
    });

    if (options?.useBeacon && typeof navigator.sendBeacon === "function") {
        navigator.sendBeacon("/api/analytics/event", body);
        return;
    }

    void fetch("/api/analytics/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: options?.useBeacon,
    }).catch((error) => {
        console.error("[Analytics] Failed to send event", error);
    });
}
