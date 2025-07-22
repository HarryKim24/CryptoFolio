'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CoinDetail from '@/components/chart/CoinDetail';
import ChartDescription from '@/components/home/ChartDescription';
import dynamic from 'next/dynamic';

gsap.registerPlugin(ScrollTrigger);

const CoinChart = dynamic(() => import('@/components/chart/CoinChartWrapper'), {
  ssr: false,
  loading: () => (
    <div className="text-white text-sm px-4 py-2 h-full flex items-center justify-center">
      차트를 불러오는 중...
    </div>
  ),
});

const ChartSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const [showChart, setShowChart] = useState(false);

  const market = 'KRW-BTC';
  const isMobile = false;
  const view = 'chart';

  useEffect(() => {
    const chartEl = chartRef.current;
    const sectionEl = sectionRef.current;
    if (!chartEl || !sectionEl) return;

    const updateScale = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const cw = chartEl.offsetWidth;
      const ch = chartEl.offsetHeight;

      const scaleX = vw / cw;
      const scaleY = vh / ch;
      const scale = Math.min(scaleX, scaleY);

      gsap.set(chartEl, {
        scale,
        transformOrigin: 'bottom center',
      });

      gsap.to(chartEl, {
        scale: 1,
        y: 0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top 60%',
          end: 'top top',
          scrub: true,
        },
      });
    };

    requestAnimationFrame(() => {
      setTimeout(() => {
        updateScale();

        setTimeout(() => setShowChart(true), 1000);
      }, 32);
    });

    window.addEventListener('resize', updateScale);

    return () => {
      window.removeEventListener('resize', updateScale);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="w-full p-8 md:p-20 lg:p-40 min-w-[320px] flex flex-col items-center justify-start gap-12"
    >
      <div
        ref={chartRef}
        className="w-full max-w-7xl h-[520px] xs:h-[600px] text-sm flex flex-col bg-white/5 rounded-xl shadow overflow-visible"
      >
        <CoinDetail
          market={market}
          isMobile={isMobile}
          view={view}
          onToggleView={() => {}}
          isChartSection={true}
        />

        <div className="flex-1 relative min-h-0">
          {showChart ? (
            <CoinChart market={market} disableZoom />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-xs">
              차트를 준비 중입니다...
            </div>
          )}
        </div>
      </div>

      <ChartDescription />
    </motion.div>
  );
};

export default ChartSection;