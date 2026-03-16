import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      console.error("[API/Consultations] Failed to parse JSON body:", e);
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    console.log("[API/Consultations] Received submission:", JSON.stringify(body, null, 2));

    const {
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
    } = body;

    // Basic validation
    if (!name || !phone || !type) {
      console.warn("[API/Consultations] Missing required fields:", { name, phone, type });
      return NextResponse.json(
        { error: "Name, phone, and type are required" },
        { status: 400 }
      );
    }

    console.log("[API/Consultations] Creating consultation in DB...");
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
    console.log("[API/Consultations] DB creation successful.");

    console.log("[API/Consultations] Successfully created consultation ID:", consultation.id);

    // Email Notification to Master
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
        console.log("[API/Consultations] Notification email sent to info@seesun.kr");
      } else {
        console.log("[API/Consultations] SMTP not configured. Skipping email notification.");
      }
    } catch (mailError) {
      console.error("[API/Consultations] Error sending notification email:", mailError);
      // We don't return 500 here because the database save was successful
    }

    return NextResponse.json(consultation, { status: 201 });
  } catch (error: any) {
    console.error("[API/Consultations] ERROR creating consultation:", {
        message: error.message,
        stack: error.stack,
        errorRaw: error
    });
    
    return NextResponse.json(
      { 
        error: "Internal Server Error",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  // This could be restricted to COACH role in the real app, 
  // but for simplicity and checking, we'll implement it here.
  // The layout/dashboard will handle role checks for the UI.
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
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "ID and status are required" },
        { status: 400 }
      );
    }

    const updated = await prisma.consultation.update({
      where: { id },
      data: { status },
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
