'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

const HOVER_LINE_CLASS = 'relative after:absolute after:left-0 after:bottom-[-2px] after:w-full after:h-[1px] after:bg-current after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left';

const Footer = () => {
  const { data: session, status } = useSession();
  const isSessionLoading = status === 'loading';

  const footerLinks = [
    { href: '/', label: '홈' },
    { href: '/chart/KRW-BTC', label: '차트' },
    { href: '/trends', label: '트렌드' },
    { href: '/portfolio', label: '포트폴리오' },
    { href: '/settings', label: '설정' },
  ];

  return (
    <footer className="text-gray-300 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <nav className="text-neutral-100 grid grid-cols-3 md:grid-cols-6 gap-4 text-center text-sm sm:text-base">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <span className={HOVER_LINE_CLASS}>{link.label}</span>
            </Link>
          ))}

          {session ? (
            <button
              onClick={() => !isSessionLoading && signOut()}
              disabled={isSessionLoading}
              className={`${HOVER_LINE_CLASS} disabled:opacity-50`}
            >
              로그아웃
            </button>
          ) : (
            <Link href="/login">
              <span className={HOVER_LINE_CLASS}>로그인</span>
            </Link>
          )}
        </nav>

        <div className="space-y-2 text-xs sm:text-sm">
          <p className="text-center">© 2025 CryptoFolio. All rights reserved.</p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-6">
            <a href="mailto:tl9434@naver.com" className={HOVER_LINE_CLASS}>
              Contact: tl9434@naver.com
            </a>
            <a
              href="https://github.com/HarryKim24/CryptoFolio"
              target="_blank"
              rel="noopener noreferrer"
              className={HOVER_LINE_CLASS}
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