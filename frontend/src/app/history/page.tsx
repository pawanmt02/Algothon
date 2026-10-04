'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import RiskBadge from '@/components/ui/RiskBadge';
import GlassCard from '@/components/ui/GlassCard';
import { Search, Filter, Video, ArrowUpRight, ShieldAlert, Calendar } from 'lucide-react';

const MOCK_HISTORY_ITEMS = [
  {
    id: 'demo',
    title: '500% Guaranteed Returns Scam.mp4',
    type: 'Vertical Video (1080x1920)',
    score: 23.4,
    status: 'DEEPFAKE',
    nlpScore: 31.2,
    visualScore: 18.6,
    date: '2026-10-04 17:42',
    duration: '00:32',
  },
  {
    id: 'scan-002',
    title: 'Official Bank Security Advisory.mp4',
    type: 'Vertical Video (1080x1920)',
    score: 94.1,
    status: 'AUTHENTIC',
    nlpScore: 96.5,
    visualScore: 91.8,
    date: '2026-10-04 16:15',
    duration: '00:45',
  },
  {
    id: 'scan-003',
    title: 'Urgent UPI Reward Scheme Claim.mp4',
    type: 'Social Reel URL',
    score: 41.8,
    status: 'HIGH_RISK',
    nlpScore: 38.0,
    visualScore: 45.6,
    date: '2026-10-04 14:30',
    duration: '00:20',
  },
  {
    id: 'scan-004',
    title: 'Crypto Instant Multiplier Influencer.mp4',
    type: 'Vertical Video (1080x1920)',
    score: 15.2,
    status: 'DEEPFAKE',
    nlpScore: 12.4,
    visualScore: 18.0,
    date: '2026-10-04 11:10',
    duration: '00:58',
  },
  {
    id: 'scan-005',
    title: 'Stock Market Masterclass Promotion.mp4',
    type: 'Vertical Video (1080x1920)',
    score: 68.5,
    status: 'SUSPICIOUS',
    nlpScore: 62.1,
    visualScore: 74.9,
    date: '2026-10-03 21:05',
    duration: '01:12',
  },
];

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredItems = MOCK_HISTORY_ITEMS.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'ALL' || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100 flex flex-col">
      <Header title="Scan History" />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeItem="history" />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                Verification <span className="gradient-text">History & Archive</span>
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Audit trail of all scanned short-form vertical videos and URL submissions.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1.5 rounded-full border border-cyan-500/30">
              {filteredItems.length} Records Found
            </span>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center glass p-4 rounded-2xl border border-slate-800">
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search scans by title or keyword..."
                className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 transition-all"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400 mr-1 hidden sm:block" />
              {['ALL', 'DEEPFAKE', 'HIGH_RISK', 'SUSPICIOUS', 'AUTHENTIC'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                    filterStatus === status
                      ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(0,212,255,0.4)]'
                      : 'glass text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Scans Table / Cards */}
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <GlassCard
                key={item.id}
                hover
                glow={item.status === 'DEEPFAKE' ? 'red' : 'cyan'}
                className="p-5 border-slate-800"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-100 text-sm md:text-base flex items-center gap-2">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {item.date}
                        </span>
                        <span>•</span>
                        <span>{item.type}</span>
                        <span>•</span>
                        <span>{item.duration}</span>
                      </div>
                    </div>
                  </div>

                  {/* Scores & Risk Badge */}
                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-slate-800/80 pt-3 md:pt-0">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Authenticity Score</div>
                      <div className="text-lg font-bold font-mono text-white">
                        {item.score.toFixed(1)}/100
                      </div>
                    </div>

                    <RiskBadge level={item.status as any} />

                    <Link
                      href={`/analysis/${item.id}`}
                      className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1 transition-all"
                    >
                      <span>Report</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
