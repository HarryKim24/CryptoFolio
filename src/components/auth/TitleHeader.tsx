"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const TitleHeader = () => {
  const pathname = usePathname();

  let title: string | null = null;
  if (pathname.includes('/login')) {
    title = 'CryptoFolio에 로그인하세요';
  } else if (pathname.includes('/register')) {
    title = 'CryptoFolio 계정을 생성하세요'
  }

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