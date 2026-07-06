import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type DecisionBody = {
    decision?: "accept" | "dismiss";
    note?: string;
};

export async function POST(
    request: Request,
    { params }: { params: Promise<{ recommendationId: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "COACH") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { recommendationId } = await params;

    if (!recommendationId) {
        return NextResponse.json({ error: "recommendationId is required" }, { status: 400 });
    }

    let body: DecisionBody;

    try {
        body = (await request.json()) as DecisionBody;
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    if (body.decision !== "accept" && body.decision !== "dismiss") {
        return NextResponse.json({ error: "decision must be accept or dismiss" }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
        const recommendation = await tx.gojoRoutineRecommendation.findUnique({
            where: { id: recommendationId },
        });

        if (!recommendation) {
            return null;
        }

        const status = body.decision === "accept" ? "ACCEPTED" : "DISMISSED";
        const updated = await tx.gojoRoutineRecommendation.update({
            where: { id: recommendation.id },
            data: {
                status,
                generatedByUserId: session.user.id,
            },
        });

        await tx.contactLog.create({
            data: {
                userId: recommendation.userId,
                coachId: session.user.id,
                channel: "NOTE",
                summary: `Gojo 추천 ${body.decision === "accept" ? "승인" : "기각"}: ${recommendation.title}`,
                nextAction: body.note || (body.decision === "accept"
                    ? "필요하면 발행 API로 루틴을 생성하세요."
                    : "다음 추천 생성 시 이 판단을 참고하세요."),
            },
        });

        return updated;
    });

    if (!result) {
        return NextResponse.json({ error: "Recommendation not found" }, { status: 404 });
    }

    return NextResponse.json({
        success: true,
        recommendation: result,
        operatingPacket: {
            schemaVersion: "seesun_gojo_recommendation_decision_v1",
            decision: body.decision,
            nextAction: body.decision === "accept"
                ? "추천이 ACCEPTED 상태가 되었습니다. 기존 publish API로 루틴 발행을 이어갈 수 있습니다."
                : "추천이 DISMISSED 상태가 되었습니다. 회원 OS 로그에 결정이 남았습니다.",
        },
    });
}
