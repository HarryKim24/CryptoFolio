'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

const Footer = () => {
  const { data: session, status } = useSession();
  const isSessionLoading = status === 'loading';

  return (
    <footer className="text-gray-300 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-6 gap-6 flex flex-col justify-between items-center">
        <div className="grid grid-cols-3 xs:grid-cols-6 gap-2 xs:gap-6 text-sm sm:text-base text-center w-full">
          <Link href="/"><span className="hover:underline">홈</span></Link>
          <Link href="/trends"><span className="hover:underline">트렌드</span></Link>
          <Link href="/chart/BTC"><span className="hover:underline">차트</span></Link>
          <Link href="/portfolio"><span className="hover:underline">포트폴리오</span></Link>
          <Link href="/settings"><span className="hover:underline">설정</span></Link>
          {session ? (
            <button
              onClick={() => !isSessionLoading && signOut()}
              disabled={isSessionLoading}
              className="hover:underline disabled:opacity-50"
            >
              로그아웃
            </button>
          ) : (
            <Link href="/login"><span className="hover:underline">로그인</span></Link>
          )}
        </div>
        <div className="text-center mb-4">
          <p className="text-sm mb-2">© 2025 CryptoFolio. All rights reserved.</p>
          <div className="text-xs mt-1 md:flex md:justify-center md:gap-6">
            <p>
              Contact | <a href="mailto:tl9434@naver.com" className="hover:underline">tl9434@naver.com</a>
            </p>
            <p>
              GitHub | <a href="https://github.com/HarryKim24/CryptoFolio" className="hover:underline">github.com/HarryKim24/CryptoFolio</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;