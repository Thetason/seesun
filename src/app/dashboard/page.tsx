import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StudentDashboardClient from "./StudentDashboardClient";
import CoachDashboardClient from "./CoachDashboardClient";
import "../../styles/styles.css";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return null;
    }

    const { role, id } = session.user as { role: string; id: string };

    if (role === "COACH") {
        // Fetch ALL students for the coach dashboard
        const students = await prisma.user.findMany({
            where: { role: "STUDENT" },
            include: {
                track: true,
                assignments: {
                    include: { feedbacks: true },
                    orderBy: { createdAt: 'desc' }
                }
            },
            orderBy: { name: 'asc' }
        });

        return <CoachDashboardClient students={students} />;
    }

    // Role is STUDENT - Fetch live user data including nested relationships
    const studentData = await prisma.user.findUnique({
        where: { id: id },
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

