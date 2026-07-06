import { randomUUID } from "crypto";
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
            gojoRecommendationId,
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
        const canAttachGojoRecommendation = typeof gojoRecommendationId === "string" && gojoRecommendationId.trim().length > 0 && userIdsToCreate.length === 1;

        if (userIdsToCreate.length > 0) {
            await prisma.$transaction(async (tx) => {
                for (const targetUserId of userIdsToCreate) {
                    const assignment = await tx.assignment.create({
                        data: {
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
                        },
                    });

                    if (availability.availableFrom || availability.availableUntil) {
                        const activeEnrollment = await tx.enrollment.findFirst({
                            where: {
                                userId: targetUserId,
                                status: {
                                    in: ["ACTIVE", "PENDING_PAYMENT"],
                                },
                            },
                            orderBy: { createdAt: "desc" },
                            select: { id: true, practiceAnchor: true },
                        });

                        const dailyRoutine = await tx.dailyRoutine.create({
                            data: {
                                userId: targetUserId,
                                enrollmentId: activeEnrollment?.id,
                                generatedByUserId: session.user.id,
                                title: title.replace(/^\[Mission Possible\]\s*/, ""),
                                focus: description || title,
                                lifeAnchor: activeEnrollment?.practiceAnchor,
                                expectedMinutes: 7,
                                coachMemo: description,
                                guideUrl: scaleGuide.guideAudioUrl,
                                assignmentId: assignment.id,
                                shareToken: randomUUID(),
                                status: availability.availableFrom && availability.availableFrom > new Date()
                                    ? "SCHEDULED"
                                    : "ACTIVE",
                                availableFrom: availability.availableFrom,
                                expiresAt: availability.availableUntil,
                            },
                        });

                        await tx.routineDeliveryLog.create({
                            data: {
                                dailyRoutineId: dailyRoutine.id,
                                channel: "COPY_LINK",
                                status: "READY",
                                message: "코치가 오늘 루틴 링크를 복사해 회원에게 전달할 수 있습니다.",
                            },
                        });

                        if (canAttachGojoRecommendation) {
                            await tx.gojoRoutineRecommendation.updateMany({
                                where: {
                                    id: gojoRecommendationId,
                                    userId: targetUserId,
                                    status: {
                                        in: ["SUGGESTED", "ACCEPTED"],
                                    },
                                },
                                data: {
                                    status: "PUBLISHED",
                                    generatedByUserId: session.user.id,
                                    assignmentId: assignment.id,
                                    dailyRoutineId: dailyRoutine.id,
                                },
                            });
                        }
                    }
                }
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
