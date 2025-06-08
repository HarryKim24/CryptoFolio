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
        primary: "#0b0a1a",
        secondary: "#1b1443",
        accent: "#fac263",
      },
      backgroundImage: {
        "main-gradient": "linear-gradient(to bottom, #0b0a1a, #1b1443, #0b0a1a)",
        "second-gradient": "linear-gradient(90deg, #f59e85, #f8b36e, #fac263, #f8b36e, #f59e85)",
      },
      fontFamily: {
        sans: ['"Noto Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;