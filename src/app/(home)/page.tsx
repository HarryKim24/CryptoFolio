'use client';

import { Suspense } from "react";
import dynamic from "next/dynamic";
import UpbitTickerController from "@/components/UpbitTickerController";

const MainSection = dynamic(() => import("@/components/home/MainSection"), {
  ssr: true,
});
const ChartSection = dynamic(() => import("@/components/home/ChartSection"), {
  ssr: true,
});
const TrendSection = dynamic(() => import("@/components/home/TrendSection"), {
  ssr: true,
});
const PortfolioSection = dynamic(() => import("@/components/home/PortfolioSection"), {
  ssr: true,
});
const Footer = dynamic(() => import("@/components/home/Footer"), {
  ssr: true,
});

const HomePage = () => {
  return (
    <>
      <UpbitTickerController />
      <div>
        <section className="panel h-screen flex items-center justify-center">
          <Suspense fallback={null}>
            <MainSection />
          </Suspense>
        </section>

        <section className="h-96" />

        <section className="panel h-screen flex flex-col items-center justify-center">
          <Suspense fallback={null}>
            <ChartSection />
          </Suspense>
        </section>

        <section className="h-32" />

        <section className="panel h-screen flex flex-col items-center justify-center">
          <Suspense fallback={null}>
            <TrendSection />
          </Suspense>
        </section>

        <section className="h-32" />

        <section className="panel h-screen flex items-center justify-center">
          <Suspense fallback={null}>
            <PortfolioSection />
          </Suspense>
        </section>

        <section className="panel flex flex-col items-center justify-center">
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </section>
      </div>
    </>
  );
};

export default HomePage;