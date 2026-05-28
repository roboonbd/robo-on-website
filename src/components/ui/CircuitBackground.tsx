"use client";

import { memo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NeonPulse = ({ path, duration = 3, delay = 0, size = 0.08 }: { path: string; duration?: number; delay?: number; size?: number }) => (
  <g>
    {/* Sharp Neon Core */}
    <motion.path
      d={path}
      fill="none"
      stroke="var(--color-primary)"
      strokeWidth="1.5"
      strokeLinecap="round"
      filter="url(#neon-glow-surge)"
      initial={{ pathLength: size, pathOffset: -size, opacity: 0 }}
      animate={{ 
        pathOffset: [-size, 1],
        opacity: [0, 1, 1, 0]
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        repeatDelay: Math.random() * 10 + 5, // Dramatic pause between pulses
        delay: delay,
        ease: "easeInOut",
      }}
    />
  </g>
);

const CircuitBackground = memo(() => {
  const [surgeKey, setSurgeKey] = useState(0);

  // Trigger a coordinated "system surge" every 15-25 seconds
  useEffect(() => {
    const triggerSurge = () => {
      setSurgeKey(prev => prev + 1);
      const nextSurge = Math.random() * 10000 + 15000;
      setTimeout(triggerSurge, nextSurge);
    };
    
    const timer = setTimeout(triggerSurge, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-100 accelerate-gpu bg-[#000000]">
      <svg width="100%" height="100%" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="neon-glow-surge" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feFlood floodColor="var(--color-primary)" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Dynamic Energy Surges */}
        <AnimatePresence>
          <g key={surgeKey} className="text-primary" fill="none" stroke="currentColor" strokeWidth="0.5">
            {/* Group 1: Top Region Surge */}
            <NeonPulse path="M -50 100 L 150 100 L 250 200" duration={4} delay={0.1} size={0.1} />
            <NeonPulse path="M 1200 -30 L 1200 100 L 1350 250" duration={3.5} delay={0.5} size={0.08} />
            
            {/* Group 2: Center Region Surge */}
            <NeonPulse path="M 600 200 L 700 300 L 700 550" duration={5} delay={1.2} size={0.15} />
            <NeonPulse path="M 850 150 L 850 450 L 700 600" duration={4.5} delay={0.8} size={0.12} />

            {/* Group 3: Bottom Region Surge */}
            <NeonPulse path="M 150 950 L 150 800 L 350 800" duration={4} delay={2} size={0.1} />
            <NeonPulse path="M 1500 800 L 1300 800 L 1150 650" duration={4.5} delay={1.5} size={0.13} />

            {/* Rare Full-Screen Trace */}
            {surgeKey % 3 === 0 && (
              <NeonPulse path="M -100 450 L 1540 450" duration={6} delay={0} size={0.2} />
            )}
          </g>
        </AnimatePresence>

        {/* Very faint background grid for context */}
        <pattern id="grid-dim" x="0" y="0" width="400" height="400" patternUnits="userSpaceOnUse">
           <path d="M 0 150 L 50 150" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.03" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid-dim)" className="text-primary" />
      </svg>
    </div>
  );
});

CircuitBackground.displayName = "CircuitBackground";
export default CircuitBackground;
