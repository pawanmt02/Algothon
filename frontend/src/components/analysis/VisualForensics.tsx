'use client';

import React from 'react';
import { AnalysisResult } from '@/lib/types';
import { Eye, ShieldAlert, Cpu, Sparkles } from 'lucide-react';

interface VisualForensicsProps {
  result: AnalysisResult;
}

export default function VisualForensics({ result }: VisualForensicsProps) {
  const deepfakeProbPct = Math.round(result.deepfake_probability * 100);
  const visualFlags = result.flagged_segments.filter((s) => s.type === 'visual');

  return (
    <div className="space-y-6">
      {/* Visual Manipulation Gauge */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-cyan-500/20">
        <div className="flex items-center gap-3">
          <Eye className="w-6 h-6 text-cyan-400" />
          <div>
            <div className="text-sm font-semibold text-white">Visual Deepfake Probability</div>
            <div className="text-xs text-slate-400">OpenCV Face Mesh & Frame Inconsistency Analysis</div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold font-mono text-cyan-400">{deepfakeProbPct}%</span>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">
            {deepfakeProbPct > 50 ? 'AI Synthetic Media' : 'Natural Footage'}
          </div>
        </div>
      </div>

      {/* Frame Artifact Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl glass border border-slate-800">
          <div className="flex items-center gap-2 mb-2 text-xs font-mono text-cyan-400 uppercase">
            <Cpu className="w-4 h-4" /> Facial Mesh Stability
          </div>
          <div className="text-sm font-semibold text-white mb-1">
            {deepfakeProbPct > 60 ? 'Distortions Detected' : 'Stable Trajectory'}
          </div>
          <p className="text-xs text-slate-400">
            Temporal landmark shifts across adjacent vertical video frames.
          </p>
        </div>

        <div className="p-4 rounded-xl glass border border-slate-800">
          <div className="flex items-center gap-2 mb-2 text-xs font-mono text-cyan-400 uppercase">
            <Sparkles className="w-4 h-4" /> Boundary Blur & Blending
          </div>
          <div className="text-sm font-semibold text-white mb-1">
            {deepfakeProbPct > 50 ? 'High Blending Inconsistency' : 'Natural Edge Profile'}
          </div>
          <p className="text-xs text-slate-400">
            Laplacian blur variance evaluated at facial mask boundaries.
          </p>
        </div>
      </div>

      {/* Flagged Visual Segments */}
      <div>
        <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 mb-3">
          Flagged Visual Anomalies ({visualFlags.length})
        </h4>
        <div className="space-y-3">
          {visualFlags.map((flag, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-start gap-3 text-xs"
            >
              <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between font-semibold text-cyan-200 mb-1">
                  <span>{flag.description}</span>
                  <span className="font-mono text-[10px] bg-cyan-900/50 px-2 py-0.5 rounded text-cyan-300">
                    @ {flag.timestamp.toFixed(1)}s
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Confidence Score: {(flag.confidence * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
