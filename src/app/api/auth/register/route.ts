import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { email, password, name } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "이메일과 비밀번호를 입력해주세요." },
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

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                name: name || email.split("@")[0],
                password: hashedPassword,
                role: "STUDENT", // Default role
            },
        });

        return NextResponse.json(
            { message: "회원가입이 완료되었습니다.", userId: user.id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "회원가입 중 오류가 발생했습니다." },
            { status: 500 }
        );
    }
}
