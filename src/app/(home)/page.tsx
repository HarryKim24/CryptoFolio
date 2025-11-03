import MainSection from "@/components/home/MainSection";
import dynamic from "next/dynamic";

const ChartSection = dynamic(() => import("@/components/home/ChartSection"));
const TrendSection = dynamic(() => import("@/components/home/TrendSection"));
const PortfolioSection = dynamic(() => import("@/components/home/PortfolioSection"));
const Footer = dynamic(() => import("@/components/home/Footer"));

const HomePage = () => {
  return (
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
  );
};

export default HomePage;