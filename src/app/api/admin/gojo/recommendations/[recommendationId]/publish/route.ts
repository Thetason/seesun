import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { publishGojoRecommendation } from "@/lib/gojo/publish-recommendation";

export async function POST(
    _request: Request,
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

    try {
        const result = await publishGojoRecommendation({
            recommendationId,
            coachId: session.user.id,
        });

        return NextResponse.json({
            success: true,
            ...result,
        });
    } catch (error) {
        console.error("Publish Gojo recommendation error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 500 }
        );
    }
}
