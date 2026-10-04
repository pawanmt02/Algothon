'use client';

import { motion } from 'framer-motion';

interface LoadingScannerProps {
  progress?: number;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: { outer: 80, inner: 60, mid: 40, line: 2 },
  md: { outer: 140, inner: 110, mid: 80, line: 3 },
  lg: { outer: 200, inner: 160, mid: 120, line: 4 },
};

export default function LoadingScanner({
  progress = 0,
  message = 'ANALYZING...',
  size = 'md',
}: LoadingScannerProps) {
  const s = sizes[size];

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Radar rings */}
      <div className="relative flex items-center justify-center" style={{ width: s.outer, height: s.outer }}>
        {/* Outer ring */}
        <div
          className="absolute rounded-full border border-finradar-cyan/20"
          style={{ width: s.outer, height: s.outer }}
        />
        {/* Mid ring */}
        <div
          className="absolute rounded-full border border-finradar-cyan/30"
          style={{ width: s.mid, height: s.mid }}
        />
        {/* Pulsing rings */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute rounded-full border border-finradar-cyan/10"
            style={{
              width: s.outer * 0.5 * i / 3 + s.outer * 0.5,
              height: s.outer * 0.5 * i / 3 + s.outer * 0.5,
              animation: `pulse-ring ${1.5 + i * 0.4}s cubic-bezier(0.215, 0.61, 0.355, 1) ${i * 0.2}s infinite`,
            }}
          />
        ))}
        {/* Rotating sweep */}
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden"
          animate={{ rotate: 360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 origin-bottom"
            style={{
              width: s.line,
              height: '50%',
              background: 'linear-gradient(to top, rgba(0,212,255,0.8), transparent)',
              filter: 'blur(1px)',
            }}
          />
        </motion.div>
        {/* Center dot */}
        <div
          className="w-2 h-2 rounded-full bg-finradar-cyan"
          style={{ boxShadow: '0 0 10px rgba(0,212,255,0.8), 0 0 20px rgba(0,212,255,0.4)' }}
        />
      </div>

      {/* Progress bar */}
      <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #00d4ff, #7c3aed)' }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Text */}
      <div className="text-center">
        <p className="font-mono text-sm text-finradar-cyan tracking-widest">
          {message}
          <span className="blink">_</span>
        </p>
        {progress > 0 && (
          <p className="font-mono text-xs text-white/40 mt-1">{Math.round(progress)}%</p>
        )}
      </div>
    </div>
  );
}
