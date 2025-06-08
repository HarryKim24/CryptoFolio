"use client";

import { motion } from "framer-motion";
import React from "react";
import { usePathname } from "next/navigation";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const getTitleByPath = (path: string) => {
    if (path.includes("/login")) return "CryptoFolio에 로그인하세요";
    if (path.includes("/register")) return "CryptoFolio 계정을 만들어보세요";
    return null;
  };

  const title = getTitleByPath(pathname);

  return (
    <div className="min-h-screen flex items-center justify-center bg-main-gradient px-16">
      <div className="flex flex-col items-center w-full max-w-[480px] min-w-[220px]">
        {title && (
          <motion.h1
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-3xl font-bold bg-clip-text text-neutral-100 text-center mb-12"
          >
            {title}
          </motion.h1>
        )}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.5,
            y: { duration: 3, ease: "easeOut" },
            opacity: { delay: 1, duration: 2, ease: "easeOut" },
          }}
          className="p-[2px] rounded-2xl bg-second-gradient shadow-2xl w-full mb-20"
        >
          <div className="w-full bg-secondary backdrop-blur-md p-8 rounded-[14px]">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;