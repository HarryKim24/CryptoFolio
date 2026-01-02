"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAnimatedNumber } from "@/utils/animatedNumber";

gsap.registerPlugin(ScrollTrigger);

const useUpbitStats = () => {
  const [stats, setStats] = useState({ assetCount: 0, marketCount: 0 });

  useEffect(() => {
    let cancelled = false;

    const fetchMarketData = async () => {
      try {
        const res = await fetch("/api/proxy/market?isDetails=false");
        if (!res.ok) throw new Error(`업비트 API 오류: ${res.status}`);

        const data = await res.json();
        if (!Array.isArray(data) || cancelled) return;

        const markets = data.map((item: { market: string }) => item.market);
        const assets = new Set(markets.map((m: string) => m.split("-")[1]));

        setStats({
          marketCount: markets.length,
          assetCount: assets.size,
        });
      } catch (error) {
        if (!cancelled) console.error("데이터 로드 실패:", error);
      }
    };

    fetchMarketData();
    return () => {
      cancelled = true;
    };
  }, []);

  return stats;
};

type StatItemProps = {
  count: string | number;
  label: string;
};

function StatItem({ count, label }: StatItemProps) {
  return (
    <div>
      <p className="text-4xl md:text-5xl font-bold">{count}</p>
      <p className="text-sm text-neutral-300 min-w-[90px]">{label}</p>
    </div>
  );
}

type ActionButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
};

function ActionButton({ onClick, children }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-white/20 shadow hover:brightness-150 min-w-[188px] text-neutral-100 text-2xl font-semibold py-2 px-6 rounded transition pointer-events-auto"
    >
      {children}
    </button>
  );
}

function MainSection() {
  const router = useRouter();
  const { data: session } = useSession();
  const { assetCount, marketCount } = useUpbitStats();

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const statRef = useRef<HTMLDivElement | null>(null);

  const isInView = useInView(statRef, { amount: 0.6 });

  const animatedAssetCount = useAnimatedNumber(isInView ? assetCount : 0, {
    duration: 2000,
    trigger: isInView,
  });

  const animatedMarketCount = useAnimatedNumber(isInView ? marketCount : 0, {
    duration: 2000,
    trigger: isInView,
  });

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "center center",
        end: "bottom top",
        onUpdate: (self) => {
          const p = self.progress;
          gsap.set(el, {
            opacity: 1 - p,
            scale: 1 + p * 4,
            transformOrigin: "center center",
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const mainTitleMotion = useMemo(
    () => ({
      initial: { opacity: 0, scale: 6 },
      animate: { opacity: 1, scale: 1 },
      transition: {
        duration: 0.9,
        ease: "easeOut" as const,
      },
    }),
    []
  );

  const subTextMotion = useMemo(
    () => ({
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: {
        duration: 0.8,
        delay: 0.6,
        ease: "easeOut" as const,
      },
    }),
    []
  );

  const statMotion = useMemo(
    () => ({
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: {
        duration: 0.7,
        delay: 0.8,
        ease: "easeOut" as const,
      },
    }),
    []
  );

  const buttonMotion = useMemo(
    () => ({
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      transition: {
        duration: 0.7,
        delay: 0.9,
        ease: "easeOut" as const,
      },
    }),
    []
  );

  function handleMainAction() {
    router.push(session ? "/portfolio" : "/login");
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        ref={sectionRef}
        className="absolute inset-0 max-w-[100vw] flex flex-col items-center justify-center text-center px-4 will-change-[opacity,transform] pointer-events-none"
      >
        <div className="space-y-6 pt-32 pb-48">
          <motion.h1
            {...mainTitleMotion}
            className="text-3xl md:text-4xl font-bold leading-tight"
          >
            사용자 중심 암호화폐 자산 포트폴리오 플랫폼
          </motion.h1>

          <motion.p
            {...subTextMotion}
            className="text-neutral-300 text-sm md:text-lg"
          >
            암호화폐 가격을 실시간으로 조회하고,
            <br className="hidden md:block" />
            트렌드를 분석하여 나만의 맞춤형 포트폴리오를 만들어보세요.
          </motion.p>

          <motion.div
            ref={statRef}
            {...statMotion}
            className="flex items-center justify-center gap-2 xs:gap-20 mt-12"
          >
            <StatItem count={animatedAssetCount} label="Digital Assets" />
            <StatItem count={animatedMarketCount} label="Markets" />
          </motion.div>

          <motion.div
            {...buttonMotion}
            className="flex flex-col xs:flex-row items-center justify-center gap-4 mt-12"
          >
            <ActionButton onClick={() => router.push("/chart/KRW-BTC")}>
              차트 확인하기
            </ActionButton>
            <ActionButton onClick={handleMainAction}>
              {session ? "내 포트폴리오" : "로그인"}
            </ActionButton>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default MainSection;