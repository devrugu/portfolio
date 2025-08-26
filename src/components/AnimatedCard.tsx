"use client";

import { motion, easeInOut } from 'framer-motion';
import Link from 'next/link';

interface AnimatedCardProps {
  children: React.ReactNode;
  href: string;
  // 'index' is used to calculate the animation delay for the stagger effect
  index: number;
}

// Define the animation properties for a single card
const cardVariants = {
  hidden: { opacity: 0, y: 20 }, // Start invisible and 20px down
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ease: easeInOut,
      duration: 0.5,
    },
  },
};

export default function AnimatedCard({ children, href, index }: AnimatedCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      // The magic of staggering: delay each card's animation based on its index
      transition={{ delay: index * 0.15 }}
      className="block h-full" // Ensure the motion div takes up the full height
    >
      <motion.div
        whileHover={{ scale: 1.03, y: -5 }} // Hover effect: scale up and lift
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 15,
        }}
        className="h-full"
      >
        <Link href={href} target="_blank" rel="noopener noreferrer" className="block h-full bg-gray-800/50 p-6 rounded-lg border border-gray-700/50 hover:border-accent transition-colors">
          {children}
        </Link>
      </motion.div>
    </motion.div>
  );
}