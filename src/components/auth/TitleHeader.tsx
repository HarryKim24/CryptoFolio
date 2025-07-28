"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const TitleHeader = () => {
  const pathname = usePathname();

  const getTitleByPath = (path: string) => {
    if (path.includes("/login")) return "CryptoFolio에 로그인하세요";
    if (path.includes("/register")) return "CryptoFolio 계정을 만들어보세요";
    return null;
  };

  const title = getTitleByPath(pathname);

  if (!title) return null;

  return (
    <motion.h1
      initial={{ scale: 2, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="text-3xl font-bold bg-clip-text text-neutral-100 text-center mb-12"
    >
      {title}
    </motion.h1>
  );
};

export default TitleHeader;