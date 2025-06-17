"use client";

import { motion } from "framer-motion";
import ExchangeRates from "@/components/trends/ExchangeRates";
import WeeklyTopRise from "@/components/trends/WeeklyTopRise";
import TopPerformance from "@/components/trends/TopPerformance";
import TopVolume from "@/components/trends/TopVolume";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const TrendsPage = () => {
  return (
    <div className="px-4 lg:px-20 max-w-screen-xl mx-auto text-neutral-100">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-stretch pb-4 lg:pb-0 h-full">
        <div className="flex flex-col gap-6 h-full">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 1 }}
            className="h-full"
          >
            <ExchangeRates />
          </motion.div>
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 1, delay: 0.2 }}
            className="h-full"
          >
            <TopPerformance />
          </motion.div>
        </div>

        <div className="flex flex-col gap-6 h-full">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 1, delay: 0.4 }}
            className="flex-1"
          >
            <WeeklyTopRise />
          </motion.div>
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 1, delay: 0.6 }}
            className="flex-1"
          >
            <TopVolume />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TrendsPage;