import type { Metadata } from "next";
import { Fraunces, Noto_Serif_KR } from "next/font/google";
import "./globals.css";
import "../styles/styles.css";
import SmoothScroll from "@/components/SmoothScroll";
import AuthProvider from "@/components/AuthProvider";
import SiteAnalyticsTracker from "@/components/SiteAnalyticsTracker";
import ServerPageViewTracker from "@/components/ServerPageViewTracker";
import StickyDiagnosisCTA from "@/components/marketing/StickyDiagnosisCTA";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://seesun-delta.vercel.app"),
  title: "시선뮤직 아티스트클럽 | Everlasting Change",
  description: "쉽게 얻는 건 팔지 않습니다. 평생 무너지지 않는 소리를 만드는 정파 발성 트레이닝, 시선뮤직 아티스트클럽.",
  openGraph: {
    title: "시선뮤직 아티스트클럽 | Everlasting Change",
    description: "쉽게 얻는 건 팔지 않습니다. 평생 무너지지 않는 소리를 만드는 정파 발성 트레이닝, 시선뮤직 아티스트클럽.",
    images: ["/og-main-v2.png"],
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "시선뮤직 아티스트클럽 | Everlasting Change",
    description: "쉽게 얻는 건 팔지 않습니다. 평생 무너지지 않는 소리를 만드는 정파 발성 트레이닝, 시선뮤직 아티스트클럽.",
    images: ["/og-main-v2.png"],
  },
  icons: {
    icon: "/brand/seesun-mark-512.png",
    apple: "/brand/seesun-mark-512.png",
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
