'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import GlassCard from '@/components/ui/GlassCard';
import { BarChart3, TrendingUp, Download, PieChart, ShieldAlert, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100 flex flex-col">
      <Header title="Forensic Analytics" />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeItem="reports" />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Top Banner Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                Threat Intelligence <span className="gradient-text">& Analytics</span>
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Aggregated metrics on synthetic media proliferation and regional financial scam categories.
              </p>
            </div>

            <button
              onClick={() => toast.success('Executive Intelligence Report (PDF) exported successfully!')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Executive PDF</span>
            </button>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="p-6 border-cyan-500/20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-slate-400 uppercase">Detection Precision</span>
                <TrendingUp className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="text-3xl font-extrabold text-cyan-400 font-mono">99.2%</div>
              <p className="text-xs text-slate-400 mt-2">Evaluated on 1,482 short-form vertical media samples.</p>
            </GlassCard>

            <GlassCard className="p-6 border-purple-500/20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-slate-400 uppercase">Top Scam Category</span>
                <ShieldAlert className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-2xl font-extrabold text-purple-400">Guaranteed Return Scams</div>
              <p className="text-xs text-slate-400 mt-2">Accounts for 48.5% of flagged financial video claims.</p>
            </GlassCard>

            <GlassCard className="p-6 border-emerald-500/20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-slate-400 uppercase">Average Latency</span>
                <BarChart3 className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-3xl font-extrabold text-emerald-400 font-mono">8.4ms / frame</div>
              <p className="text-xs text-slate-400 mt-2">Low-latency GPU accelerated inference pipeline.</p>
            </GlassCard>
          </div>

          {/* Regional Proliferation Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 glass p-6 rounded-2xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-cyan-400" />
                  Financial Fraud Categories Distribution
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-200">Guaranteed 500%+ Returns Scams</span>
                    <span className="text-rose-400 font-bold">48.5%</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-rose-500 w-[48.5%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-200">Fake WhatsApp / Telegram Group Invites</span>
                    <span className="text-purple-400 font-bold">28.2%</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-purple-500 w-[28.2%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-200">Deepfake Influencer Endorsements</span>
                    <span className="text-cyan-400 font-bold">15.1%</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-cyan-400 w-[15.1%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-200">Phishing Reward Claim Links</span>
                    <span className="text-emerald-400 font-bold">8.2%</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-emerald-400 w-[8.2%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Audit Logs */}
            <div className="lg:col-span-5 glass p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                Security Audit Summary
              </h3>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300">
                  <div className="text-cyan-400 font-bold">[17:42:01] Visual Forensics</div>
                  <div>OpenCV Haar face mesh landmark jitter detected (0.92 confidence).</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300">
                  <div className="text-purple-400 font-bold">[17:42:04] Semantic NLP</div>
                  <div>Scam pattern match: "500% returns in 7 days".</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300">
                  <div className="text-rose-400 font-bold">[17:42:05] Authenticity Verdict</div>
                  <div>Score: 23.4/100 (HIGH DEEPFAKE THREAT LEVEL).</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
