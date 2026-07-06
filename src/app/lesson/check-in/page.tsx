import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { normalizeLessonDateKey } from "@/lib/lesson-attendance";
import LessonCheckInClient from "./LessonCheckInClient";

type LessonCheckInPageProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
    return Array.isArray(value) ? value[0] : value;
}

export default async function LessonCheckInPage({ searchParams }: LessonCheckInPageProps) {
    const params = await searchParams;
    const rawDate = firstParam(params.date);
    const rawToken = firstParam(params.token);
    const dateKey = normalizeLessonDateKey(rawDate);
    const token = typeof rawToken === "string" && rawToken.trim() ? rawToken.trim() : null;
    const callbackUrl = `/lesson/check-in?date=${encodeURIComponent(rawDate || "")}&token=${encodeURIComponent(rawToken || "")}`;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }

    return (
        <LessonCheckInClient
            dateKey={dateKey}
            token={token}
            memberName={session.user.name || "회원"}
            initialError={!dateKey || !token ? "출석 QR 정보가 올바르지 않습니다. 코치 화면의 오늘 QR을 다시 찍어 주세요." : undefined}
        />
    );
}
