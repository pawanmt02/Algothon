'use client';

import { cn } from '@/lib/utils';
import type { RiskLevel } from '@/lib/types';
import { RISK_COLORS } from '@/lib/constants';
import { motion } from 'framer-motion';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-3 py-1 gap-1.5',
  lg: 'text-base px-4 py-2 gap-2',
};

const labels: Record<RiskLevel, string> = {
  AUTHENTIC: '✓ AUTHENTIC',
  SUSPICIOUS: '⚠ SUSPICIOUS',
  HIGH_RISK: '⚡ HIGH RISK',
  DEEPFAKE: '☠ DEEPFAKE',
};

export default function RiskBadge({
  level,
  size = 'md',
  pulse = false,
  className,
}: RiskBadgeProps) {
  const color = RISK_COLORS[level];

  return (
    <motion.div
      className={cn(
        'inline-flex items-center rounded-full font-mono font-bold uppercase tracking-widest border',
        sizeClasses[size],
        className
      )}
      style={{
        color,
        borderColor: `${color}40`,
        backgroundColor: `${color}15`,
        boxShadow: `0 0 15px ${color}30`,
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      {pulse && (
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 6px ${color}`,
            animation: 'pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
          }}
        />
      )}
      {labels[level]}
    </motion.div>
  );
}
