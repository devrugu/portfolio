"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: "About", href: "/about" },
  { name: "Projects", href: "/#projects" },
  { name: "Resume", href: "/resume" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [availability, setAvailability] = useState<{ openToWork: boolean; statusText: string } | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/site-settings')
      .then(r => r.json())
      .then(d => setAvailability({ openToWork: d.openToWork ?? false, statusText: d.statusText ?? 'Open to Opportunities' }))
      .catch(() => { });
  }, []);

  // Close menu on route change / resize
  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, []);

  const headerVariants = {
    top: { backgroundColor: 'rgba(18,18,18,1)', height: '80px', backdropFilter: 'blur(0px)' },
    scrolled: { backgroundColor: 'rgba(18,18,18,0.3)', height: '64px', backdropFilter: 'blur(12px)' },
    hovered: { backgroundColor: 'rgba(18,18,18,1)', height: '64px', backdropFilter: 'blur(12px)' },
  };

  const getState = () => {
    if (!isScrolled) return 'top';
    return isHovered ? 'hovered' : 'scrolled';
  };

  return (
    <>
      <motion.header
        className="sticky top-0 z-50 w-full border-b border-gray-700/50"
        variants={headerVariants}
        initial="top"
        animate={getState()}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="container mx-auto flex max-w-5xl items-center justify-between px-4 h-full">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xl font-bold text-primary hover:text-accent transition-colors">
              Uğurcan Yılmaz
            </Link>
            {availability?.openToWork && (
              <div className="hidden sm:flex items-center gap-1.5 bg-green-500/10 border border-green-500/25 rounded-full px-3 py-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span className="text-green-400 text-xs font-medium whitespace-nowrap">{availability.statusText}</span>
              </div>
            )}
          </div>

          {/* Desktop nav + theme toggle */}
          <div className="hidden md:flex items-center gap-6">
            <nav>
              <ul
                className="flex items-center space-x-6 text-sm font-medium text-on-background"
                onMouseLeave={() => setHoveredLink(null)}
              >
                {navLinks.map((link) => (
                  <li key={link.name} className="relative" onMouseEnter={() => setHoveredLink(link.href)}>
                    <Link href={link.href} className="transition-colors hover:text-primary">
                      {link.name}
                    </Link>
                    {hoveredLink === link.href && (
                      <motion.div
                        className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-accent"
                        layoutId="underline"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            <ThemeToggle />
          </div>

          {/* Hamburger button — mobile only */}
          <button
            className="md:hidden flex flex-col justify-center items-center gap-1.5 w-8 h-8"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <motion.span
              className="block w-6 h-0.5 bg-primary rounded"
              animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block w-6 h-0.5 bg-primary rounded"
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block w-6 h-0.5 bg-primary rounded"
              animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
            />
          </button>
        </div>
      </motion.header>

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-[64px] left-0 right-0 z-40 bg-background border-b border-gray-700/50 shadow-xl"
          >
            <nav className="container mx-auto max-w-5xl px-4 py-4">
              <ul className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center py-3 px-2 text-base font-medium text-on-background hover:text-accent hover:bg-gray-800/50 rounded-lg transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="pt-3 pb-1 border-t border-gray-700/30 mt-2 flex items-center justify-between px-2">
                <span className="text-sm text-gray-500">Toggle theme</span>
                <ThemeToggle />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}