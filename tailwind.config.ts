import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#121212',      // Very dark charcoal
        'on-background': '#E0E0E0', // Creamy off-white text
        primary: '#F5F5F5',         // Brighter warm white
        'on-primary': '#121212',    // Dark text for primary backgrounds
        accent: '#FFC107',          // Warm amber/gold accent
        'accent-hover': '#FFA000',  // Darker amber for hover
      },
    },
  },
  plugins: [],
};
export default config;