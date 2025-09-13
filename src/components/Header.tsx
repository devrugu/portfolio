"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const navLinks = [
  { name: "Resume", href: "/resume" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  // --- NEW: State to track which link is being hovered ---
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => { setIsScrolled(window.scrollY > 10); };
    window.addEventListener('scroll', handleScroll);
    return () => { window.removeEventListener('scroll', handleScroll); };
  }, []);

  const headerVariants = {
    top: { backgroundColor: 'rgba(18, 18, 18, 1)', height: '80px', backdropFilter: 'blur(0px)' },
    scrolled: { backgroundColor: 'rgba(18, 18, 18, 0.3)', height: '64px', backdropFilter: 'blur(12px)' },
    hovered: { backgroundColor: 'rgba(18, 18, 18, 1)', height: '64px', backdropFilter: 'blur(12px)' },
  };

  const containerVariants = {
    top: { height: '80px' },
    scrolled: { height: '64px' },
  };

  const getAnimationState = () => {
    if (!isScrolled) return "top";
    return isHovered ? "hovered" : "scrolled";
  };

  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b border-gray-700/50"
      variants={headerVariants}
      initial="top"
      animate={getAnimationState()}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
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
          {/* --- NEW: Updated Navigation List --- */}
          <ul 
            className="flex items-center space-x-6 text-sm font-medium text-on-background"
            onMouseLeave={() => setHoveredLink(null)} // Clear hover when mouse leaves the whole list
          >
            {navLinks.map((link) => (
              <li 
                key={link.name} 
                className="relative"
                onMouseEnter={() => setHoveredLink(link.href)} // Set the hovered link
              >
                <Link href={link.href} className="transition-colors hover:text-primary">
                  {link.name}
                </Link>
                {/* The Animated Underline */}
                {hoveredLink === link.href && (
                  <motion.div
                    className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-accent"
                    layoutId="underline" // This is the magic!
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </li>
            ))}
          </ul>
        </nav>
      </motion.div>
    </motion.header>
  );
}