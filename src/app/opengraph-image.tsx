import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/site";

export const alt = "시선뮤직 아티스트클럽";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TAGLINE = "분당 1:1 보컬 트레이닝 · 평생 무너지지 않는 소리";

// Fetches only the glyphs this card needs; the default OG font has no Hangul.
async function loadKoreanFont(text: string) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700&text=${encodeURIComponent(text)}`
  ).then((res) => res.text());
  const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
  if (!url) throw new Error("Korean font subset not found");
  return fetch(url).then((res) => res.arrayBuffer());
}

export default async function Image() {
  const font = await loadKoreanFont(`${BRAND.nameKo}${TAGLINE}`).catch(() => null);

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
        <div style={{ display: "flex", fontSize: 30, color: "#FE7502" }}>{BRAND.slogan}</div>
        <div style={{ display: "flex", fontSize: 76, lineHeight: 1.25, letterSpacing: "-0.02em" }}>
          {BRAND.nameKo}
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#a1a1a6" }}>{TAGLINE}</div>
      </div>
    ),
    { ...size, fonts: [{ name: "NotoSansKR", data: font, weight: 700, style: "normal" }] }
  );
}
