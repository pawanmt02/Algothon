'use client';

import React from 'react';
import Link from 'next/link';
import RiskBadge from '@/components/ui/RiskBadge';
import { ExternalLink, Video } from 'lucide-react';

const RECENT_SAMPLES = [
  {
    id: 'demo',
    title: '500% Guaranteed Returns Scam.mp4',
    score: 23.4,
    status: 'DEEPFAKE',
    time: '5 mins ago',
  },
  {
    id: 'sample-002',
    title: 'Official Bank Advisory Update.mp4',
    score: 94.1,
    status: 'AUTHENTIC',
    time: '22 mins ago',
  },
  {
    id: 'sample-003',
    title: 'Urgent UPI Reward WhatsApp Link.mp4',
    score: 41.8,
    status: 'HIGH_RISK',
    time: '1 hour ago',
  },
];

export default function RecentAnalyses() {
  return (
    <div className="glass rounded-2xl p-6 border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
          Recent Video Verification Scans
        </h3>
        <Link href="/analysis/demo" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
          <span>View All</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-3">
        {RECENT_SAMPLES.map((item) => (
          <Link
            key={item.id}
            href={`/analysis/${item.id}`}
            className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </div>
                <div className="text-[10px] text-slate-400">{item.time}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-slate-300">{item.score.toFixed(1)}/100</span>
              <RiskBadge level={item.status as any} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
