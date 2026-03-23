import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAssignmentAvailabilityState } from "@/lib/assignment-window";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const assignmentIdRaw = formData.get('assignmentId');
        const assignmentId = typeof assignmentIdRaw === "string" && assignmentIdRaw !== "quick" && assignmentIdRaw.trim() !== ""
            ? assignmentIdRaw
            : undefined;
        const sessionEmail = session.user.email?.trim().toLowerCase();
        let currentUserId: string | undefined = session.user.id;

        if (!currentUserId && sessionEmail) {
            const currentUser = await prisma.user.findUnique({
                where: { email: sessionEmail },
                select: { id: true },
            });

            currentUserId = currentUser?.id;
        }

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        if (!file.type.startsWith('audio/')) {
            return NextResponse.json({ error: "Audio files only" }, { status: 400 });
        }

        if (file.size > 50 * 1024 * 1024) {
            return NextResponse.json({ error: "File is too large" }, { status: 400 });
        }

        if (assignmentId) {
            const assignment = await prisma.assignment.findUnique({
                where: { id: assignmentId },
                select: {
                    id: true,
                    userId: true,
                    availableFrom: true,
                    availableUntil: true,
                    user: {
                        select: { email: true },
                    },
                },
            });

            const assignmentOwnerEmail = assignment?.user.email?.trim().toLowerCase();
            const isAssignmentOwnerById = Boolean(currentUserId) && assignment?.userId === currentUserId;
            const isAssignmentOwnerByEmail = Boolean(sessionEmail) && assignmentOwnerEmail === sessionEmail;

            if (!assignment || (!isAssignmentOwnerById && !isAssignmentOwnerByEmail)) {
                return NextResponse.json({ error: "Not authorized to update this assignment" }, { status: 403 });
            }

            const availability = getAssignmentAvailabilityState(assignment);

            if (availability.isUpcoming) {
                return NextResponse.json(
                    { error: "This assignment is not open yet." },
                    { status: 409 }
                );
            }

            if (availability.isExpired) {
                return NextResponse.json(
                    { error: "This assignment window has already closed." },
                    { status: 410 }
                );
            }
        }

        // Include the user email and timestamp in the filename to avoid collisions
        const fileName = `${session.user.email?.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}_${file.name}`;

        // Upload to Vercel Blob
        const blob = await put(fileName, file, {
            access: 'private',
            contentType: file.type,
        });

        let savedAssignmentId: string | null = null;

        if (assignmentId) {
            const updatedAssignment = await prisma.assignment.update({
                where: { id: assignmentId },
                data: {
                    audioFileUrl: blob.url,
                    isCompleted: true // Mark as completed when uploaded
                },
            });

            savedAssignmentId = updatedAssignment.id;
        } else {
            if (!currentUserId) {
                return NextResponse.json({ error: "Unable to resolve current user for upload" }, { status: 401 });
            }

            const uploadedAtLabel = new Intl.DateTimeFormat("ko-KR", {
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
                timeZone: "Asia/Seoul",
            }).format(new Date());

            const createdAssignment = await prisma.assignment.create({
                data: {
                    title: `[Free Practice] ${uploadedAtLabel}`,
                    description: "자유로운 추가 연습 업로드",
                    isCompleted: true,
                    audioFileUrl: blob.url,
                    userId: currentUserId,
                },
            });

            savedAssignmentId = createdAssignment.id;
        }

        return NextResponse.json({
            url: blob.url,
            success: true,
            assignmentId: savedAssignmentId,
            mode: assignmentId ? "mission" : "free-practice",
        });
    } catch (error) {
        console.error("Blob Upload Error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Upload Failed" },
            { status: 500 }
        );
    }
}
