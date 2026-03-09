import * as dotenv from 'dotenv';
dotenv.config();
import { Pool } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

async function main() {
    console.log("Starting seed with Direct Neon Pool...");
    const connectionString = "postgres://neondb_owner:npg_JqSalBh97mAy@ep-little-forest-a144tjd5-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&schema=sisun";
    const pool = new Pool({ connectionString });

    try {
        console.log("Checking for admin (COACH) accounts...");
        const resAdmin = await pool.query('SELECT * FROM sisun."User" WHERE email = $1', ['admin@sisun.com']);
        const hashedPassword = await bcrypt.hash("admin1234!", 10);

        if (resAdmin.rows.length === 0) {
            console.log("Creating admin...");
            await pool.query(
                'INSERT INTO sisun."User" (id, name, email, password, role) VALUES (gen_random_uuid(), $1, $2, $3, $4)',
                ['시선뮤직 코치', 'admin@sisun.com', hashedPassword, 'COACH']
            );
        } else {
            console.log("Updating admin password...");
            await pool.query('UPDATE sisun."User" SET password = $1 WHERE email = $2', [hashedPassword, 'admin@sisun.com']);
        }

        console.log("Checking for student accounts...");
        const resStudent = await pool.query('SELECT * FROM sisun."User" WHERE email = $1', ['student@test.com']);
        const studentPassword = await bcrypt.hash("student1234!", 10);

        if (resStudent.rows.length === 0) {
            console.log("Creating student...");
            await pool.query(
                'INSERT INTO sisun."User" (id, name, email, password, role) VALUES (gen_random_uuid(), $1, $2, $3, $4)',
                ['테스트 학생', 'student@test.com', studentPassword, 'STUDENT']
            );
        } else {
            console.log("Updating student password...");
            await pool.query('UPDATE sisun."User" SET password = $1 WHERE email = $2', [studentPassword, 'student@test.com']);
        }

        console.log("Users created/updated successfully");
    } finally {
        await pool.end();
    }
}
main().catch(console.error);
