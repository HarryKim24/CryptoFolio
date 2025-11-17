"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const TITLE_MAP: Record<string, string> = {
  "/login": "CryptoFolio에 로그인하세요",
  "/register": "CryptoFolio 계정을 생성하세요",
};

const TitleHeader = () => {
  const pathname = usePathname();

  const title =
    Object.entries(TITLE_MAP).find(([path]) =>
      pathname.startsWith(path)
    )?.[1] ?? null;

  if (!title) return null;

  return (
    <motion.h1
      initial={{ scale: 2, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="text-3xl font-bold text-neutral-100 text-center mb-12"
    >
      {title}
    </motion.h1>
  );
};

export default TitleHeader;