import { prisma } from "@/lib/prisma";
import {
    ANALYTICS_EVENT_TYPES,
    ANALYTICS_PAGE_VIEW_DEDUPE_WINDOW_MS,
    isTrackableAnalyticsPath,
    normalizeAnalyticsPath,
} from "@/lib/site-analytics";

type RecordAnalyticsEventInput = {
    eventType: string;
    path: string;
    visitorKey: string;
    sessionKey?: string | null;
    durationMs?: number | null;
    label?: string | null;
    dedupeWindowMs?: number;
};

type RecordAnalyticsEventResult =
    | { created: true }
    | { created: false; reason: "ignored" | "deduped" };

const MAX_DURATION_MS = 1000 * 60 * 60 * 12;

function cleanText(value: string | null | undefined, maxLength: number) {
    if (typeof value !== "string") {
        return null;
    }

    const trimmed = value.trim();
    return trimmed ? trimmed.slice(0, maxLength) : null;
}

export async function recordAnalyticsEvent({
    eventType,
    path,
    visitorKey,
    sessionKey,
    durationMs,
    label,
    dedupeWindowMs,
}: RecordAnalyticsEventInput): Promise<RecordAnalyticsEventResult> {
    const normalizedPath = normalizeAnalyticsPath(path);
    const cleanVisitorKey = cleanText(visitorKey, 120);
    const cleanSessionKey = cleanText(sessionKey, 120);
    const cleanLabel = cleanText(label, 200);
    const normalizedDuration = typeof durationMs === "number" && durationMs >= 0
        ? Math.min(Math.round(durationMs), MAX_DURATION_MS)
        : null;

    if (!eventType || !cleanVisitorKey || !isTrackableAnalyticsPath(normalizedPath)) {
        return { created: false, reason: "ignored" };
    }

    if (dedupeWindowMs && dedupeWindowMs > 0) {
        const duplicate = await prisma.analyticsEvent.findFirst({
            where: {
                eventType,
                path: normalizedPath,
                visitorKey: cleanVisitorKey,
                ...(cleanSessionKey ? { sessionKey: cleanSessionKey } : {}),
                createdAt: {
                    gte: new Date(Date.now() - dedupeWindowMs),
                },
            },
            select: { id: true },
            orderBy: { createdAt: "desc" },
        });

        if (duplicate) {
            return { created: false, reason: "deduped" };
        }
    }

    await prisma.analyticsEvent.create({
        data: {
            eventType,
            path: normalizedPath,
            visitorKey: cleanVisitorKey,
            sessionKey: cleanSessionKey,
            durationMs: normalizedDuration,
            label: cleanLabel,
        },
    });

    return { created: true };
}

export async function recordServerPageView({
    path,
    visitorKey,
    sessionKey,
}: {
    path: string;
    visitorKey: string;
    sessionKey?: string | null;
}) {
    return recordAnalyticsEvent({
        eventType: ANALYTICS_EVENT_TYPES.pageView,
        path,
        visitorKey,
        sessionKey,
        dedupeWindowMs: ANALYTICS_PAGE_VIEW_DEDUPE_WINDOW_MS,
    });
}
