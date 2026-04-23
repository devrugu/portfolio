"use client";

import { useTheme } from "./ThemeProvider";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="relative w-12 h-6 rounded-full border border-gray-600 bg-gray-800 flex items-center transition-colors hover:border-accent"
      style={{ background: isDark ? "#1f1f1f" : "#e8e0d0" }}
    >
      <motion.div
        className="absolute w-4 h-4 rounded-full flex items-center justify-center text-xs"
        animate={{ x: isDark ? 4 : 24 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        style={{ background: isDark ? "#FFC107" : "#f59e0b" }}
      >
        {isDark ? "🌙" : "☀️"}
      </motion.div>
    </button>
  );
}