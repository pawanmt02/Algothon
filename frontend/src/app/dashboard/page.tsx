'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import VideoUploader from '@/components/upload/VideoUploader';
import UrlInput from '@/components/upload/UrlInput';
import StatsCards from '@/components/dashboard/StatsCards';
import RecentAnalyses from '@/components/dashboard/RecentAnalyses';
import ThreatMap from '@/components/dashboard/ThreatMap';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100 flex flex-col">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeItem="dashboard" />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Top Banner Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                FinRadar <span className="gradient-text">Verification Hub</span>
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Upload short-form vertical videos (1080x1920) or submit media URLs for real-time deepfake & financial fraud triage.
              </p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <StatsCards />

          {/* Main Work Area: Upload/URL Scanner (Left) + Threat Map & Recent Scans (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Scanner Input Panel */}
            <div className="lg:col-span-7 space-y-6">
              <div className="glass rounded-2xl p-6 border border-slate-800">
                {/* Mode Selector Tabs */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <h2 className="text-lg font-semibold text-slate-200">Submit Media for Analysis</h2>
                  <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => setActiveTab('upload')}
                      className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                        activeTab === 'upload'
                          ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(0,212,255,0.4)]'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      File Upload
                    </button>
                    <button
                      onClick={() => setActiveTab('url')}
                      className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                        activeTab === 'url'
                          ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(0,212,255,0.4)]'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      URL Link
                    </button>
                  </div>
                </div>

                {activeTab === 'upload' ? <VideoUploader /> : <UrlInput />}
              </div>
            </div>

            {/* Side Panel: Threat Radar & Recent Scans */}
            <div className="lg:col-span-5 space-y-6">
              <ThreatMap />
              <RecentAnalyses />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
