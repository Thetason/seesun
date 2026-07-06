import { createHash, randomBytes } from "crypto";
import nodemailer from "nodemailer";

export function createMemberInviteToken() {
    return randomBytes(32).toString("base64url");
}

export function hashMemberInviteToken(token: string) {
    return createHash("sha256").update(token).digest("hex");
}

export function buildMemberInviteUrl(token: string) {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    return `${baseUrl.replace(/\/$/, "")}/invite/${encodeURIComponent(token)}`;
}

export function isMemberInviteEmailConfigured() {
    return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function sendMemberInviteEmail({
    to,
    memberName,
    inviteUrl,
}: {
    to: string;
    memberName?: string | null;
    inviteUrl: string;
}) {
    if (!isMemberInviteEmailConfigured()) {
        return { sent: false, reason: "SMTP_NOT_CONFIGURED" };
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
    const from = process.env.SMTP_FROM || process.env.SMTP_USER;
    const safeName = memberName || "회원";

    await transporter.sendMail({
        from,
        to,
        subject: "SEE:SUN App 회원 공간 초대",
        text: [
            `${safeName}님, SEE:SUN App 회원 공간이 준비되었습니다.`,
            "",
            "아래 링크에서 비밀번호를 설정한 뒤 오늘 루틴과 코칭 리포트를 확인할 수 있습니다.",
            inviteUrl,
            "",
            "이 링크는 일정 기간 후 만료됩니다.",
        ].join("\n"),
        html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #1d1d1f;">
                <h1 style="font-size: 22px;">SEE:SUN App 회원 공간이 준비되었습니다.</h1>
                <p>${safeName}님, 아래 버튼을 눌러 비밀번호를 설정해 주세요.</p>
                <p>
                    <a href="${inviteUrl}" style="display:inline-block;background:#1d1d1f;color:#fff;text-decoration:none;padding:12px 18px;border-radius:12px;font-weight:700;">
                        비밀번호 설정하기
                    </a>
                </p>
                <p style="color:#6e6e73;font-size:14px;">버튼이 열리지 않으면 아래 링크를 복사해 브라우저에 붙여넣어 주세요.</p>
                <p style="word-break:break-all;color:#6e6e73;font-size:14px;">${inviteUrl}</p>
            </div>
        `,
    });

    return { sent: true };
}
