"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useInView } from "react-intersection-observer";

const PortfolioSectionClient = dynamic(
  () => import("./PortfolioSection.client"),
  { ssr: false }
);

const Placeholder = () => (
  <div className="w-full min-h-[300px] flex items-center justify-center text-xs text-neutral-300">
    포트폴리오 차트를 불러오는 중...
  </div>
);

export default function PortfolioSection() {
  const [ready, setReady] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "600px",
  });

  useEffect(() => {
    if (!inView) return;

    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(() => setReady(true));
      return () => cancelIdleCallback(id);
    } else {
      const id = setTimeout(() => setReady(true), 300);
      return () => clearTimeout(id);
    }
  }, [inView]);

  return (
    <section ref={ref}>
      {ready ? <PortfolioSectionClient /> : <Placeholder />}
    </section>
  );
}