import ExchangeRates from "@/components/trends/ExchangeRates";
import WeeklyTopRise from "@/components/trends/WeeklyTopRise";
import TopPerformance from "@/components/trends/TopPerformance";
import TopVolume from "@/components/trends/TopVolume";

const TrendsPage = () => {
  return (
    <div className="px-4 lg:px-20 max-w-screen-xl mx-auto text-neutral-100">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start pb-4 lg:pb-0">
        <div className="flex flex-col gap-6 h-full">
          <ExchangeRates />
          <TopPerformance />
        </div>

        <div className="flex flex-col gap-6 h-full">
          <WeeklyTopRise />
          <TopVolume />
        </div>
      </div>
    </div>
  );
};

export default TrendsPage;