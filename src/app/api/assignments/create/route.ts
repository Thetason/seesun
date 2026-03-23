import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseAvailabilityWindow } from "@/lib/assignment-window";
import { resolveAssignmentScaleGuide } from "@/lib/scale-guide";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== 'COACH') {
        return NextResponse.json({ error: "Unauthorized. Coach access required." }, { status: 403 });
    }

    try {
        const { userId, title, description, weekNumber, availableFrom, availableUntil, guideAudioUrl, guidePresetKey, guidePatternJson } = await request.json();

        if (!userId || !title) {
            return NextResponse.json({ error: "Missing required fields: userId or title" }, { status: 400 });
        }

        const availability = parseAvailabilityWindow({ availableFrom, availableUntil });

        if ("error" in availability) {
            return NextResponse.json({ error: availability.error }, { status: 400 });
        }

        const scaleGuide = resolveAssignmentScaleGuide({
            title,
            guideAudioUrl,
            guidePresetKey,
            guidePatternJson,
        });

        const assignment = await prisma.assignment.create({
            data: {
                title,
                description,
                weekNumber: weekNumber ? parseInt(weekNumber) : null,
                userId,
                availableFrom: availability.availableFrom,
                availableUntil: availability.availableUntil,
                guideAudioUrl: scaleGuide.guideAudioUrl,
                guidePresetKey: scaleGuide.guidePresetKey,
                guidePatternJson: scaleGuide.guidePatternJson,
            }
        });

        return NextResponse.json({ assignment, success: true });
    } catch (error) {
        console.error("Assignment Creation Error:", error);
        return NextResponse.json({ error: "Failed to create assignment" }, { status: 500 });
    }
}
