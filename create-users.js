/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function main() {
    const prisma = new PrismaClient();

    console.log("Creating Coach...");
    const adminPassword = await bcrypt.hash("admin1234!", 10);
    const coach = await prisma.user.upsert({
        where: { email: "admin@sisun.com" },
        update: { password: adminPassword },
        create: {
            name: "시선뮤직 코치",
            email: "admin@sisun.com",
            password: adminPassword,
            role: "COACH"
        }
    });
    console.log("Coach created/updated:", coach.email);

    console.log("Creating Student...");
    const studentPassword = await bcrypt.hash("student1234!", 10);
    const student = await prisma.user.upsert({
        where: { email: "student@test.com" },
        update: { password: studentPassword },
        create: {
            name: "테스트 학생",
            email: "student@test.com",
            password: studentPassword,
            role: "STUDENT"
        }
    });
    console.log("Student created/updated:", student.email);

    console.log("Users created successfully");
}
main().catch(console.error);
