import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xs: "580px",
      md: "768px",
      lg: "1024px",
    },
    extend: {
      colors: {
        primary: "#0a0a13",
        secondary: "#1b112b",
        accent: "#f6b072",
        warning: "#f87171",
      },
      backgroundImage: {
        "main-gradient": "linear-gradient(to bottom, #0a0a13, #1b112b, #0a0a13)",
        "second-gradient": "linear-gradient(90deg, #f08c6c, #f6b072, #fbc987, #f6b072, #f08c6c)",
        'chart-gradient': 'linear-gradient(to bottom, #24345c, #267187)',
        'trends-gradient': 'linear-gradient(to bottom, #6b3455, #a3566c, #e97e7e)',
        'portfolio-gradient': 'linear-gradient(to bottom, #5a3372, #a77ecb)',
        'setting-gradient': 'linear-gradient(to bottom, #374e3e, #556648)',
      },
      fontFamily: {
        sans: ['"Noto Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};


export default config;