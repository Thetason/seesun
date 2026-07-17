// Naver SmartPlace booking — deep link straight to the 예약 tab (place ID 2024719184).
// Short link from the owner (lands on place home, one extra tap): https://naver.me/FCZh3Iar
// Every CTA on the site reads from this single value.
const SMARTPLACE_BOOKING_URL = "https://m.place.naver.com/place/2024719184/booking";

// Used until the booking URL above is filled in.
const SMARTPLACE_FALLBACK_URL = "https://map.naver.com/p/search/시선뮤직";

export const SMARTPLACE_URL = SMARTPLACE_BOOKING_URL || SMARTPLACE_FALLBACK_URL;

// Paste the KakaoTalk channel add-friend URL here once ready (e.g. "https://pf.kakao.com/_abc123")
export const KAKAO_CHANNEL_URL = "";

export const KICKOFF_CTA_LABEL = "무료 킥오프 상담 예약";

export const BRAND = {
  nameKo: "시선뮤직 아티스트클럽",
  nameEn: "SEE:SUN",
  slogan: "Everlasting Change",
} as const;

// Canonical origin. Once seesunmusic.com is connected, set NEXT_PUBLIC_SITE_URL
// in Vercel env (or replace the fallback) — every meta tag, sitemap and JSON-LD
// block reads from this single value.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://seesunmusic.com";

// Naver Analytics (애널리틱스 > 사이트 관리 발급 ID)
export const NAVER_WCS_ID = "17a4d2b22c44c40";

// 세타쓴 entity pipe: shared between this site's JSON-LD and thetason.com's
// Rank Math Person schema. Keep both sides in sync.
export const THETASON_LINKS = [
  "https://thetason.com",
  "https://blog.naver.com/thetason",
  "https://www.instagram.com/thetasonwillsing/",
  "https://www.youtube.com/@thetasonwillcreate",
] as const;
