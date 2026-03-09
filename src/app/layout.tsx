import type { Metadata } from "next";
import "./globals.css";
import "../styles/styles.css";
import SmoothScroll from "@/components/SmoothScroll";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "시선뮤직 | 완벽한 무대와 생존을 위한 여정",
  description: "내 진짜 목소리를 찾는 단 1개월의 여정. 누구나 부담 없이 시작할 수 있는 맞춤형 스튜디오.",
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
