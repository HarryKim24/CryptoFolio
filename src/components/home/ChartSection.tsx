'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';
import CoinDetail from '@/components/chart/CoinDetail';
import ChartDescription from '@/components/home/ChartDescription';

gsap.registerPlugin(ScrollTrigger);

const ChartLoading = () => (
  <div className="w-full h-full flex items-center justify-center text-white text-xs px-4 py-2">
    차트를 불러오는 중...
  </div>
);

const CoinChart = dynamic(() => import('@/components/chart/CoinChart'), {
  ssr: false,
  loading: ChartLoading,
});

function ChartSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<HTMLDivElement | null>(null);
  const [showChart, setShowChart] = useState(false);

  const market = 'KRW-BTC';

  const updateScale = useCallback(() => {
    const chartEl = chartRef.current;
    if (!chartEl) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cw = chartEl.offsetWidth;
    const ch = chartEl.offsetHeight;

    if (!cw || !ch) return;

    const scale = Math.min(vw / cw, vh / ch);

    gsap.set(chartEl, {
      scale,
      transformOrigin: 'bottom center',
    });
  }, []);

  useEffect(() => {
    if (!chartRef.current || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      updateScale();

      gsap.to(chartRef.current, {
        scale: 1,
        y: 0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          end: 'top top',
          scrub: true,
        },
      });
    }, sectionRef);

    const handleResize = () => {
      updateScale();
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    const timerId = window.setTimeout(() => setShowChart(true), 500);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.clearTimeout(timerId);
      ctx.revert();
    };
  }, [updateScale]);

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
          isMobile={false}
          view="chart"
          onToggleView={() => {}}
        />
        <div className="flex-1 relative min-h-0">
          {showChart ? <CoinChart market={market} /> : <ChartLoading />}
        </div>
      </div>

      <ChartDescription />
    </motion.div>
  );
}

export default ChartSection;