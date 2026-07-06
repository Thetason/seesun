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
        const [students, consultations, analyticsEvents, routineTemplates] = await Promise.all([
            prisma.user.findMany({
                where: { role: "STUDENT" },
                include: {
                    _count: {
                        select: { lessonAttendances: true },
                    },
                    track: true,
                    memberProfile: true,
                    enrollments: {
                        include: {
                            _count: {
                                select: { lessonAttendances: true },
                            },
                            track: true,
                            paymentRecords: {
                                orderBy: { createdAt: "desc" },
                            },
                            lessonAttendances: {
                                orderBy: { checkedInAt: "desc" },
                                take: 24,
                            },
                        },
                        orderBy: { createdAt: "desc" },
                    },
                    lessonAttendances: {
                        orderBy: { checkedInAt: "desc" },
                        take: 14,
                    },
                    dailyRoutines: {
                        include: {
                            assignment: {
                                include: { feedbacks: true },
                            },
                            checkIns: true,
                            deliveryLogs: true,
                        },
                        orderBy: { createdAt: "desc" },
                    },
                    checkIns: {
                        orderBy: { createdAt: "desc" },
                        take: 14,
                    },
                    contactLogs: {
                        orderBy: { createdAt: "desc" },
                        take: 8,
                    },
                    memberInvites: {
                        orderBy: { createdAt: "desc" },
                        take: 5,
                    },
                    weeklyReports: {
                        orderBy: { weekStart: "desc" },
                        take: 6,
                    },
                    gojoRecommendations: {
                        orderBy: { createdAt: "desc" },
                        take: 5,
                    },
                    obiwanSignals: {
                        orderBy: { createdAt: "desc" },
                        take: 3,
                    },
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
            prisma.routineTemplate.findMany({
                where: { isActive: true },
                orderBy: { createdAt: "desc" },
                take: 30,
            }),
        ]);

        return (
            <CoachDashboardClient
                students={students}
                consultations={consultations}
                analyticsSummary={buildSiteAnalyticsSummary(analyticsEvents)}
                routineTemplates={routineTemplates}
            />
        );
    }

    const studentData = await prisma.user.findUnique({
        where: { id },
        include: {
            _count: {
                select: { lessonAttendances: true },
            },
            track: true,
            memberProfile: true,
            enrollments: {
                include: {
                    _count: {
                        select: { lessonAttendances: true },
                    },
                    track: true,
                    lessonAttendances: {
                        orderBy: { checkedInAt: "desc" },
                        take: 24,
                    },
                },
                orderBy: { createdAt: "desc" },
            },
            lessonAttendances: {
                orderBy: { checkedInAt: "desc" },
                take: 12,
            },
            dailyRoutines: {
                include: {
                    assignment: {
                        include: { feedbacks: true },
                    },
                    checkIns: true,
                },
                orderBy: { createdAt: "desc" },
            },
            checkIns: {
                orderBy: { createdAt: "desc" },
                take: 14,
            },
            weeklyReports: {
                orderBy: { weekStart: "desc" },
                take: 6,
            },
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
