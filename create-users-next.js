/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function main() {
    const prisma = new PrismaClient({
        datasources: {
            db: { url: process.env.DATABASE_URL }
        }
    });
    
    const adminPassword = await bcrypt.hash("admin1234!", 10);
    await prisma.user.create({
        data: {
            name: "시선뮤직 코치",
            email: "admin@sisun.com",
            password: adminPassword,
            role: "COACH"
        }
    }).catch(e => console.error("Admin exists or error:", e.message));

    const studentPassword = await bcrypt.hash("student1234!", 10);
    await prisma.user.create({
        data: {
            name: "테스트 학생",
            email: "student@test.com",
            password: studentPassword,
            role: "STUDENT"
        }
    }).catch(e => console.error("Student exists or error:", e.message));

    console.log("Users created successfully");
}
main();
