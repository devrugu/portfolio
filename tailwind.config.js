/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#121212',
        'on-background': '#E0E0E0',
        primary: '#F5F5F5',
        'on-primary': '#121212',
        accent: '#FFC107',
        'accent-hover': '#FFA000',
        tagColors: {
          cpp: '#659AD2', // <-- ADD THIS
          rust: '#DEA584',
          javascript: '#F0DB4F',
          typescript: '#3178C6',
          python: '#3776AB',
          svelte: '#FF3E00',
          lua: '#2C2D72',
          php: '#777BB4',   // <-- ADD THIS
          mysql: '#4479A1', // <-- ADD THIS
        }
      },
    },
  },
  plugins: [],
};