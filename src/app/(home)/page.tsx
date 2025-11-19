import MainSection from "@/components/home/MainSection";
import Footer from "@/components/home/Footer";
import dynamic from "next/dynamic";
import DelayedRender from "@/components/home/DelayedRender";

const SectionSkeleton = ({ heightClass }: { heightClass: string }) => (
  <div className={`w-full ${heightClass} flex items-center justify-center`}>
    <div className="text-neutral-100 text-md animate-pulse">로딩중...</div>
  </div>
);

const ChartSection = dynamic(() => import("@/components/home/ChartSection"), {
  loading: () => <SectionSkeleton heightClass="h-[800px]" />,
});
const TrendSection = dynamic(() => import("@/components/home/TrendSection"), {
  loading: () => <SectionSkeleton heightClass="h-[600px]" />,
});
const PortfolioSection = dynamic(() => import("@/components/home/PortfolioSection"), {
  loading: () => <SectionSkeleton heightClass="h-[500px]" />,
});

const Spacer = ({ className }: { className: string }) => <section className={className} />;

const HomePage = () => {
  return (
    <div>
      <section className="panel h-screen flex items-center justify-center">
        <MainSection />
      </section>

      <Spacer className="h-96" />

      <section className="panel h-screen flex flex-col items-center justify-center">
        <DelayedRender delay={2000} fallback={<SectionSkeleton heightClass="h-full" />}>
          <ChartSection />
        </DelayedRender>
      </section>

      <Spacer className="h-32" />

      <section className="panel h-screen flex flex-col items-center justify-center">
        <DelayedRender delay={2000} fallback={<SectionSkeleton heightClass="h-full" />}>
          <TrendSection />
        </DelayedRender>
      </section>

      <Spacer className="h-32" />

      <section className="panel h-screen flex items-center justify-center">
        <DelayedRender delay={2000} fallback={<SectionSkeleton heightClass="h-full" />}>
          <PortfolioSection />
        </DelayedRender>
      </section>

      <section className="panel flex flex-col items-center justify-center">
        <Footer />
      </section>
    </div>
  );
};

export default HomePage;