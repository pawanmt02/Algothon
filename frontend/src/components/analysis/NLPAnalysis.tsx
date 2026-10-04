'use client';

import React from 'react';
import { AnalysisResult } from '@/lib/types';
import { MessageSquareText, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

interface NLPAnalysisProps {
  result: AnalysisResult;
}

export default function NLPAnalysis({ result }: NLPAnalysisProps) {
  const nlpScorePct = Math.round(result.nlp_score);
  const nlpFlags = result.flagged_segments.filter((s) => s.type === 'nlp');

  return (
    <div className="space-y-6">
      {/* NLP Score Indicator */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-purple-500/20">
        <div className="flex items-center gap-3">
          <MessageSquareText className="w-6 h-6 text-purple-400" />
          <div>
            <div className="text-sm font-semibold text-white">Semantic NLP Fraud Score</div>
            <div className="text-xs text-slate-400">Sentence Transformers NLP Classification</div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold font-mono text-purple-400">{nlpScorePct}/100</span>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">
            {nlpScorePct < 50 ? 'High Risk Text' : 'Low Fraud Risk'}
          </div>
        </div>
      </div>

      {/* Extracted Audio Transcript */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300">
            Extracted Audio Transcript
          </h4>
        </div>
        <div className="p-4 rounded-xl bg-black/50 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed italic relative">
          "{result.transcript || 'No transcript available'}"
        </div>
      </div>

      {/* NLP Flagged Vulnerabilities */}
      <div>
        <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 mb-3">
          Detected Scam Patterns ({nlpFlags.length})
        </h4>
        {nlpFlags.length === 0 ? (
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            No financial scam jargon or phishing patterns detected in speech.
          </div>
        ) : (
          <div className="space-y-3">
            {nlpFlags.map((flag, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 flex items-start gap-3 text-xs"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between font-semibold text-rose-200 mb-1">
                    <span>{flag.description}</span>
                    <span className="font-mono text-[10px] bg-rose-900/50 px-2 py-0.5 rounded text-rose-300">
                      @ {flag.timestamp.toFixed(1)}s
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Confidence: {(flag.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
