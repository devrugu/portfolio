"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  // --- NEW: State to track if the mouse is hovering over the header ---
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // --- UPDATED: Animation variants with a new 'hovered' state ---
  const headerVariants = {
    top: {
      backgroundColor: 'rgba(18, 18, 18, 1)', // Solid
      height: '80px',
      backdropFilter: 'blur(0px)',
    },
    // The transparent state when scrolled and NOT hovered
    scrolled: {
      backgroundColor: 'rgba(18, 18, 18, 0.3)', // Much more transparent (30% opaque)
      height: '64px',
      backdropFilter: 'blur(12px)', // Slightly more blur for readability
    },
    // The state when scrolled AND hovered
    hovered: {
      backgroundColor: 'rgba(18, 18, 18, 1)', // Solid
      height: '64px',
      backdropFilter: 'blur(12px)',
    },
  };

  // The inner container only needs to know about scrolling for its height
  const containerVariants = {
    top: { height: '80px' },
    scrolled: { height: '64px' },
  };

  // --- NEW: Helper function to determine the current animation state ---
  const getAnimationState = () => {
    if (!isScrolled) return "top"; // Always solid at the top
    // If scrolled, the state depends on whether the user is hovering
    return isHovered ? "hovered" : "scrolled";
  };

  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b border-gray-700/50"
      variants={headerVariants}
      initial="top"
      animate={getAnimationState()} // Use the helper function here
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      // --- NEW: Event handlers to track mouse enter and leave ---
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="container mx-auto flex max-w-5xl items-center justify-between px-4"
        variants={containerVariants}
        initial="top"
        animate={isScrolled ? "scrolled" : "top"}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <Link href="/" className="text-xl font-bold text-primary hover:text-accent transition-colors">
          Uğurcan Yılmaz
        </Link>
        <nav>
          <ul className="flex items-center space-x-6 text-sm font-medium text-on-background">
            <li><Link href="/resume" className="hover:text-accent transition-colors">Resume</Link></li>
            <li><Link href="/blog" className="hover:text-accent transition-colors">Blog</Link></li>
            <li><Link href="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
          </ul>
        </nav>
      </motion.div>
    </motion.header>
  );
}