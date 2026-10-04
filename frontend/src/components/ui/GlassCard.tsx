'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean | 'cyan' | 'green' | 'purple' | 'red' | 'none';
  onClick?: () => void;
  delay?: number;
  animate?: boolean;
}

const glowColors = {
  cyan: 'hover:shadow-[0_0_30px_rgba(0,212,255,0.2)] hover:border-finradar-cyan/30',
  green: 'hover:shadow-[0_0_30px_rgba(0,255,136,0.2)] hover:border-finradar-green/30',
  purple: 'hover:shadow-[0_0_30px_rgba(124,58,237,0.2)] hover:border-finradar-purple/30',
  red: 'hover:shadow-[0_0_30px_rgba(255,51,102,0.2)] hover:border-finradar-red/30',
  none: '',
};

export default function GlassCard({
  children,
  className,
  hover = true,
  glow = 'cyan',
  onClick,
  delay = 0,
  animate = true,
}: GlassCardProps) {
  const Comp = animate ? motion.div : 'div';

  const animProps = animate
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, delay },
        whileHover: hover ? { scale: 1.01, y: -2 } : undefined,
      }
    : {};

  const resolvedGlow = typeof glow === 'boolean' ? (glow ? 'cyan' : 'none') : glow;

  return (
    <Comp
      className={cn(
        'glass rounded-2xl transition-all duration-300',
        hover && 'cursor-pointer',
        resolvedGlow !== 'none' && glowColors[resolvedGlow],
        className
      )}
      onClick={onClick}
      {...animProps}
    >
      {children}
    </Comp>
  );
}
