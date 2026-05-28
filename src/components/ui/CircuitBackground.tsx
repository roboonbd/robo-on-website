"use client";

import { memo } from "react";
import { motion } from "framer-motion";

const NeonTrain = ({ path, duration = 4, delay = 0, size = 0.15 }: { path: string; duration?: number; delay?: number; size?: number }) => (
  <g>
    {/* MASSIVE OUTER BLOOM (The "Aura") */}
    <motion.path
      d={path}
      fill="none"
      stroke="var(--color-primary)"
      strokeWidth="25"
      strokeLinecap="round"
      filter="url(#massive-bloom)"
      initial={{ pathLength: size, pathOffset: -size, opacity: 0 }}
      animate={{ 
        pathOffset: [0, 1 + size],
        opacity: [0, 0.6, 0.6, 0]
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        delay: delay,
        ease: "linear",
      }}
    />
    {/* WIDE NEON GLOW (The "Tube") */}
    <motion.path
      d={path}
      fill="none"
      stroke="var(--color-primary)"
      strokeWidth="12"
      strokeLinecap="round"
      filter="url(#neon-glow-intense)"
      initial={{ pathLength: size, pathOffset: -size, opacity: 0 }}
      animate={{ 
        pathOffset: [0, 1 + size],
        opacity: [0, 1, 1, 0]
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        delay: delay,
        ease: "linear",
      }}
    />
    {/* BOLD WHITE CORE (The "Filament") */}
    <motion.path
      d={path}
      fill="none"
      stroke="#fff"
      strokeWidth="4"
      strokeLinecap="round"
      initial={{ pathLength: 0.05, pathOffset: -0.05, opacity: 0 }}
      animate={{ 
        pathOffset: [0, 1.05],
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
          {/* ULTRA INTENSE NEON FILTER */}
          <filter id="neon-glow-intense" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feFlood floodColor="var(--color-primary)" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="glow" />
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* MASSIVE BLOOM FILTER */}
          <filter id="massive-bloom" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="20" result="blur" />
          </filter>

          {/* Background trace pattern - static and slightly more visible */}
          <pattern id="grid-traces" x="0" y="0" width="400" height="400" patternUnits="userSpaceOnUse">
             <path d="M 0 150 L 100 150 L 150 200 L 150 300 L 200 350 L 400 350" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.15" />
             <path d="M 300 0 L 300 100 L 250 150 L 100 150" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.15" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#grid-traces)" className="text-primary" />
        
        {/* LARGE SCALE ASYMMETRICAL NEON TRACES */}
        <g className="text-primary" fill="none" stroke="currentColor" strokeWidth="3">
          {/* Path 1: Bold Diagonal Sweeps */}
          <path d="M -100 200 L 300 200 L 600 500 L 600 900" opacity="0.1" />
          <NeonTrain path="M -100 200 L 300 200 L 600 500 L 600 900" duration={7} />
          
          {/* Path 2: Wide Horizontal Branch */}
          <path d="M 1600 150 L 1000 150 L 800 350 L -200 350" opacity="0.1" />
          <NeonTrain path="M 1600 150 L 1000 150 L 800 350 L -200 350" duration={9} delay={2} size={0.12} />

          {/* Path 3: Central High-Energy Jag */}
          <path d="M 720 -100 L 720 300 L 900 480 L 900 1000" opacity="0.1" />
          <NeonTrain path="M 720 -100 L 720 300 L 900 480 L 900 1000" duration={6} delay={4} size={0.18} />

          {/* Path 4: Lower Corner Network */}
          <path d="M -50 750 L 400 750 L 550 900" opacity="0.1" />
          <NeonTrain path="M -50 750 L 400 750 L 550 900" duration={5} delay={1} size={0.2} />

          {/* Path 5: Top Edge Circuitry */}
          <path d="M 1200 -100 L 1200 100 L 1400 300 L 1600 300" opacity="0.1" />
          <NeonTrain path="M 1200 -100 L 1200 100 L 1400 300 L 1600 300" duration={8} delay={5} size={0.15} />
        </g>
      </svg>
    </div>
  );
});

CircuitBackground.displayName = "CircuitBackground";
export default CircuitBackground;
