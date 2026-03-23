import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { parseAvailabilityWindow } from "@/lib/assignment-window";
import { resolveAssignmentScaleGuide } from "@/lib/scale-guide";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "COACH") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { userId, title, description, weekNumber, availableFrom, availableUntil, guideAudioUrl, guidePresetKey, guidePatternJson } = await req.json();

        if (!userId || !title) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
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

        const newAssignment = await prisma.assignment.create({
            data: {
                userId,
                title,
                description,
                weekNumber: weekNumber ? parseInt(weekNumber) : null,
                isCompleted: false,
                availableFrom: availability.availableFrom,
                availableUntil: availability.availableUntil,
                guideAudioUrl: scaleGuide.guideAudioUrl,
                guidePresetKey: scaleGuide.guidePresetKey,
                guidePatternJson: scaleGuide.guidePatternJson,
            }
        });

        return NextResponse.json(newAssignment);
    } catch (error) {
        console.error("Create assignment error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
