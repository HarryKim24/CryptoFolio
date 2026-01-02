import MainSection from "@/components/home/MainSection";
import Footer from "@/components/home/Footer";
import ViewportSection from "@/components/home/ViewportSection";

const Spacer = ({ className }: { className: string }) => (
  <section className={className} />
);

const HomePage = () => {
  return (
    <div>
      <section className="panel h-screen flex items-center justify-center">
        <MainSection />
      </section>

      <Spacer className="h-96" />

      <ViewportSection type="chart" skeletonHeight="h-full" />

      <Spacer className="h-32" />

      <ViewportSection type="trend" skeletonHeight="h-full" />

      <Spacer className="h-32" />

      <ViewportSection type="portfolio" skeletonHeight="h-full" />

      <section className="panel flex flex-col items-center justify-center">
        <Footer />
      </section>
    </div>
  );
};

export default HomePage;
