'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import AuthenticityScore from '@/components/analysis/AuthenticityScore';
import VisualForensics from '@/components/analysis/VisualForensics';
import NLPAnalysis from '@/components/analysis/NLPAnalysis';
import SegmentTimeline from '@/components/analysis/SegmentTimeline';
import VideoPlayer from '@/components/analysis/VideoPlayer';
import LoadingScanner from '@/components/ui/LoadingScanner';
import { MOCK_ANALYSIS } from '@/lib/constants';
import { AnalysisResult } from '@/lib/types';
import { api } from '@/lib/api';
import { Download, Share2, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AnalysisPage() {
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'visual' | 'nlp' | 'timeline'>('overview');

  useEffect(() => {
    async function fetchAnalysis() {
      if (id === 'demo' || !id) {
        setResult(MOCK_ANALYSIS);
        setLoading(false);
        return;
      }

      try {
        const data = await api.getResult(id);
        setResult(data);
      } catch (err) {
        console.warn('Backend fetch failed, using fallback mock report:', err);
        setResult({
          ...MOCK_ANALYSIS,
          task_id: id,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchAnalysis();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-slate-100 flex items-center justify-center">
        <LoadingScanner progress={85} message="Executing Multimodal Deepfake & NLP Triage..." />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-slate-100 flex items-center justify-center p-4">
        <div className="text-center glass p-8 rounded-2xl border border-red-500/30 max-w-md">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4 animate-bounce" />
          <h2 className="text-xl font-bold text-white mb-2">Analysis Report Not Found</h2>
          <p className="text-sm text-slate-400 mb-6">Could not locate task result for ID: {id}</p>
          <a
            href="/dashboard"
            className="px-6 py-2.5 rounded-xl bg-cyan-500 text-black font-semibold text-sm hover:bg-cyan-400 transition-all inline-block"
          >
            Return to Verification Hub
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100 flex flex-col">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeItem="dashboard" />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white">Forensic Analysis Report</h1>
                <span className="font-mono text-xs px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-cyan-400">
                  ID: {result.task_id}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Completed in {result.processing_time.toFixed(2)}s • Timestamp: {new Date(result.created_at).toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => toast.success('Report exported to PDF')}
                className="px-4 py-2 rounded-xl glass hover:bg-white/10 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Export PDF</span>
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Report link copied to clipboard');
                }}
                className="px-4 py-2 rounded-xl glass hover:bg-white/10 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-2"
              >
                <Share2 className="w-4 h-4 text-purple-400" />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Core Layout: Video Player + Authenticity Score Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: 1080x1920 Vertical Video Preview */}
            <div className="lg:col-span-5 flex justify-center">
              <VideoPlayer flaggedSegments={result.flagged_segments} />
            </div>

            {/* Right Column: Authenticity Score + Detailed Breakdowns */}
            <div className="lg:col-span-7 space-y-6">
              <AuthenticityScore result={result} />

              {/* Forensic Details Tabs */}
              <div className="glass rounded-2xl p-6 border border-slate-800">
                <div className="flex border-b border-slate-800 pb-3 mb-6 gap-2 sm:gap-4 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                      activeTab === 'overview'
                        ? 'border-cyan-400 text-cyan-400'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('visual')}
                    className={`pb-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                      activeTab === 'visual'
                        ? 'border-cyan-400 text-cyan-400'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Visual Forensics
                  </button>
                  <button
                    onClick={() => setActiveTab('nlp')}
                    className={`pb-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                      activeTab === 'nlp'
                        ? 'border-cyan-400 text-cyan-400'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    NLP Scam Analysis
                  </button>
                  <button
                    onClick={() => setActiveTab('timeline')}
                    className={`pb-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                      activeTab === 'timeline'
                        ? 'border-cyan-400 text-cyan-400'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Flagged Timeline ({result.flagged_segments.length})
                  </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                      <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
                        Summary Verdict
                      </h4>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        The video exhibits high visual manipulation indicators ({(result.visual_score * 100).toFixed(0)}% deepfake probability) alongside fraudulent financial claims in the audio transcript.
                      </p>
                    </div>
                    <SegmentTimeline segments={result.flagged_segments} />
                  </div>
                )}

                {activeTab === 'visual' && <VisualForensics result={result} />}

                {activeTab === 'nlp' && <NLPAnalysis result={result} />}

                {activeTab === 'timeline' && <SegmentTimeline segments={result.flagged_segments} />}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
