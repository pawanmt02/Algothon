'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconLink, IconArrowRight, IconAlertCircle } from '@tabler/icons-react';
import LoadingScanner from '@/components/ui/LoadingScanner';

interface UrlInputProps {
  onAnalyze?: (url: string) => void;
  isLoading?: boolean;
  progress?: number;
}

const PLACEHOLDER_URLS = [
  'https://www.instagram.com/reels/...',
  'https://youtube.com/shorts/...',
  'https://vm.tiktok.com/...',
];

export default function UrlInput({ onAnalyze, isLoading = false, progress = 0 }: UrlInputProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [placeholder] = useState(
    PLACEHOLDER_URLS[Math.floor(Math.random() * PLACEHOLDER_URLS.length)]
  );

  const validate = (val: string): boolean => {
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }
    if (!validate(url.trim())) {
      setError('Please enter a valid URL');
      return;
    }
    if (onAnalyze) {
      onAnalyze(url.trim());
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-finradar-cyan/20 bg-finradar-cyan/3 p-10 flex flex-col items-center gap-6">
        <LoadingScanner progress={progress} message="FETCHING & ANALYZING URL" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/2 p-6 space-y-4">
        <div className="flex items-center gap-2 text-white/50 text-sm">
          <IconLink size={16} />
          <span>Paste a social media video URL</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError('');
              }}
              placeholder={placeholder}
              className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none transition-all duration-200
                focus:border-finradar-cyan/50 focus:shadow-[0_0_20px_rgba(0,212,255,0.1)]
                ${error ? 'border-finradar-red/50' : 'border-white/10'}`}
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-finradar-red text-xs"
            >
              <IconAlertCircle size={14} />
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all duration-200
              bg-gradient-to-r from-finradar-cyan/20 to-finradar-purple/20
              border border-finradar-cyan/30 text-finradar-cyan
              hover:from-finradar-cyan/30 hover:to-finradar-purple/30
              hover:shadow-[0_0_25px_rgba(0,212,255,0.2)]
              active:scale-[0.98]"
          >
            Analyze URL
            <IconArrowRight size={16} />
          </button>
        </form>

        {/* Supported platforms */}
        <div className="flex flex-wrap gap-2">
          {['YouTube Shorts', 'Instagram Reels', 'TikTok', 'Direct MP4'].map((p) => (
            <span key={p} className="text-xs px-2 py-0.5 rounded-full border border-white/8 text-white/25">
              {p}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-finradar-yellow/20 bg-finradar-yellow/5 p-3 flex gap-2">
        <span className="text-finradar-yellow text-sm flex-shrink-0">⚠</span>
        <p className="text-xs text-white/40">
          URL analysis requires the video to be publicly accessible. Private or age-restricted videos may fail.
        </p>
      </div>
    </div>
  );
}
