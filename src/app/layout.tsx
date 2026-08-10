import type { Metadata } from "next";
import { Fraunces, Noto_Serif_KR } from "next/font/google";
import "./globals.css";
import "../styles/styles.css";
import SmoothScroll from "@/components/SmoothScroll";
import AuthProvider from "@/components/AuthProvider";
import SiteAnalyticsTracker from "@/components/SiteAnalyticsTracker";
import ServerPageViewTracker from "@/components/ServerPageViewTracker";
import StickyDiagnosisCTA from "@/components/marketing/StickyDiagnosisCTA";
import Script from "next/script";
import { BRAND, NAVER_WCS_ID, SITE_URL } from "@/lib/site";
import { OG_IMAGE } from "@/lib/seo";
import { SITE_SCHEMA } from "@/lib/site-schema";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-fraunces",
  display: "swap",
});

const notoSerifKr = Noto_Serif_KR({
  weight: ["400", "500", "600"],
  variable: "--font-noto-serif-kr",
  display: "swap",
  preload: false,
});

const SITE_TITLE = "시선뮤직 아티스트클럽 | 분당 보컬학원·보컬레슨·보컬트레이닝";
const SITE_DESCRIPTION =
  "분당 보컬학원 시선뮤직 아티스트클럽. 성남시 분당구 보컬레슨·보컬트레이닝·실용음악 전문. 평생 무너지지 않는 소리를 만드는 정파 발성, 세타쓴(서영빈) 원장 직강.";

const naverVerification =
  process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION ??
  "3ec69fdc8c21eca1636c82a2b0c8bae9cc2d3b53";
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${BRAND.nameKo}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "분당보컬학원",
    "분당보컬레슨",
    "분당실용음악학원",
    "성남보컬학원",
    "판교보컬학원",
    "보컬트레이닝",
    "보컬트레이너",
    "시선뮤직",
    "세타쓴",
  ],
  // No `alternates.canonical` here on purpose. Root metadata is inherited by
  // every segment, so a canonical declared at this level made all sub-pages
  // announce themselves as copies of the home page. Each page owns its own
  // canonical via buildMetadata() in src/lib/seo.ts.
  robots: {
    index: true,
    follow: true,
  },
  // Fallback share card only. openGraph is replaced wholesale (not merged) by
  // any page that declares it, so pages must emit their own complete block.
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: BRAND.nameKo,
    images: [OG_IMAGE],
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  icons: {
    icon: "/brand/seesun-mark-512.png",
    apple: "/brand/seesun-mark-512.png",
  },
  verification: {
    ...(googleVerification ? { google: googleVerification } : {}),
    ...(naverVerification
      ? { other: { "naver-site-verification": naverVerification } }
      : {}),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${fraunces.variable} ${notoSerifKr.variable}`}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_SCHEMA) }}
        />
        {/* Naver Analytics — inject via onload so wcs_do() never races wcslog.js */}
        <Script id="naver-wcs" strategy="afterInteractive">
          {`(function(){var s=document.createElement("script");s.src="https://wcs.pstatic.net/wcslog.js";s.onload=function(){if(!window.wcs_add)window.wcs_add={};window.wcs_add["wa"]="${NAVER_WCS_ID}";if(window.wcs)wcs_do();};document.head.appendChild(s);})();`}
        </Script>
        <ServerPageViewTracker />
        <AuthProvider>
          <SiteAnalyticsTracker />
          <StickyDiagnosisCTA />
          <SmoothScroll>{children}</SmoothScroll>
        </AuthProvider>
      </body>
    </html>
  );
}
