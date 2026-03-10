import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    // Verify Coach Role
    if (!session || !session.user || session.user.role !== 'COACH') {
        return NextResponse.json({ error: "Unauthorized. Coach access required." }, { status: 403 });
    }

    try {
        const { assignmentId, comment } = await request.json();

        if (!assignmentId || !comment) {
            return NextResponse.json({ error: "Missing required fields: assignmentId or comment" }, { status: 400 });
        }

        // Create the feedback record
        const feedback = await prisma.feedback.create({
            data: {
                comment,
                assignmentId,
                coachId: session.user.id
            }
        });

        // Mark assignment as completed
        await prisma.assignment.update({
            where: { id: assignmentId },
            data: { isCompleted: true }
        });

        return NextResponse.json({ feedback, success: true });
    } catch (error) {
        console.error("Feedback Submission Error:", error);
        return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
    }
}
