import { get, type GetBlobResult } from "@vercel/blob";

export function buildAssignmentAudioUrl(assignmentId: string) {
    return `/api/audio/assignment/${encodeURIComponent(assignmentId)}`;
}

export function buildFeedbackAudioUrl(feedbackId: string) {
    return `/api/audio/feedback/${encodeURIComponent(feedbackId)}`;
}

export async function fetchStoredAudioBlob(blobUrl: string) {
    let lastError: unknown;

    for (const access of ["private", "public"] as const) {
        try {
            const blob = await get(blobUrl, {
                access,
                useCache: access === "private" ? false : undefined,
            });

            if (blob) {
                return blob;
            }
        } catch (error) {
            lastError = error;
        }
    }

    if (lastError) {
        throw lastError;
    }

    return null;
}

export function createAudioStreamResponse(blob: GetBlobResult) {
    if (blob.statusCode === 304 || !blob.stream) {
        return new Response(null, { status: 304 });
    }

    const headers = new Headers();
    const contentLength = blob.headers.get("content-length");
    const acceptRanges = blob.headers.get("accept-ranges");

    headers.set("Content-Type", blob.blob.contentType || "audio/webm");
    headers.set("Content-Disposition", blob.blob.contentDisposition || "inline");
    headers.set("Cache-Control", "private, no-store, max-age=0");
    headers.set("X-Content-Type-Options", "nosniff");

    if (contentLength) {
        headers.set("Content-Length", contentLength);
    }

    if (acceptRanges) {
        headers.set("Accept-Ranges", acceptRanges);
    }

    return new Response(blob.stream, {
        status: 200,
        headers,
    });
}
