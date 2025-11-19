'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAnimatedNumber } from '@/utils/animatedNumber';

gsap.registerPlugin(ScrollTrigger);

const useUpbitStats = () => {
  const [stats, setStats] = useState({ assetCount: 0, marketCount: 0 });

  useEffect(() => {
    let cancelled = false;

    const fetchMarketData = async () => {
      try {
        const res = await fetch('/api/proxy/market?isDetails=false');
        if (!res.ok) throw new Error(`업비트 API 오류: ${res.status}`);

        const data = await res.json();
        if (!Array.isArray(data) || cancelled) return;

        const markets = data.map((item: { market: string }) => item.market);
        const assets = new Set(markets.map((m: string) => m.split('-')[1]));

        setStats({
          marketCount: markets.length,
          assetCount: assets.size,
        });
      } catch (error) {
        if (!cancelled) console.error('데이터 로드 실패:', error);
      }
    };

    fetchMarketData();
    return () => { cancelled = true; };
  }, []);

  return stats;
};

const MainSection = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { assetCount, marketCount } = useUpbitStats();

  const sectionRef = useRef<HTMLDivElement>(null);
  const statRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(statRef, { amount: 0.5 });

  const animatedAssetCount = useAnimatedNumber(isInView ? assetCount : 0, { duration: 2000, trigger: isInView });
  const animatedMarketCount = useAnimatedNumber(isInView ? marketCount : 0, { duration: 2000, trigger: isInView });

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(sectionRef.current, {
        opacity: 0,
        scale: 5,
        ease: 'power2.out',
        transformOrigin: 'center center',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'center center',
          end: 'bottom top',
          scrub: 0.2,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleMainAction = useCallback(() => {
    router.push(session ? '/portfolio' : '/login');
  }, [router, session]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        ref={sectionRef}
        className="absolute inset-0 max-w-[100vw] flex flex-col items-center justify-center text-center px-4 will-change-[opacity,transform] pointer-events-none"
      >
        <div className="space-y-6 pt-32 pb-48">
          <motion.h1
            initial={{ opacity: 0, scale: 20 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="text-3xl md:text-4xl font-bold leading-tight"
          >
            사용자 중심 암호화폐 자산 포트폴리오 플랫폼
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 1 }}
            className="text-neutral-300 text-sm md:text-lg"
          >
            암호화폐 가격을 실시간으로 조회하고,
            <br className="hidden md:block" /> 트렌드를 분석하여 나만의 맞춤형 포트폴리오를 만들어보세요.
          </motion.p>

          <motion.div
            ref={statRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1, ease: 'easeOut' }}
            className="flex items-center justify-center gap-2 xs:gap-20 mt-12"
          >
            <StatItem count={animatedAssetCount} label="Digital Assets" />
            <StatItem count={animatedMarketCount} label="Markets" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1, ease: 'easeOut' }}
            className="flex flex-col xs:flex-row items-center justify-center gap-4 mt-12"
          >
            <ActionButton onClick={() => router.push('/chart/KRW-BTC')}>차트 확인하기</ActionButton>
            <ActionButton onClick={handleMainAction}>{session ? '내 포트폴리오' : '로그인'}</ActionButton>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ count, label }: { count: string | number; label: string }) => (
  <div>
    <p className="text-4xl md:text-5xl font-bold">{count}</p>
    <p className="text-sm text-neutral-300 min-w-[90px]">{label}</p>
  </div>
);

const ActionButton = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className="bg-white/20 shadow hover:brightness-150 min-w-[188px] text-neutral-100 text-2xl font-semibold py-2 px-6 rounded transition pointer-events-auto"
  >
    {children}
  </button>
);

export default MainSection;