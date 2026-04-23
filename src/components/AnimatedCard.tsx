"use client";

import { motion, easeInOut } from 'framer-motion';
import Link from 'next/link';

interface AnimatedCardProps {
  children: React.ReactNode;
  href?: string;
  index: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ease: easeInOut, duration: 0.5 },
  },
};

const baseClass =
  "block h-full bg-gray-800/50 p-6 rounded-lg border border-gray-700/50 transition-colors";

export default function AnimatedCard({ children, href, index }: AnimatedCardProps) {
  const isExternal = href?.startsWith("http");

  return (
    <motion.div
      variants={cardVariants}
      transition={{ delay: index * 0.15 }}
      className="block h-full"
    >
      <motion.div
        whileHover={{ scale: href ? 1.03 : 1, y: href ? -5 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        className="h-full"
      >
        {href ? (
          <Link
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className={`${baseClass} hover:border-accent`}
          >
            {children}
          </Link>
        ) : (
          <div className={`${baseClass} border-gray-700/30 cursor-default`}>
            {children}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}