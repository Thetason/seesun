import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { verifyAssignmentAccessToken } from "@/lib/assignment-access";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createAudioStreamResponse, fetchStoredAudioResponse } from "@/lib/blob-audio";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ assignmentId: string }> }
) {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const accessToken = searchParams.get("accessToken");
    const tokenPayload = verifyAssignmentAccessToken(accessToken);

    if (!session?.user && !tokenPayload) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { assignmentId } = await params;
        const sessionEmail = session?.user.email?.trim().toLowerCase();
        const sessionRole = session?.user.role;
        let currentUserId: string | undefined = session?.user.id || tokenPayload?.userId;

        if (tokenPayload && tokenPayload.assignmentId !== assignmentId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        if (!currentUserId && sessionEmail) {
            const currentUser = await prisma.user.findUnique({
                where: { email: sessionEmail },
                select: { id: true },
            });

            currentUserId = currentUser?.id;
        }

        const assignment = await prisma.assignment.findUnique({
            where: { id: assignmentId },
            select: {
                audioFileUrl: true,
                userId: true,
                user: {
                    select: { email: true },
                },
            },
        });

        if (!assignment?.audioFileUrl) {
            return NextResponse.json({ error: "Audio not found" }, { status: 404 });
        }

        const assignmentOwnerEmail = assignment.user.email?.trim().toLowerCase();
        const canAccess =
            sessionRole === "COACH" ||
            (Boolean(currentUserId) && assignment.userId === currentUserId) ||
            (Boolean(sessionEmail) && assignmentOwnerEmail === sessionEmail) ||
            (tokenPayload ? assignment.userId === tokenPayload.userId && assignmentId === tokenPayload.assignmentId : false);

        if (!canAccess) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const blob = await fetchStoredAudioResponse(
            assignment.audioFileUrl,
            request.headers.get("range")
        );

        if (!blob) {
            return NextResponse.json({ error: "Audio not found" }, { status: 404 });
        }

        return await createAudioStreamResponse(blob);
    } catch (error) {
        console.error("Assignment audio proxy error:", error);
        return NextResponse.json({ error: "Unable to load audio" }, { status: 500 });
    }
}
