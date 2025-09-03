"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

interface ImageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

export default function ImageViewer({ isOpen, onClose, imageUrl }: ImageViewerProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset state and handle body scroll when modal opens/closes
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleWheel = (event: React.WheelEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!containerRef.current) return;

    const scaleAmount = -event.deltaY * 0.002; // Increased sensitivity slightly
    const newScale = Math.min(Math.max(scale + scaleAmount, 0.5), 4);
    
    const rect = containerRef.current.getBoundingClientRect();
    // Mouse position relative to the container center
    const mouseX = event.clientX - rect.left - rect.width / 2;
    const mouseY = event.clientY - rect.top - rect.height / 2;

    // Calculate the position adjustment needed to keep the zoom centered on the mouse
    const newX = position.x - (mouseX / scale) * (newScale - scale);
    const newY = position.y - (mouseY / scale) * (newScale - scale);
    
    setScale(newScale);
    setPosition({ x: newX, y: newY });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center cursor-grab"
          onWheel={handleWheel}
          ref={containerRef}
        >
          {/* --- Close Button with correct styling --- */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 text-4xl bg-black/30 rounded-full p-1 leading-none"
          >
            &times;
          </button>
          
          {/* --- Download Button restored --- */}
          <a
            href={imageUrl}
            download
            className="absolute top-4 left-4 text-white hover:text-gray-300 z-10 bg-black/30 p-2 rounded-lg"
            title="Download Diagram"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>

          {/* Draggable container */}
          <motion.div
            drag
            dragMomentum={false}
            className="w-full h-full absolute"
            style={{ x: position.x, y: position.y, scale }}
            animate={{ x: position.x, y: position.y, scale }}
            transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={imageUrl}
                alt="Algorithm Diagram"
                className="max-w-[90vw] max-h-[90vh] object-contain pointer-events-none active:cursor-grabbing"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}