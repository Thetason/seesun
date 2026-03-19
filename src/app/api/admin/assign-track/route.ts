import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Assign track error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
