import { NextResponse } from "next/server";
import { ANALYTICS_EVENT_TYPES, isTrackableAnalyticsPath, normalizeAnalyticsPath } from "@/lib/site-analytics";
import { recordAnalyticsEvent } from "@/lib/site-analytics-server";

const ALLOWED_EVENT_TYPES = new Set(Object.values(ANALYTICS_EVENT_TYPES));

async function parseAnalyticsBody(req: Request) {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
        return req.json();
    }

    const text = await req.text();

    if (!text) {
        return null;
    }

    return JSON.parse(text);
}

export async function POST(req: Request) {
    try {
        const payload = await parseAnalyticsBody(req);

        if (!payload || typeof payload !== "object") {
            return NextResponse.json({ success: true, ignored: true });
        }

        const eventType = typeof payload.eventType === "string" ? payload.eventType : "";
        const path = normalizeAnalyticsPath(typeof payload.path === "string" ? payload.path : "/");
        const visitorKey = typeof payload.visitorKey === "string" ? payload.visitorKey.slice(0, 120) : "";
        if (!ALLOWED_EVENT_TYPES.has(eventType) || !visitorKey || !isTrackableAnalyticsPath(path)) {
            return NextResponse.json({ success: true, ignored: true });
        }

        const result = await recordAnalyticsEvent({
            eventType,
            path,
            visitorKey,
            sessionKey: typeof payload.sessionKey === "string" ? payload.sessionKey : null,
            label: typeof payload.label === "string" ? payload.label : null,
            durationMs: typeof payload.durationMs === "number" ? payload.durationMs : null,
            dedupeWindowMs: eventType === ANALYTICS_EVENT_TYPES.pageView ? 5000 : undefined,
        });

        return NextResponse.json({
            success: true,
            deduped: !result.created && result.reason === "deduped",
        });
    } catch (error) {
        console.error("[Analytics] Event ingest failed", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
