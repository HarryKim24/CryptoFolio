'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ChartDescription = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      const element = ref.current;
      if (!element) return;

      gsap.fromTo(
        element,
        { y: 0, opacity: 0 },
        {
          y: -200,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="px-4 text-white text-5xl font-bold py-6 text-left tracking-tight leading-snug"
    >
      <div className="flex flex-col items-start space-y-3">
        <span>실시간으로</span>
        <div className="flex flex-col space-y-3">
          <span>확인할 수 있는</span>
          <Link
            href="/chart/KRW-BTC"
            className="text-chart brightness-200 whitespace-nowrap cursor-pointer hover:brightness-150 transition-all"
          >
            차트
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChartDescription;