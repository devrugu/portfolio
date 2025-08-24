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
      },
    },
  },
  plugins: [],
};