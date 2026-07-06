import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
    isLessonQrDateActive,
    normalizeLessonDateKey,
    recordLessonAttendance,
    verifyLessonQrToken,
} from "@/lib/lesson-attendance";

type LessonCheckInBody = {
    date?: string;
    token?: string;
};

function sanitizeToken(value: unknown) {
    if (typeof value !== "string") {
        return null;
    }

    const token = value.trim();
    return token.length > 0 ? token : null;
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    if (session.user.role !== "STUDENT") {
        return NextResponse.json({ error: "회원 계정으로 로그인해야 출석을 기록할 수 있습니다." }, { status: 403 });
    }

    let body: LessonCheckInBody;

    try {
        body = (await request.json()) as LessonCheckInBody;
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const dateKey = normalizeLessonDateKey(body.date);
    const token = sanitizeToken(body.token);

    if (!dateKey || !token) {
        return NextResponse.json({ error: "출석 QR 정보가 올바르지 않습니다." }, { status: 400 });
    }

    if (!isLessonQrDateActive(dateKey)) {
        return NextResponse.json({ error: "오늘 사용할 수 있는 QR만 출석 처리할 수 있습니다." }, { status: 400 });
    }

    if (!verifyLessonQrToken(dateKey, token)) {
        return NextResponse.json({ error: "출석 QR이 유효하지 않습니다." }, { status: 400 });
    }

    const result = await recordLessonAttendance({
        userId: session.user.id,
        dateKey,
        tokenDateKey: dateKey,
    });

    return NextResponse.json({
        success: true,
        attendance: {
            id: result.attendance.id,
            attendanceDate: result.attendance.attendanceDate,
            checkedInAt: result.attendance.checkedInAt,
            lessonNumber: result.attendance.lessonNumber,
        },
        enrollment: result.enrollment,
        totalCount: result.totalCount,
        alreadyCheckedIn: result.alreadyCheckedIn,
    });
}
