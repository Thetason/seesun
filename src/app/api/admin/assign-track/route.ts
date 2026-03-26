import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDefaultMissionPossibleWindow } from "@/lib/assignment-window";
import { isMissionPossibleTrackId } from "@/lib/mission-possible";
import { syncLiveMissionPossibleAssignmentsForUser } from "@/lib/mission-possible-sync";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "COACH") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { studentId, trackId } = await req.json();

        if (!studentId || !trackId) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: studentId },
            data: { trackId: trackId },
            include: { track: true }
        });

        // Automated Mission Possible routine generation for eligible tracks
        if (isMissionPossibleTrackId(trackId)) {
            const syncResult = await syncLiveMissionPossibleAssignmentsForUser(studentId);

            if (syncResult.totalTemplates === 0) {
                const { availableFrom, availableUntil } = getDefaultMissionPossibleWindow();
                const sparkGuideUrl = process.env.SPARK_GUIDE_URL?.trim();
                const sparkDescription = [
                    "반갑습니다! SEE:SUN에 오신 것을 환영합니다.",
                    "",
                    "오늘의 미션파서블 10분 루틴입니다.",
                    "스파크 코어 루틴을 기반으로 시그니처/하이엔드 수강생도 동일하게 누릴 수 있는 혜택입니다.",
                    "가이드에 맞춰 소리를 내고 업로드해 주세요.",
                    "코치가 24시간 이내에 보이스 피드백을 보내드립니다.",
                    "",
                    sparkGuideUrl
                        ? `가이드 영상: ${sparkGuideUrl}`
                        : "가이드 영상 링크는 코치가 별도로 전달드립니다.",
                ].join("\n");

                const existingDefaultAssignment = await prisma.assignment.findFirst({
                    where: {
                        userId: studentId,
                        title: "[Mission Possible] 데일리 루틴 01",
                        availableFrom,
                        availableUntil,
                    },
                });

                if (!existingDefaultAssignment) {
                    await prisma.assignment.create({
                        data: {
                            userId: studentId,
                            title: "[Mission Possible] 데일리 루틴 01",
                            description: sparkDescription,
                            availableFrom,
                            availableUntil,
                            weekNumber: 1
                        }
                    });
                }
            }
        }

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Assign track error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
