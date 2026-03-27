import { notFound } from "next/navigation";
import MissionAccessClient from "@/components/MissionAccessClient";
import { verifyAssignmentAccessToken } from "@/lib/assignment-access";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function InvalidMissionLinkState({ title, description }: { title: string; description: string }) {
    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #111217 0%, #1d1d1f 100%)", color: "#fff", display: "grid", placeItems: "center", padding: "1.5rem" }}>
            <div style={{ maxWidth: "520px", background: "rgba(255,255,255,0.06)", borderRadius: "28px", padding: "2rem", border: "1px solid rgba(255,255,255,0.08)", textAlign: "center" }}>
                <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "#FFB340", marginBottom: "10px", letterSpacing: "0.08em" }}>MISSION LINK</div>
                <h1 style={{ fontSize: "1.8rem", fontWeight: 900, letterSpacing: "-0.04em", marginBottom: "0.75rem" }}>{title}</h1>
                <p style={{ color: "rgba(255,255,255,0.72)", lineHeight: 1.7 }}>{description}</p>
            </div>
        </div>
    );
}

export default async function MissionAccessPage({
    params,
}: {
    params: Promise<{ token: string }>;
}) {
    const { token } = await params;
    const decodedToken = decodeURIComponent(token);
    const payload = verifyAssignmentAccessToken(decodedToken);

    if (!payload) {
        return (
            <InvalidMissionLinkState
                title="링크가 만료되었거나 유효하지 않습니다."
                description="새로운 오늘의 미션 링크를 다시 받아서 접속해 주세요."
            />
        );
    }

    const assignment = await prisma.assignment.findUnique({
        where: { id: payload.assignmentId },
        include: {
            user: {
                include: {
                    track: true,
                },
            },
            feedbacks: {
                orderBy: { createdAt: "desc" },
                take: 1,
            },
        },
    });

    if (!assignment) {
        notFound();
    }

    if (assignment.userId !== payload.userId) {
        return (
            <InvalidMissionLinkState
                title="이 링크는 다른 수강생의 미션입니다."
                description="전달받은 링크가 맞는지 확인해 주세요. 필요하면 새 링크를 다시 받아주세요."
            />
        );
    }

    return (
        <MissionAccessClient
            accessToken={decodedToken}
            studentName={assignment.user.name || "수강생"}
            trackName={assignment.user.track?.name}
            assignment={{
                id: assignment.id,
                title: assignment.title,
                description: assignment.description,
                isCompleted: assignment.isCompleted,
                audioFileUrl: assignment.audioFileUrl,
                guidePresetKey: assignment.guidePresetKey,
                guidePatternJson: assignment.guidePatternJson,
                availableFrom: assignment.availableFrom,
                availableUntil: assignment.availableUntil,
                feedbacks: assignment.feedbacks.map((feedback) => ({
                    id: feedback.id,
                    comment: feedback.comment,
                })),
            }}
        />
    );
}
