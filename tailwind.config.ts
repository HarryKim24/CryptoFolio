import type { Config } from 'tailwindcss';

const contentPaths = ['./src/**/*.{js,ts,jsx,tsx}'];

const screenSizes = {
  xs: '580px',
  md: '768px',
  lg: '1024px',
};

const colorSet = {
  primary: '#5731a8',
  secondary: '#c637b3',
  third: '#ffb84c',
  chart: '#267187',
  trend: '#5a3a56',
  portfolio: '#7b5ea8',
  setting: '#2d4b4a',
  warning: '#f87171',
};

const backgroundImages = {
  'main-gradient':
    'linear-gradient(to bottom, #5731a8, #c637b3, #f27567, #ffb84c)',
  'second-gradient':
    'linear-gradient(90deg, #f08c6c, #f6b072, #fbc987, #f6b072, #f08c6c)',
  'chart-gradient':
    'linear-gradient(to bottom,#267187, #24345c)',
  'trends-gradient':
    'linear-gradient(to bottom, #8e5a67, #5a3a56, #3c2441)',
  'portfolio-gradient':
    'linear-gradient(to bottom, #8383c3, #7b5ea8, #4f3a6c)',
  'setting-gradient':
    'linear-gradient(to bottom, #2d4b4a, #1f3337)',
};

const fontFamilies = {
  sans: ['"Noto Sans"', 'sans-serif'],
};

const config: Config = {
  content: contentPaths,
  theme: {
    screens: screenSizes,
    extend: {
      colors: colorSet,
      backgroundImage: backgroundImages,
      fontFamily: fontFamilies,
    },
  },
  plugins: [],
};

export default config;