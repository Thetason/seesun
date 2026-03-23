import { spawnSync } from "node:child_process";

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
