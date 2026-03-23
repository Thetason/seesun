import { NextResponse } from "next/server";
import { ConsultationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import nodemailer from "nodemailer";

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

    const name = sanitizeRequiredString(body.name);
    const email = sanitizeOptionalString(body.email)?.toLowerCase();
    const phone = sanitizeRequiredString(body.phone);
    const type = sanitizeRequiredString(body.type);
    const notes = sanitizeOptionalString(body.notes);
    const bottleneck = sanitizeOptionalString(body.bottleneck);
    const motivation = sanitizeOptionalString(body.motivation);
    const timeline = sanitizeOptionalString(body.timeline);
    const level = sanitizeOptionalString(body.level);
    const timeInvestment = sanitizeOptionalString(body.timeInvestment);
    const reference = sanitizeOptionalString(body.reference);
    const preferredTime = sanitizeOptionalString(body.preferredTime);

    if (!name || !phone || !type) {
      return NextResponse.json(
        { error: "Name, phone, and type are required" },
        { status: 400 }
      );
    }

    const consultation = await prisma.consultation.create({
      data: {
        name,
        email,
        phone,
        type,
        notes,
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
      if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || "587"),
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const mailOptions = {
          from: `"SEE:SUN LMS" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
          to: "info@seesun.kr",
          subject: `[신규 상담 신청] ${name}님의 ${type} 신청건`,
          text: `
신규 상담 신청이 접수되었습니다.

- 신청 분류: ${type}
- 이름: ${name}
- 연락처: ${phone}
- 이메일: ${email || "미기재"}
- 주요 고민: ${bottleneck || notes || "없음"}
- 희망 시간: ${preferredTime || "미기재"}

대시보드에서 상세 내용을 확인하세요.
          `,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #FF9F0A;">새로운 상담 신청이 있습니다.</h2>
              <p>대시보드에서 상세 내용을 확인하고 연락을 취해주세요.</p>
              <hr style="border: 1px solid #eee; margin: 20px 0;" />
              <p><strong>신청 분류:</strong> ${type}</p>
              <p><strong>이름:</strong> ${name}</p>
              <p><strong>연락처:</strong> ${phone}</p>
              <p><strong>이메일:</strong> ${email || "미기재"}</p>
              <p><strong>주요 고민:</strong> ${bottleneck || notes || "없음"}</p>
              <p><strong>희망 시간:</strong> ${preferredTime || "미기재"}</p>
              <br />
              <a href="${process.env.NEXTAUTH_URL}/dashboard" style="display: inline-block; padding: 12px 24px; background: #FF9F0A; color: #000; text-decoration: none; border-radius: 8px; font-weight: bold;">대시보드로 이동</a>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
      }
    } catch (mailError) {
      console.error("[API/Consultations] Error sending notification email:", mailError);
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
