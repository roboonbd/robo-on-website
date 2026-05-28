"use client";

import { memo } from "react";
import { motion } from "framer-motion";

const NeonTrain = ({ path, duration = 4, delay = 0, size = 0.1 }: { path: string; duration?: number; delay?: number; size?: number }) => (
  <g>
    {/* Outer bloom glow (Soft and large) */}
    <motion.path
      d={path}
      fill="none"
      stroke="var(--color-primary)"
      strokeWidth="8"
      strokeLinecap="round"
      filter="url(#neon-bloom)"
      initial={{ pathLength: size, pathOffset: -size, opacity: 0 }}
      animate={{ 
        pathOffset: [0, 1 + size],
        opacity: [0, 0.4, 0.4, 0]
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        delay: delay,
        ease: "linear",
      }}
    />
    {/* Inner neon glow (Sharp and bright) */}
    <motion.path
      d={path}
      fill="none"
      stroke="var(--color-primary)"
      strokeWidth="3.5"
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
    {/* The bright 'white core' (The train itself) */}
    <motion.path
      d={path}
      fill="none"
      stroke="#fff"
      strokeWidth="1.2"
      strokeLinecap="round"
      initial={{ pathLength: 0.03, pathOffset: -0.03, opacity: 0 }}
      animate={{ 
        pathOffset: [0, 1.03],
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
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-50 accelerate-gpu bg-[#010103]">
      <svg width="100%" height="100%" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Intense Core Glow */}
          <filter id="neon-glow-intense" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feFlood floodColor="var(--color-primary)" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Soft Outer Bloom */}
          <filter id="neon-bloom" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="10" result="blur" />
          </filter>

          {/* Background trace pattern - static and very dim */}
          <pattern id="grid-traces" x="0" y="0" width="400" height="400" patternUnits="userSpaceOnUse">
             <path d="M 0 150 L 100 150 L 150 200 L 150 300 L 200 350 L 400 350" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
             <path d="M 300 0 L 300 100 L 250 150 L 100 150" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#grid-traces)" className="text-primary" />
        
        {/* Asymmetrical High-Energy Traces */}
        <g className="text-primary" fill="none" stroke="currentColor" strokeWidth="1">
          {/* Path 1: Top Left to Mid Right */}
          <path d="M -50 100 L 200 100 L 350 250 L 350 450 L 500 600 L 900 600 L 1100 400 L 1500 400" opacity="0.05" />
          <NeonTrain path="M -50 100 L 200 100 L 350 250 L 350 450 L 500 600 L 900 600 L 1100 400 L 1500 400" duration={8} size={0.1} />
          
          {/* Path 2: Bottom Right to Top Mid */}
          <path d="M 1500 800 L 1200 800 L 1000 600 L 1000 300 L 800 100 L 400 100 L 200 -50" opacity="0.05" />
          <NeonTrain path="M 1500 800 L 1200 800 L 1000 600 L 1000 300 L 800 100 L 400 100 L 200 -50" duration={10} delay={2} size={0.08} />

          {/* Path 3: Vertical Jagged Trace */}
          <path d="M 600 -50 L 600 200 L 750 350 L 750 600 L 600 750 L 600 950" opacity="0.05" />
          <NeonTrain path="M 600 -50 L 600 200 L 750 350 L 750 600 L 600 750 L 600 950" duration={6} delay={4} size={0.12} />

          {/* Path 4: Sharp Horizontal Branch */}
          <path d="M 100 700 L 400 700 L 500 800 L 1300 800 L 1450 650" opacity="0.05" />
          <NeonTrain path="M 100 700 L 400 700 L 500 800 L 1300 800 L 1450 650" duration={7} delay={1} size={0.09} />

          {/* Path 5: Top Right Corner Loop */}
          <path d="M 1100 -50 L 1100 150 L 1300 350 L 1500 350" opacity="0.05" />
          <NeonTrain path="M 1100 -50 L 1100 150 L 1300 350 L 1500 350" duration={5} delay={5} size={0.15} />
        </g>
      </svg>
    </div>
  );
});

CircuitBackground.displayName = "CircuitBackground";
export default CircuitBackground;
