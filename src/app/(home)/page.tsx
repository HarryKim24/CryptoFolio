import ChartSection from "@/components/home/ChartSection";
import MainSection from "@/components/home/MainSection";
import PortfolioSection from "@/components/home/PortfolioSection";
import TrendSection from "@/components/home/TrendSection";

export default function HomePage() {
  return (
    <div>
      <section className="panel h-screen flex items-center justify-center text-white text-3xl">
        <MainSection />
      </section>
      <section className="panel h-screen flex items-center justify-center text-white text-3xl">
        <ChartSection />
      </section>
      <section className="panel h-screen flex items-center justify-center text-white text-3xl">
        <TrendSection />
      </section>
      <section className="panel h-screen flex items-center justify-center text-white text-3xl">
        <PortfolioSection />
      </section>
    </div>
  )
}
