import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { syncLiveMissionPossibleAssignmentsForUser } from "@/lib/mission-possible-sync";

type RegisterRequestBody = {
    email?: string;
    password?: string;
    name?: string;
};

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as RegisterRequestBody;
        const email = body.email?.trim().toLowerCase();
        const password = body.password?.trim();
        const name = body.name?.trim();

        if (!email || !password) {
            return NextResponse.json(
                { error: "이메일과 비밀번호를 입력해주세요." },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "비밀번호는 8자 이상으로 설정해주세요." },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "이미 가입된 이메일입니다." },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                email,
                name: name || email.split("@")[0],
                password: hashedPassword,
                role: "STUDENT", // Default role
            },
        });

        await syncLiveMissionPossibleAssignmentsForUser(user.id);

        return NextResponse.json(
            { message: "회원가입이 완료되었습니다.", userId: user.id },
            { status: 201 }
        );
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        const stack = error instanceof Error ? error.stack : undefined;

        console.error("Registration error full details:", {
            message,
            stack,
            errorRaw: error
        });

        return NextResponse.json(
            { 
                error: "회원가입 중 오류가 발생했습니다.",
                details: process.env.NODE_ENV === 'development' ? message : undefined 
            },
            { status: 500 }
        );
    }
}
