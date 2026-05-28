"use client";

import { memo } from "react";
import { motion } from "framer-motion";

const NeonPulse = ({ path, duration = 4, delay = 0, size = 0.05 }: { path: string; duration?: number; delay?: number; size?: number }) => (
  <g>
    {/* Thin Bloom Aura */}
    <motion.path
      d={path}
      fill="none"
      stroke="var(--color-primary)"
      strokeWidth="6"
      strokeLinecap="round"
      filter="url(#neon-bloom-tiny)"
      initial={{ pathLength: size, pathOffset: -size, opacity: 0 }}
      animate={{ 
        pathOffset: [-size, 1],
        opacity: [0, 0.4, 0.4, 0]
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        delay: delay,
        ease: "linear",
      }}
    />
    {/* Ultra Thin Neon Core */}
    <motion.path
      d={path}
      fill="none"
      stroke="var(--color-primary)"
      strokeWidth="1.5"
      strokeLinecap="round"
      filter="url(#neon-glow-tiny)"
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
          <filter id="neon-glow-tiny" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feFlood floodColor="var(--color-primary)" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="neon-bloom-tiny" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="5" result="blur" />
          </filter>
        </defs>

        {/* Numerous Scattered Ultra-Small Pulses */}
        <g className="text-primary" fill="none" stroke="currentColor" strokeWidth="0.5">
          {/* Top Region */}
          <NeonPulse path="M -50 100 L 150 100 L 250 200" duration={5} delay={1} size={0.06} />
          <NeonPulse path="M 100 -50 L 100 80 L 180 160" duration={7} delay={3} size={0.04} />
          <NeonPulse path="M 400 -20 L 450 30 L 450 200" duration={9} delay={10} size={0.05} />
          <NeonPulse path="M 1200 -30 L 1200 100 L 1350 250" duration={6} delay={5} size={0.07} />
          <NeonPulse path="M 1400 50 L 1250 200 L 1150 200" duration={8} delay={2} size={0.05} />

          {/* Mid Region */}
          <NeonPulse path="M 200 300 L 350 300 L 450 400 L 450 600" duration={10} delay={6} size={0.06} />
          <NeonPulse path="M 600 200 L 700 300 L 700 550" duration={11} delay={0} size={0.08} />
          <NeonPulse path="M 850 150 L 850 450 L 700 600" duration={12} delay={4} size={0.05} />
          <NeonPulse path="M 1100 250 L 1100 450 L 1250 600" duration={7} delay={8} size={0.06} />
          <NeonPulse path="M 1450 350 L 1300 350 L 1200 450" duration={9} delay={11} size={0.04} />

          {/* Bottom Region */}
          <NeonPulse path="M -30 650 L 200 650 L 300 750" duration={8} delay={3} size={0.07} />
          <NeonPulse path="M 150 950 L 150 800 L 350 800" duration={10} delay={7} size={0.05} />
          <NeonPulse path="M 500 950 L 500 750 L 650 600" duration={11} delay={1} size={0.06} />
          <NeonPulse path="M 1000 950 L 1000 800 L 850 650" duration={13} delay={5} size={0.04} />
          <NeonPulse path="M 1500 800 L 1300 800 L 1150 650" duration={7} delay={9} size={0.08} />
          <NeonPulse path="M 1350 950 L 1350 850 L 1450 750" duration={6} delay={12} size={0.05} />
        </g>
      </svg>
    </div>
  );
});

CircuitBackground.displayName = "CircuitBackground";
export default CircuitBackground;
