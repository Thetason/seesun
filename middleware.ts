import { NextResponse, type NextRequest } from "next/server";
import {
    ANALYTICS_COOKIE_KEYS,
    ANALYTICS_SESSION_MAX_AGE_SECONDS,
    ANALYTICS_VISITOR_MAX_AGE_SECONDS,
    isTrackableAnalyticsPath,
    normalizeAnalyticsPath,
} from "./src/lib/site-analytics";

function createAnalyticsKey() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function isPrefetchRequest(request: NextRequest) {
    return request.headers.get("purpose") === "prefetch" || request.headers.has("next-router-prefetch");
}

export function middleware(request: NextRequest) {
    const pathname = normalizeAnalyticsPath(request.nextUrl.pathname);
    const isTrackablePath = isTrackableAnalyticsPath(pathname);
    const requestHeaders = new Headers(request.headers);
    const visitorKey = request.cookies.get(ANALYTICS_COOKIE_KEYS.visitor)?.value || createAnalyticsKey();
    const sessionKey = request.cookies.get(ANALYTICS_COOKIE_KEYS.session)?.value || createAnalyticsKey();

    requestHeaders.set("x-seesun-pathname", pathname);
    requestHeaders.set("x-seesun-analytics-visitor", visitorKey);
    requestHeaders.set("x-seesun-analytics-session", sessionKey);
    requestHeaders.set(
        "x-seesun-track-pageview",
        request.method === "GET" && isTrackablePath && !isPrefetchRequest(request) ? "1" : "0"
    );

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    if (isTrackablePath) {
        if (!request.cookies.get(ANALYTICS_COOKIE_KEYS.visitor)?.value) {
            response.cookies.set({
                name: ANALYTICS_COOKIE_KEYS.visitor,
                value: visitorKey,
                maxAge: ANALYTICS_VISITOR_MAX_AGE_SECONDS,
                sameSite: "lax",
                path: "/",
                httpOnly: false,
                secure: process.env.NODE_ENV === "production",
            });
        }

        response.cookies.set({
            name: ANALYTICS_COOKIE_KEYS.session,
            value: sessionKey,
            maxAge: ANALYTICS_SESSION_MAX_AGE_SECONDS,
            sameSite: "lax",
            path: "/",
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
        });
    }

    return response;
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|woff|woff2|ttf)$).*)",
    ],
};
