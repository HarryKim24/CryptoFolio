"use client";

import React from "react";
import { motion } from "framer-motion";

const SettingsLayoutClient = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen pt-16 bg-setting-gradient text-neutral-100 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="px-4 sm:px-6"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default SettingsLayoutClient;