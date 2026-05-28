"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Ultra-snappy springs for minimal latency
  const springConfig = { damping: 30, stiffness: 1000 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') ||
        target.getAttribute('role') === 'button';
      
      setIsHovering(!!isClickable);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleHover);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleHover);
    };
  }, [isVisible, mouseX, mouseY]);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null; // Don't show on touch devices
  }

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      {/* Outer Aim Target Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-primary/50 rounded-full flex items-center justify-center"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          scale: isHovering ? 1.5 : 1,
        }}
      >
        {/* Crosshair Lines */}
        <div className="absolute w-full h-[1px] bg-primary/30" />
        <div className="absolute h-full w-[1px] bg-primary/30" />
        
        {/* Inner Glow Dot */}
        <motion.div 
          className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_var(--primary)]"
          animate={{
            scale: isHovering ? [1, 1.5, 1] : 1
          }}
          transition={{
            repeat: Infinity,
            duration: 1
          }}
        />
      </motion.div>

      {/* Trailing Secondary Ring */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 border-[0.5px] border-primary/20 rounded-full"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          scale: isHovering ? 2 : 1,
        }}
        transition={{ type: "spring", damping: 35, stiffness: 400 }}
      />
    </div>
  );
}
