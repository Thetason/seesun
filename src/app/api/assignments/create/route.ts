import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== 'COACH') {
        return NextResponse.json({ error: "Unauthorized. Coach access required." }, { status: 403 });
    }

    try {
        const { userId, title, description, weekNumber } = await request.json();

        if (!userId || !title) {
            return NextResponse.json({ error: "Missing required fields: userId or title" }, { status: 400 });
        }

        const assignment = await prisma.assignment.create({
            data: {
                title,
                description,
                weekNumber: weekNumber ? parseInt(weekNumber) : null,
                userId
            }
        });

        return NextResponse.json({ assignment, success: true });
    } catch (error) {
        console.error("Assignment Creation Error:", error);
        return NextResponse.json({ error: "Failed to create assignment" }, { status: 500 });
    }
}
