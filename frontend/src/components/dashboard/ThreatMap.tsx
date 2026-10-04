'use client';

import React from 'react';
import { ShieldAlert, Activity } from 'lucide-react';

export default function ThreatMap() {
  return (
    <div className="glass rounded-2xl p-6 border border-slate-800 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
            Regional Fraud Threat Monitor
          </h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
          REALTIME RADAR
        </span>
      </div>

      {/* Radar Graphic Mock */}
      <div className="relative h-44 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center overflow-hidden">
        {/* Radar concentric circles */}
        <div className="absolute w-36 h-36 border border-cyan-500/20 rounded-full" />
        <div className="absolute w-24 h-24 border border-cyan-500/30 rounded-full" />
        <div className="absolute w-12 h-12 border border-cyan-500/40 rounded-full" />

        {/* Sweep radar hand */}
        <div className="absolute w-36 h-36 rounded-full radar-sweep pointer-events-none bg-gradient-to-tr from-cyan-500/20 via-transparent to-transparent" />

        {/* Threat blips */}
        <div className="absolute top-10 right-14 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
        <div className="absolute bottom-12 left-16 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <div className="absolute top-16 left-24 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />

        <div className="z-10 text-center">
          <ShieldAlert className="w-8 h-8 text-cyan-400 mx-auto mb-1 opacity-80" />
          <div className="text-xs font-mono text-cyan-300">SCANNING REGIONAL MEDIA STREAMS</div>
          <div className="text-[10px] text-slate-500">Short-form vertical format (1080x1920)</div>
        </div>
      </div>
    </div>
  );
}
