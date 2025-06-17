import ExchangeRates from "@/components/trends/ExchangeRates";
import WeeklyTopRise from "@/components/trends/WeeklyTopRise";
import TopPerformance from "@/components/trends/TopPerformance";
import TopVolume from "@/components/trends/TopVolume";

const TrendsPage = () => {
  return (
    <div className="px-4 lg:px-20 max-w-screen-xl mx-auto text-neutral-100">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2 flex flex-col gap-6 h-full">
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