"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 480) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const menuItems = [
    { href: "/chart/BTC", label: "차트" },
    { href: "/trends", label: "트렌드" },
    { href: "/portfolio", label: "포트폴리오" },
    { href: "/settings", label: "설정" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full px-6 backdrop-blur-md bg-transparent shadow-sm z-50">
      <div className="mx-auto h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-extrabold bg-second-gradient bg-clip-text text-transparent"
        >
          CryptoFolio
        </Link>

        <button
          className="relative w-6 h-6 xs:hidden flex flex-col justify-center items-center"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="모바일 메뉴 열기"
        >
          <span
            className={`absolute w-full h-1 bg-neutral-100 transition-all duration-500 ${
              isOpen ? "rotate-45 top-1/2" : "-translate-y-[6px]"
            }`}
          />
          <span
            className={`absolute w-full h-1 bg-neutral-100 transition-all duration-500 ${
              isOpen ? "-rotate-45 top-1/2" : "translate-y-[6px]"
            }`}
          />
        </button>

        <ul className="hidden xs:flex gap-4 text-md font-extrabold text-neutral-100">
          {menuItems.map(({ href, label }) => (
            <li key={href} className="flex items-center h-12 whitespace-nowrap px-2">
              <Link href={href}>{label}</Link>
            </li>
          ))}
          <li className="flex items-center h-12 px-2">
            {session ? (
              <button onClick={() => signOut()}>로그아웃</button>
            ) : (
              <Link href="/login">로그인</Link>
            )}
          </li>
        </ul>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5 }}
            className="xs:hidden absolute top-full right-0 w-2/3 max-w-xs h-screen shadow-lg flex flex-col justify-start gap-6 text-lg font-extrabold text-neutral-100 pt-24 px-6 z-40 backdrop-blur-md bg-main-gradient"
          >
            {menuItems.map(({ href, label }) => (
              <li key={href} className="flex items-center text-lg h-8 px-2">
                <Link href={href} onClick={() => setIsOpen(false)}>
                  {label}
                </Link>
              </li>
            ))}
            <li className="flex items-center text-lg h-8 px-2">
              {session ? (
                <button onClick={() => signOut()}>로그아웃</button>
              ) : (
                <Link href="/login" onClick={() => setIsOpen(false)}>로그인</Link>
              )}
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;