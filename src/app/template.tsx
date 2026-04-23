"use client";

import { motion, AnimatePresence } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, y: 16 },
  enter:  { opacity: 1, y: 0  },
  exit:   { opacity: 0, y: -8 },
};

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <motion.main
        variants={variants}
        initial="hidden"
        animate="enter"
        exit="exit"
        transition={{
          type: 'tween',
          ease: [0.25, 0.1, 0.25, 1], // cubic-bezier ease-out
          duration: 0.35,
        }}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}