"use client";

import { motion } from 'framer-motion';

interface SkillBarProps {
  skill: string;
  proficiency?: number;
}

// --- UPDATED: The 'ease' property is removed ---
const barVariants = {
  hidden: { width: '0%' },
  visible: (proficiency: number) => ({
    width: `${proficiency}%`,
    transition: {
      duration: 1,
      delay: 0.2,
    },
  }),
};

export default function SkillBar({ skill, proficiency = 0 }: SkillBarProps) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="font-semibold text-primary">{skill}</span>
        <span className="text-sm font-medium text-gray-400">{proficiency}%</span>
      </div>
      <div className="w-full bg-gray-700/50 rounded-full h-2.5">
        <motion.div
          className="bg-accent h-2.5 rounded-full"
          variants={barVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={proficiency}
        />
      </div>
    </div>
  );
}