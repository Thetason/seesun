"use client";

import {
    ANALYTICS_COOKIE_KEYS,
    ANALYTICS_SESSION_MAX_AGE_SECONDS,
    ANALYTICS_VISITOR_MAX_AGE_SECONDS,
    normalizeAnalyticsPath,
} from "@/lib/site-analytics";

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

function getCookie(name: string) {
    if (typeof document === "undefined") {
        return null;
    }

    const encodedName = `${encodeURIComponent(name)}=`;
    const match = document.cookie
        .split("; ")
        .find((entry) => entry.startsWith(encodedName));

    if (!match) {
        return null;
    }

    return decodeURIComponent(match.slice(encodedName.length));
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
    if (typeof document === "undefined") {
        return;
    }

    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

export function getOrCreateVisitorKey() {
    if (typeof window === "undefined") {
        return "server";
    }

    try {
        const existingCookie = getCookie(ANALYTICS_COOKIE_KEYS.visitor);

        if (existingCookie) {
            window.localStorage.setItem(VISITOR_STORAGE_KEY, existingCookie);
            return existingCookie;
        }

        const stored = window.localStorage.getItem(VISITOR_STORAGE_KEY);

        if (stored) {
            setCookie(ANALYTICS_COOKIE_KEYS.visitor, stored, ANALYTICS_VISITOR_MAX_AGE_SECONDS);
            return stored;
        }

        const nextKey = createKey();
        window.localStorage.setItem(VISITOR_STORAGE_KEY, nextKey);
        setCookie(ANALYTICS_COOKIE_KEYS.visitor, nextKey, ANALYTICS_VISITOR_MAX_AGE_SECONDS);
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
        const existingCookie = getCookie(ANALYTICS_COOKIE_KEYS.session);

        if (existingCookie) {
            window.sessionStorage.setItem(SESSION_STORAGE_KEY, existingCookie);
            return existingCookie;
        }

        const stored = window.sessionStorage.getItem(SESSION_STORAGE_KEY);

        if (stored) {
            setCookie(ANALYTICS_COOKIE_KEYS.session, stored, ANALYTICS_SESSION_MAX_AGE_SECONDS);
            return stored;
        }

        const nextKey = createKey();
        window.sessionStorage.setItem(SESSION_STORAGE_KEY, nextKey);
        setCookie(ANALYTICS_COOKIE_KEYS.session, nextKey, ANALYTICS_SESSION_MAX_AGE_SECONDS);
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
