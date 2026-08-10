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
  "https://www.instagram.com/thetason_/",
  "https://www.youtube.com/@thetasonwillcreate",
] as const;

// Naver SmartPlace entry (place ID 2024719184) — the business entity profile,
// as opposed to THETASON_LINKS which are the coach's personal channels.
export const NAVER_PLACE_URL = "https://m.place.naver.com/place/2024719184";

// Third-party review profile. Linked via sameAs only — never marked up as
// aggregateRating on our own domain (self-serving review, Google-disallowed).
export const RECORD_REVIEWS_URL = "https://recordyours.com/syb2020";

// Business-entity profiles. Organization schema merges these with THETASON_LINKS;
// the Person node uses THETASON_LINKS alone.
export const BUSINESS_LINKS = [NAVER_PLACE_URL, RECORD_REVIEWS_URL] as const;

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
    name: "데일리 구독",
    serviceName: "데일리 — 매일 AI 루틴 + 주 1회 코치 피드백",
    serviceType: "보컬 트레이닝 구독",
    description:
      "매일 아침 10분 보컬 루틴을 AI가 교정하고, 주 1회 코치가 한 주치 기록을 직접 듣고 진단합니다.",
    path: "/spark",
    price: 120000,
    billing: "month",
  },
  {
    id: "daily-feedback",
    name: "데일리 피드백 멤버십",
    serviceName: "데일리 피드백 멤버십 — 1일 1회 코치 피드백",
    serviceType: "보컬 트레이닝 구독",
    description:
      "데일리 구성에 더해 영업일 기준 1일 1회 코치 피드백을 받습니다.",
    path: "/spark",
    price: 200000,
    billing: "month",
  },
  {
    id: "signature",
    name: "시선 시그니처 멤버십",
    serviceName: "시선 시그니처 — 주 1회 50분 1:1 보컬 트레이닝",
    serviceType: "1:1 보컬 트레이닝",
    description:
      "횡격막을 자동화하는 D.A.P.(Diaphragm Automatic Program) 기반 1:1 트레이닝. 주 1회 50분, 코치 피드백과 기록 아카이브가 함께 갑니다.",
    path: "/signature",
    price: 440000,
    billing: "month",
    commitPrice: 420000,
    commitMonths: 3,
  },
  {
    id: "crew",
    name: "아티스트웨이 크루 회비",
    serviceName: "아티스트웨이 크루 — 시즌제 크리에이티브 클럽",
    serviceType: "크리에이티브 커뮤니티",
    description:
      "멤버십에 더해지는 크루 활동 회비입니다. 시즌마다 지원과 선발로 합류합니다.",
    path: "/crew",
    price: 40000,
    billing: "month",
    limitedAvailability: true,
  },
  {
    id: "master-protocol",
    name: "15주 마스터 프로토콜",
    serviceName: "15주 마스터 프로토콜 — 프라이빗 보컬 집중 과정",
    serviceType: "1:1 보컬 트레이닝",
    description:
      "사람들 앞에서 한 곡을 실제로 해내는 상태까지. 프라이빗 트레이닝과 실전 세션, 졸업공연으로 완성하는 15주 프로그램입니다.",
    path: "/reserve",
    price: 3800000,
    billing: "once",
    limitedAvailability: true,
  },
] as const;
