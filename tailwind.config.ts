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
        primary: "#0c0c1f",
        secondary: "#140b29",
      },
      backgroundImage: {
        "nav-gradient": "linear-gradient(to right, #0c0c1f, #140b29, #0c0c1f)",
        "menu-gradient": "linear-gradient(to bottom, #0c0c1f, #140b29, #0c0c1f)",
        "text-yellow-gradient": "linear-gradient(45deg, #fef08a 10%, #fef9c3 50%, #fef08a 90%)",
      },
      fontFamily: {
        sans: ['"Noto Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;