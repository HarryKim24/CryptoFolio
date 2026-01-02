"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useInView } from "react-intersection-observer";

const TrendSectionClient = dynamic(
  () => import("./TrendSection.client"),
  { ssr: false }
);

const Placeholder = () => (
  <div className="w-full min-h-[400px] flex items-center justify-center text-xs text-neutral-300">
    트렌드 데이터를 불러오는 중...
  </div>
);

export default function TrendSection() {
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
      {ready ? <TrendSectionClient /> : <Placeholder />}
    </section>
  );
}