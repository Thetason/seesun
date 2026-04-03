import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { parseAvailabilityWindow } from "@/lib/assignment-window";
import { MISSION_POSSIBLE_TRACK_IDS } from "@/lib/mission-possible";
import { resolveAssignmentScaleGuide } from "@/lib/scale-guide";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "COACH") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const {
            userId,
            userIds,
            title,
            description,
            weekNumber,
            availableFrom,
            availableUntil,
            guideAudioUrl,
            guidePresetKey,
            guidePatternJson,
            broadcastToMissionPossibleStudents,
        } = await req.json();

        const normalizedUserIds = Array.isArray(userIds)
            ? userIds.filter((value): value is string => typeof value === "string" && value.trim().length > 0)
            : [];

        if (!title || (!userId && normalizedUserIds.length === 0 && !broadcastToMissionPossibleStudents)) {
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

        const parsedWeekNumber = weekNumber ? parseInt(weekNumber, 10) : null;

        const targetUserIds = broadcastToMissionPossibleStudents
            ? (
                await prisma.user.findMany({
                    where: {
                        role: "STUDENT",
                        trackId: {
                            in: [...MISSION_POSSIBLE_TRACK_IDS],
                        },
                    },
                    select: { id: true },
                })
            ).map((user) => user.id)
            : Array.from(new Set(normalizedUserIds.length > 0 ? normalizedUserIds : [userId]));

        if (targetUserIds.length === 0) {
            return NextResponse.json(
                { error: "No eligible mission possible students found" },
                { status: 400 }
            );
        }

        const existingAssignments = await prisma.assignment.findMany({
            where: {
                userId: { in: targetUserIds },
                title,
                availableFrom: availability.availableFrom,
                availableUntil: availability.availableUntil,
            },
            select: {
                userId: true,
            },
        });

        const existingUserIds = new Set(existingAssignments.map((assignment) => assignment.userId));
        const userIdsToCreate = targetUserIds.filter((targetId) => !existingUserIds.has(targetId));

        if (userIdsToCreate.length > 0) {
            await prisma.assignment.createMany({
                data: userIdsToCreate.map((targetUserId) => ({
                    userId: targetUserId,
                    title,
                    description,
                    weekNumber: parsedWeekNumber,
                    isCompleted: false,
                    availableFrom: availability.availableFrom,
                    availableUntil: availability.availableUntil,
                    guideAudioUrl: scaleGuide.guideAudioUrl,
                    guidePresetKey: scaleGuide.guidePresetKey,
                    guidePatternJson: scaleGuide.guidePatternJson,
                })),
            });
        }

        return NextResponse.json({
            success: true,
            createdCount: userIdsToCreate.length,
            skippedCount: targetUserIds.length - userIdsToCreate.length,
            totalTargetCount: targetUserIds.length,
            broadcastToMissionPossibleStudents: Boolean(broadcastToMissionPossibleStudents),
        });
    } catch (error) {
        console.error("Create assignment error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
