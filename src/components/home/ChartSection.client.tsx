"use client";

import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import CoinDetail from "@/components/chart/CoinDetail";
import ChartDescription from "@/components/home/ChartDescription";

gsap.registerPlugin(ScrollTrigger);

const ChartLoading = () => (
  <div className="w-full h-full flex items-center justify-center text-xs text-neutral-300">
    차트를 불러오는 중...
  </div>
);

const CoinChart = dynamic(
  () => import("@/components/chart/CoinChart"),
  {
    ssr: false,
    loading: ChartLoading,
  }
);

export default function ChartSectionClient() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<HTMLDivElement | null>(null);

  const market = "KRW-BTC";

  const updateScale = useCallback(() => {
    if (!chartRef.current) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const { offsetWidth: cw, offsetHeight: ch } = chartRef.current;

    if (!cw || !ch) return;

    const scale = Math.min(vw / cw, vh / ch);

    gsap.set(chartRef.current, {
      scale,
      transformOrigin: "bottom center",
    });
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !chartRef.current) return;

    updateScale();

    const ctx = gsap.context(() => {
      gsap.to(chartRef.current!, {
        scale: 1,
        y: 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current!,
          start: "top 60%",
          end: "top top",
          scrub: true,
        },
      });
    }, sectionRef);

    const handleResize = () => {
      updateScale();
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ctx.revert();
    };
  }, [updateScale]);

  return (
    <div
      ref={sectionRef}
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
          <CoinChart market={market} />
        </div>
      </div>

      <ChartDescription />
    </div>
  );
}