import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/nav/Navbar";
import SessionClientLayout from "@/components/session/SessionClientLayout";

export const metadata: Metadata = {
  title: "CryptoFolio",
  description:
    "CryptoFolio는 실시간 암호화폐 시세 확인, 포트폴리오 관리, 차트 조회 기능을 제공하는 웹 애플리케이션입니다.",
  authors: [{ name: "CryptoFolio Team" }],
  creator: "CryptoFolio",
  openGraph: {
    title: "CryptoFolio | 실시간 암호화폐 포트폴리오",
    description: "실시간 코인 시세 확인 및 포트폴리오 관리까지 한 곳에서!",
    url: "https://your-domain.com",
    siteName: "CryptoFolio",
    locale: "ko_KR",
    type: "website",
  },
  metadataBase: new URL("https://your-domain.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className="bg-gradient-to-b from-[#0d0d0d] to-[#1a1a1a] text-white">
        <SessionClientLayout>
          <Navbar />
          <main className="pt-16 px-4">{children}</main>
        </SessionClientLayout>
      </body>
    </html>
  );
}