import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RoutineTemplateBody = {
    title?: string;
    description?: string;
    focus?: string;
    expectedMinutes?: number | string;
    stepsJson?: string;
    guidePresetKey?: string;
    category?: string;
    tags?: string[];
    tagsJson?: string;
    automationMode?: string;
    sourceProject?: string;
};

function sanitizeOptionalString(value: unknown) {
    if (typeof value !== "string") {
        return undefined;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
}

function parseExpectedMinutes(value: unknown) {
    if (typeof value === "number" && Number.isFinite(value)) {
        return Math.max(1, Math.round(value));
    }

    const sanitized = sanitizeOptionalString(value);

    if (!sanitized) {
        return undefined;
    }

    const numeric = Number(sanitized);
    return Number.isFinite(numeric) ? Math.max(1, Math.round(numeric)) : undefined;
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "COACH") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: RoutineTemplateBody;

    try {
        body = (await request.json()) as RoutineTemplateBody;
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const title = sanitizeOptionalString(body.title);

    if (!title) {
        return NextResponse.json({ error: "title is required" }, { status: 400 });
    }

    const template = await prisma.routineTemplate.create({
        data: {
            createdByUserId: session.user.id,
            title,
            description: sanitizeOptionalString(body.description),
            focus: sanitizeOptionalString(body.focus),
            expectedMinutes: parseExpectedMinutes(body.expectedMinutes),
            stepsJson: sanitizeOptionalString(body.stepsJson),
            guidePresetKey: sanitizeOptionalString(body.guidePresetKey),
            category: sanitizeOptionalString(body.category) || "Daily Routine",
            tagsJson: Array.isArray(body.tags)
                ? JSON.stringify(body.tags.filter((tag) => typeof tag === "string" && tag.trim().length > 0))
                : sanitizeOptionalString(body.tagsJson),
            automationMode: body.automationMode === "AUTO_PUBLISH" || body.automationMode === "COACH_REQUIRED"
                ? body.automationMode
                : "COACH_APPROVAL",
            sourceProject: sanitizeOptionalString(body.sourceProject) || "KAKASHI",
        },
    });

    return NextResponse.json({ success: true, template });
}
