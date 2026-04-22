"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement;
      setIsHovering(!!target.closest('a, button, input, textarea, select, label, [role="button"]'));
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full bg-accent"
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
        width: isHovering ? 20 : 6,
        height: isHovering ? 20 : 6,
        opacity: isVisible ? (isHovering ? 0.35 : 0.9) : 0,
      }}
      style={{ translateX: '-50%', translateY: '-50%' }}
      transition={{
        x: { type: 'spring', stiffness: 800, damping: 50, mass: 0.3 },
        y: { type: 'spring', stiffness: 800, damping: 50, mass: 0.3 },
        width: { type: 'spring', stiffness: 400, damping: 25 },
        height: { type: 'spring', stiffness: 400, damping: 25 },
        opacity: { duration: 0.15 },
      }}
    />
  );
}