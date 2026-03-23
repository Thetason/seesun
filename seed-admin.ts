import * as dotenv from 'dotenv';
dotenv.config();
import { Pool } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

function getRequiredEnv(name: string) {
    const value = process.env[name]?.trim();

    if (!value) {
        throw new Error(`${name} is required to run seed-admin.ts safely.`);
    }

    return value;
}

async function main() {
    console.log("Starting seed with Direct Neon Pool...");
    const connectionString = getRequiredEnv("DATABASE_URL");
    const coachEmail = getRequiredEnv("SEED_COACH_EMAIL");
    const coachPassword = getRequiredEnv("SEED_COACH_PASSWORD");
    const studentEmail = getRequiredEnv("SEED_STUDENT_EMAIL");
    const studentPassword = getRequiredEnv("SEED_STUDENT_PASSWORD");
    const pool = new Pool({ connectionString });

    try {
        console.log("Checking for admin (COACH) accounts...");
        const resAdmin = await pool.query('SELECT * FROM sisun."User" WHERE email = $1', [coachEmail]);
        const hashedPassword = await bcrypt.hash(coachPassword, 10);

        if (resAdmin.rows.length === 0) {
            console.log("Creating admin...");
            await pool.query(
                'INSERT INTO sisun."User" (id, name, email, password, role) VALUES (gen_random_uuid(), $1, $2, $3, $4)',
                ['시선뮤직 코치', coachEmail, hashedPassword, 'COACH']
            );
        } else {
            console.log("Updating admin password...");
            await pool.query('UPDATE sisun."User" SET password = $1 WHERE email = $2', [hashedPassword, coachEmail]);
        }

        console.log("Checking for student accounts...");
        const resStudent = await pool.query('SELECT * FROM sisun."User" WHERE email = $1', [studentEmail]);
        const hashedStudentPassword = await bcrypt.hash(studentPassword, 10);

        if (resStudent.rows.length === 0) {
            console.log("Creating student...");
            await pool.query(
                'INSERT INTO sisun."User" (id, name, email, password, role) VALUES (gen_random_uuid(), $1, $2, $3, $4)',
                ['테스트 학생', studentEmail, hashedStudentPassword, 'STUDENT']
            );
        } else {
            console.log("Updating student password...");
            await pool.query('UPDATE sisun."User" SET password = $1 WHERE email = $2', [hashedStudentPassword, studentEmail]);
        }

        console.log("Users created/updated successfully");
    } finally {
        await pool.end();
    }
}
main().catch(console.error);
