import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAudioStreamResponse, fetchStoredAudioResponse } from "@/lib/blob-audio";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ feedbackId: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { feedbackId } = await params;
        const sessionEmail = session.user.email?.trim().toLowerCase();
        const sessionRole = session.user.role;
        let currentUserId: string | undefined = session.user.id;

        if (!currentUserId && sessionEmail) {
            const currentUser = await prisma.user.findUnique({
                where: { email: sessionEmail },
                select: { id: true },
            });

            currentUserId = currentUser?.id;
        }

        const feedback = await prisma.feedback.findUnique({
            where: { id: feedbackId },
            select: {
                audioFileUrl: true,
                assignment: {
                    select: {
                        userId: true,
                        user: {
                            select: { email: true },
                        },
                    },
                },
            },
        });

        if (!feedback?.audioFileUrl) {
            return NextResponse.json({ error: "Audio not found" }, { status: 404 });
        }

        const assignmentOwnerEmail = feedback.assignment.user.email?.trim().toLowerCase();
        const canAccess =
            sessionRole === "COACH" ||
            (Boolean(currentUserId) && feedback.assignment.userId === currentUserId) ||
            (Boolean(sessionEmail) && assignmentOwnerEmail === sessionEmail);

        if (!canAccess) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const blob = await fetchStoredAudioResponse(
            feedback.audioFileUrl,
            request.headers.get("range")
        );

        if (!blob) {
            return NextResponse.json({ error: "Audio not found" }, { status: 404 });
        }

        return await createAudioStreamResponse(blob);
    } catch (error) {
        console.error("Feedback audio proxy error:", error);
        return NextResponse.json({ error: "Unable to load audio" }, { status: 500 });
    }
}
