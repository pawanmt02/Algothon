'use client';

import { cn } from '@/lib/utils';

interface AnimatedBorderProps {
  children: React.ReactNode;
  className?: string;
  borderClassName?: string;
  colors?: string;
  rounded?: string;
}

export default function AnimatedBorder({
  children,
  className,
  borderClassName,
  colors = 'from-finradar-cyan via-finradar-purple to-finradar-green',
  rounded = 'rounded-2xl',
}: AnimatedBorderProps) {
  return (
    <div className={cn('relative p-[1px]', rounded, className)}>
      {/* Animated gradient border */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-r animate-gradient-x',
          colors,
          rounded,
          'opacity-70',
          borderClassName
        )}
        style={{ backgroundSize: '300% 300%' }}
      />
      {/* Inner content */}
      <div className={cn('relative z-10', rounded, 'overflow-hidden')}>
        {children}
      </div>
    </div>
  );
}
