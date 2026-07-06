import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { hashMemberInviteToken } from "@/lib/member-invites";

type AcceptInviteBody = {
    token?: string;
    password?: string;
    name?: string;
};

function sanitizeOptionalString(value: unknown) {
    if (typeof value !== "string") {
        return undefined;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
}

export async function POST(request: Request) {
    let body: AcceptInviteBody;

    try {
        body = (await request.json()) as AcceptInviteBody;
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const token = sanitizeOptionalString(body.token);
    const password = sanitizeOptionalString(body.password);
    const name = sanitizeOptionalString(body.name);

    if (!token || !password) {
        return NextResponse.json({ error: "초대 토큰과 비밀번호가 필요합니다." }, { status: 400 });
    }

    if (password.length < 8) {
        return NextResponse.json({ error: "비밀번호는 8자 이상이어야 합니다." }, { status: 400 });
    }

    const invite = await prisma.memberInvite.findUnique({
        where: { tokenHash: hashMemberInviteToken(token) },
        include: {
            user: true,
        },
    });

    if (!invite || invite.acceptedAt || invite.expiresAt < new Date()) {
        return NextResponse.json({ error: "만료되었거나 이미 사용된 초대 링크입니다." }, { status: 410 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.$transaction([
        prisma.user.update({
            where: { id: invite.userId },
            data: {
                password: hashedPassword,
                name: name || invite.user.name,
                role: "STUDENT",
            },
        }),
        prisma.memberInvite.update({
            where: { id: invite.id },
            data: { acceptedAt: new Date() },
        }),
        prisma.contactLog.create({
            data: {
                userId: invite.userId,
                coachId: invite.createdByUserId,
                channel: "NOTE",
                summary: "회원이 SEE:SUN App 초대를 수락하고 비밀번호를 설정했습니다.",
                nextAction: "첫 루틴과 주간 리포트 확인 여부를 점검합니다.",
            },
        }),
    ]);

    return NextResponse.json({
        success: true,
        email: invite.user.email,
    });
}
