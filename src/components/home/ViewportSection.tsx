"use client";

import dynamic from "next/dynamic";
import { useInView } from "react-intersection-observer";

const SectionSkeleton = ({ heightClass }: { heightClass: string }) => (
  <div className={`w-full ${heightClass} flex items-center justify-center`}>
    <div className="text-neutral-100 text-md animate-pulse">로딩중...</div>
  </div>
);

const ChartSection = dynamic(
  () => import("@/components/home/ChartSection"),
  { ssr: false }
);

const TrendSection = dynamic(
  () => import("@/components/home/TrendSection"),
  { ssr: false }
);

const PortfolioSection = dynamic(
  () => import("@/components/home/PortfolioSection"),
  { ssr: false }
);

type SectionType = "chart" | "trend" | "portfolio";

const SectionMap = {
  chart: ChartSection,
  trend: TrendSection,
  portfolio: PortfolioSection,
};

export default function ViewportSection({
  type,
  skeletonHeight,
}: {
  type: SectionType;
  skeletonHeight: string;
}) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: "600px",
  });

  const SectionComponent = SectionMap[type];

  return (
    <section
      ref={ref}
      className="panel h-screen flex items-center justify-center"
    >
      {inView ? (
        <SectionComponent />
      ) : (
        <SectionSkeleton heightClass={skeletonHeight} />
      )}
    </section>
  );
}