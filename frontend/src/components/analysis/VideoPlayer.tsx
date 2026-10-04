'use client';

import React, { useState } from 'react';
import { FlaggedSegment } from '@/lib/types';
import { Play, Pause, AlertTriangle, ShieldCheck, Volume2 } from 'lucide-react';

interface VideoPlayerProps {
  flaggedSegments: FlaggedSegment[];
}

export default function VideoPlayer({ flaggedSegments }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeSegment, setActiveSegment] = useState<FlaggedSegment | null>(
    flaggedSegments[0] || null
  );

  return (
    <div className="flex flex-col items-center">
      {/* 1080x1920 Vertical Aspect Ratio Mock Video Box */}
      <div className="relative w-[280px] h-[498px] sm:w-[320px] sm:h-[568px] rounded-3xl overflow-hidden glass border-2 border-cyan-500/30 shadow-[0_0_40px_rgba(0,212,255,0.2)] flex flex-col justify-between p-4 group">
        {/* Mock Simulated Video Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-indigo-950/80 to-slate-950 flex items-center justify-center -z-10">
          <div className="w-48 h-48 rounded-full bg-cyan-500/10 blur-2xl animate-pulse" />
          {/* Facial Mesh Wireframe overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
            <div className="w-36 h-48 border-2 border-dashed border-cyan-400 rounded-full flex items-center justify-center">
              <div className="w-24 h-24 border border-purple-400 rounded-full" />
            </div>
          </div>
        </div>

        {/* Top Video Overlay Bar */}
        <div className="flex items-center justify-between z-10 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            LIVE VERIFICATION
          </div>
          <span className="text-[10px] font-mono text-slate-400">1080×1920</span>
        </div>

        {/* Active Flagged Overlay Alert */}
        {activeSegment && (
          <div className="z-10 bg-red-950/90 backdrop-blur-md border border-red-500/50 p-3 rounded-2xl animate-pulse">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-300 mb-1">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>
                {activeSegment.type.toUpperCase()} FLAG @ {activeSegment.timestamp.toFixed(1)}s
              </span>
            </div>
            <p className="text-[11px] text-slate-200 leading-snug">
              {activeSegment.description}
            </p>
          </div>
        )}

        {/* Center Play Button Overlay */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="self-center my-auto z-10 w-16 h-16 rounded-full bg-cyan-500/20 backdrop-blur-md border border-cyan-400 flex items-center justify-center text-cyan-300 hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,212,255,0.4)]"
        >
          {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
        </button>

        {/* Bottom Playbar Controls */}
        <div className="z-10 space-y-2 bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
            <span>00:08 / 00:30</span>
            <Volume2 className="w-4 h-4 text-cyan-400" />
          </div>

          {/* Timestamp Segment Markers Bar */}
          <div className="h-2 w-full bg-slate-800 rounded-full relative overflow-hidden">
            <div className="h-full bg-cyan-500 w-1/3" />
            {flaggedSegments.map((seg, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSegment(seg)}
                title={`Flag @ ${seg.timestamp}s`}
                className="absolute top-0 bottom-0 w-2 bg-rose-500 hover:scale-125 transition-transform"
                style={{ left: `${(seg.timestamp / 30) * 100}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
