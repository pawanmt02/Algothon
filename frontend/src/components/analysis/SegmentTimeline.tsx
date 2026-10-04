'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { FlaggedSegment } from '@/lib/types';
import { formatTimestamp } from '@/lib/utils';
import Tooltip from '@/components/ui/Tooltip';

interface SegmentTimelineProps {
  segments: FlaggedSegment[];
  duration?: number;
}

const segmentColors: Record<string, { bg: string; border: string; text: string }> = {
  visual: { bg: 'rgba(255,51,102,0.3)', border: '#ff3366', text: '#ff3366' },
  nlp: { bg: 'rgba(255,140,0,0.3)', border: '#ff8c00', text: '#ff8c00' },
  audio: { bg: 'rgba(255,204,0,0.3)', border: '#ffcc00', text: '#ffcc00' },
};

const segmentLabels: Record<string, string> = {
  visual: '👁 Visual',
  nlp: '📝 NLP',
  audio: '🔊 Audio',
};

export default function SegmentTimeline({ segments, duration = 30 }: SegmentTimelineProps) {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

  if (segments.length === 0) {
    return (
      <div className="rounded-xl border border-finradar-green/20 bg-finradar-green/5 p-6 text-center">
        <p className="text-finradar-green font-mono text-sm">✓ No flagged segments detected</p>
        <p className="text-white/30 text-xs mt-1">Video appears clean across all timeframes</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Timeline bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono text-white/30">
          <span>0:00</span>
          <span>{formatTimestamp(duration)}</span>
        </div>

        <div className="relative h-10 bg-finradar-green/10 rounded-lg overflow-hidden border border-white/5">
          {/* Clean baseline */}
          <div className="absolute inset-0 bg-finradar-green/5" />

          {/* Flagged segments */}
          {segments.map((seg, i) => {
            const left = (seg.timestamp / duration) * 100;
            const width = (seg.duration / duration) * 100;
            const colors = segmentColors[seg.type] || segmentColors.visual;

            return (
              <Tooltip
                key={i}
                content={
                  <div className="space-y-1 max-w-[200px]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: colors.bg, color: colors.text }}>
                        {segmentLabels[seg.type]}
                      </span>
                      <span className="text-[10px] font-mono text-white/50">
                        {(seg.confidence * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                    <p className="text-xs text-white/70">{seg.description}</p>
                    <p className="text-[10px] font-mono text-white/40">
                      {formatTimestamp(seg.timestamp)} → {formatTimestamp(seg.timestamp + seg.duration)}
                    </p>
                  </div>
                }
              >
                <motion.div
                  className="absolute top-0 h-full rounded cursor-pointer"
                  style={{
                    left: `${left}%`,
                    width: `${Math.max(width, 1.5)}%`,
                    backgroundColor: colors.bg,
                    borderLeft: `2px solid ${colors.border}`,
                    boxShadow: hoveredSegment === i ? `0 0 12px ${colors.border}` : 'none',
                  }}
                  onMouseEnter={() => setHoveredSegment(i)}
                  onMouseLeave={() => setHoveredSegment(null)}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: i * 0.1 }}
                />
              </Tooltip>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(segmentColors).map(([type, colors]) => (
          <div key={type} className="flex items-center gap-1.5 text-xs">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors.bg, border: `1px solid ${colors.border}` }} />
            <span className="text-white/40 capitalize">{type}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 text-xs">
          <div className="w-3 h-3 rounded-sm bg-finradar-green/10 border border-finradar-green/30" />
          <span className="text-white/40">Clean</span>
        </div>
      </div>

      {/* Segment list */}
      <div className="space-y-2">
        <p className="text-xs font-mono text-white/40 uppercase tracking-widest">Flagged Segments ({segments.length})</p>
        {segments.map((seg, i) => {
          const colors = segmentColors[seg.type] || segmentColors.visual;
          return (
            <motion.div
              key={i}
              className="flex gap-3 p-3 rounded-xl border bg-white/2 hover:bg-white/4 transition-colors"
              style={{ borderColor: `${colors.border}20` }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div
                className="w-1 rounded-full flex-shrink-0 self-stretch"
                style={{ backgroundColor: colors.border }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded uppercase"
                    style={{ background: colors.bg, color: colors.text }}
                  >
                    {seg.type}
                  </span>
                  <span className="text-[10px] font-mono text-white/40">
                    {formatTimestamp(seg.timestamp)} – {formatTimestamp(seg.timestamp + seg.duration)}
                  </span>
                  <span className="text-[10px] font-mono ml-auto" style={{ color: colors.text }}>
                    {(seg.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-xs text-white/60 leading-relaxed">{seg.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
