import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import QRCode from "qrcode";
import { authOptions } from "@/lib/auth";
import {
    buildLessonCheckInUrl,
    getKstDateKey,
    normalizeLessonDateKey,
} from "@/lib/lesson-attendance";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "COACH") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const requestedDateKey = normalizeLessonDateKey(url.searchParams.get("date"));
    const dateKey = requestedDateKey || getKstDateKey();
    const checkInUrl = buildLessonCheckInUrl(url.origin, dateKey);
    const qrDataUrl = await QRCode.toDataURL(checkInUrl, {
        errorCorrectionLevel: "M",
        margin: 1,
        width: 640,
        color: {
            dark: "#1D1D1F",
            light: "#FFFFFF",
        },
    });

    return NextResponse.json({
        success: true,
        dateKey,
        checkInUrl,
        qrDataUrl,
    });
}
