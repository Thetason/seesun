import nodemailer from "nodemailer";
import type { DailyRoutine, RoutineDeliveryChannel } from "@prisma/client";
import {
    buildAssignmentAccessPath,
    createAssignmentAccessToken,
    getAssignmentAccessTokenExpiry,
} from "@/lib/assignment-access";
import { prisma } from "@/lib/prisma";

const DELIVERY_BATCH_SIZE = 100;

type RoutineDeliveryTarget = DailyRoutine & {
    user: {
        id: string;
        name: string | null;
        email: string | null;
        memberProfile: {
            preferredContact: string | null;
            practiceAnchor: string | null;
        } | null;
        enrollments: {
            programName: string;
            practiceAnchor: string | null;
        }[];
    };
    assignment: {
        id: string;
        userId: string;
        title: string;
        description: string | null;
        createdAt: Date;
        availableUntil: Date | null;
    } | null;
    deliveryLogs: {
        channel: RoutineDeliveryChannel;
        status: string;
    }[];
};

type DeliverTodayRoutinesOptions = {
    origin: string;
    dryRun?: boolean;
    now?: Date;
};

function escapeHtml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function getBaseUrl(origin: string) {
    return (process.env.NEXTAUTH_URL || origin).replace(/\/$/, "");
}

export function isRoutineDeliveryEmailConfigured() {
    return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function createTransporter() {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
}

function hasExistingDelivery(routine: RoutineDeliveryTarget, channel: RoutineDeliveryChannel) {
    return routine.deliveryLogs.some((log) => log.channel === channel && log.status !== "FAILED");
}

export function buildRoutineAccessUrl(routine: RoutineDeliveryTarget, origin: string) {
    const baseUrl = getBaseUrl(origin);

    if (!routine.assignment) {
        return `${baseUrl}/dashboard`;
    }

    const expiresAt = getAssignmentAccessTokenExpiry({
        availableUntil: routine.assignment.availableUntil,
        createdAt: routine.assignment.createdAt,
    });
    const token = createAssignmentAccessToken({
        assignmentId: routine.assignment.id,
        userId: routine.assignment.userId,
        expiresAt,
    });

    return `${baseUrl}${buildAssignmentAccessPath(token)}`;
}

export function buildRoutineDeliveryMessage(routine: RoutineDeliveryTarget, accessUrl: string) {
    const memberName = routine.user.name || "회원";
    const enrollment = routine.user.enrollments[0];
    const anchor = routine.lifeAnchor || enrollment?.practiceAnchor || routine.user.memberProfile?.practiceAnchor;
    const minutes = routine.expectedMinutes ? `${routine.expectedMinutes}분` : "짧게";
    const title = routine.title || "오늘의 루틴";
    const memo = routine.coachMemo || routine.focus || "오늘은 이것만 해도 충분합니다.";

    const lines = [
        `[SEE:SUN] ${memberName}님, 오늘의 루틴이 도착했습니다.`,
        "",
        `오늘은 이것만 하면 됩니다: ${title}`,
        `예상 시간: ${minutes}`,
        anchor ? `생활 지점: ${anchor}` : null,
        "",
        memo,
        "",
        accessUrl,
    ].filter((line): line is string => Boolean(line));

    return {
        subject: `SEE:SUN 오늘의 루틴: ${title}`,
        text: lines.join("\n"),
        html: `
            <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;line-height:1.65;color:#1d1d1f;max-width:560px;margin:0 auto;padding:24px;">
                <div style="font-size:12px;font-weight:800;color:#ff9f0a;letter-spacing:0.08em;margin-bottom:10px;">SEE:SUN TODAY ROUTINE</div>
                <h1 style="font-size:24px;line-height:1.2;margin:0 0 12px;">${escapeHtml(memberName)}님, 오늘은 이것만 하면 됩니다.</h1>
                <div style="border:1px solid rgba(0,0,0,0.08);border-radius:18px;padding:18px;margin:18px 0;background:#f9f9fb;">
                    <h2 style="font-size:19px;margin:0 0 10px;">${escapeHtml(title)}</h2>
                    <p style="margin:0 0 8px;color:#48484a;">예상 시간: ${escapeHtml(minutes)}</p>
                    ${anchor ? `<p style="margin:0 0 8px;color:#48484a;">생활 지점: ${escapeHtml(anchor)}</p>` : ""}
                    <p style="margin:14px 0 0;color:#48484a;white-space:pre-wrap;">${escapeHtml(memo)}</p>
                </div>
                <p>
                    <a href="${accessUrl}" style="display:inline-block;background:#1d1d1f;color:#fff;text-decoration:none;padding:13px 18px;border-radius:13px;font-weight:800;">
                        오늘 루틴 열기
                    </a>
                </p>
                <p style="font-size:13px;color:#86868b;word-break:break-all;">버튼이 열리지 않으면 이 링크를 복사해 주세요: ${accessUrl}</p>
            </div>
        `,
    };
}

async function sendRoutineEmail({
    to,
    subject,
    text,
    html,
}: {
    to: string;
    subject: string;
    text: string;
    html: string;
}) {
    const transporter = createTransporter();
    const from = process.env.SMTP_FROM || process.env.SMTP_USER;

    await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html,
    });
}

export async function deliverTodayRoutines({
    origin,
    dryRun = false,
    now = new Date(),
}: DeliverTodayRoutinesOptions) {
    const routines = await prisma.dailyRoutine.findMany({
        where: {
            status: {
                in: ["ACTIVE", "SCHEDULED"],
            },
            OR: [
                { availableFrom: null },
                { availableFrom: { lte: now } },
            ],
            AND: [
                {
                    OR: [
                        { expiresAt: null },
                        { expiresAt: { gte: now } },
                    ],
                },
            ],
            user: {
                role: "STUDENT",
                enrollments: {
                    some: {
                        status: "ACTIVE",
                    },
                },
            },
        },
        include: {
            assignment: {
                select: {
                    id: true,
                    userId: true,
                    title: true,
                    description: true,
                    createdAt: true,
                    availableUntil: true,
                },
            },
            deliveryLogs: {
                where: {
                    channel: {
                        in: ["EMAIL", "KAKAO"],
                    },
                },
                select: {
                    channel: true,
                    status: true,
                },
            },
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    memberProfile: {
                        select: {
                            preferredContact: true,
                            practiceAnchor: true,
                        },
                    },
                    enrollments: {
                        where: {
                            status: "ACTIVE",
                        },
                        orderBy: [
                            { startDate: "desc" },
                            { createdAt: "desc" },
                        ],
                        take: 1,
                        select: {
                            programName: true,
                            practiceAnchor: true,
                        },
                    },
                },
            },
        },
        orderBy: [
            { availableFrom: "asc" },
            { createdAt: "desc" },
        ],
        take: DELIVERY_BATCH_SIZE,
    });

    const emailConfigured = isRoutineDeliveryEmailConfigured();
    const results = [];

    for (const routine of routines) {
        const accessUrl = buildRoutineAccessUrl(routine, origin);
        const message = buildRoutineDeliveryMessage(routine, accessUrl);
        const result = {
            routineId: routine.id,
            userId: routine.userId,
            email: "SKIPPED",
            kakao: "SKIPPED",
        };

        if (!hasExistingDelivery(routine, "KAKAO")) {
            result.kakao = dryRun ? "DRY_RUN" : "READY";

            if (!dryRun) {
                await prisma.routineDeliveryLog.create({
                    data: {
                        dailyRoutineId: routine.id,
                        channel: "KAKAO",
                        status: "READY",
                        recipient: routine.user.memberProfile?.preferredContact || routine.user.name || null,
                        message: message.text,
                    },
                });
            }
        }

        if (!hasExistingDelivery(routine, "EMAIL")) {
            if (!routine.user.email) {
                result.email = "NO_EMAIL";

                if (!dryRun) {
                    await prisma.routineDeliveryLog.create({
                        data: {
                            dailyRoutineId: routine.id,
                            channel: "EMAIL",
                            status: "FAILED",
                            message: message.text,
                            errorMessage: "NO_MEMBER_EMAIL",
                        },
                    });
                }
            } else if (!emailConfigured) {
                result.email = "SMTP_NOT_CONFIGURED";

                if (!dryRun) {
                    await prisma.routineDeliveryLog.create({
                        data: {
                            dailyRoutineId: routine.id,
                            channel: "EMAIL",
                            status: "READY",
                            recipient: routine.user.email,
                            message: message.text,
                            errorMessage: "SMTP_NOT_CONFIGURED",
                        },
                    });
                }
            } else if (dryRun) {
                result.email = "DRY_RUN";
            } else {
                try {
                    await sendRoutineEmail({
                        to: routine.user.email,
                        ...message,
                    });

                    result.email = "SENT";

                    await prisma.routineDeliveryLog.create({
                        data: {
                            dailyRoutineId: routine.id,
                            channel: "EMAIL",
                            status: "SENT",
                            recipient: routine.user.email,
                            message: message.text,
                        },
                    });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : "UNKNOWN_EMAIL_ERROR";
                    result.email = "FAILED";

                    await prisma.routineDeliveryLog.create({
                        data: {
                            dailyRoutineId: routine.id,
                            channel: "EMAIL",
                            status: "FAILED",
                            recipient: routine.user.email,
                            message: message.text,
                            errorMessage,
                        },
                    });
                }
            }
        }

        results.push(result);
    }

    return {
        scanned: routines.length,
        emailConfigured,
        dryRun,
        results,
    };
}
