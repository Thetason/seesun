import { absoluteUrl, SCHEMA_ID } from "@/lib/seo";
import {
  BRAND,
  BUSINESS_LINKS,
  NAVER_PLACE_URL,
  PRODUCTS,
  SITE_URL,
  SMARTPLACE_URL,
  THETASON_LINKS,
  type Product,
} from "@/lib/site";

const ORG_DESCRIPTION =
  "경기 성남시 분당구의 1:1 프리미엄 보컬 트레이닝 스튜디오. 횡격막을 자동화하는 D.A.P.(Diaphragm Automatic Program) 기반 정파 발성으로 평생 무너지지 않는 소리를 만듭니다.";

const EXPERTISE = [
  "보컬 트레이닝",
  "정파 발성",
  "벨칸토",
  "횡격막 호흡",
  "D.A.P.",
  "발성 교정",
];

const AREA_SERVED = [
  { "@type": "AdministrativeArea", name: "성남시 분당구" },
  { "@type": "City", name: "성남시" },
  { "@type": "Place", name: "판교" },
  { "@type": "City", name: "용인시" },
];

function priceSpecification(product: Product) {
  const base = {
    "@type": "UnitPriceSpecification",
    price: product.price,
    priceCurrency: "KRW",
    valueAddedTaxIncluded: true,
    billingIncrement: 1,
    unitCode: "MON",
  };

  if (!product.commitPrice || !product.commitMonths) return base;

  return [
    { ...base, name: "월 단위" },
    {
      ...base,
      name: `${product.commitMonths}개월 정기결제`,
      price: product.commitPrice,
      billingDuration: product.commitMonths,
    },
  ];
}

function toOffer(product: Product) {
  const url = absoluteUrl(product.path);
  const availability = product.limitedAvailability
    ? "https://schema.org/LimitedAvailability"
    : "https://schema.org/InStock";

  return {
    "@type": "Offer",
    "@id": `${SITE_URL}/#offer-${product.id}`,
    name: product.name,
    url,
    availability,
    ...(product.billing === "once"
      ? {
          price: product.price,
          priceCurrency: "KRW",
          valueAddedTaxIncluded: true,
        }
      : { priceSpecification: priceSpecification(product) }),
    itemOffered: {
      "@type": "Service",
      "@id": `${SITE_URL}/#service-${product.id}`,
      name: product.serviceName,
      serviceType: product.serviceType,
      description: product.description,
      url,
      provider: { "@id": SCHEMA_ID.organization },
    },
  };
}

// Organization is intentionally a multi-type node rather than a second entity:
// splitting it would fragment every existing @id reference.
// schema.org has no "MusicSchool" type — EducationalOrganization + LocalBusiness
// is the correct pairing for a local training studio.
//
// Deliberately omitted until the owner confirms real values:
//   geo / streetAddress  — exact address is not published on this site
//   openingHoursSpecification — must match SmartPlace exactly, unknown here
//   telephone — no public number exists on the site
//   aggregateRating — self-serving review markup; Re:cord is linked via sameAs
export const SITE_SCHEMA = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SCHEMA_ID.website,
    name: BRAND.nameKo,
    alternateName: "분당보컬학원 시선뮤직",
    url: SITE_URL,
    inLanguage: "ko-KR",
    publisher: { "@id": SCHEMA_ID.organization },
  },
  {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "LocalBusiness"],
    "@id": SCHEMA_ID.organization,
    name: BRAND.nameKo,
    alternateName: ["분당보컬학원 시선뮤직", "시선뮤직 음악학원", "SEE:SUN MUSIC"],
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/brand/seesun-mark-512.png`,
      width: 512,
      height: 512,
    },
    image: `${SITE_URL}/og-main-v2.png`,
    description: ORG_DESCRIPTION,
    slogan: BRAND.slogan,
    address: {
      "@type": "PostalAddress",
      addressLocality: "성남시 분당구",
      addressRegion: "경기도",
      addressCountry: "KR",
    },
    areaServed: AREA_SERVED,
    priceRange: "₩₩₩",
    currenciesAccepted: "KRW",
    knowsAbout: EXPERTISE,
    hasMap: NAVER_PLACE_URL,
    founder: { "@id": SCHEMA_ID.person },
    employee: { "@id": SCHEMA_ID.person },
    potentialAction: {
      "@type": "ReserveAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: SMARTPLACE_URL,
        inLanguage: "ko-KR",
        actionPlatform: [
          "https://schema.org/DesktopWebPlatform",
          "https://schema.org/MobileWebPlatform",
        ],
      },
      result: { "@type": "Reservation", name: "무료 킥오프 상담" },
    },
    sameAs: [...THETASON_LINKS, ...BUSINESS_LINKS],
    hasOfferCatalog: { "@id": SCHEMA_ID.offerCatalog },
  },
  {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "@id": SCHEMA_ID.offerCatalog,
    name: `${BRAND.nameKo} 멤버십`,
    url: SITE_URL,
    provider: { "@id": SCHEMA_ID.organization },
    itemListElement: PRODUCTS.map(toOffer),
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": SCHEMA_ID.person,
    name: "서영빈",
    alternateName: ["세타쓴", "Thetason"],
    jobTitle: "보컬 트레이너",
    description:
      "정파 벨칸토 계열의 발성 원리를 바탕으로 횡격막 자동화 프로그램 D.A.P.(Diaphragm Automatic Program)를 설계한 보컬 트레이너. 시선뮤직 아티스트클럽을 이끌고 있습니다.",
    url: "https://thetason.com",
    worksFor: { "@id": SCHEMA_ID.organization },
    affiliation: { "@id": SCHEMA_ID.organization },
    knowsLanguage: "ko",
    knowsAbout: EXPERTISE,
    hasOccupation: {
      "@type": "Occupation",
      name: "보컬 트레이너",
      occupationLocation: {
        "@type": "AdministrativeArea",
        name: "성남시 분당구",
      },
    },
    sameAs: [...THETASON_LINKS],
  },
];
