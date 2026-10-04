'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  Cpu,
  Eye,
  FileCheck,
  ArrowRight,
  Sparkles,
  Zap,
  Lock,
  Video,
  BarChart3,
  Users,
} from 'lucide-react';
import ParticleBackground from '@/components/ui/ParticleBackground';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import Header from '@/components/layout/Header';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-slate-100 overflow-hidden flex flex-col">
      {/* Background FX */}
      <ParticleBackground count={60} />
      
      {/* Background Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/10 via-purple-600/15 to-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation Header */}
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 relative z-10 flex flex-col justify-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-mono shadow-[0_0_15px_rgba(0,212,255,0.2)]">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>ALGOTHON 26 SUBMISSION • TEAM FINRADAR</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-1" />
          </div>
        </motion.div>

        {/* Hero Title & Subtitle */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 leading-none"
          >
            Real-Time <span className="gradient-text">Deepfake & Financial</span> Fraud Detection Engine
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto"
          >
            Protecting regional digital ecosystems by detecting AI-manipulated short-form vertical videos (1080x1920) and flagging scam claims before viral distribution.
          </motion.p>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold text-lg shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3 group"
          >
            <ShieldAlert className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            <span>Launch Scanner</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/analysis/demo"
            className="w-full sm:w-auto px-8 py-4 rounded-xl glass hover:bg-white/10 text-slate-200 font-semibold text-lg border border-white/15 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3"
          >
            <Video className="w-5 h-5 text-cyan-400" />
            <span>View Demo Report</span>
          </Link>
        </motion.div>

        {/* Live Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto mb-20 w-full"
        >
          <GlassCard className="p-6 text-center border-cyan-500/20">
            <Zap className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
            <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-mono">
              &lt;<AnimatedCounter end={10} suffix="ms" />
            </div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1 uppercase tracking-wider">Frame Latency</div>
          </GlassCard>

          <GlassCard className="p-6 text-center border-purple-500/20">
            <Eye className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-3xl sm:text-4xl font-extrabold text-purple-400 font-mono">
              <AnimatedCounter end={99.2} decimals={1} suffix="%" />
            </div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1 uppercase tracking-wider">Detection Accuracy</div>
          </GlassCard>

          <GlassCard className="p-6 text-center border-emerald-500/20">
            <Video className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">
              1080x1920
            </div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1 uppercase tracking-wider">Vertical Video Native</div>
          </GlassCard>

          <GlassCard className="p-6 text-center border-rose-500/20">
            <Lock className="w-6 h-6 text-rose-400 mx-auto mb-2" />
            <div className="text-3xl sm:text-4xl font-extrabold text-rose-400 font-mono">
              Zero-Trust
            </div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1 uppercase tracking-wider">JWT Security</div>
          </GlassCard>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="max-w-6xl mx-auto w-full mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">
              Multimodal Inference Triage Engine
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              Combining spatial face mesh analysis with semantic NLP scam classification
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GlassCard hover glow className="p-8 border-cyan-500/20 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-3">1. Visual Forensics</h3>
              <p className="text-slate-400 text-sm leading-relaxed flex-1">
                OpenCV Haar cascades and frame entropy metrics analyze rendering inconsistencies, facial mesh micro-distortions, and boundary blurring typical of deepfakes.
              </p>
            </GlassCard>

            <GlassCard hover glow className="p-8 border-purple-500/20 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-3">2. Semantic NLP Analysis</h3>
              <p className="text-slate-400 text-sm leading-relaxed flex-1">
                Hugging Face Sentence Transformers scan extracted audio transcripts for high-risk financial fraud patterns, false yield guarantees, and scam WhatsApp groups.
              </p>
            </GlassCard>

            <GlassCard hover glow className="p-8 border-emerald-500/20 flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-3">3. Unified Scoring</h3>
              <p className="text-slate-400 text-sm leading-relaxed flex-1">
                Aggregates NLP and CV metrics into a single 0-100 Authenticity Score with timestamped vulnerability breakdowns linked directly to video playback.
              </p>
            </GlassCard>
          </div>
        </div>

        {/* Team Footer Banner */}
        <div className="max-w-4xl mx-auto w-full glass p-6 rounded-2xl border border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-cyan-400" />
            <div>
              <div className="font-semibold text-slate-200">Project Team</div>
              <div className="text-xs text-slate-400">Pawan Kumar M T & Sachin M S</div>
            </div>
          </div>
          <div className="text-xs text-slate-400 font-mono bg-black/40 px-4 py-2 rounded-lg border border-white/10">
            ALGOTHON 26 • SUBMISSION DEADLINE: 4 OCT 2026, 10:00 PM IST
          </div>
        </div>
      </main>
    </div>
  );
}
