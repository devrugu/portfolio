"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHoveringLink, setIsHoveringLink] = useState(false);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });

      // Check if the element under the cursor is a link or a button
      const target = event.target as HTMLElement;
      if (target.closest('a, button')) {
        setIsHoveringLink(true);
      } else {
        setIsHoveringLink(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const cursorVariants = {
    default: {
      width: 32,
      height: 32,
      border: '2px solid #FFC107', // accent color
      transition: { type: 'spring' as const, stiffness: 500, damping: 30 },
    },
    hovering: {
      width: 50,
      height: 50,
      border: '3px solid #F5F5F5', // primary color
      backgroundColor: 'rgba(255, 193, 7, 0.2)', // transparent accent
      transition: { type: 'spring' as const, stiffness: 300, damping: 20 },
    },
  };
  
  const dotVariants = {
    default: {
        opacity: 1,
        scale: 1,
    },
    hovering: {
        opacity: 0,
        scale: 0,
    }
  }

  return (
    <>
      {/* The outer, lagging ring */}
      <motion.div
        variants={cursorVariants}
        animate={isHoveringLink ? 'hovering' : 'default'}
        className="pointer-events-none fixed top-0 left-0 z-50 rounded-full"
        style={{ 
          translateX: mousePosition.x - 16, // Center the ring
          translateY: mousePosition.y - 16,
        }}
      />
      {/* The inner, precise dot */}
      <motion.div
        variants={dotVariants}
        animate={isHoveringLink ? 'hovering' : 'default'}
        className="pointer-events-none fixed top-0 left-0 z-50 h-2 w-2 rounded-full bg-accent"
        style={{ 
          translateX: mousePosition.x - 4, // Center the dot
          translateY: mousePosition.y - 4,
        }}
        transition={{ type: 'spring', stiffness: 800, damping: 40 }}
      />
    </>
  );
}