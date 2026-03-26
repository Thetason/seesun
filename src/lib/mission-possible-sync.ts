import { MISSION_POSSIBLE_TRACK_IDS } from "@/lib/mission-possible";
import { prisma } from "@/lib/prisma";

type MissionPossibleTemplate = {
    title: string;
    description: string | null;
    weekNumber: number | null;
    availableFrom: Date;
    availableUntil: Date;
    guideAudioUrl: string | null;
    guidePresetKey: string | null;
    guidePatternJson: string | null;
};

function getMissionPossibleTemplateKey(template: MissionPossibleTemplate | {
    title: string;
    availableFrom: Date | string | null;
    availableUntil: Date | string | null;
}) {
    return [
        template.title.trim(),
        template.availableFrom ? new Date(template.availableFrom).toISOString() : "",
        template.availableUntil ? new Date(template.availableUntil).toISOString() : "",
    ].join("::");
}

export async function getLiveMissionPossibleTemplates(referenceDate = new Date()) {
    const liveAssignments = await prisma.assignment.findMany({
        where: {
            availableFrom: { not: null },
            availableUntil: { gte: referenceDate },
            user: {
                trackId: {
                    in: [...MISSION_POSSIBLE_TRACK_IDS],
                },
            },
        },
        select: {
            title: true,
            description: true,
            weekNumber: true,
            availableFrom: true,
            availableUntil: true,
            guideAudioUrl: true,
            guidePresetKey: true,
            guidePatternJson: true,
            createdAt: true,
        },
        orderBy: [
            { availableFrom: "asc" },
            { createdAt: "asc" },
        ],
    });

    const uniqueTemplates = new Map<string, MissionPossibleTemplate>();

    for (const assignment of liveAssignments) {
        if (!assignment.availableFrom || !assignment.availableUntil) {
            continue;
        }

        const key = getMissionPossibleTemplateKey(assignment);

        if (!uniqueTemplates.has(key)) {
            uniqueTemplates.set(key, {
                title: assignment.title,
                description: assignment.description,
                weekNumber: assignment.weekNumber,
                availableFrom: assignment.availableFrom,
                availableUntil: assignment.availableUntil,
                guideAudioUrl: assignment.guideAudioUrl,
                guidePresetKey: assignment.guidePresetKey,
                guidePatternJson: assignment.guidePatternJson,
            });
        }
    }

    return Array.from(uniqueTemplates.values());
}

export async function syncLiveMissionPossibleAssignmentsForUser(userId: string, referenceDate = new Date()) {
    const liveTemplates = await getLiveMissionPossibleTemplates(referenceDate);

    if (liveTemplates.length === 0) {
        return { createdCount: 0, totalTemplates: 0 };
    }

    const existingAssignments = await prisma.assignment.findMany({
        where: {
            userId,
            availableFrom: { not: null },
            availableUntil: { not: null },
        },
        select: {
            title: true,
            availableFrom: true,
            availableUntil: true,
        },
    });

    const existingKeys = new Set(existingAssignments.map(getMissionPossibleTemplateKey));
    const missingTemplates = liveTemplates.filter((template) => !existingKeys.has(getMissionPossibleTemplateKey(template)));

    if (missingTemplates.length === 0) {
        return { createdCount: 0, totalTemplates: liveTemplates.length };
    }

    await prisma.assignment.createMany({
        data: missingTemplates.map((template) => ({
            userId,
            title: template.title,
            description: template.description,
            weekNumber: template.weekNumber,
            availableFrom: template.availableFrom,
            availableUntil: template.availableUntil,
            guideAudioUrl: template.guideAudioUrl,
            guidePresetKey: template.guidePresetKey,
            guidePatternJson: template.guidePatternJson,
        })),
    });

    return {
        createdCount: missingTemplates.length,
        totalTemplates: liveTemplates.length,
    };
}
