import { ImageResponse } from "next/og";
import { docsOfKind, findDoc } from "@/lib/content/registry";

export const alt = "시선뮤직 아티스트클럽 발성 가이드";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Params = { category: string; slug: string };

export function generateStaticParams(): Params[] {
  return docsOfKind("guide").map((doc) => ({ category: doc.category, slug: doc.slug }));
}

const BRAND = "시선뮤직 아티스트클럽 · 분당 1:1 보컬 트레이닝";

// Fetches only the glyphs this card needs; the default OG font has no Hangul.
async function loadKoreanFont(text: string) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700&text=${encodeURIComponent(text)}`
  ).then((res) => {
    if (!res.ok) throw new Error(`Font CSS request failed: ${res.status}`);
    return res.text();
  });
  const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
  if (!url) throw new Error("Korean font subset not found");
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Font file request failed: ${res.status}`);
  const font = await res.arrayBuffer();
  // Google can answer with an HTML error page; ImageResponse throws on it and fails the build.
  const signature = new TextDecoder().decode(new Uint8Array(font, 0, 4));
  if (!["\0\u0001\0\0", "OTTO", "true"].includes(signature)) throw new Error("Font response is not a font");
  return font;
}

export default async function Image({ params }: { params: Promise<Params> }) {
  const { category, slug } = await params;
  const doc = findDoc("guide", category, slug);
  const title = doc?.title ?? "발성 가이드";
  const label = doc?.categoryLabel ?? "발성 가이드";
  const font = await loadKoreanFont(`${title}${label}${BRAND}`).catch(() => null);

  // A font outage must not fail the build; fall back to a Latin-only card.
  if (!font) {
    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0b0b0c", color: "#f5f5f7", fontSize: 56 }}>
          SEESUN MUSIC ARTIST CLUB
        </div>
      ),
      size
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0b0b0c",
          color: "#f5f5f7",
          fontFamily: "NotoSansKR",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: "#FE7502" }}>{label}</div>
        <div style={{ display: "flex", fontSize: title.length > 22 ? 64 : 76, lineHeight: 1.25, letterSpacing: "-0.02em" }}>
          {title}
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#a1a1a6" }}>{BRAND}</div>
      </div>
    ),
    { ...size, fonts: [{ name: "NotoSansKR", data: font, weight: 700, style: "normal" }] }
  );
}
