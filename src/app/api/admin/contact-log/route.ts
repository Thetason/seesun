import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ContactChannel } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type ContactLogBody = {
    userId?: string;
    channel?: string;
    summary?: string;
    nextAction?: string;
};

const validChannels = new Set<string>(Object.values(ContactChannel));

function sanitizeOptionalString(value: unknown) {
    if (typeof value !== "string") {
        return undefined;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "COACH") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: ContactLogBody;

    try {
        body = (await request.json()) as ContactLogBody;
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const userId = sanitizeOptionalString(body.userId);
    const summary = sanitizeOptionalString(body.summary);
    const nextAction = sanitizeOptionalString(body.nextAction);
    const channel = validChannels.has(body.channel || "")
        ? (body.channel as ContactChannel)
        : ContactChannel.NOTE;

    if (!userId || !summary) {
        return NextResponse.json({ error: "userId and summary are required" }, { status: 400 });
    }

    const member = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true },
    });

    if (!member) {
        return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const contactLog = await prisma.contactLog.create({
        data: {
            userId,
            coachId: session.user.id,
            channel,
            summary,
            nextAction,
        },
    });

    return NextResponse.json({ success: true, contactLog });
}
