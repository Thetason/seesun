import type { RoutineAutomationMode } from "@prisma/client";
import { generateGojoRecommendation } from "@/lib/gojo/recommendation-engine";
import { prisma } from "@/lib/prisma";
import { normalizeObiwanSignalPayload, type NormalizedObiwanSignal } from "./obiwan-signal-normalizer";

type IngestOptions = {
    payload: unknown;
    createRecommendation?: boolean;
};

export type KakashiObiwanIngestResult = {
    success: true;
    normalized: NormalizedObiwanSignal;
    signal: unknown;
    recommendation: unknown | null;
    generatedRecommendation: ReturnType<typeof generateGojoRecommendation> | null;
    operatingPacket: {
        sourceProject: "OBIWAN";
        targetProject: "GOJO";
        operatingProject: "KAKASHI";
        createdRecommendation: boolean;
        nextAction: string;
        automationMode: RoutineAutomationMode | null;
        coachReviewRequired: boolean;
    };
};

export async function ingestObiwanSignalIntoKakashi({
    payload,
    createRecommendation = true,
}: IngestOptions): Promise<KakashiObiwanIngestResult> {
    const normalized = normalizeObiwanSignalPayload(payload);
    const userId = normalized.memberLookup.userId;
    const email = normalized.memberLookup.email;

    if (!userId && !email) {
        throw new KakashiOsError("userId or email is required", 400);
    }

    return prisma.$transaction(async (tx) => {
        const user = await tx.user.findFirst({
            where: userId ? { id: userId, role: "STUDENT" } : { email, role: "STUDENT" },
            select: { id: true, name: true, email: true },
        });

        if (!user) {
            throw new KakashiOsError("Member not found", 404);
        }

        const signal = await tx.obiwanVocalSignal.create({
            data: {
                userId: user.id,
                assignmentId: normalized.dbSignal.assignmentId,
                externalSessionId: normalized.dbSignal.externalSessionId,
                sourceRecordingId: normalized.dbSignal.sourceRecordingId,
                summary: normalized.dbSignal.summary,
                pitchStability: normalized.dbSignal.pitchStability,
                rhythmStability: normalized.dbSignal.rhythmStability,
                breathStability: normalized.dbSignal.breathStability,
                firstPhraseStability: normalized.dbSignal.firstPhraseStability,
                tensionLevel: normalized.dbSignal.tensionLevel,
                signalTagsJson: JSON.stringify(normalized.dbSignal.signalTags),
                rawPayloadJson: safeJsonStringify(normalized.dbSignal.rawPayload),
            },
        });

        if (!createRecommendation) {
            return {
                success: true,
                normalized,
                signal,
                recommendation: null,
                generatedRecommendation: null,
                operatingPacket: {
                    sourceProject: "OBIWAN",
                    targetProject: "GOJO",
                    operatingProject: "KAKASHI",
                    createdRecommendation: false,
                    nextAction: "Obiwan 신호만 저장했습니다. Gojo 추천은 생성하지 않았습니다.",
                    automationMode: null,
                    coachReviewRequired: normalized.operatingSignal.coachReviewRequired,
                },
            };
        }

        const [member, routineTemplates] = await Promise.all([
            tx.user.findUnique({
                where: { id: user.id },
                include: {
                    memberProfile: true,
                    enrollments: {
                        orderBy: { createdAt: "desc" },
                        take: 4,
                    },
                    dailyRoutines: {
                        orderBy: { createdAt: "desc" },
                        take: 12,
                    },
                    checkIns: {
                        orderBy: { createdAt: "desc" },
                        take: 14,
                    },
                    weeklyReports: {
                        orderBy: { weekStart: "desc" },
                        take: 4,
                    },
                    assignments: {
                        orderBy: { createdAt: "desc" },
                        take: 10,
                    },
                    obiwanSignals: {
                        orderBy: { createdAt: "desc" },
                        take: 5,
                    },
                },
            }),
            tx.routineTemplate.findMany({
                where: { isActive: true },
                orderBy: { updatedAt: "desc" },
                take: 80,
            }),
        ]);

        if (!member) {
            throw new KakashiOsError("Member not found after signal insert", 404);
        }

        const generatedRecommendation = generateGojoRecommendation({
            member,
            routineTemplates,
        });
        const activeEnrollment = member.enrollments.find((enrollment) =>
            enrollment.status === "ACTIVE" || enrollment.status === "PENDING_PAYMENT"
        ) || member.enrollments[0] || null;
        const automationMode = resolveAutomationMode(
            generatedRecommendation.automationMode,
            normalized.operatingSignal.riskLevel,
            normalized.operatingSignal.coachReviewRequired
        );

        const recommendation = await tx.gojoRoutineRecommendation.create({
            data: {
                userId: member.id,
                enrollmentId: activeEnrollment?.id,
                routineTemplateId: generatedRecommendation.routineTemplateId,
                obiwanSignalId: signal.id,
                automationMode,
                title: generatedRecommendation.title,
                focus: generatedRecommendation.focus,
                memberMemo: generatedRecommendation.memberMemo,
                expectedMinutes: generatedRecommendation.expectedMinutes,
                lifeAnchor: generatedRecommendation.lifeAnchor,
                rationale: generatedRecommendation.rationale,
                signalsJson: JSON.stringify({
                    ...generatedRecommendation.signals,
                    kakashiRiskLevel: normalized.operatingSignal.riskLevel,
                    coachReviewRequired: normalized.operatingSignal.coachReviewRequired,
                    gojoTriggerTags: normalized.operatingSignal.gojoTriggerTags,
                }),
                sourceSnapshotJson: JSON.stringify({
                    ...generatedRecommendation.sourceSnapshot,
                    obiwanOperatingSignal: normalized.operatingSignal,
                }),
            },
        });

        await tx.contactLog.create({
            data: {
                userId: member.id,
                channel: "NOTE",
                summary: `Obiwan 신호 수신: ${normalized.operatingSignal.diagnosisId || generatedRecommendation.signals.trigger}`,
                nextAction: buildNextAction(automationMode, normalized),
            },
        });

        return {
            success: true,
            normalized,
            signal,
            recommendation,
            generatedRecommendation,
            operatingPacket: {
                sourceProject: "OBIWAN",
                targetProject: "GOJO",
                operatingProject: "KAKASHI",
                createdRecommendation: true,
                nextAction: buildNextAction(automationMode, normalized),
                automationMode,
                coachReviewRequired: automationMode !== "AUTO_PUBLISH",
            },
        };
    });
}

export class KakashiOsError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = "KakashiOsError";
        this.status = status;
    }
}

function resolveAutomationMode(
    generatedMode: RoutineAutomationMode,
    riskLevel: "LOW" | "MEDIUM" | "HIGH",
    coachReviewRequired: boolean
): RoutineAutomationMode {
    if (riskLevel === "HIGH") {
        return "COACH_REQUIRED";
    }
    if (coachReviewRequired && generatedMode === "AUTO_PUBLISH") {
        return "COACH_APPROVAL";
    }
    return generatedMode;
}

function buildNextAction(automationMode: RoutineAutomationMode, normalized: NormalizedObiwanSignal) {
    if (automationMode === "AUTO_PUBLISH") {
        return "저위험 루틴입니다. 코치가 원하면 바로 발행할 수 있습니다.";
    }
    if (automationMode === "COACH_REQUIRED") {
        return `코치 확인 필요: ${normalized.operatingSignal.oneCause || "기술 신호가 강합니다."}`;
    }
    return "Gojo 추천이 대기열에 생성되었습니다. 코치 승인 후 루틴으로 발행하세요.";
}

function safeJsonStringify(value: unknown, maxLength = 24000) {
    try {
        const text = JSON.stringify(value ?? {});
        return text.length > maxLength
            ? JSON.stringify({ truncated: true, prefix: text.slice(0, maxLength) })
            : text;
    } catch {
        return JSON.stringify({ error: "payload_not_serializable" });
    }
}
