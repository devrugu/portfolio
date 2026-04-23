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
        background:     "var(--color-background)",
        "on-background":"var(--color-on-background)",
        primary:        "var(--color-primary)",
        "on-primary":   "var(--color-on-primary)",
        accent:         "var(--color-accent)",
        "accent-hover": "var(--color-accent-hover)",
        tagColors: {
          cpp:        '#659AD2',
          rust:       '#DEA584',
          javascript: '#F0DB4F',
          typescript: '#3178C6',
          python:     '#3776AB',
          svelte:     '#FF3E00',
          lua:        '#2C2D72',
          php:        '#777BB4',
          mysql:      '#4479A1',
        },
      },
    },
  },
  plugins: [],
};