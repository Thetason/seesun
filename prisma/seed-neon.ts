import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Load variables from .env into process.env
dotenv.config();

// Initialize native PrismaClient
const prisma = new PrismaClient();

function getRequiredEnv(name: string) {
    const value = process.env[name]?.trim();

    if (!value) {
        throw new Error(`${name} is required to run prisma/seed-neon.ts safely.`);
    }

    return value;
}

async function main() {
    console.log("Seeding started using native PrismaClient...");
    try {
        await prisma.track.upsert({
            where: { id: "track_spark" },
            update: {},
            create: {
                id: "track_spark",
                name: "Spark",
                description: "월 10만 원 첫 변화 체감 클래스"
            }
        });

        const signatureTrack = await prisma.track.upsert({
            where: { id: "track_signature" },
            update: {},
            create: {
                id: "track_signature",
                name: "Signature",
                description: "히어로 프로덕트, 6주 단위 핵심 솔루션"
            }
        });

        const coachEmail = getRequiredEnv("SEED_COACH_EMAIL");
        const coachPassword = getRequiredEnv("SEED_COACH_PASSWORD");
        const studentEmail = getRequiredEnv("SEED_STUDENT_EMAIL");
        const studentPassword = getRequiredEnv("SEED_STUDENT_PASSWORD");
        const hashedAdminPassword = await bcrypt.hash(coachPassword, 10);

        await prisma.user.upsert({
            where: { email: coachEmail },
            update: {},
            create: {
                email: coachEmail,
                name: "SEE:SUN 대표 코치",
                password: hashedAdminPassword,
                role: "COACH",
            },
        });

        const hashedStudentPassword = await bcrypt.hash(studentPassword, 10);

        const testStudent = await prisma.user.upsert({
            where: { email: studentEmail },
            update: {},
            create: {
                email: studentEmail,
                name: "김진수 (테스트 수강생)",
                password: hashedStudentPassword,
                role: "STUDENT",
                trackId: signatureTrack.id
            },
        });

        await prisma.assignment.create({
            data: {
                title: "1주차: 숨쉬는 위치 마킹 및 기본 복식 호흡",
                description: "명치에 손을 얹고 숨을 깊게 들이마시며 팽창을 느끼는 훈련입니다.",
                weekNumber: 1,
                userId: testStudent.id,
                isCompleted: false,
            }
        });
        console.log("Seeding complete!");
    } catch (e) {
        console.error("error seeding:", e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
