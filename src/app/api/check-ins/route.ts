import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { CheckInCondition } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type CheckInBody = {
    dailyRoutineId?: string;
    condition?: string;
    practicedToday?: boolean;
    memo?: string;
};

const validConditions = new Set<string>(Object.values(CheckInCondition));

function sanitizeOptionalString(value: unknown) {
    if (typeof value !== "string") {
        return undefined;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: CheckInBody;

    try {
        body = (await request.json()) as CheckInBody;
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const dailyRoutineId = sanitizeOptionalString(body.dailyRoutineId);
    const memo = sanitizeOptionalString(body.memo);
    const condition = validConditions.has(body.condition || "")
        ? (body.condition as CheckInCondition)
        : CheckInCondition.NORMAL;
    const practicedToday = Boolean(body.practicedToday);

    if (dailyRoutineId) {
        const routine = await prisma.dailyRoutine.findUnique({
            where: { id: dailyRoutineId },
            select: { id: true, userId: true },
        });

        if (!routine || routine.userId !== session.user.id) {
            return NextResponse.json({ error: "Routine not found" }, { status: 404 });
        }
    }

    const checkIn = await prisma.$transaction(async (tx) => {
        const created = await tx.checkIn.create({
            data: {
                userId: session.user.id,
                dailyRoutineId,
                condition,
                practicedToday,
                memo,
            },
        });

        if (dailyRoutineId && practicedToday) {
            await tx.dailyRoutine.update({
                where: { id: dailyRoutineId },
                data: {
                    status: "COMPLETED",
                    completedAt: new Date(),
                },
            });
        }

        return created;
    });

    return NextResponse.json({ success: true, checkIn });
}
