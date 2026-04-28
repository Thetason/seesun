import type { Consultation } from "@prisma/client";
import nodemailer from "nodemailer";

export const CONSULTATION_REMINDER_GRACE_MINUTES = 30;
export const CONSULTATION_REMINDER_INTERVAL_HOURS = 6;

type ConsultationAlertReason = "new" | "reminder";
type AlertStatus = "SENT" | "PARTIAL" | "FAILED" | "NO_CHANNEL";

type AlertDeliveryResult = {
  status: AlertStatus;
  attemptedAt: Date;
  deliveredAt: Date | null;
  channels: string[];
  errors: string[];
};

function getDashboardUrl() {
  const baseUrl = process.env.NEXTAUTH_URL || "https://seesun-delta.vercel.app";
  return `${baseUrl.replace(/\/$/, "")}/dashboard`;
}

function getAlertEmails() {
  const raw = process.env.CONSULTATION_ALERT_EMAILS || process.env.SMTP_TO || "info@seesun.kr";

  return raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function getConsultationPrimaryMessage(consultation: Consultation) {
  return consultation.bottleneck || consultation.notes || "추가 메모 없음";
}

function buildAlertSubject(consultation: Consultation, reason: ConsultationAlertReason) {
  const prefix = reason === "new" ? "신규 상담 신청" : "미응답 상담 리마인드";
  return `[SEE:SUN] ${prefix} · ${consultation.name} · ${consultation.type}`;
}

function buildAlertText(consultation: Consultation, reason: ConsultationAlertReason) {
  const reminderLine =
    reason === "reminder"
      ? "아직 PENDING 상태인 상담입니다. 빠른 확인이 필요합니다."
      : "새 상담 신청이 접수되었습니다.";

  return [
    reminderLine,
    "",
    `이름: ${consultation.name}`,
    `연락처: ${consultation.phone}`,
    `이메일: ${consultation.email || "미기재"}`,
    `신청 유형: ${consultation.type}`,
    `주요 고민: ${consultation.bottleneck || "미기재"}`,
    `편한 연락 시간/방식: ${consultation.preferredTime || "미기재"}`,
    `신청일: ${consultation.createdAt.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}`,
    "",
    `메모: ${getConsultationPrimaryMessage(consultation)}`,
    "",
    `관리자 페이지: ${getDashboardUrl()}`,
  ].join("\n");
}

function buildAlertHtml(consultation: Consultation, reason: ConsultationAlertReason) {
  const title = reason === "new" ? "새 상담 신청이 들어왔습니다" : "미응답 상담 리마인드";
  const subtitle =
    reason === "new"
      ? "상담 신청이 접수되었습니다. 빠르게 확인해 주세요."
      : "아직 PENDING 상태인 상담입니다. 놓치지 않도록 다시 알려드립니다.";

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 24px; color: #111217;">
      <h2 style="margin: 0 0 8px; color: #111217;">${title}</h2>
      <p style="margin: 0 0 18px; color: #5b5c63; line-height: 1.6;">${subtitle}</p>
      <div style="border: 1px solid rgba(17,18,23,0.08); border-radius: 16px; padding: 16px 18px; background: #f7f7f9;">
        <p><strong>이름:</strong> ${consultation.name}</p>
        <p><strong>연락처:</strong> ${consultation.phone}</p>
        <p><strong>이메일:</strong> ${consultation.email || "미기재"}</p>
        <p><strong>신청 유형:</strong> ${consultation.type}</p>
        <p><strong>주요 고민:</strong> ${consultation.bottleneck || "미기재"}</p>
        <p><strong>편한 연락 시간/방식:</strong> ${consultation.preferredTime || "미기재"}</p>
        <p><strong>신청일:</strong> ${consultation.createdAt.toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}</p>
      </div>
      <div style="margin-top: 16px; padding: 16px 18px; border-radius: 16px; background: #fff7eb; border: 1px solid rgba(255,159,10,0.16);">
        <strong>메모</strong>
        <p style="margin: 8px 0 0; white-space: pre-wrap; line-height: 1.7;">${getConsultationPrimaryMessage(consultation)}</p>
      </div>
      <a href="${getDashboardUrl()}" style="display: inline-block; margin-top: 18px; padding: 12px 20px; border-radius: 999px; background: #111217; color: #fff; text-decoration: none; font-weight: 700;">관리자 페이지 열기</a>
    </div>
  `;
}

async function sendEmailAlert(consultation: Consultation, reason: ConsultationAlertReason) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return false;
  }

  const recipients = getAlertEmails();

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"SEE:SUN ALERT" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: recipients.join(", "),
    subject: buildAlertSubject(consultation, reason),
    text: buildAlertText(consultation, reason),
    html: buildAlertHtml(consultation, reason),
  });

  return true;
}

async function postJson(url: string, body: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
}

async function sendDiscordAlert(consultation: Consultation, reason: ConsultationAlertReason) {
  if (!process.env.DISCORD_WEBHOOK_URL) {
    return false;
  }

  const prefix = reason === "new" ? "새 상담 신청" : "미응답 상담 리마인드";
  const content = [
    `**${prefix}**`,
    `이름: ${consultation.name}`,
    `연락처: ${consultation.phone}`,
    `유형: ${consultation.type}`,
    `고민: ${consultation.bottleneck || "미기재"}`,
    `대시보드: ${getDashboardUrl()}`,
  ].join("\n");

  await postJson(process.env.DISCORD_WEBHOOK_URL, { content });
  return true;
}

async function sendSlackAlert(consultation: Consultation, reason: ConsultationAlertReason) {
  if (!process.env.SLACK_WEBHOOK_URL) {
    return false;
  }

  const prefix = reason === "new" ? "새 상담 신청" : "미응답 상담 리마인드";
  const text = [
    `*${prefix}*`,
    `이름: ${consultation.name}`,
    `연락처: ${consultation.phone}`,
    `유형: ${consultation.type}`,
    `고민: ${consultation.bottleneck || "미기재"}`,
    `대시보드: ${getDashboardUrl()}`,
  ].join("\n");

  await postJson(process.env.SLACK_WEBHOOK_URL, { text });
  return true;
}

async function sendTelegramAlert(consultation: Consultation, reason: ConsultationAlertReason) {
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    return false;
  }

  const prefix = reason === "new" ? "새 상담 신청" : "미응답 상담 리마인드";
  const text = [
    `${prefix}`,
    `이름: ${consultation.name}`,
    `연락처: ${consultation.phone}`,
    `유형: ${consultation.type}`,
    `고민: ${consultation.bottleneck || "미기재"}`,
    `대시보드: ${getDashboardUrl()}`,
  ].join("\n");

  const response = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return true;
}

export function describeConsultationAlertConfig() {
  return {
    email: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS),
    discord: Boolean(process.env.DISCORD_WEBHOOK_URL),
    slack: Boolean(process.env.SLACK_WEBHOOK_URL),
    telegram: Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
  };
}

export async function sendConsultationAlert(consultation: Consultation, reason: ConsultationAlertReason): Promise<AlertDeliveryResult> {
  const attemptedAt = new Date();
  const channels: string[] = [];
  const errors: string[] = [];

  const deliveries: Array<{ name: string; send: () => Promise<boolean> }> = [
    { name: "email", send: () => sendEmailAlert(consultation, reason) },
    { name: "discord", send: () => sendDiscordAlert(consultation, reason) },
    { name: "slack", send: () => sendSlackAlert(consultation, reason) },
    { name: "telegram", send: () => sendTelegramAlert(consultation, reason) },
  ];

  for (const delivery of deliveries) {
    try {
      const sent = await delivery.send();
      if (sent) {
        channels.push(delivery.name);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`${delivery.name}: ${message}`);
    }
  }

  let status: AlertStatus = "NO_CHANNEL";

  if (channels.length > 0 && errors.length === 0) {
    status = "SENT";
  } else if (channels.length > 0 && errors.length > 0) {
    status = "PARTIAL";
  } else if (errors.length > 0) {
    status = "FAILED";
  }

  return {
    status,
    attemptedAt,
    deliveredAt: channels.length > 0 ? attemptedAt : null,
    channels,
    errors,
  };
}
