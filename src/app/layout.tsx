import type { Metadata } from "next";
import "./globals.css";
import "../styles/styles.css";
import SmoothScroll from "@/components/SmoothScroll";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "시선뮤직 | 당신의 목소리가 예술이 되는 순간",
  description: "발성 기술을 넘어, 당신만의 고유한 음색과 무대 위 압도적인 존재감을 디자인합니다.",
  openGraph: {
    title: "시선뮤직 | 당신의 목소리가 예술이 되는 순간",
    description: "발성 기술을 넘어, 당신만의 고유한 음색과 무대 위 압도적인 존재감을 디자인합니다.",
    images: [
      {
        url: "/og-preview.png",
        width: 1200,
        height: 630,
        alt: "시선뮤직",
      },
    ],
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "시선뮤직 | 당신의 목소리가 예술이 되는 순간",
    description: "발성 기술을 넘어, 당신만의 고유한 음색과 무대 위 압도적인 존재감을 디자인합니다.",
    images: ["/og-preview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <AuthProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </AuthProvider>
      </body>
    </html>
  );
}
