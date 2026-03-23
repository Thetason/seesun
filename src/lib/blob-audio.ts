export function buildAssignmentAudioUrl(assignmentId: string) {
    return `/api/audio/assignment/${encodeURIComponent(assignmentId)}`;
}

export function buildFeedbackAudioUrl(feedbackId: string) {
    return `/api/audio/feedback/${encodeURIComponent(feedbackId)}`;
}

export async function fetchStoredAudioResponse(blobUrl: string, rangeHeader?: string | null) {
    const token = process.env.BLOB_READ_WRITE_TOKEN;

    if (!token) {
        throw new Error("BLOB_READ_WRITE_TOKEN is not configured.");
    }

    const headers = new Headers({
        Authorization: `Bearer ${token}`,
    });

    if (rangeHeader) {
        headers.set("Range", rangeHeader);
    }

    const response = await fetch(blobUrl, {
        headers,
        cache: "no-store",
    });

    if (response.status === 404) {
        return null;
    }

    if (!response.ok && response.status !== 206) {
        throw new Error(`Blob fetch failed with status ${response.status}`);
    }

    return response;
}

function detectAudioContentType(chunk: Uint8Array, fallback?: string | null) {
    if (chunk.length >= 12) {
        const firstFour = Array.from(chunk.subarray(0, 4))
            .map((value) => value.toString(16).padStart(2, "0"))
            .join("");
        const boxType = new TextDecoder().decode(chunk.subarray(4, 8));

        if (firstFour === "1a45dfa3") {
            return "audio/webm";
        }

        if (boxType === "ftyp") {
            return "audio/mp4";
        }
    }

    if (chunk.length >= 4) {
        const oggSignature = new TextDecoder().decode(chunk.subarray(0, 4));

        if (oggSignature === "OggS") {
            return "audio/ogg";
        }
    }

    if (chunk.length >= 3) {
        const id3Signature = new TextDecoder().decode(chunk.subarray(0, 3));

        if (id3Signature === "ID3") {
            return "audio/mpeg";
        }
    }

    return fallback || "application/octet-stream";
}

export async function createAudioStreamResponse(response: Response) {
    if (!response.body) {
        return new Response(null, { status: response.status });
    }

    const reader = response.body.getReader();
    const firstChunkResult = await reader.read();
    const firstChunk = firstChunkResult.value ?? new Uint8Array();
    const detectedContentType = detectAudioContentType(firstChunk, response.headers.get("content-type"));

    const headers = new Headers();
    const contentLength = response.headers.get("content-length");
    const acceptRanges = response.headers.get("accept-ranges");
    const contentRange = response.headers.get("content-range");
    const contentDisposition = response.headers.get("content-disposition");

    headers.set("Content-Type", detectedContentType);
    headers.set("Content-Disposition", contentDisposition || "inline");
    headers.set("Cache-Control", "private, no-store, max-age=0");
    headers.set("X-Content-Type-Options", "nosniff");

    if (contentLength) {
        headers.set("Content-Length", contentLength);
    }

    if (acceptRanges) {
        headers.set("Accept-Ranges", acceptRanges);
    }

    if (contentRange) {
        headers.set("Content-Range", contentRange);
    }

    const stream = new ReadableStream<Uint8Array>({
        start(controller) {
            if (firstChunk.length > 0) {
                controller.enqueue(firstChunk);
            }

            if (firstChunkResult.done) {
                controller.close();
                return;
            }

            const pump = () => {
                reader.read()
                    .then(({ done, value }) => {
                        if (done) {
                            controller.close();
                            return;
                        }

                        if (value) {
                            controller.enqueue(value);
                        }

                        pump();
                    })
                    .catch((error) => controller.error(error));
            };

            pump();
        },
        cancel(reason) {
            void reader.cancel(reason);
        },
    });

    return new Response(stream, {
        status: response.status,
        headers,
    });
}
