'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  IconRadar,
  IconMenu2,
  IconBell,
  IconShieldCheck,
  IconVideoPlus,
  IconUser,
} from '@tabler/icons-react';

interface HeaderProps {
  onMenuClick?: () => void;
  title?: string;
}

export default function Header({ onMenuClick, title }: HeaderProps) {
  return (
    <motion.header
      className="sticky top-0 z-30 glass-dark border-b border-white/5 px-4 md:px-6 py-3 flex items-center justify-between"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
        >
          <IconMenu2 size={20} />
        </button>
        <div className="flex items-center gap-2">
          <IconRadar size={20} className="text-finradar-cyan" />
          <span className="font-bold text-sm text-white hidden sm:block">
            FinRadar <span className="text-finradar-cyan">AI</span>
          </span>
          {title && (
            <>
              <span className="text-white/20 mx-1">/</span>
              <span className="text-white/60 text-sm">{title}</span>
            </>
          )}
        </div>
      </div>

      {/* Center - Status pill */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-finradar-green/20 bg-finradar-green/5">
        <div className="w-1.5 h-1.5 rounded-full bg-finradar-green animate-pulse" />
        <span className="text-xs font-mono text-finradar-green">SYSTEM ONLINE</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-all border border-cyan-500/30 shadow-[0_0_15px_rgba(0,212,255,0.2)]"
        >
          <IconUser size={16} className="text-cyan-400" />
          <span>Sign In / Register</span>
        </Link>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition-all border border-purple-500/20"
        >
          <IconVideoPlus size={16} />
          <span>Analyze</span>
        </Link>
      </div>
    </motion.header>
  );
}
