"use client";

import { motion } from "framer-motion";
import ExchangeRates from "@/components/trends/ExchangeRates";
import TopRise from "@/components/trends/TopRise";
import BitFlow from "@/components/trends/BitFlow";
import TopVolume from "@/components/trends/TopVolume";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const TrendsPage = () => {
  return (
    <div className="px-4 lg:px-20 max-w-screen-xl mx-auto text-neutral-100">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 pb-4">
        <div className="flex flex-col gap-6 min-w-[320px] lg:min-w-[580px]">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 1 }}
          >
            <ExchangeRates />
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 1, delay: 0.3 }}
          >
            <BitFlow />
          </motion.div>
        </div>

        <div className="flex flex-col gap-6 min-w-[320px]">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 1, delay: 0.6 }}
          >
            <TopRise />
          </motion.div>
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 1, delay: 0.9 }}
          >
            <TopVolume />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TrendsPage;