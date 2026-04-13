import { headers } from "next/headers";
import { recordServerPageView } from "@/lib/site-analytics-server";

export default async function ServerPageViewTracker() {
    const requestHeaders = await headers();

    if (requestHeaders.get("x-seesun-track-pageview") !== "1") {
        return null;
    }

    const path = requestHeaders.get("x-seesun-pathname");
    const visitorKey = requestHeaders.get("x-seesun-analytics-visitor");
    const sessionKey = requestHeaders.get("x-seesun-analytics-session");

    if (!path || !visitorKey) {
        return null;
    }

    try {
        await recordServerPageView({
            path,
            visitorKey,
            sessionKey,
        });
    } catch (error) {
        console.error("[Analytics] Server page view ingest failed", error);
    }

    return null;
}
