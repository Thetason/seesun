import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "COACH") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const member = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            memberProfile: true,
            enrollments: {
                orderBy: { createdAt: "desc" },
                take: 4,
            },
            dailyRoutines: {
                orderBy: { createdAt: "desc" },
                take: 10,
            },
            checkIns: {
                orderBy: { createdAt: "desc" },
                take: 10,
            },
            weeklyReports: {
                orderBy: { weekStart: "desc" },
                take: 4,
            },
            obiwanSignals: {
                orderBy: { createdAt: "desc" },
                take: 8,
            },
            gojoRecommendations: {
                orderBy: { createdAt: "desc" },
                take: 8,
            },
            contactLogs: {
                orderBy: { createdAt: "desc" },
                take: 8,
            },
        },
    });

    if (!member || member.role !== "STUDENT") {
        return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const latestRecommendation = member.gojoRecommendations[0] || null;
    const openRecommendations = member.gojoRecommendations.filter((recommendation) =>
        recommendation.status === "SUGGESTED" || recommendation.status === "ACCEPTED"
    );
    const activeRoutine = member.dailyRoutines.find((routine) => routine.status === "ACTIVE" || routine.status === "SCHEDULED") || null;
    const latestSignal = member.obiwanSignals[0] || null;

    return NextResponse.json({
        success: true,
        osPacket: {
            schemaVersion: "seesun_internal_os_member_state_v1",
            projects: {
                operatingProject: "KAKASHI",
                recommendationProject: "GOJO",
                vocalSignalProject: "OBIWAN",
            },
            member,
            queue: {
                activeRoutineId: activeRoutine?.id || null,
                latestObiwanSignalId: latestSignal?.id || null,
                latestGojoRecommendationId: latestRecommendation?.id || null,
                openRecommendationCount: openRecommendations.length,
                nextAction: resolveNextAction({ activeRoutine, latestSignal, openRecommendations }),
            },
        },
    });
}

function resolveNextAction({
    activeRoutine,
    latestSignal,
    openRecommendations,
}: {
    activeRoutine: { id: string } | null;
    latestSignal: { id: string } | null;
    openRecommendations: Array<{ id: string; automationMode: string }>;
}) {
    const coachRequired = openRecommendations.find((recommendation) => recommendation.automationMode === "COACH_REQUIRED");
    if (coachRequired) {
        return "코치 확인이 필요한 Gojo 추천을 검토하세요.";
    }
    if (openRecommendations.length > 0) {
        return "Gojo 추천을 승인하거나 루틴으로 발행하세요.";
    }
    if (latestSignal && !activeRoutine) {
        return "Obiwan 신호는 있으나 오늘 루틴이 없습니다. 추천 생성을 확인하세요.";
    }
    if (!activeRoutine) {
        return "오늘 루틴을 발행하세요.";
    }
    return "활성 루틴이 있습니다. 체크인과 녹음 제출을 기다리세요.";
}
