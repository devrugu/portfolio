"use client";

import { motion } from 'framer-motion';

// This component will wrap its children with a fade-in animation
export default function FadeIn({ children, delay = 0.2, duration = 0.5 }: { children: React.ReactNode; delay?: number; duration?: number; }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Start invisible and 20px down
      whileInView={{ opacity: 1, y: 0 }} // Animate to visible and original position
      viewport={{ once: true }} // Only animate the first time it comes into view
      transition={{
        delay,
        duration,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}