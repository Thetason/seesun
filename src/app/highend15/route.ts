import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

let cachedHtml: string | null = null;

async function getHighendLandingHtml() {
  const shouldCache = process.env.NODE_ENV === "production";

  if (shouldCache && cachedHtml) {
    return cachedHtml;
  }

  const html = await readFile(
    path.join(process.cwd(), "public", "highend15", "index.html"),
    "utf8"
  );

  if (shouldCache) {
    cachedHtml = html;
  }

  return html;
}

export async function GET() {
  const html = await getHighendLandingHtml();

  return new Response(html, {
    headers: {
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "index, follow",
    },
  });
}
