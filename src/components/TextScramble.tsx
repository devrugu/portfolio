"use client";

import { useState, useEffect, useRef } from 'react';

// Define the props the component will accept
interface TextScrambleProps {
  text: string;
  className?: string;
}

export default function TextScramble({ text, className = '' }: TextScrambleProps) {
  const [displayText, setDisplayText] = useState('');
  const animationFrameId = useRef<number | null>(null);
  const lastUpdateTime = useRef<number>(0);

  // The character set to use for scrambling
  const chars = '!<>-_\\/[]{}—=+*^?#________';

  useEffect(() => {
    let counter = 0;
    const frameRate = 1000 / 30; // 30 frames per second

    const updateText = (time: number) => {
      if (time - lastUpdateTime.current < frameRate) {
        animationFrameId.current = requestAnimationFrame(updateText);
        return;
      }
      lastUpdateTime.current = time;

      const newText = text
        .split('')
        .map((char, index) => {
          if (index < counter) {
            return text[index];
          }
          // Add a space to the random characters to make it less dense
          if (char === ' ') return ' ';

          const randomChar = chars[Math.floor(Math.random() * chars.length)];
          return randomChar;
        })
        .join('');

      setDisplayText(newText);

      if (counter < text.length) {
        counter += 1;
        animationFrameId.current = requestAnimationFrame(updateText);
      }
    };

    // Start the animation
    animationFrameId.current = requestAnimationFrame(updateText);

    // Cleanup function to cancel the animation if the component unmounts
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [text]); // Re-run the effect if the target text changes

  return <span className={className}>{displayText}</span>;
}