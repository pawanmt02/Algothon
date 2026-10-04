'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface ScoreGaugeProps {
  score: number;
  size?: number;
  showLabel?: boolean;
  animated?: boolean;
}

function getScoreColor(score: number): string {
  if (score >= 75) return '#00ff88';
  if (score >= 50) return '#ffcc00';
  if (score >= 25) return '#ff8c00';
  return '#ff3366';
}

function getScoreLabel(score: number): string {
  if (score >= 75) return 'AUTHENTIC';
  if (score >= 50) return 'SUSPICIOUS';
  if (score >= 25) return 'HIGH RISK';
  return 'DEEPFAKE';
}

export default function ScoreGauge({
  score,
  size = 220,
  showLabel = true,
  animated = true,
}: ScoreGaugeProps) {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true });
  const [displayScore, setDisplayScore] = useState(0);

  const radius = (size - 40) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = -210;
  const endAngle = 30;
  const totalArc = endAngle - startAngle; // 240 degrees
  const circumference = (totalArc / 360) * 2 * Math.PI * radius;

  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  // Animate score counter
  useEffect(() => {
    if (!isInView) return;
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(eased * score);

      if (progress < 1) requestAnimationFrame(animate);
    };

    if (animated) {
      requestAnimationFrame(animate);
    } else {
      setDisplayScore(score);
    }
  }, [isInView, score, animated]);

  // Arc math
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const getPoint = (angle: number) => ({
    x: cx + radius * Math.cos(toRad(angle)),
    y: cy + radius * Math.sin(toRad(angle)),
  });

  const describeArc = (start: number, end: number, r: number) => {
    const s = getPoint(start);
    const e = getPoint(end);
    const largeArc = end - start > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
  };

  const progressAngle = startAngle + (totalArc * displayScore) / 100;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          ref={ref}
          width={size}
          height={size}
          className="overflow-visible"
        >
          {/* Background track */}
          <path
            d={describeArc(startAngle, endAngle, radius)}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={14}
            strokeLinecap="round"
          />
          {/* Tick marks */}
          {Array.from({ length: 11 }, (_, i) => {
            const angle = startAngle + (totalArc * i) / 10;
            const inner = getPoint2(cx, cy, radius - 18, angle);
            const outer = getPoint2(cx, cy, radius - 10, angle);
            return (
              <line
                key={i}
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth={1}
              />
            );
          })}
          {/* Gradient progress arc */}
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff3366" />
              <stop offset="33%" stopColor="#ff8c00" />
              <stop offset="66%" stopColor="#ffcc00" />
              <stop offset="100%" stopColor="#00ff88" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <motion.path
            d={describeArc(startAngle, progressAngle, radius)}
            fill="none"
            stroke={color}
            strokeWidth={14}
            strokeLinecap="round"
            filter="url(#glow)"
            initial={{ pathLength: 0 }}
            animate={isInView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
          {/* Score circle indicator */}
          <motion.circle
            cx={getPoint(progressAngle).x}
            cy={getPoint(progressAngle).y}
            r={8}
            fill={color}
            filter="url(#glow)"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.3, delay: 1.2 }}
          />
        </svg>

        {/* Center display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <motion.div
            className="text-5xl font-black font-mono"
            style={{ color }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            {displayScore.toFixed(1)}
          </motion.div>
          <div className="text-xs text-white/40 font-mono tracking-widest mt-1">/ 100</div>
          <div className="text-xs font-mono text-white/30 mt-0.5">SCORE</div>
        </div>
      </div>

      {showLabel && (
        <motion.div
          className="font-mono font-bold tracking-widest text-sm px-4 py-1.5 rounded-full border"
          style={{
            color,
            borderColor: `${color}40`,
            backgroundColor: `${color}15`,
            boxShadow: `0 0 20px ${color}30`,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
        >
          {label}
        </motion.div>
      )}
    </div>
  );
}

function getPoint2(cx: number, cy: number, r: number, angle: number) {
  const rad = (angle * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
