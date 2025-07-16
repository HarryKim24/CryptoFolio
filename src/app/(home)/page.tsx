'use client'

import ChartSection from "@/components/home/ChartSection";
import MainSection from "@/components/home/MainSection";
import PortfolioSection from "@/components/home/PortfolioSection";
import TrendSection from "@/components/home/TrendSection";
import { UpbitTickerProvider } from "@/context/UpbitTickerContext";
import Footer from "@/components/home/Footer";

export default function HomePage() {
  return (
    <UpbitTickerProvider>
      <div>
        <section className="panel h-[120vh] flex items-center justify-center">
          <MainSection />
        </section>
        <section className="panel h-[200vh] md:h-[150vh] flex flex-col items-center justify-center">
          <ChartSection />
        </section>

        <section className="panel h-screen flex flex-col items-center justify-center">
          <TrendSection />
        </section>
        <section className="panel h-[150vh] md:h-screen flex items-center justify-center">
          <PortfolioSection />
        </section>
        <section className="panel h-[20vh] flex flex-col items-center justify-center">
          <Footer />
        </section>
      </div>
    </UpbitTickerProvider>
  );
}