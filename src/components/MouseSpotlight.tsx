"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function MouseSpotlight() {
  const [mousePosition, setMousePosition] = useState({ x: -200, y: -200 });
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia('(hover: none) and (pointer: coarse)').matches);
  }, []);

  useEffect(() => {
    if (isTouch) return;
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // This is a cleanup function that runs when the component is removed
    // It's crucial for preventing memory leaks!
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[-10]"
      style={{
        background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, var(--spotlight-color), transparent 80%)`
      }}
      animate={{ 
        background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, var(--spotlight-color), transparent 80%)`
      }}
      transition={{ type: 'tween', ease: 'backOut', duration: 0.5 }}
    />
  );
}