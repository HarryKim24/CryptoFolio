"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ChartClient = dynamic(
  () => import("./ChartSection.client"),
  { ssr: false }
);

const Placeholder = () => (
  <div className="w-full max-w-7xl h-[520px] xs:h-[600px] bg-white/5 rounded-xl flex items-center justify-center text-xs text-neutral-300">
    차트를 준비 중입니다...
  </div>
);

export default function ChartSection() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = requestIdleCallback(() => setReady(true));
    return () => cancelIdleCallback(id);
  }, []);

  return ready ? <ChartClient /> : <Placeholder />;
}