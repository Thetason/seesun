import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
    buildMemberInviteUrl,
    createMemberInviteToken,
    hashMemberInviteToken,
    sendMemberInviteEmail,
} from "@/lib/member-invites";

type MemberInviteBody = {
    userId?: string;
    sendEmail?: boolean;
};

const INVITE_TTL_DAYS = 14;

function sanitizeOptionalString(value: unknown) {
    if (typeof value !== "string") {
        return undefined;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "COACH") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: MemberInviteBody;

    try {
        body = (await request.json()) as MemberInviteBody;
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const userId = sanitizeOptionalString(body.userId);

    if (!userId) {
        return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const member = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
        },
    });

    if (!member?.email) {
        return NextResponse.json({ error: "초대 링크를 만들려면 회원 이메일이 필요합니다." }, { status: 400 });
    }

    const token = createMemberInviteToken();
    const inviteUrl = buildMemberInviteUrl(token);
    const expiresAt = new Date(Date.now() + INVITE_TTL_DAYS * 24 * 60 * 60 * 1000);

    const invite = await prisma.memberInvite.create({
        data: {
            userId: member.id,
            createdByUserId: session.user.id,
            tokenHash: hashMemberInviteToken(token),
            expiresAt,
        },
    });

    let emailSent = false;
    let emailReason: string | undefined;

    if (body.sendEmail !== false) {
        const emailResult = await sendMemberInviteEmail({
            to: member.email,
            memberName: member.name,
            inviteUrl,
        });

        emailSent = Boolean(emailResult.sent);
        emailReason = emailResult.reason;

        if (emailSent) {
            await prisma.memberInvite.update({
                where: { id: invite.id },
                data: { sentAt: new Date() },
            });
        }
    }

    await prisma.contactLog.create({
        data: {
            userId: member.id,
            coachId: session.user.id,
            channel: emailSent ? "EMAIL" : "NOTE",
            summary: emailSent
                ? "SEE:SUN App 초대 이메일을 발송했습니다."
                : "SEE:SUN App 초대 링크를 생성했습니다.",
            nextAction: emailSent ? "회원의 비밀번호 설정 여부를 확인합니다." : "초대 링크를 카카오 또는 문자로 전달합니다.",
        },
    });

    return NextResponse.json({
        success: true,
        inviteId: invite.id,
        inviteUrl,
        expiresAt,
        emailSent,
        emailReason,
    });
}
