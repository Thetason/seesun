import "dotenv/config";
import { spawnSync } from "node:child_process";

const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
    if (process.env.VERCEL_ENV === "production" || process.env.REQUIRE_DATABASE_PREP === "true") {
        console.error("[prisma] DATABASE_URL is required for production database preparation.");
        process.exit(1);
    }

    console.warn("[prisma] DATABASE_URL is not set. Skipping database preparation for this non-production build.");
    process.exit(0);
}

function runPrismaCommand(args) {
    const result = spawnSync("npx", ["prisma", ...args], {
        encoding: "utf8",
    });

    if (result.stdout) {
        process.stdout.write(result.stdout);
    }

    if (result.stderr) {
        process.stderr.write(result.stderr);
    }

    return result;
}

const migrateDeploy = runPrismaCommand(["migrate", "deploy"]);

if (migrateDeploy.status === 0) {
    process.exit(0);
}

const deployOutput = `${migrateDeploy.stdout ?? ""}\n${migrateDeploy.stderr ?? ""}`;

if (!deployOutput.includes("P3005")) {
    process.exit(migrateDeploy.status ?? 1);
}

console.warn(
    "[prisma] Existing non-baselined database detected. Falling back to `prisma db push` for schema sync."
);

const dbPush = runPrismaCommand(["db", "push"]);
process.exit(dbPush.status ?? 1);
