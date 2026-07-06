import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { ConsultationStatus, EnrollmentStatus, PaymentStatus } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
    buildMemberInviteUrl,
    createMemberInviteToken,
    hashMemberInviteToken,
    sendMemberInviteEmail,
} from "@/lib/member-invites";

type ConvertConsultationBody = {
    consultationId?: string;
    name?: string;
    email?: string;
    initialPassword?: string;
    trackId?: string;
    programName?: string;
    enrollmentStatus?: string;
    paymentStatus?: string;
    startDate?: string;
    expectedEndDate?: string;
    primaryGoal?: string;
    practiceAnchor?: string;
    representativeSongs?: string;
    privateNotes?: string;
    createFirstRoutine?: boolean;
    sendInviteEmail?: boolean;
};

const trackProgramNames: Record<string, string> = {
    track_spark: "Spark",
    track_focus: "Essential",
    track_signature: "Signature",
    track_reserve: "HighEnd",
};

const enrollmentStatuses = new Set<string>(Object.values(EnrollmentStatus));
const paymentStatuses = new Set<string>(Object.values(PaymentStatus));
const INVITE_TTL_DAYS = 14;

function sanitizeOptionalString(value: unknown) {
    if (typeof value !== "string") {
        return undefined;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
}

function parseOptionalDate(value: unknown) {
    const sanitized = sanitizeOptionalString(value);

    if (!sanitized) {
        return undefined;
    }

    const parsed = new Date(sanitized);

    if (Number.isNaN(parsed.getTime())) {
        return undefined;
    }

    return parsed;
}

function addHours(date: Date, hours: number) {
    return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

function buildInitialRoutineDescription({
    focus,
    practiceAnchor,
}: {
    focus: string;
    practiceAnchor?: string;
}) {
    return [
        "완벽하게 부르지 않아도 됩니다. 현재 상태를 보는 짧은 기록입니다.",
        "",
        practiceAnchor ? `오늘 붙일 시간: ${practiceAnchor}` : "오늘 편한 시간에 7분만 남겨주세요.",
        "",
        "1. 30초 조용한 호흡",
        "2. 허밍 3회",
        "3. 대표곡 또는 가장 편한 첫 소절 녹음",
        "",
        `오늘의 초점: ${focus}`,
        "이 녹음은 담당 코치만 확인합니다.",
    ].join("\n");
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "COACH") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: ConvertConsultationBody;

    try {
        body = (await request.json()) as ConvertConsultationBody;
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const consultationId = sanitizeOptionalString(body.consultationId);

    if (!consultationId) {
        return NextResponse.json({ error: "consultationId is required" }, { status: 400 });
    }

    const consultation = await prisma.consultation.findUnique({
        where: { id: consultationId },
    });

    if (!consultation) {
        return NextResponse.json({ error: "Consultation not found" }, { status: 404 });
    }

    const email = sanitizeOptionalString(body.email || consultation.email)?.toLowerCase();
    const initialPassword = sanitizeOptionalString(body.initialPassword);

    if (!email) {
        return NextResponse.json(
            { error: "회원 로그인을 만들려면 이메일이 필요합니다." },
            { status: 400 }
        );
    }

    if (initialPassword && initialPassword.length < 8) {
        return NextResponse.json(
            { error: "초기 비밀번호는 8자 이상이어야 합니다." },
            { status: 400 }
        );
    }

    const name = sanitizeOptionalString(body.name || consultation.name) || email.split("@")[0];
    const trackId = sanitizeOptionalString(body.trackId) || "track_reserve";
    const programName =
        sanitizeOptionalString(body.programName) ||
        trackProgramNames[trackId] ||
        consultation.type ||
        "SEE:SUN Coaching";
    const enrollmentStatus = enrollmentStatuses.has(body.enrollmentStatus || "")
        ? (body.enrollmentStatus as EnrollmentStatus)
        : EnrollmentStatus.ACTIVE;
    const paymentStatus = paymentStatuses.has(body.paymentStatus || "")
        ? (body.paymentStatus as PaymentStatus)
        : PaymentStatus.PENDING;
    const startDate = parseOptionalDate(body.startDate);
    const expectedEndDate = parseOptionalDate(body.expectedEndDate);
    const primaryGoal =
        sanitizeOptionalString(body.primaryGoal) ||
        sanitizeOptionalString(consultation.motivation) ||
        sanitizeOptionalString(consultation.bottleneck);
    const practiceAnchor = sanitizeOptionalString(body.practiceAnchor || consultation.timeInvestment);
    const representativeSongs = sanitizeOptionalString(body.representativeSongs);
    const privateNotes = sanitizeOptionalString(body.privateNotes || consultation.notes);
    const painPoint =
        sanitizeOptionalString(consultation.bottleneck) ||
        sanitizeOptionalString(consultation.notes);
    const now = new Date();
    const inviteToken = createMemberInviteToken();
    const inviteUrl = buildMemberInviteUrl(inviteToken);
    const inviteExpiresAt = new Date(now.getTime() + INVITE_TTL_DAYS * 24 * 60 * 60 * 1000);
    const firstRoutineFocus = painPoint || "첫 소절 전 호흡 안정";
    const firstRoutineDescription = buildInitialRoutineDescription({
        focus: firstRoutineFocus,
        practiceAnchor,
    });

    try {
        const result = await prisma.$transaction(async (tx) => {
            const track = await tx.track.findUnique({
                where: { id: trackId },
                select: { id: true, name: true },
            });
            const hashedPassword = await bcrypt.hash(initialPassword || createMemberInviteToken(), 12);
            const existingUser = await tx.user.findUnique({
                where: { email },
            });

            const user = existingUser
                ? await tx.user.update({
                    where: { id: existingUser.id },
                    data: {
                        name,
                        role: "STUDENT",
                        password: existingUser.password || hashedPassword,
                        trackId: track?.id || existingUser.trackId,
                    },
                })
                : await tx.user.create({
                    data: {
                        name,
                        email,
                        password: hashedPassword,
                        role: "STUDENT",
                        trackId: track?.id,
                    },
                });

            const memberProfile = await tx.memberProfile.upsert({
                where: { userId: user.id },
                update: {
                    phone: consultation.phone,
                    roleTitle: sanitizeOptionalString(consultation.level),
                    primaryGoal,
                    painPoint,
                    practiceAnchor,
                    preferredContact: sanitizeOptionalString(consultation.preferredTime),
                    representativeSongs,
                    privateNotes,
                    createdFromConsultationId: consultation.id,
                },
                create: {
                    userId: user.id,
                    phone: consultation.phone,
                    roleTitle: sanitizeOptionalString(consultation.level),
                    primaryGoal,
                    painPoint,
                    practiceAnchor,
                    preferredContact: sanitizeOptionalString(consultation.preferredTime),
                    representativeSongs,
                    privateNotes,
                    createdFromConsultationId: consultation.id,
                },
            });

            const enrollment = await tx.enrollment.create({
                data: {
                    userId: user.id,
                    trackId: track?.id,
                    consultationId: consultation.id,
                    programName,
                    status: enrollmentStatus,
                    paymentStatus,
                    startDate,
                    expectedEndDate,
                    coachId: session.user.id,
                    coachName: session.user.name || session.user.email || "SEE:SUN Coach",
                    primaryGoal,
                    practiceAnchor,
                    representativeSongs,
                    notes: privateNotes,
                },
            });

            await tx.contactLog.create({
                data: {
                    userId: user.id,
                    coachId: session.user.id,
                    consultationId: consultation.id,
                    channel: "NOTE",
                    summary: `${consultation.type} 상담 신청을 ${programName} 유료회원으로 전환했습니다.`,
                    nextAction: "첫 루틴 진행 여부와 로그인 가능 여부를 확인합니다.",
                },
            });

            const invite = await tx.memberInvite.create({
                data: {
                    userId: user.id,
                    createdByUserId: session.user.id,
                    tokenHash: hashMemberInviteToken(inviteToken),
                    expiresAt: inviteExpiresAt,
                },
            });

            let dailyRoutine = null;
            let assignment = null;

            if (body.createFirstRoutine !== false) {
                const availableFrom = now;
                const expiresAt = addHours(now, 24);

                dailyRoutine = await tx.dailyRoutine.create({
                    data: {
                        userId: user.id,
                        enrollmentId: enrollment.id,
                        generatedByUserId: session.user.id,
                        title: "첫 7분 목소리 루틴",
                        focus: firstRoutineFocus,
                        lifeAnchor: practiceAnchor,
                        expectedMinutes: 7,
                        stepsJson: JSON.stringify([
                            "30초 조용한 호흡",
                            "허밍 3회",
                            "대표곡 또는 가장 편한 첫 소절 녹음",
                        ]),
                        coachMemo: firstRoutineDescription,
                        shareToken: randomUUID(),
                        status: "ACTIVE",
                        availableFrom,
                        expiresAt,
                    },
                });

                await tx.routineDeliveryLog.create({
                    data: {
                        dailyRoutineId: dailyRoutine.id,
                        channel: "MANUAL",
                        status: "READY",
                        recipient: consultation.phone || email,
                        message: "첫 7분 목소리 루틴이 준비되었습니다. 카카오로 링크 또는 로그인 안내를 전달해 주세요.",
                    },
                });

                assignment = await tx.assignment.create({
                    data: {
                        userId: user.id,
                        title: "[Mission Possible] 첫 7분 목소리 루틴",
                        description: firstRoutineDescription,
                        weekNumber: 1,
                        availableFrom,
                        availableUntil: expiresAt,
                    },
                });

                await tx.dailyRoutine.update({
                    where: { id: dailyRoutine.id },
                    data: { assignmentId: assignment.id },
                });
            }

            const updatedConsultation = await tx.consultation.update({
                where: { id: consultation.id },
                data: {
                    status: ConsultationStatus.COMPLETED,
                    convertedUserId: user.id,
                    convertedAt: now,
                },
            });

            return {
                user,
                memberProfile,
                enrollment,
                dailyRoutine,
                assignment,
                invite,
                consultation: updatedConsultation,
            };
        });

        let emailSent = false;
        let emailReason: string | undefined;

        if (body.sendInviteEmail !== false) {
            const emailResult = await sendMemberInviteEmail({
                to: email,
                memberName: result.user.name,
                inviteUrl,
            });

            emailSent = Boolean(emailResult.sent);
            emailReason = emailResult.reason;

            if (emailSent) {
                await prisma.memberInvite.update({
                    where: { id: result.invite.id },
                    data: { sentAt: new Date() },
                });
            }
        }

        return NextResponse.json({
            success: true,
            userId: result.user.id,
            enrollmentId: result.enrollment.id,
            dailyRoutineId: result.dailyRoutine?.id,
            assignmentId: result.assignment?.id,
            inviteId: result.invite.id,
            inviteUrl,
            emailSent,
            emailReason,
            message: "유료회원 전환이 완료되었습니다.",
        });
    } catch (error) {
        console.error("[API/ConvertConsultation] Failed:", error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Internal Server Error",
            },
            { status: 500 }
        );
    }
}
