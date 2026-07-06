import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateGojoRecommendation } from "@/lib/gojo/recommendation-engine";

type RecommendationRequestBody = {
    userId?: string;
};

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

    const recommendations = await prisma.gojoRoutineRecommendation.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 10,
    });

    return NextResponse.json({ recommendations });
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "COACH") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: RecommendationRequestBody;

    try {
        body = (await request.json()) as RecommendationRequestBody;
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    if (!body.userId) {
        return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const [member, routineTemplates] = await Promise.all([
        prisma.user.findUnique({
            where: { id: body.userId },
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
                    take: 3,
                },
            },
        }),
        prisma.routineTemplate.findMany({
            where: { isActive: true },
            orderBy: { updatedAt: "desc" },
            take: 80,
        }),
    ]);

    if (!member || member.role !== "STUDENT") {
        return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const recommendation = generateGojoRecommendation({
        member,
        routineTemplates,
    });

    const activeEnrollment = member.enrollments.find((enrollment) =>
        enrollment.status === "ACTIVE" || enrollment.status === "PENDING_PAYMENT"
    ) || member.enrollments[0] || null;

    const createdRecommendation = await prisma.gojoRoutineRecommendation.create({
        data: {
            userId: member.id,
            enrollmentId: activeEnrollment?.id,
            routineTemplateId: recommendation.routineTemplateId,
            generatedByUserId: session.user.id,
            obiwanSignalId: recommendation.signals.obiwanSignalId,
            automationMode: recommendation.automationMode,
            title: recommendation.title,
            focus: recommendation.focus,
            memberMemo: recommendation.memberMemo,
            expectedMinutes: recommendation.expectedMinutes,
            lifeAnchor: recommendation.lifeAnchor,
            rationale: recommendation.rationale,
            signalsJson: JSON.stringify(recommendation.signals),
            sourceSnapshotJson: JSON.stringify(recommendation.sourceSnapshot),
        },
    });

    return NextResponse.json({
        success: true,
        recommendation: createdRecommendation,
        generated: recommendation,
    });
}
