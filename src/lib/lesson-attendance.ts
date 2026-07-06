import crypto from "crypto";
import { LessonAttendanceStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const LESSON_QR_TOKEN_VERSION = "see-sun-lesson-attendance-v1";

export function getKstDateKey(date = new Date()) {
    return new Date(date.getTime() + KST_OFFSET_MS).toISOString().slice(0, 10);
}

export function normalizeLessonDateKey(value: unknown) {
    if (typeof value !== "string") {
        return null;
    }

    const dateKey = value.trim();

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
        return null;
    }

    const parsed = new Date(`${dateKey}T00:00:00.000Z`);

    if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== dateKey) {
        return null;
    }

    return dateKey;
}

function getLessonQrSecret() {
    const secret = process.env.LESSON_QR_SECRET || process.env.NEXTAUTH_SECRET;

    if (secret) {
        return secret;
    }

    if (process.env.NODE_ENV === "production") {
        throw new Error("LESSON_QR_SECRET or NEXTAUTH_SECRET is required in production.");
    }

    return "development-only-lesson-qr-secret";
}

export function createLessonQrToken(dateKey = getKstDateKey()) {
    return crypto
        .createHmac("sha256", getLessonQrSecret())
        .update(`${LESSON_QR_TOKEN_VERSION}:${dateKey}`)
        .digest("base64url");
}

export function verifyLessonQrToken(dateKey: string, token: string) {
    const expected = createLessonQrToken(dateKey);
    const expectedBuffer = Buffer.from(expected);
    const tokenBuffer = Buffer.from(token);

    return expectedBuffer.length === tokenBuffer.length && crypto.timingSafeEqual(expectedBuffer, tokenBuffer);
}

export function isLessonQrDateActive(dateKey: string, now = new Date()) {
    return dateKey === getKstDateKey(now);
}

export function buildLessonCheckInUrl(origin: string, dateKey = getKstDateKey()) {
    const url = new URL("/lesson/check-in", origin);
    url.searchParams.set("date", dateKey);
    url.searchParams.set("token", createLessonQrToken(dateKey));
    return url.toString();
}

export async function findLessonAttendanceEnrollment(userId: string) {
    return prisma.enrollment.findFirst({
        where: {
            userId,
            status: {
                in: ["ACTIVE", "PENDING_PAYMENT"],
            },
        },
        orderBy: [
            { startDate: "desc" },
            { createdAt: "desc" },
        ],
        select: {
            id: true,
            programName: true,
            status: true,
        },
    });
}

export async function recordLessonAttendance({
    userId,
    dateKey,
    tokenDateKey,
}: {
    userId: string;
    dateKey: string;
    tokenDateKey: string;
}) {
    const enrollment = await findLessonAttendanceEnrollment(userId);

    return prisma.$transaction(async (tx) => {
        const countWhere = enrollment
            ? {
                enrollmentId: enrollment.id,
                status: LessonAttendanceStatus.CONFIRMED,
            }
            : {
                userId,
                status: LessonAttendanceStatus.CONFIRMED,
            };
        const existing = await tx.lessonAttendance.findUnique({
            where: {
                userId_attendanceDate: {
                    userId,
                    attendanceDate: dateKey,
                },
            },
            include: {
                enrollment: {
                    select: {
                        id: true,
                        programName: true,
                    },
                },
            },
        });

        if (existing) {
            const existingCountWhere = existing.enrollmentId
                ? {
                    enrollmentId: existing.enrollmentId,
                    status: LessonAttendanceStatus.CONFIRMED,
                }
                : {
                    userId,
                    status: LessonAttendanceStatus.CONFIRMED,
                };
            const totalCount = await tx.lessonAttendance.count({
                where: existingCountWhere,
            });

            return {
                attendance: existing,
                enrollment: existing.enrollment || enrollment,
                totalCount,
                alreadyCheckedIn: true,
            };
        }

        const totalCountBefore = await tx.lessonAttendance.count({
            where: countWhere,
        });
        const lessonNumber = totalCountBefore + 1;
        const attendance = await tx.lessonAttendance.create({
            data: {
                userId,
                enrollmentId: enrollment?.id,
                attendanceDate: dateKey,
                source: "QR",
                status: LessonAttendanceStatus.CONFIRMED,
                qrTokenDate: tokenDateKey,
                lessonNumber,
            },
            include: {
                enrollment: {
                    select: {
                        id: true,
                        programName: true,
                    },
                },
            },
        });

        await tx.contactLog.create({
            data: {
                userId,
                channel: "IN_PERSON",
                summary: `레슨 출석 QR 체크인 완료 (${dateKey})`,
                nextAction: "오늘 레슨 후 다음 루틴 또는 코칭 메모를 정리합니다.",
            },
        });

        return {
            attendance,
            enrollment: attendance.enrollment || enrollment,
            totalCount: lessonNumber,
            alreadyCheckedIn: false,
        };
    });
}
