"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useInView } from "react-intersection-observer";

import TrendDescription from "@/components/home/TrendDescription";
import { useAnimatedNumber } from "@/utils/animatedNumber";
import { useTrendData } from "@/hooks/useTrendData";
import VolumeDisplay from "@/components/home/VolumeDisplay";
import CoinListCard from "@/components/home/CoinListCard";

gsap.registerPlugin(ScrollTrigger);

export default function TrendSectionClient() {
  const { ubmiValue, ubaiValue, topRise, topFall } = useTrendData();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);

  const { ref: inViewRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  const animatedUBMV = useAnimatedNumber(
    inView ? ubmiValue : 0,
    { duration: 2000, trigger: inView }
  );

  const animatedUBAV = useAnimatedNumber(
    inView ? ubaiValue : 0,
    { duration: 2000, trigger: inView }
  );

  useEffect(() => {
    const container = containerRef.current;
    const left = leftRef.current;

    if (!container || !left) return;
    if (window.innerWidth < 768) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        left,
        { y: 160 },
        {
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "center bottom",
            end: "center top",
            scrub: true,
          },
        }
      );
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="text-center space-y-10 px-6">
      <div ref={inViewRef} className="flex flex-col justify-center items-stretch px-6 md:px-0">
        <TrendDescription />

        <div className="flex flex-col md:flex-row gap-6 md:gap-12 mt-6 md:mt-0">
          <div
            ref={leftRef}
            className="flex-1 bg-white/5 rounded-xl px-6 py-6 shadow flex flex-col gap-4 justify-center md:max-h-[300px]"
          >
            <h2 className="text-2xl font-bold text-neutral-100 mb-8">
              디지털 자산 거래규모
            </h2>

            <div className="space-y-6">
              <VolumeDisplay label="Market 거래규모" value={animatedUBMV} />
              <VolumeDisplay label="Altcoin 거래규모" value={animatedUBAV} />
            </div>
          </div>

          <div className="flex-1 grid sm:grid-cols-2 gap-6 md:gap-12">
            <CoinListCard title="오늘의 급등 Top 5" coins={topRise} isRise />
            <CoinListCard title="오늘의 급락 Top 5" coins={topFall} isRise={false} />
          </div>
        </div>
      </div>
    </div>
  );
}