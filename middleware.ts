import { NextResponse, type NextRequest } from "next/server";
import {
    ANALYTICS_COOKIE_KEYS,
    ANALYTICS_SESSION_MAX_AGE_SECONDS,
    ANALYTICS_VISITOR_MAX_AGE_SECONDS,
    isTrackableAnalyticsPath,
    normalizeAnalyticsPath,
} from "./src/lib/site-analytics";

const CRAWLER_USER_AGENTS = [
    "googlebot",
    "bingbot",
    "yeti",
    "daum",
    "duckduckbot",
    "applebot",
    "petalbot",
    "facebookexternalhit",
    "twitterbot",
    "slackbot",
    "linkedinbot",
    "gptbot",
    "oai-searchbot",
    "chatgpt-user",
    "claudebot",
    "anthropic-ai",
    "perplexitybot",
    "bytespider",
    "ahrefsbot",
    "semrushbot",
];

const CRAWLER_USER_AGENT_PATTERN = new RegExp(CRAWLER_USER_AGENTS.join("|"), "i");

function createAnalyticsKey() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function isCrawlerRequest(request: NextRequest) {
    return CRAWLER_USER_AGENT_PATTERN.test(request.headers.get("user-agent") || "");
}

// Server-set cookies outlive Safari's 7-day cap on script-set cookies, so returning
// visitors stay recognizable. Page views themselves are recorded by the client tracker.
export function middleware(request: NextRequest) {
    const response = NextResponse.next();
    const pathname = normalizeAnalyticsPath(request.nextUrl.pathname);

    // Crawlers get no cookies so their hits stay out of visit data.
    if (!isTrackableAnalyticsPath(pathname) || isCrawlerRequest(request)) {
        return response;
    }

    if (!request.cookies.get(ANALYTICS_COOKIE_KEYS.visitor)?.value) {
        response.cookies.set({
            name: ANALYTICS_COOKIE_KEYS.visitor,
            value: createAnalyticsKey(),
            maxAge: ANALYTICS_VISITOR_MAX_AGE_SECONDS,
            sameSite: "lax",
            path: "/",
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
        });
    }

    response.cookies.set({
        name: ANALYTICS_COOKIE_KEYS.session,
        value: request.cookies.get(ANALYTICS_COOKIE_KEYS.session)?.value || createAnalyticsKey(),
        maxAge: ANALYTICS_SESSION_MAX_AGE_SECONDS,
        sameSite: "lax",
        path: "/",
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
    });

    return response;
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*opengraph-image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|woff|woff2|ttf)$).*)",
    ],
};
