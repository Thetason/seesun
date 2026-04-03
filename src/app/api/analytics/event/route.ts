import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ANALYTICS_EVENT_TYPES, isTrackableAnalyticsPath, normalizeAnalyticsPath } from "@/lib/site-analytics";

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
        const sessionKey = typeof payload.sessionKey === "string" ? payload.sessionKey.slice(0, 120) : null;
        const label = typeof payload.label === "string" ? payload.label.slice(0, 200) : null;
        const durationMs = typeof payload.durationMs === "number" && payload.durationMs >= 0
            ? Math.min(Math.round(payload.durationMs), 1000 * 60 * 60 * 12)
            : null;

        if (!ALLOWED_EVENT_TYPES.has(eventType) || !visitorKey || !isTrackableAnalyticsPath(path)) {
            return NextResponse.json({ success: true, ignored: true });
        }

        await prisma.analyticsEvent.create({
            data: {
                eventType,
                path,
                visitorKey,
                sessionKey,
                durationMs,
                label,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[Analytics] Event ingest failed", error);
        return NextResponse.json({ success: true, ignored: true });
    }
}
