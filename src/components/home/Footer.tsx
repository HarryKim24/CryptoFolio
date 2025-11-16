'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

const Footer = () => {
  const { data: session, status } = useSession();
  const isSessionLoading = status === 'loading';

  const hoverLine =
    'relative after:absolute after:left-0 after:bottom-[-2px] after:w-full after:h-[1px] after:bg-current after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left';

  return (
    <footer className="text-gray-300 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <nav className="text-neutral-100 grid grid-cols-3 md:grid-cols-6 gap-4 text-center text-sm sm:text-base">
          <Link href="/"><span className={hoverLine}>홈</span></Link>
          <Link href="/chart/KRW-BTC"><span className={hoverLine}>차트</span></Link>
          <Link href="/trends"><span className={hoverLine}>트렌드</span></Link>
          <Link href="/portfolio"><span className={hoverLine}>포트폴리오</span></Link>
          <Link href="/settings"><span className={hoverLine}>설정</span></Link>

          {session ? (
            <button
              onClick={() => !isSessionLoading && signOut()}
              disabled={isSessionLoading}
              className={`${hoverLine} disabled:opacity-50`}
            >
              로그아웃
            </button>
          ) : (
            <Link href="/login"><span className={hoverLine}>로그인</span></Link>
          )}
        </nav>

        <div className="space-y-2 text-xs sm:text-sm">
          <p className="text-center">© 2025 CryptoFolio. All rights reserved.</p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-6">
            <a href="mailto:tl9434@naver.com" className={hoverLine}>
              Contact: tl9434@naver.com
            </a>
            <a
              href="https://github.com/HarryKim24/CryptoFolio"
              target="_blank"
              rel="noopener noreferrer"
              className={hoverLine}
            >
              GitHub: github.com/HarryKim24/CryptoFolio
            </a>
          </div>

          <p className="text-center text-gray-300">
            실시간 암호화폐 시세 (업비트 API 제공) · 환율 데이터 (freecurrencyapi.com)
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;