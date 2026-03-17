import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StudentDashboardClient from "./StudentDashboardClient";
import CoachDashboardClient from "./CoachDashboardClient";
import "../../styles/styles.css";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            console.log("[Dashboard] No session or user found in session");
            return <div style={{ padding: "2rem", color: "#fff" }}>로그인이 필요합니다.</div>;
        }

        const { role, id } = session.user as { role: string; id: string };
        console.log("[Dashboard] Loading for role:", role, "ID:", id);

        if (role === "COACH") {
            const [students, consultations] = await Promise.all([
                prisma.user.findMany({
                    where: { role: "STUDENT" },
                    include: {
                        track: true,
                        assignments: {
                            include: { feedbacks: true },
                            orderBy: { createdAt: 'desc' }
                        }
                    },
                    orderBy: { name: 'asc' }
                }),
                prisma.consultation.findMany({
                    orderBy: { createdAt: 'desc' }
                })
            ]);

            console.log("[Dashboard] Coach data loaded. Students:", students.length, "Consultations:", consultations.length);
            return <CoachDashboardClient students={students} consultations={consultations} />;
        }

        const studentData = await prisma.user.findUnique({
            where: { id: id },
            include: {
                track: true,
                assignments: {
                    include: { feedbacks: true },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!studentData) {
            console.log("[Dashboard] Student data not found for ID:", id);
            return <div style={{ padding: "2rem", color: "#fff" }}>유저 정보를 찾을 수 없습니다.</div>;
        }

        return <StudentDashboardClient studentData={studentData} />;
    } catch (error: any) {
        console.error("[Dashboard] FATAL ERROR:", error);
        return (
            <div style={{ padding: "2rem", color: "#ff3b30", background: "#000", minHeight: "100vh" }}>
                <h1>Dashboard Error</h1>
                <p>{error.message}</p>
                <pre style={{ fontSize: "0.8rem", color: "#888", marginTop: "1rem" }}>{error.stack}</pre>
            </div>
        );
    }
}

