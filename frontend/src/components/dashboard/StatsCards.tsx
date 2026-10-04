'use client';

import React from 'react';
import GlassCard from '@/components/ui/GlassCard';
import { ShieldCheck, ShieldAlert, Video, Cpu } from 'lucide-react';

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <GlassCard className="p-5 border-cyan-500/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-mono uppercase tracking-wider">Total Scanned</div>
            <div className="text-2xl font-bold font-mono text-white mt-1">1,482</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Video className="w-5 h-5" />
          </div>
        </div>
        <div className="text-[11px] text-cyan-400 mt-3 font-mono">↑ 18% from yesterday</div>
      </GlassCard>

      <GlassCard className="p-5 border-rose-500/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-mono uppercase tracking-wider">Deepfakes Flagged</div>
            <div className="text-2xl font-bold font-mono text-rose-400 mt-1">319</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
        <div className="text-[11px] text-rose-400 mt-3 font-mono">21.5% threat detection rate</div>
      </GlassCard>

      <GlassCard className="p-5 border-emerald-500/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-mono uppercase tracking-wider">Verified Authentic</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">1,163</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
        <div className="text-[11px] text-emerald-400 mt-3 font-mono">Clean media verified</div>
      </GlassCard>

      <GlassCard className="p-5 border-purple-500/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-mono uppercase tracking-wider">Avg Latency</div>
            <div className="text-2xl font-bold font-mono text-purple-400 mt-1">8.4ms</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Cpu className="w-5 h-5" />
          </div>
        </div>
        <div className="text-[11px] text-purple-400 mt-3 font-mono">Real-time inference active</div>
      </GlassCard>
    </div>
  );
}
