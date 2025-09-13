"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function MouseSpotlight() {
  const [mousePosition, setMousePosition] = useState({ x: -200, y: -200 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // This is a cleanup function that runs when the component is removed
    // It's crucial for preventing memory leaks!
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []); // Empty dependency array means this effect runs only once

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[-10]"
      style={{
        background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 193, 7, 0.15), transparent 80%)`
      }}
      animate={{ 
        background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 193, 7, 0.15), transparent 80%)`
      }}
      transition={{ type: 'tween', ease: 'backOut', duration: 0.5 }}
    />
  );
}