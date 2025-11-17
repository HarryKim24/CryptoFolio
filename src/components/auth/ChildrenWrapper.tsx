"use client";

import { motion } from "framer-motion";
import React from "react";

const ChildrenWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        y: { duration: 1, ease: "easeOut" },
        opacity: { duration: 1, ease: "easeOut" },
      }}
      className="p-[1px] rounded-xl bg-second-gradient shadow-2xl w-full mb-20"
    >
      <div className="w-full bg-main-gradient backdrop-blur-md p-8 rounded-xl">
        {children}
      </div>
    </motion.div>
  );
};

export default ChildrenWrapper;