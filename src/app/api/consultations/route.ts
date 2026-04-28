import { NextResponse } from "next/server";
import { ConsultationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  MAY_02_SEMINAR_DATE_LABEL,
  MAY_02_SEMINAR_TITLE,
  MAY_02_SEMINAR_TYPE,
  getMay02SeminarPricing,
} from "@/lib/seminar-may-02";
import { sendConsultationAlert } from "@/lib/consultation-alerts";

type ConsultationRequestBody = {
  name?: string;
  email?: string;
  phone?: string;
  type?: string;
  notes?: string;
  bottleneck?: string;
  motivation?: string;
  timeline?: string;
  level?: string;
  timeInvestment?: string;
  reference?: string;
  preferredTime?: string;
};

type ConsultationPatchBody = {
  id?: string;
  status?: string;
};

const consultationStatuses = new Set<ConsultationStatus>([
  "PENDING",
  "CONTACTED",
  "COMPLETED",
  "CANCELLED",
]);

function sanitizeOptionalString(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function sanitizeRequiredString(value: unknown) {
  return sanitizeOptionalString(value) ?? null;
}

async function requireCoachSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "COACH") {
    return null;
  }

  return session;
}

export async function POST(request: Request) {
  try {
    let body: ConsultationRequestBody;
    try {
      body = (await request.json()) as ConsultationRequestBody;
    } catch (e) {
      console.error("[API/Consultations] Failed to parse JSON body:", e);
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const name = sanitizeOptionalString(body.name);
    const email = sanitizeOptionalString(body.email)?.toLowerCase();
    const phone = sanitizeOptionalString(body.phone);
    const type = sanitizeRequiredString(body.type);
    const notes = sanitizeOptionalString(body.notes);
    const bottleneck = sanitizeOptionalString(body.bottleneck);
    const motivation = sanitizeOptionalString(body.motivation);
    const timeline = sanitizeOptionalString(body.timeline);
    const level = sanitizeOptionalString(body.level);
    const timeInvestment = sanitizeOptionalString(body.timeInvestment);
    const reference = sanitizeOptionalString(body.reference);
    const preferredTime = sanitizeOptionalString(body.preferredTime);

    if (!type || (!email && !phone)) {
      return NextResponse.json(
        { error: "Type and either email or phone are required" },
        { status: 400 }
      );
    }

    const safeName = name || email || "카카오 리드";
    const safePhone = phone || "카카오톡 연결";
    let finalNotes = notes;

    if (type === MAY_02_SEMINAR_TYPE) {
      const seminarApplicationCount = await prisma.consultation.count({
        where: {
          type: MAY_02_SEMINAR_TYPE,
        },
      });
      const seminarPricing = getMay02SeminarPricing(seminarApplicationCount);

      finalNotes = [
        notes,
        `[세미나 자동기록]`,
        `세미나명: ${MAY_02_SEMINAR_TITLE}`,
        `진행 일시: ${MAY_02_SEMINAR_DATE_LABEL}`,
        `신청 시점 가격: ${seminarPricing.priceLabel}`,
        seminarPricing.isEarlyBird
          ? `선착순 특별가 적용`
          : `일반 참가비 적용`,
      ]
        .filter(Boolean)
        .join("\n");
    }

    const consultation = await prisma.consultation.create({
      data: {
        name: safeName,
        email,
        phone: safePhone,
        type,
        notes: finalNotes,
        bottleneck,
        motivation,
        timeline,
        level,
        timeInvestment,
        reference,
        preferredTime,
      },
    });

    try {
      const alertResult = await sendConsultationAlert(consultation, "new");

      await prisma.consultation.update({
        where: { id: consultation.id },
        data: {
          alertAttemptCount: { increment: 1 },
          lastAlertAttemptedAt: alertResult.attemptedAt,
          lastAlertSentAt: alertResult.deliveredAt,
          initialAlertSentAt: alertResult.deliveredAt,
          lastAlertStatus: alertResult.status,
          lastAlertChannels: alertResult.channels.length > 0 ? alertResult.channels.join(", ") : null,
          lastAlertError: alertResult.errors.length > 0 ? alertResult.errors.join("\n") : null,
        },
      });
    } catch (alertError) {
      console.error("[API/Consultations] Error sending consultation alert:", alertError);

      await prisma.consultation.update({
        where: { id: consultation.id },
        data: {
          alertAttemptCount: { increment: 1 },
          lastAlertAttemptedAt: new Date(),
          lastAlertStatus: "FAILED",
          lastAlertError:
            alertError instanceof Error ? alertError.message : "Unknown consultation alert error",
        },
      });
    }

    return NextResponse.json(consultation, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const stack = error instanceof Error ? error.stack : undefined;

    console.error("[API/Consultations] ERROR creating consultation:", {
        message,
        stack,
        errorRaw: error
    });
    
    return NextResponse.json(
      { 
        error: "Internal Server Error",
        details: process.env.NODE_ENV === 'development' ? message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await requireCoachSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const consultations = await prisma.consultation.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(consultations);
  } catch (error) {
    console.error("Failed to fetch consultations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const session = await requireCoachSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as ConsultationPatchBody;
    const id = sanitizeRequiredString(body.id);
    const status = typeof body.status === "string" ? body.status.trim().toUpperCase() : "";

    if (!id || !status) {
      return NextResponse.json(
        { error: "ID and status are required" },
        { status: 400 }
      );
    }

    if (!consultationStatuses.has(status as ConsultationStatus)) {
      return NextResponse.json(
        { error: "Invalid consultation status" },
        { status: 400 }
      );
    }

    const updated = await prisma.consultation.update({
      where: { id },
      data: { status: status as ConsultationStatus },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update consultation:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
