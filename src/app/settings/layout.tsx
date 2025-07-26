"use client";

import React from "react";
import { motion } from "framer-motion";

const SettingsLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const isRenderable =
    typeof children === "string" ||
    typeof children === "number" ||
    React.isValidElement(children);

  return (
    <div className="min-h-screen pt-16 bg-setting-gradient text-neutral-100 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {isRenderable ? children : null}
      </motion.div>
    </div>
  );
};

export default SettingsLayout;