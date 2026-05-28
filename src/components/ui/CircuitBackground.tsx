"use client";

import { memo } from "react";
import { motion } from "framer-motion";

const NeonTrain = ({ path, duration = 8, delay = 0, size = 0.9 }: { path: string; duration?: number; delay?: number; size?: number }) => (
  <g>
    {/* Massive Bloom Aura */}
    <motion.path
      d={path}
      fill="none"
      stroke="var(--color-primary)"
      strokeWidth="12"
      strokeLinecap="round"
      filter="url(#massive-bloom-tranquil)"
      initial={{ pathLength: size, pathOffset: -size, opacity: 0 }}
      animate={{ 
        pathOffset: [-size, 1],
        opacity: [0, 0.5, 0.5, 0]
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        delay: delay,
        ease: "linear",
      }}
    />
    {/* Pure Neon Core */}
    <motion.path
      d={path}
      fill="none"
      stroke="var(--color-primary)"
      strokeWidth="3.5"
      strokeLinecap="round"
      filter="url(#neon-glow-core-tranquil)"
      initial={{ pathLength: size, pathOffset: -size, opacity: 0 }}
      animate={{ 
        pathOffset: [-size, 1],
        opacity: [0, 1, 1, 0]
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        delay: delay,
        ease: "linear",
      }}
    />
  </g>
);

const CircuitBackground = memo(() => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-100 accelerate-gpu bg-[#000000]">
      <svg width="100%" height="100%" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="neon-glow-core-tranquil" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feFlood floodColor="var(--color-primary)" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="massive-bloom-tranquil" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="12" result="blur" />
          </filter>

          {/* Grid traces - barely visible grid only */}
          <pattern id="grid-traces" x="0" y="0" width="400" height="400" patternUnits="userSpaceOnUse">
             <path d="M 0 150 L 100 150 L 150 200" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.05" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#grid-traces)" className="text-primary" />
        
        {/* Ultra-Long, Precise Energy Streaks */}
        <g className="text-primary" fill="none" stroke="currentColor" strokeWidth="3">
          {/* Streak 1: Main Diagonal */}
          <NeonTrain path="M -100 200 L 300 200 L 600 500 L 600 900" duration={12} size={0.9} />
          
          {/* Streak 2: Long Horizontal */}
          <NeonTrain path="M 1600 300 L 1000 300 L 800 500 L -200 500" duration={15} delay={4} size={0.85} />

          {/* Streak 3: Top edge sweep */}
          <NeonTrain path="M 1200 -100 L 1200 150 L 1450 400" duration={10} delay={8} size={0.95} />
        </g>
      </svg>
    </div>
  );
});

CircuitBackground.displayName = "CircuitBackground";
export default CircuitBackground;
