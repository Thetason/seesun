import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StudentDashboardClient from "./StudentDashboardClient";
import "../../styles/styles.css";

export default async function StudentDashboard() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return null; // Will redirect in layout
    }

    // Fetch live user data including nested relationships
    const studentData = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            track: true,
            assignments: {
                include: {
                    feedbacks: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    });

    if (!studentData) {
        return <div style={{ padding: "2rem" }}>유저 정보를 찾을 수 없습니다.</div>;
    }

    return <StudentDashboardClient studentData={studentData} />;
}

