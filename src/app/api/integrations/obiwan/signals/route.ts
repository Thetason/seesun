import { NextResponse } from "next/server";
import { ingestObiwanSignalIntoKakashi, KakashiOsError } from "@/lib/internal-os/kakashi-obiwan-os";

function getBearerToken(headerValue: string | null) {
    if (!headerValue?.startsWith("Bearer ")) {
        return null;
    }

    return headerValue.slice("Bearer ".length).trim();
}

function assertIntegrationAuthorized(request: Request) {
    const expectedSecret = process.env.OBIWAN_INTEGRATION_SECRET;

    if (!expectedSecret) {
        return process.env.NODE_ENV !== "production";
    }

    const headerSecret = request.headers.get("x-obiwan-secret") || getBearerToken(request.headers.get("authorization"));
    return headerSecret === expectedSecret;
}

export async function POST(request: Request) {
    if (!assertIntegrationAuthorized(request)) {
        return NextResponse.json(
            {
                error: process.env.OBIWAN_INTEGRATION_SECRET
                    ? "Unauthorized"
                    : "OBIWAN_INTEGRATION_SECRET is required in production",
            },
            { status: process.env.OBIWAN_INTEGRATION_SECRET ? 401 : 503 }
        );
    }

    let body: unknown;

    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const createRecommendation = searchParams.get("recommend") !== "0";
        const result = await ingestObiwanSignalIntoKakashi({
            payload: body,
            createRecommendation,
        });

        return NextResponse.json({
            success: true,
            signal: result.signal,
            recommendation: result.recommendation,
            generatedRecommendation: result.generatedRecommendation,
            operatingPacket: result.operatingPacket,
            normalizedSignal: result.normalized.operatingSignal,
            harness: {
                sourceProject: "OBIWAN",
                targetProject: "GOJO",
                operatingProject: "KAKASHI",
            },
        });
    } catch (error) {
        if (error instanceof KakashiOsError) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }
        console.error("Obiwan signal ingest error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
