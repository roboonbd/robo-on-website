"use client";

import { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";

const Pulse = ({ path, duration = 3, delay = 0 }: { path: string; duration?: number; delay?: number }) => (
  <g filter="url(#neon-glow)">
    <motion.path
      d={path}
      fill="none"
      stroke="var(--color-primary)"
      strokeWidth="2.5"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ 
        pathLength: [0, 1, 1],
        opacity: [0, 1, 0],
        pathOffset: [0, 0, 1]
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut",
      }}
    />
    {/* Core bright line for neon effect */}
    <motion.path
      d={path}
      fill="none"
      stroke="#fff"
      strokeWidth="0.8"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ 
        pathLength: [0, 1, 1],
        opacity: [0, 0.8, 0],
        pathOffset: [0, 0, 1]
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut",
      }}
    />
  </g>
);

const Sparkle = () => {
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; size: number }[]>([]);

  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles = Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
      }));
      setSparkles(newSparkles);
    };
    generateSparkles();
  }, []);

  return (
    <g filter="url(#neon-glow)">
      {sparkles.map((s) => (
        <motion.circle
          key={s.id}
          cx={`${s.x}%`}
          cy={`${s.y}%`}
          r={s.size}
          fill="var(--color-primary)"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 1.2, 0],
          }}
          transition={{
            duration: Math.random() * 2 + 1.5,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}
    </g>
  );
};

const CircuitBackground = memo(() => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-30 accelerate-gpu">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'hidden' }}>
        <defs>
          <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <pattern id="circuit-pattern" x="0" y="0" width="500" height="500" patternUnits="userSpaceOnUse">
            <path d="M 0 100 L 150 100 L 250 200 L 500 200" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
            <path d="M 300 150 L 350 200 L 350 500" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.15" />
            
            <Pulse path="M 0 100 L 150 100 L 250 200 L 500 200" duration={4} delay={1} />
          </pattern>
        </defs>
        
        <rect width="100%" height="100%" fill="url(#circuit-pattern)" className="text-primary" />
        
        {/* Large stylized traces with neon flowing current */}
        <g className="text-primary" fill="none" stroke="currentColor" strokeWidth="1.5">
          {/* Main sweeping trace */}
          <path d="M -50 400 L 150 400 L 300 250 L 800 250" opacity="0.1" />
          <Pulse path="M -50 400 L 150 400 L 300 250 L 800 250" duration={5} />
          
          {/* Secondary smaller trace branch */}
          <path d="M -20 500 L 250 500 L 450 300" opacity="0.1" />
          <Pulse path="M -20 500 L 250 500 L 450 300" duration={6} delay={2} />

          {/* Additional random traces for more energy */}
          <path d="M 1200 100 L 1000 100 L 900 200 L 700 200" opacity="0.1" />
          <Pulse path="M 1200 100 L 1000 100 L 900 200 L 700 200" duration={7} delay={3} />
        </g>

        {/* Dynamic Neon Sparkles */}
        <Sparkle />
        
        {/* Global Fades */}
        <defs>
          <radialGradient id="fade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--background)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="var(--background)" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
});

CircuitBackground.displayName = "CircuitBackground";
export default CircuitBackground;
