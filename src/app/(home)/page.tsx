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
        <section className="panel h-screen flex items-center justify-center">
          <MainSection />
        </section>

        <section className="h-96" />

        <section className="panel h-screen flex flex-col items-center justify-center">
          <ChartSection />
        </section>

        <section className="h-32" />

        <section className="panel h-screen flex flex-col items-center justify-center">
          <TrendSection />
        </section>

        <section className="h-32" />

        <section className="panel h-screen flex items-center justify-center">
          <PortfolioSection />
        </section>

        <section className="panel flex flex-col items-center justify-center">
          <Footer />
        </section>
      </div>
    </UpbitTickerProvider>
  );
}