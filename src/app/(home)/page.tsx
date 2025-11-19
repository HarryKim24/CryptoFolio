import MainSection from "@/components/home/MainSection";
import Footer from "@/components/home/Footer";
import dynamic from "next/dynamic";

const ChartSection = dynamic(() => import("@/components/home/ChartSection"));
const TrendSection = dynamic(() => import("@/components/home/TrendSection"));
const PortfolioSection = dynamic(() => import("@/components/home/PortfolioSection"));

const Spacer = ({ className }: { className: string }) => <section className={className} />;

const HomePage = () => {
  return (
    <div>
      <section className="panel h-screen flex items-center justify-center">
        <MainSection />
      </section>

      <Spacer className="h-96" />

      <section className="panel h-screen flex flex-col items-center justify-center">
        <ChartSection />
      </section>

      <Spacer className="h-32" />

      <section className="panel h-screen flex flex-col items-center justify-center">
        <TrendSection />
      </section>

      <Spacer className="h-32" />

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