import { NextResponse } from "next/server";
import { deliverTodayRoutines } from "@/lib/routine-delivery";

function isAuthorizedCronRequest(request: Request) {
    if (process.env.NODE_ENV !== "production") {
        return true;
    }

    const url = new URL(request.url);
    const providedSecret =
        request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
        url.searchParams.get("secret");

    if (process.env.CRON_SECRET && providedSecret === process.env.CRON_SECRET) {
        return true;
    }

    const userAgent = request.headers.get("user-agent") || "";
    const vercelCronHeader = request.headers.get("x-vercel-cron");

    return userAgent.includes("vercel-cron") || vercelCronHeader === "1";
}

export async function GET(request: Request) {
    if (!isAuthorizedCronRequest(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const dryRun = url.searchParams.get("dryRun") === "1";

    try {
        const result = await deliverTodayRoutines({
            origin: url.origin,
            dryRun,
        });

        return NextResponse.json({
            ok: true,
            ...result,
        });
    } catch (error) {
        console.error("[RoutineDailyDelivery] Failed to deliver routines:", error);
        return NextResponse.json(
            { error: "Failed to deliver daily routines" },
            { status: 500 }
        );
    }
}
