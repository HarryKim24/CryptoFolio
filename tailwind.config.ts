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
        accent: "#fbc987",
        warning: "#f87171",
      },
      backgroundImage: {
        "main-gradient": "linear-gradient(to bottom, #0a0a13, #1b112b, #0a0a13)",
        "second-gradient": "linear-gradient(90deg, #f08c6c, #f6b072, #fbc987, #f6b072, #f08c6c)",
        "setting-gradient": "linear-gradient(to bottom, #356378, #47576f, #5c3c58, #3c2c4e)",
      },
      fontFamily: {
        sans: ['"Noto Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};


export default config;