// Naver SmartPlace booking — deep link straight to the 예약 tab (place ID 2024719184).
// Short link from the owner (lands on place home, one extra tap): https://naver.me/FCZh3Iar
// Every CTA on the site reads from this single value.
const SMARTPLACE_BOOKING_URL = "https://m.place.naver.com/place/2024719184/booking";

// Used until the booking URL above is filled in.
const SMARTPLACE_FALLBACK_URL = "https://map.naver.com/p/search/시선뮤직";

export const SMARTPLACE_URL = SMARTPLACE_BOOKING_URL || SMARTPLACE_FALLBACK_URL;

// Paste the KakaoTalk channel add-friend URL here once ready (e.g. "https://pf.kakao.com/_abc123")
export const KAKAO_CHANNEL_URL = "";

export const KICKOFF_CTA_LABEL = "무료 상담 30분 예약";

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
  "https://www.instagram.com/thetason_/",
  "https://www.youtube.com/@thetasonwillcreate",
] as const;

// Naver SmartPlace entry (place ID 2024719184) — the business entity profile,
// as opposed to THETASON_LINKS which are the coach's personal channels.
// Compression 15 runs on its own campaign landing; the official site links out to it.
export const COMPRESSION15_URL = "https://compression15.seesunmusic.com";

export const NAVER_PLACE_URL = "https://m.place.naver.com/place/2024719184";

// Third-party review profile. Linked via sameAs only — never marked up as
// aggregateRating on our own domain (self-serving review, Google-disallowed).
export const RECORD_REVIEWS_URL = "https://recordyours.com/syb2020";
export const DAANGN_PROFILE_URL = "https://www.daangn.com/kr/local-profile/9izuvt5oi311/";

// Business-entity profiles. Organization schema merges these with THETASON_LINKS;
// the Person node uses THETASON_LINKS alone.
export const BUSINESS_LINKS = [NAVER_PLACE_URL, RECORD_REVIEWS_URL, DAANGN_PROFILE_URL] as const;

export type ProductBillingUnit = "month" | "once";

export type Product = {
  id: string;
  name: string;
  serviceName: string;
  serviceType: string;
  description: string;
  path: string;
  price: number;
  billing: ProductBillingUnit;
  /** Discounted recurring price when committing to `commitMonths`. */
  commitPrice?: number;
  commitMonths?: number;
  limitedAvailability?: boolean;
  note?: string;
};

// Prices are VAT-inclusive KRW and mirror the copy on each product page.
// Single source of truth for Offer/Service JSON-LD.
export const PRODUCTS: readonly Product[] = [
  {
    id: "daily",
    name: "데일리 · 주 1회 피드백",
    serviceName: "데일리 · 주 1회 피드백 — 매일 AI 루틴 + 주 1회 코치 피드백",
    serviceType: "보컬 트레이닝 구독",
    description:
      "매일 아침 10분 보컬 루틴을 AI가 바로 확인하고, 주 1회 원장이 한 주치 기록을 직접 듣고 진단해요.",
    path: "/spark",
    price: 120000,
    billing: "month",
  },
  {
    id: "daily-feedback",
    name: "데일리 · 매일 피드백",
    serviceName: "데일리 · 매일 피드백 — 영업일 하루 1회 코치 피드백",
    serviceType: "보컬 트레이닝 구독",
    description:
      "주 1회 피드백 구성에 더해 영업일마다 하루 한 번 코치 피드백을 받아요.",
    path: "/spark",
    price: 200000,
    billing: "month",
  },
  {
    id: "signature",
    name: "1:1 레슨 · 주 1회 50분",
    serviceName: "1:1 레슨 — 주 1회 50분 1:1 보컬 트레이닝",
    serviceType: "1:1 보컬 트레이닝",
    description:
      "깊은 발음으로 소리를 잡고 노래와 녹음으로 확인하는 1:1 레슨. 주 1회 50분, 코치 피드백과 회원 페이지 기록이 함께 가요.",
    path: "/signature",
    price: 440000,
    billing: "month",
    commitPrice: 420000,
    commitMonths: 3,
  },
  {
    id: "crew",
    name: "아티스트웨이 크루 활동비",
    serviceName: "아티스트웨이 크루 — 시즌제 크리에이티브 클럽",
    serviceType: "크리에이티브 커뮤니티",
    description:
      "1:1 레슨·컴프레션 15주 회원이 지원하는 12주 시즌 모임의 활동비예요. 시즌마다 지원을 받아 함께할 분을 정해요.",
    path: "/crew",
    price: 40000,
    billing: "month",
    limitedAvailability: true,
  },
] as const;
