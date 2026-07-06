import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { getDefaultMissionPossibleWindow } from "@/lib/assignment-window";

export async function publishGojoRecommendation({
    recommendationId,
    coachId,
}: {
    recommendationId: string;
    coachId: string;
}) {
    return prisma.$transaction(async (tx) => {
        const recommendation = await tx.gojoRoutineRecommendation.findUnique({
            where: { id: recommendationId },
        });

        if (!recommendation) {
            throw new Error("Gojo recommendation not found.");
        }

        if (recommendation.status === "DISMISSED") {
            throw new Error("Dismissed Gojo recommendations cannot be published.");
        }

        if (recommendation.automationMode === "COACH_REQUIRED" && recommendation.status !== "ACCEPTED") {
            throw new Error("Coach-required Gojo recommendations must be accepted before publishing.");
        }

        if (recommendation.status === "PUBLISHED" && recommendation.assignmentId && recommendation.dailyRoutineId) {
            return {
                recommendation,
                assignmentId: recommendation.assignmentId,
                dailyRoutineId: recommendation.dailyRoutineId,
                alreadyPublished: true,
            };
        }

        const availability = getDefaultMissionPossibleWindow();
        const assignment = await tx.assignment.create({
            data: {
                userId: recommendation.userId,
                title: recommendation.title,
                description: recommendation.memberMemo,
                isCompleted: false,
                availableFrom: availability.availableFrom,
                availableUntil: availability.availableUntil,
            },
        });

        const dailyRoutine = await tx.dailyRoutine.create({
            data: {
                userId: recommendation.userId,
                enrollmentId: recommendation.enrollmentId,
                generatedByUserId: coachId,
                title: recommendation.title,
                focus: recommendation.focus,
                lifeAnchor: recommendation.lifeAnchor,
                expectedMinutes: recommendation.expectedMinutes,
                coachMemo: recommendation.memberMemo,
                assignmentId: assignment.id,
                shareToken: randomUUID(),
                status: availability.availableFrom > new Date() ? "SCHEDULED" : "ACTIVE",
                availableFrom: availability.availableFrom,
                expiresAt: availability.availableUntil,
            },
        });

        await tx.routineDeliveryLog.create({
            data: {
                dailyRoutineId: dailyRoutine.id,
                channel: "COPY_LINK",
                status: "READY",
                message: `Project Gojo 추천 루틴입니다. 추천 근거: ${recommendation.rationale}`,
            },
        });

        await tx.contactLog.create({
            data: {
                userId: recommendation.userId,
                coachId,
                channel: "NOTE",
                summary: `Project Gojo 추천 루틴 발행: ${recommendation.title}`,
                nextAction: "회원에게 오늘 루틴 링크 전달",
            },
        });

        const updatedRecommendation = await tx.gojoRoutineRecommendation.update({
            where: { id: recommendation.id },
            data: {
                status: "PUBLISHED",
                generatedByUserId: coachId,
                assignmentId: assignment.id,
                dailyRoutineId: dailyRoutine.id,
            },
        });

        return {
            recommendation: updatedRecommendation,
            assignmentId: assignment.id,
            dailyRoutineId: dailyRoutine.id,
            alreadyPublished: false,
        };
    });
}
