import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const assignmentId = formData.get('assignmentId') as string;

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
                select: { id: true, userId: true },
            });

            if (!assignment || assignment.userId !== session.user.id) {
                return NextResponse.json({ error: "Not authorized to update this assignment" }, { status: 403 });
            }
        }

        // Include the user email and timestamp in the filename to avoid collisions
        const fileName = `${session.user.email?.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}_${file.name}`;

        // Upload to Vercel Blob
        const blob = await put(fileName, file, {
            access: 'public',
        });

        // Update the assignment record if assignmentId is passed
        if (assignmentId) {
            await prisma.assignment.update({
                where: { id: assignmentId },
                data: {
                    audioFileUrl: blob.url,
                    isCompleted: true // Mark as completed when uploaded
                },
            });
        }

        return NextResponse.json({ url: blob.url, success: true });
    } catch (error) {
        console.error("Blob Upload Error:", error);
        return NextResponse.json({ error: "Upload Failed" }, { status: 500 });
    }
}
