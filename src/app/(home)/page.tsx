import ChartSection from "@/components/home/ChartSection";
import DescriptSection from "@/components/home/DescriptSection";
import MainSection from "@/components/home/MainSection";
import PortfolioSection from "@/components/home/PortfolioSection";
import TrendSection from "@/components/home/TrendSection";
import { UpbitTickerProvider } from "@/context/UpbitTickerContext"; // ✅ 추가

export default function HomePage() {
  return (
    <UpbitTickerProvider>
      <div>
        <section className="panel h-screen flex items-center justify-center">
          <MainSection />
        </section>
        <section className="panel h-[200vh] md:h-[150vh] flex flex-col items-center justify-center">
          <ChartSection />
          <DescriptSection />
        </section>

        <section className="panel h-screen flex items-center justify-center">
          <TrendSection />
        </section>
        <section className="panel h-screen flex items-center justify-center">
          <PortfolioSection />
        </section>
      </div>
    </UpbitTickerProvider>
  );
}
