import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
    buildAssignmentAccessPath,
    createAssignmentAccessToken,
    getAssignmentAccessTokenExpiry,
} from "@/lib/assignment-access";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "COACH") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams, origin } = new URL(request.url);
    const assignmentId = searchParams.get("assignmentId")?.trim();

    if (!assignmentId) {
        return NextResponse.json({ error: "assignmentId is required" }, { status: 400 });
    }

    const assignment = await prisma.assignment.findUnique({
        where: { id: assignmentId },
        select: {
            id: true,
            userId: true,
            title: true,
            createdAt: true,
            availableUntil: true,
            user: {
                select: {
                    name: true,
                },
            },
        },
    });

    if (!assignment) {
        return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    const expiresAt = getAssignmentAccessTokenExpiry({
        availableUntil: assignment.availableUntil,
        createdAt: assignment.createdAt,
    });
    const token = createAssignmentAccessToken({
        assignmentId: assignment.id,
        userId: assignment.userId,
        expiresAt,
    });
    const url = `${origin}${buildAssignmentAccessPath(token)}`;

    return NextResponse.json({
        success: true,
        url,
        token,
        expiresAt,
        assignmentTitle: assignment.title,
        studentName: assignment.user.name || "수강생",
    });
}
