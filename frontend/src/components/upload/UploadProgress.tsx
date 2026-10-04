'use client';

import { motion } from 'framer-motion';
import { IconVideo } from '@tabler/icons-react';
import { formatFileSize } from '@/lib/utils';

interface UploadProgressProps {
  file: File;
  progress: number;
}

export default function UploadProgress({ file, progress }: UploadProgressProps) {
  return (
    <motion.div
      className="rounded-2xl border border-finradar-cyan/20 bg-finradar-cyan/3 p-6 space-y-4"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* File info */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}
        >
          <IconVideo size={22} className="text-finradar-cyan" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white/80 truncate">{file.name}</p>
          <p className="text-xs text-white/40">{formatFileSize(file.size)}</p>
        </div>
        <span className="font-mono font-bold text-finradar-cyan text-sm">{Math.round(progress)}%</span>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full rounded-full relative overflow-hidden"
            style={{ background: 'linear-gradient(90deg, #00d4ff, #7c3aed)' }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          >
            {/* Shimmer */}
            <div className="absolute inset-0 shimmer-bg" />
          </motion.div>
        </div>
        <div className="flex justify-between text-xs font-mono text-white/30">
          <span>Uploading...</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
      </div>

      {/* Scanning indicator */}
      <div className="relative h-8 rounded-lg bg-white/3 border border-white/5 overflow-hidden flex items-center px-3 gap-2">
        <div className="scanner-line" />
        <div className="w-1.5 h-1.5 rounded-full bg-finradar-cyan animate-pulse" />
        <span className="text-xs font-mono text-white/40">
          Transferring to analysis engine<span className="blink">...</span>
        </span>
      </div>
    </motion.div>
  );
}
