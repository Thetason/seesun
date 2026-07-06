import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PaymentStatus } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type PaymentRecordBody = {
    enrollmentId?: string;
    amountKrw?: number | string;
    status?: string;
    dueDate?: string;
    paidAt?: string;
    note?: string;
};

const paymentStatuses = new Set<string>(Object.values(PaymentStatus));

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
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function parseOptionalAmount(value: unknown) {
    if (typeof value === "number" && Number.isFinite(value)) {
        return Math.max(0, Math.round(value));
    }

    const sanitized = sanitizeOptionalString(value);

    if (!sanitized) {
        return undefined;
    }

    const numeric = Number(sanitized.replace(/,/g, ""));
    return Number.isFinite(numeric) ? Math.max(0, Math.round(numeric)) : undefined;
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "COACH") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: PaymentRecordBody;

    try {
        body = (await request.json()) as PaymentRecordBody;
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const enrollmentId = sanitizeOptionalString(body.enrollmentId);
    const status = paymentStatuses.has(body.status || "")
        ? (body.status as PaymentStatus)
        : PaymentStatus.PENDING;

    if (!enrollmentId) {
        return NextResponse.json({ error: "enrollmentId is required" }, { status: 400 });
    }

    const enrollment = await prisma.enrollment.findUnique({
        where: { id: enrollmentId },
        select: { id: true, userId: true },
    });

    if (!enrollment) {
        return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }

    const record = await prisma.$transaction(async (tx) => {
        const created = await tx.paymentRecord.create({
            data: {
                enrollmentId,
                amountKrw: parseOptionalAmount(body.amountKrw),
                status,
                dueDate: parseOptionalDate(body.dueDate),
                paidAt: parseOptionalDate(body.paidAt),
                note: sanitizeOptionalString(body.note),
            },
        });

        await tx.enrollment.update({
            where: { id: enrollmentId },
            data: { paymentStatus: status },
        });

        await tx.contactLog.create({
            data: {
                userId: enrollment.userId,
                coachId: session.user.id,
                channel: "NOTE",
                summary: `결제 상태를 ${status}로 기록했습니다.`,
                nextAction: status === "PAID" ? "루틴 운영을 계속 진행합니다." : "결제 확인 후 회원 상태를 갱신합니다.",
            },
        });

        return created;
    });

    return NextResponse.json({ success: true, record });
}
