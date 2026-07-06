import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type WeeklyReportBody = {
    userId?: string;
    weekStart?: string;
    summaryTitle?: string;
    summaryBody?: string;
    nextFocus?: string;
};

const DAY_MS = 24 * 60 * 60 * 1000;

function sanitizeOptionalString(value: unknown) {
    if (typeof value !== "string") {
        return undefined;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
}

function getWeekStart(value?: string) {
    const reference = value ? new Date(value) : new Date();

    if (Number.isNaN(reference.getTime())) {
        return null;
    }

    const date = new Date(Date.UTC(reference.getUTCFullYear(), reference.getUTCMonth(), reference.getUTCDate()));
    const day = date.getUTCDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;

    date.setUTCDate(date.getUTCDate() + mondayOffset);
    date.setUTCHours(0, 0, 0, 0);

    return date;
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "COACH") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: WeeklyReportBody;

    try {
        body = (await request.json()) as WeeklyReportBody;
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const userId = sanitizeOptionalString(body.userId);

    if (!userId) {
        return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const weekStart = getWeekStart(body.weekStart);

    if (!weekStart) {
        return NextResponse.json({ error: "Invalid weekStart" }, { status: 400 });
    }

    const weekEnd = new Date(weekStart.getTime() + 7 * DAY_MS - 1);
    const [member, routineCount, recordingCount, feedbackCount] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            include: {
                enrollments: {
                    where: {
                        status: { in: ["ACTIVE", "PENDING_PAYMENT", "PAUSED"] },
                    },
                    orderBy: { createdAt: "desc" },
                    take: 1,
                },
            },
        }),
        prisma.dailyRoutine.count({
            where: {
                userId,
                createdAt: { gte: weekStart, lte: weekEnd },
            },
        }),
        prisma.assignment.count({
            where: {
                userId,
                isCompleted: true,
                updatedAt: { gte: weekStart, lte: weekEnd },
            },
        }),
        prisma.feedback.count({
            where: {
                assignment: { userId },
                createdAt: { gte: weekStart, lte: weekEnd },
            },
        }),
    ]);

    if (!member) {
        return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const summaryTitle =
        sanitizeOptionalString(body.summaryTitle) ||
        `${member.name || "회원"}님의 이번 주 연습 리듬`;
    const summaryBody =
        sanitizeOptionalString(body.summaryBody) ||
        `이번 주 루틴 ${routineCount}개, 제출 녹음 ${recordingCount}개, 코치 피드백 ${feedbackCount}개가 기록되었습니다.`;
    const nextFocus = sanitizeOptionalString(body.nextFocus);

    const report = await prisma.weeklyReport.upsert({
        where: {
            userId_weekStart: {
                userId,
                weekStart,
            },
        },
        update: {
            enrollmentId: member.enrollments[0]?.id,
            generatedByUserId: session.user.id,
            weekEnd,
            routineCount,
            recordingCount,
            feedbackCount,
            summaryTitle,
            summaryBody,
            nextFocus,
        },
        create: {
            userId,
            enrollmentId: member.enrollments[0]?.id,
            generatedByUserId: session.user.id,
            weekStart,
            weekEnd,
            routineCount,
            recordingCount,
            feedbackCount,
            summaryTitle,
            summaryBody,
            nextFocus,
        },
    });

    return NextResponse.json({ success: true, report });
}
