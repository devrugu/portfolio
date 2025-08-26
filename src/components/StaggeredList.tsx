"use client";

import { motion } from 'framer-motion';

// Define the animation properties for the list container
const listVariants = {
  visible: {
    transition: {
      staggerChildren: 0.15, // The delay between each child's animation
    },
  },
  hidden: {},
};

export default function StaggeredList({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={listVariants}
      initial="hidden"
      whileInView="visible" // Animate when the list comes into view
      viewport={{ once: true, amount: 0.2 }} // Trigger when 20% of the list is visible
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {children}
    </motion.div>
  );
}