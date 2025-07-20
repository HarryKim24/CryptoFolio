/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/nav/Navbar";
import SessionClientLayout from "@/components/session/SessionClientLayout";

export const metadata: Metadata = {
  title: "CryptoFolio",
  description:
    "CryptoFolio는 차트 조회, 트렌드 분석, 포트폴리오 만들기 제공하는 웹 사이트입니다.",
  openGraph: {
    title: "CryptoFolio | 실시간 암호화폐 포트폴리오",
    description:
      "암호화폐 가격을 실시간으로 조회하고, 트렌드를 분석하여 나만의 맞춤형 포트폴리오를 만들어보세요.",
    url: "https://crypto-folio-harrykim24.vercel.app/",
    siteName: "CryptoFolio",
    locale: "ko_KR",
    type: "website",
  },
  metadataBase: new URL("https://crypto-folio-harrykim24.vercel.app/"),
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SessionClientLayout>
          <Navbar />
          <main>{children}</main>
        </SessionClientLayout>
      </body>
    </html>
  );
}