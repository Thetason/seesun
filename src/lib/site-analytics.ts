const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

export const ANALYTICS_EVENT_TYPES = {
    pageView: "page_view",
    pageExit: "page_exit",
    diagnosisStarted: "diagnosis_started",
    diagnosisCompleted: "diagnosis_completed",
    kakaoChatClick: "kakao_chat_click",
} as const;

export const ANALYTICS_COOKIE_KEYS = {
    visitor: "seesun_vid",
    session: "seesun_sid",
} as const;

export const ANALYTICS_VISITOR_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;
export const ANALYTICS_SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;
export const ANALYTICS_PAGE_VIEW_DEDUPE_WINDOW_MS = 5000;

export const TRACKABLE_PATH_BLOCKLIST = ["/admin", "/dashboard", "/mission", "/api", "/_next"];

const PATH_LABELS: Record<string, string> = {
    "/": "홈",
    "/diagnosis": "보컬 진단",
    "/studio": "스튜디오",
    "/signature": "시그니처",
    "/reserve": "하이엔드",
    "/focus": "에센셜",
    "/login": "로그인",
    "/register": "회원가입",
};

export type AnalyticsEventRecord = {
    eventType: string;
    path: string;
    visitorKey: string;
    sessionKey?: string | null;
    durationMs?: number | null;
    label?: string | null;
    createdAt: Date | string;
};

export type SiteAnalyticsSummary = {
    dateRangeLabel: string;
    today: {
        pageViews: number;
        uniqueVisitors: number;
        diagnosisStarts: number;
        diagnosisCompletions: number;
        kakaoClicks: number;
    };
    totals: {
        pageViews: number;
        uniqueVisitors: number;
        diagnosisStarts: number;
        diagnosisCompletions: number;
        kakaoClicks: number;
    };
    topPages: Array<{
        path: string;
        label: string;
        views: number;
        uniqueVisitors: number;
        averageStaySeconds: number;
    }>;
    dailyBreakdown: Array<{
        dateKey: string;
        label: string;
        pageViews: number;
        uniqueVisitors: number;
        kakaoClicks: number;
    }>;
};

function getDateKeyKst(value: Date | string) {
    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
        return null;
    }

    const kst = new Date(parsed.getTime() + KST_OFFSET_MS);
    const year = kst.getUTCFullYear();
    const month = `${kst.getUTCMonth() + 1}`.padStart(2, "0");
    const day = `${kst.getUTCDate()}`.padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getDateLabel(dateKey: string) {
    const [yearValue, monthValue, dayValue] = dateKey.split("-");
    const weekday = ["일", "월", "화", "수", "목", "금", "토"][
        new Date(Date.UTC(Number(yearValue), Number(monthValue) - 1, Number(dayValue))).getUTCDay()
    ];

    return `${Number(monthValue)}/${Number(dayValue)} (${weekday})`;
}

function shiftDateKey(dateKey: string, amount: number) {
    const [yearValue, monthValue, dayValue] = dateKey.split("-");
    const shifted = new Date(Date.UTC(Number(yearValue), Number(monthValue) - 1, Number(dayValue) + amount));

    const year = shifted.getUTCFullYear();
    const month = `${shifted.getUTCMonth() + 1}`.padStart(2, "0");
    const day = `${shifted.getUTCDate()}`.padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export function normalizeAnalyticsPath(pathname: string | null | undefined) {
    if (!pathname) {
        return "/";
    }

    try {
        const normalizedUrl = pathname.startsWith("http")
            ? new URL(pathname)
            : new URL(pathname, "https://seesun-delta.vercel.app");

        const cleanPath = normalizedUrl.pathname || "/";
        return cleanPath === "" ? "/" : cleanPath;
    } catch {
        return pathname.startsWith("/") ? pathname : `/${pathname}`;
    }
}

export function isTrackableAnalyticsPath(pathname: string | null | undefined) {
    const normalizedPath = normalizeAnalyticsPath(pathname);

    return !TRACKABLE_PATH_BLOCKLIST.some((prefix) => normalizedPath.startsWith(prefix));
}

export function formatAnalyticsPathLabel(path: string) {
    return PATH_LABELS[path] || path;
}

export function formatAnalyticsDuration(seconds: number) {
    if (seconds < 60) {
        return `${seconds}초`;
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (remainingSeconds === 0) {
        return `${minutes}분`;
    }

    return `${minutes}분 ${remainingSeconds}초`;
}

export function buildSiteAnalyticsSummary(
    events: AnalyticsEventRecord[],
    rangeDays = 7,
    todayDateKey = getDateKeyKst(new Date()) || ""
): SiteAnalyticsSummary {
    const firstDateKey = shiftDateKey(todayDateKey, -(rangeDays - 1));
    const dateKeys = Array.from({ length: rangeDays }, (_, index) => shiftDateKey(firstDateKey, index));
    const pageViews = events.filter((event) => event.eventType === ANALYTICS_EVENT_TYPES.pageView);
    const pageExits = events.filter((event) => event.eventType === ANALYTICS_EVENT_TYPES.pageExit);
    const diagnosisStarts = events.filter((event) => event.eventType === ANALYTICS_EVENT_TYPES.diagnosisStarted);
    const diagnosisCompletions = events.filter((event) => event.eventType === ANALYTICS_EVENT_TYPES.diagnosisCompleted);
    const kakaoClicks = events.filter((event) => event.eventType === ANALYTICS_EVENT_TYPES.kakaoChatClick);

    const todayPageViews = pageViews.filter((event) => getDateKeyKst(event.createdAt) === todayDateKey);
    const todayDiagnosisStarts = diagnosisStarts.filter((event) => getDateKeyKst(event.createdAt) === todayDateKey);
    const todayDiagnosisCompletions = diagnosisCompletions.filter((event) => getDateKeyKst(event.createdAt) === todayDateKey);
    const todayKakaoClicks = kakaoClicks.filter((event) => getDateKeyKst(event.createdAt) === todayDateKey);

    const topPages = Array.from(
        pageViews.reduce((map, event) => {
            const current = map.get(event.path) || {
                path: event.path,
                label: formatAnalyticsPathLabel(event.path),
                views: 0,
                visitorKeys: new Set<string>(),
                totalDurationMs: 0,
                exitCount: 0,
            };

            current.views += 1;
            current.visitorKeys.add(event.visitorKey);
            map.set(event.path, current);
            return map;
        }, new Map<string, { path: string; label: string; views: number; visitorKeys: Set<string>; totalDurationMs: number; exitCount: number }>())
    )
        .map(([path, current]) => {
            const exitsForPath = pageExits.filter((event) => event.path === path && typeof event.durationMs === "number" && event.durationMs > 0);
            const totalDurationMs = exitsForPath.reduce((sum, event) => sum + (event.durationMs || 0), 0);
            const averageStaySeconds = exitsForPath.length > 0 ? Math.round(totalDurationMs / exitsForPath.length / 1000) : 0;

            return {
                path: current.path,
                label: current.label,
                views: current.views,
                uniqueVisitors: current.visitorKeys.size,
                averageStaySeconds,
            };
        })
        .sort((left, right) => right.views - left.views)
        .slice(0, 8);

    const dailyBreakdown = dateKeys.map((dateKey) => {
        const viewsForDate = pageViews.filter((event) => getDateKeyKst(event.createdAt) === dateKey);
        const kakaoForDate = kakaoClicks.filter((event) => getDateKeyKst(event.createdAt) === dateKey);

        return {
            dateKey,
            label: getDateLabel(dateKey),
            pageViews: viewsForDate.length,
            uniqueVisitors: new Set(viewsForDate.map((event) => event.visitorKey)).size,
            kakaoClicks: kakaoForDate.length,
        };
    });

    return {
        dateRangeLabel: `${getDateLabel(firstDateKey)} - ${getDateLabel(todayDateKey)}`,
        today: {
            pageViews: todayPageViews.length,
            uniqueVisitors: new Set(todayPageViews.map((event) => event.visitorKey)).size,
            diagnosisStarts: todayDiagnosisStarts.length,
            diagnosisCompletions: todayDiagnosisCompletions.length,
            kakaoClicks: todayKakaoClicks.length,
        },
        totals: {
            pageViews: pageViews.length,
            uniqueVisitors: new Set(pageViews.map((event) => event.visitorKey)).size,
            diagnosisStarts: diagnosisStarts.length,
            diagnosisCompletions: diagnosisCompletions.length,
            kakaoClicks: kakaoClicks.length,
        },
        topPages,
        dailyBreakdown,
    };
}
