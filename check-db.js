/* eslint-disable @typescript-eslint/no-require-imports */
const { Pool } = require('@neondatabase/serverless');
require('dotenv').config();

async function main() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const res = await pool.query(`SELECT email, role, password FROM sisun."User"`);
    console.log(JSON.stringify(res.rows, null, 2));
    await pool.end();
}
main();
