// Paste the Naver SmartPlace booking URL between the quotes once it is issued.
// Example: "https://booking.naver.com/booking/13/bizes/1234567"
// Every CTA on the site reads from this single value.
const SMARTPLACE_BOOKING_URL = "";

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
