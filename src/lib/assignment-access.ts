import { createHmac, timingSafeEqual } from "crypto";

type AssignmentAccessTokenPayload = {
    v: 1;
    a: string;
    u: string;
    e: number;
};

function getAssignmentAccessSecret() {
    const secret = process.env.MISSION_LINK_SECRET?.trim() || process.env.NEXTAUTH_SECRET?.trim();

    if (!secret) {
        throw new Error("MISSION_LINK_SECRET or NEXTAUTH_SECRET must be configured.");
    }

    return secret;
}

function encodeBase64Url(value: string | Buffer) {
    return Buffer.from(value).toString("base64url");
}

function decodeBase64Url(value: string) {
    return Buffer.from(value, "base64url").toString("utf8");
}

function signPayload(encodedPayload: string) {
    return createHmac("sha256", getAssignmentAccessSecret())
        .update(encodedPayload)
        .digest("base64url");
}

export function createAssignmentAccessToken(input: {
    assignmentId: string;
    userId: string;
    expiresAt: Date;
}) {
    const payload: AssignmentAccessTokenPayload = {
        v: 1,
        a: input.assignmentId,
        u: input.userId,
        e: input.expiresAt.getTime(),
    };

    const encodedPayload = encodeBase64Url(JSON.stringify(payload));
    const signature = signPayload(encodedPayload);

    return `${encodedPayload}.${signature}`;
}

export function verifyAssignmentAccessToken(token: string | null | undefined) {
    if (!token) {
        return null;
    }

    const [encodedPayload, providedSignature] = token.split(".");

    if (!encodedPayload || !providedSignature) {
        return null;
    }

    const expectedSignature = signPayload(encodedPayload);
    const providedBuffer = Buffer.from(providedSignature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (
        providedBuffer.length !== expectedBuffer.length ||
        !timingSafeEqual(providedBuffer, expectedBuffer)
    ) {
        return null;
    }

    try {
        const parsed = JSON.parse(decodeBase64Url(encodedPayload)) as Partial<AssignmentAccessTokenPayload>;

        if (
            parsed.v !== 1 ||
            typeof parsed.a !== "string" ||
            typeof parsed.u !== "string" ||
            typeof parsed.e !== "number"
        ) {
            return null;
        }

        if (Date.now() > parsed.e) {
            return null;
        }

        return {
            assignmentId: parsed.a,
            userId: parsed.u,
            expiresAt: new Date(parsed.e),
        };
    } catch (error) {
        console.error("Failed to verify assignment access token:", error);
        return null;
    }
}

export function getAssignmentAccessTokenExpiry(input: {
    availableUntil?: Date | string | null;
    createdAt?: Date | string | null;
}) {
    const baseDate = input.availableUntil
        ? new Date(input.availableUntil)
        : input.createdAt
            ? new Date(input.createdAt)
            : new Date();

    const fallbackBaseDate = Number.isNaN(baseDate.getTime()) ? new Date() : baseDate;

    return new Date(fallbackBaseDate.getTime() + 1000 * 60 * 60 * 24 * 30);
}

export function buildAssignmentAccessPath(token: string) {
    return `/mission/${encodeURIComponent(token)}`;
}
