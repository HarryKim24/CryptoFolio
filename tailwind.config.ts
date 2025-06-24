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
        primary: "#5731a8",
        secondary: "#c637b3",
        third: "#ffb84c",
        accent: "#f6b072",
        chart: "#267187",
        warning: "#f87171",
        portfolio: "#7b5ea8",
      },
      backgroundImage: {
        "main-gradient": "linear-gradient(to bottom, #5731a8, #c637b3, #f27567, #ffb84c)",
        "second-gradient": "linear-gradient(90deg, #f08c6c, #f6b072, #fbc987, #f6b072, #f08c6c)",
        'chart-gradient': 'linear-gradient(to bottom,#267187, #24345c)',
        'trends-gradient': 'linear-gradient(to bottom, #8e5a67, #5a3a56, #3c2441)',
        'portfolio-gradient': 'linear-gradient(to bottom, #8383c3, #7b5ea8, #4f3a6c)',
        'setting-gradient': 'linear-gradient(to bottom, #2d4b4a, #1f3337)',
      },
      fontFamily: {
        sans: ['"Noto Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};


export default config;