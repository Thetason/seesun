import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  CONSULTATION_REMINDER_GRACE_MINUTES,
  CONSULTATION_REMINDER_INTERVAL_HOURS,
  sendConsultationAlert,
} from "@/lib/consultation-alerts";

function isAuthorizedCronRequest(request: Request) {
  if (process.env.NODE_ENV !== "production") {
    return true;
  }

  const url = new URL(request.url);
  const providedSecret =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    url.searchParams.get("secret");

  if (process.env.CRON_SECRET && providedSecret === process.env.CRON_SECRET) {
    return true;
  }

  const userAgent = request.headers.get("user-agent") || "";
  const vercelCronHeader = request.headers.get("x-vercel-cron");

  return userAgent.includes("vercel-cron") || vercelCronHeader === "1";
}

export async function GET(request: Request) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const reminderGraceCutoff = new Date(
    now.getTime() - CONSULTATION_REMINDER_GRACE_MINUTES * 60 * 1000
  );
  const reminderRetryCutoff = new Date(
    now.getTime() - CONSULTATION_REMINDER_INTERVAL_HOURS * 60 * 60 * 1000
  );

  try {
    const pendingConsultations = await prisma.consultation.findMany({
      where: {
        status: "PENDING",
        createdAt: {
          lte: reminderGraceCutoff,
        },
        OR: [
          { lastAlertAttemptedAt: null },
          { lastAlertAttemptedAt: { lte: reminderRetryCutoff } },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
      take: 25,
    });

    const results = [];

    for (const consultation of pendingConsultations) {
      try {
        const alertResult = await sendConsultationAlert(consultation, "reminder");

        await prisma.consultation.update({
          where: { id: consultation.id },
          data: {
            alertAttemptCount: { increment: 1 },
            lastAlertAttemptedAt: alertResult.attemptedAt,
            lastAlertSentAt: alertResult.deliveredAt ?? consultation.lastAlertSentAt,
            initialAlertSentAt: consultation.initialAlertSentAt ?? alertResult.deliveredAt,
            lastAlertStatus: alertResult.status,
            lastAlertChannels:
              alertResult.channels.length > 0
                ? alertResult.channels.join(", ")
                : consultation.lastAlertChannels,
            lastAlertError:
              alertResult.errors.length > 0 ? alertResult.errors.join("\n") : null,
          },
        });

        results.push({
          id: consultation.id,
          status: alertResult.status,
          channels: alertResult.channels,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown reminder error";

        await prisma.consultation.update({
          where: { id: consultation.id },
          data: {
            alertAttemptCount: { increment: 1 },
            lastAlertAttemptedAt: new Date(),
            lastAlertStatus: "FAILED",
            lastAlertError: message,
          },
        });

        results.push({
          id: consultation.id,
          status: "FAILED",
          channels: [],
          error: message,
        });
      }
    }

    return NextResponse.json({
      ok: true,
      scanned: pendingConsultations.length,
      results,
    });
  } catch (error) {
    console.error("[ConsultationReminderCron] Failed to send reminders:", error);
    return NextResponse.json(
      { error: "Failed to send consultation reminders" },
      { status: 500 }
    );
  }
}
