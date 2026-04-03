import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildSiteAnalyticsSummary } from "@/lib/site-analytics";
import StudentDashboardClient from "./StudentDashboardClient";
import CoachDashboardClient from "./CoachDashboardClient";
import { redirect } from "next/navigation";
import "../../styles/styles.css";

export const dynamic = "force-dynamic";

function getAnalyticsSinceDate(days: number) {
    return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    const { role, id } = session.user as { role: string; id: string };

    if (role === "COACH") {
        const analyticsSince = getAnalyticsSinceDate(7);
        const [students, consultations, analyticsEvents] = await Promise.all([
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
            }),
            prisma.analyticsEvent.findMany({
                where: {
                    createdAt: {
                        gte: analyticsSince,
                    },
                },
                select: {
                    eventType: true,
                    path: true,
                    visitorKey: true,
                    sessionKey: true,
                    durationMs: true,
                    label: true,
                    createdAt: true,
                },
            }),
        ]);

        return (
            <CoachDashboardClient
                students={students}
                consultations={consultations}
                analyticsSummary={buildSiteAnalyticsSummary(analyticsEvents)}
            />
        );
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
