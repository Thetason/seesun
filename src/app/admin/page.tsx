import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminDashboardClient from "./AdminDashboardClient";
import "../../styles/styles.css";

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "COACH") {
        return null; // Safety net, handled by layout
    }

    // Fetch all students
    const students = await prisma.user.findMany({
        where: { role: "STUDENT" },
        include: {
            track: true,
            assignments: true,
        },
        orderBy: { id: "desc" }
    });

    // Fetch all active assignments globally for coaching
    const assignments = await prisma.assignment.findMany({
        include: {
            user: true,
            feedbacks: true
        },
        orderBy: { createdAt: "desc" }
    });

    return <AdminDashboardClient students={students} assignments={assignments} />;
}

