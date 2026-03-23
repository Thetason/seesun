import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StudentDashboardClient from "./StudentDashboardClient";
import CoachDashboardClient from "./CoachDashboardClient";
import { redirect } from "next/navigation";
import "../../styles/styles.css";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    const { role, id } = session.user as { role: string; id: string };

    if (role === "COACH") {
        const [students, consultations] = await Promise.all([
            prisma.user.findMany({
                where: { role: "STUDENT" },
                include: {
                    track: true,
                    assignments: {
                        include: { feedbacks: true },
                        orderBy: { createdAt: "desc" }
                    }
                },
                orderBy: { name: "asc" }
            }),
            prisma.consultation.findMany({
                orderBy: { createdAt: "desc" }
            })
        ]);

        return <CoachDashboardClient students={students} consultations={consultations} />;
    }

    const studentData = await prisma.user.findUnique({
        where: { id },
        include: {
            track: true,
            assignments: {
                include: { feedbacks: true },
                orderBy: { createdAt: "desc" }
            }
        }
    });

    if (!studentData) {
        redirect("/login");
    }

    return <StudentDashboardClient studentData={studentData} />;
}
