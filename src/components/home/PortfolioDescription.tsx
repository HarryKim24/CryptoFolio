'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type MatchMediaConditions = {
  isMobile?: boolean;
  isDesktop?: boolean;
};

function PortfolioDescription() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isMobile: '(max-width: 767px)',
        isDesktop: '(min-width: 768px)',
      },
      (context) => {
        const conditions = context.conditions as MatchMediaConditions | null;
        const isMobile = conditions?.isMobile ?? false;

        const fromY = isMobile ? 240 : 80;
        const toY = isMobile ? 160 : -80;

        const element = ref.current;
        if (!element) return;

        gsap.fromTo(
          element,
          { opacity: 0, y: fromY },
          {
            opacity: 1,
            y: toY,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    );

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <div
      ref={ref}
      className="z-100 px-4 text-neutral-100 text-5xl font-bold pt-6 text-left tracking-tight leading-snug"
    >
      <div className="flex flex-col items-start space-y-3">
        <span className="whitespace-nowrap">나만의 전략으로</span>
        <span className="whitespace-nowrap">완성해가는</span>
        <Link
          href="/portfolio"
          className="text-portfolio brightness-200 whitespace-nowrap cursor-pointer hover:brightness-150 transition-all"
        >
          포트폴리오
        </Link>
      </div>
    </div>
  );
}

export default PortfolioDescription;