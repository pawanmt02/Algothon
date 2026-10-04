'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ParticleBackground from '@/components/ui/ParticleBackground';
import GlassCard from '@/components/ui/GlassCard';
import { api } from '@/lib/api';
import {
  ShieldAlert,
  User,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  KeyRound,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState<boolean>(false);

  // Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleQuickFill = (user: string, pass: string) => {
    setMode('login');
    setUsername(user);
    setPassword(pass);
    toast.success(`Quick-filled ${user} credentials`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (mode === 'register' && password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      let res;
      if (mode === 'login') {
        res = await api.login(username.trim(), password.trim());
        toast.success(`Welcome back, ${username}!`);
      } else {
        res = await api.register(username.trim(), password.trim());
        toast.success(`Account created successfully! Welcome to FinRadar AI.`);
      }

      if (typeof window !== 'undefined' && res?.access_token) {
        localStorage.setItem('finradar_token', res.access_token);
        localStorage.setItem('finradar_user', username.trim());
      }

      setTimeout(() => {
        router.push('/dashboard');
      }, 600);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-slate-100 flex flex-col justify-center items-center p-4 overflow-hidden">
      {/* Background FX */}
      <ParticleBackground count={40} />
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/10 via-purple-600/15 to-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header Branding */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 relative z-10"
      >
        <Link href="/" className="inline-flex items-center gap-2 group mb-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <span className="font-extrabold text-2xl tracking-wider text-white">
            FinRadar <span className="gradient-text">AI</span>
          </span>
        </Link>
        <p className="text-xs text-slate-400 font-mono">
          Zero-Trust Authentication & Role Access Engine
        </p>
      </motion.div>

      {/* Card Container */}
      <GlassCard className="max-w-md w-full p-8 border-cyan-500/20 relative z-10 shadow-[0_0_50px_rgba(0,212,255,0.15)]">
        {/* Mode Switcher Tabs */}
        <div className="flex bg-slate-900/90 p-1 rounded-xl border border-slate-800 mb-6">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(0,212,255,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(0,212,255,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">
            {mode === 'login' ? 'Access Verification Hub' : 'Create Analyst Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login'
              ? 'Enter your credentials or use quick demo profiles below'
              : 'Register your account to access real-time multimodal media triage'}
          </p>
        </div>

        {/* Quick Demo Credentials Bar (Sign In mode) */}
        {mode === 'login' && (
          <div className="mb-6 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Quick Demo Logins:
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin', 'finradar2026')}
                className="flex-1 py-1.5 px-3 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 flex items-center justify-center gap-1 transition-all"
              >
                <ShieldCheck className="w-3 h-3 text-cyan-400" />
                <span>Admin Demo</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('demo', 'demo1234')}
                className="flex-1 py-1.5 px-3 rounded-lg bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-[11px] font-mono text-purple-300 flex items-center justify-center gap-1 transition-all"
              >
                <User className="w-3 h-3 text-purple-400" />
                <span>Analyst Demo</span>
              </button>
            </div>
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Pawan Kumar"
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-cyan-400 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1">
              {mode === 'login' ? 'Username / ID' : 'Choose Username'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-cyan-400 transition-all font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-cyan-400 transition-all font-mono"
                required
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-cyan-400 transition-all font-mono"
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,212,255,0.3)] transition-all transform active:scale-98 mt-2"
          >
            {loading ? (
              <span className="animate-pulse">Processing Token...</span>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In & Launch' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
          ALGOTHON 26 • Secure Session JWT Authentication
        </div>
      </GlassCard>
    </div>
  );
}
