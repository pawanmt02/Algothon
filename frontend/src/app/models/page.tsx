'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import GlassCard from '@/components/ui/GlassCard';
import { Cpu, Eye, MessageSquareText, Layers, CheckCircle2, Zap } from 'lucide-react';

export default function ModelsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100 flex flex-col">
      <Header title="AI Models" />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeItem="models" />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                ML Pipeline <span className="gradient-text">& Model Registry</span>
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Real-time PyTorch visual deepfake detectors and Sentence Transformer NLP scam classifiers.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-500/30 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Models Active & Loaded
            </span>
          </div>

          {/* Model Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Visual Forensics Model */}
            <GlassCard className="p-6 border-cyan-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Eye className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                  PyTorch + OpenCV
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">Visual Deepfake Detector</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Facial mesh landmark extraction & temporal boundary blur analysis.
                </p>
              </div>

              <div className="space-y-2 border-t border-slate-800 pt-4 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Backbone Architecture:</span>
                  <span className="text-cyan-300">EfficientNet-B4 + Haar Cascade</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Frame Format:</span>
                  <span className="text-cyan-300">1080×1920 (1 FPS Sampling)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Inference Latency:</span>
                  <span className="text-cyan-300">4.2ms / frame</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-400 pt-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Pre-warmed in FastAPI memory</span>
              </div>
            </GlassCard>

            {/* Semantic NLP Model */}
            <GlassCard className="p-6 border-purple-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <MessageSquareText className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/30">
                  Hugging Face
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">Semantic NLP Fraud Classifier</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Transcript embedding matching against 25+ financial scam lexicons.
                </p>
              </div>

              <div className="space-y-2 border-t border-slate-800 pt-4 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Model Weight:</span>
                  <span className="text-purple-300">all-MiniLM-L6-v2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Embedding Dimension:</span>
                  <span className="text-purple-300">384 Vector Dimensions</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Inference Latency:</span>
                  <span className="text-purple-300">3.8ms / transcript</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-400 pt-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Pre-warmed in FastAPI memory</span>
              </div>
            </GlassCard>
          </div>

          {/* Model Pipeline Specs */}
          <div className="glass p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              Multimodal Triage Flow
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-cyan-400 font-bold mb-1">Stage 1: Ingestion</div>
                <div className="text-slate-400">Asynchronous ffmpeg frame extraction & Whisper audio track isolation.</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-purple-400 font-bold mb-1">Stage 2: Parallel Triage</div>
                <div className="text-slate-400">Concurrent visual artifact detection & NLP embedding cosine scoring.</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-emerald-400 font-bold mb-1">Stage 3: Authenticity Index</div>
                <div className="text-slate-400">40% Visual + 60% NLP weighted aggregation to 0–100 Authenticity Score.</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
