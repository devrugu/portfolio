"use client";

import { motion } from 'framer-motion';

// Define the animation variants
const variants = {
  hidden: { opacity: 0, x: -20, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
};

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      variants={variants}
      initial="hidden"
      animate="enter"
      transition={{ type: 'tween', ease: 'linear', duration: 0.5 }}
    >
      {children}
    </motion.main>
  );
}