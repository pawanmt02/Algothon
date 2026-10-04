'use client';

import { useMemo } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  color: string;
}

const COLORS = [
  'rgba(0, 212, 255, VAR)',
  'rgba(0, 255, 136, VAR)',
  'rgba(124, 58, 237, VAR)',
  'rgba(0, 212, 255, VAR)',
];

interface ParticleBackgroundProps {
  count?: number;
}

export default function ParticleBackground({ count = 50 }: ParticleBackgroundProps = {}) {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.1,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)].replace(
        'VAR',
        (Math.random() * 0.6 + 0.2).toFixed(2)
      ),
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            animation: `float-particle ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* Radial gradient overlays */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-finradar-cyan/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-finradar-purple/5 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-finradar-green/3 blur-[150px] pointer-events-none" />
    </div>
  );
}
