'use client';

import { motion } from 'framer-motion';
import { IconShieldCheck, IconAlertTriangle, IconBug } from '@tabler/icons-react';
import type { AnalysisResult } from '@/lib/types';
import { getRiskLevel, getRiskColor } from '@/lib/utils';
import ScoreGauge from '@/components/ui/ScoreGauge';

interface AuthenticityScoreProps {
  result: AnalysisResult;
}

export default function AuthenticityScore({ result }: AuthenticityScoreProps) {
  const riskLevel = getRiskLevel(result.authenticity_score);
  const color = getRiskColor(riskLevel);

  const bars = [
    {
      label: 'Visual Score',
      value: result.visual_score,
      icon: IconBug,
      description: 'Facial manipulation, frame inconsistency',
    },
    {
      label: 'NLP Score',
      value: result.nlp_score,
      icon: IconAlertTriangle,
      description: 'Financial fraud keywords, phishing patterns',
    },
    {
      label: 'Deepfake Probability',
      value: result.deepfake_probability * 100,
      icon: IconShieldCheck,
      description: 'Synthetic media likelihood',
      inverted: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main gauge */}
      <div className="flex flex-col items-center">
        <ScoreGauge score={result.authenticity_score} size={200} />
      </div>

      {/* Score breakdown */}
      <div className="space-y-3">
        <p className="text-xs font-mono text-white/40 uppercase tracking-widest">Score Breakdown</p>
        {bars.map((bar, i) => {
          const barColor = bar.inverted
            ? bar.value > 75 ? '#ff3366' : bar.value > 50 ? '#ffcc00' : '#00ff88'
            : bar.value >= 75 ? '#00ff88' : bar.value >= 50 ? '#ffcc00' : '#ff3366';

          return (
            <motion.div
              key={bar.label}
              className="space-y-1.5"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-white/60">
                  <bar.icon size={12} style={{ color: barColor }} />
                  <span>{bar.label}</span>
                </div>
                <span className="font-mono font-bold" style={{ color: barColor }}>
                  {bar.value.toFixed(1)}
                </span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: barColor, boxShadow: `0 0 8px ${barColor}60` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(bar.value, 100)}%` }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.1, ease: 'easeOut' }}
                />
              </div>
              <p className="text-[10px] text-white/25">{bar.description}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Processing info */}
      <div className="rounded-xl border border-white/5 bg-white/2 p-3 grid grid-cols-2 gap-3 text-xs font-mono">
        <div>
          <p className="text-white/25">Processing Time</p>
          <p className="text-white/60 font-bold">{result.processing_time.toFixed(2)}s</p>
        </div>
        <div>
          <p className="text-white/25">Flagged Segments</p>
          <p className="font-bold" style={{ color: result.flagged_segments.length > 0 ? '#ff3366' : '#00ff88' }}>
            {result.flagged_segments.length} found
          </p>
        </div>
        {result.resolution && (
          <div>
            <p className="text-white/25">Resolution</p>
            <p className="text-white/60 font-bold">{result.resolution}</p>
          </div>
        )}
        {result.duration && (
          <div>
            <p className="text-white/25">Duration</p>
            <p className="text-white/60 font-bold">{result.duration.toFixed(1)}s</p>
          </div>
        )}
      </div>
    </div>
  );
}
