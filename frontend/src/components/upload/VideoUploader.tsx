'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  IconUpload,
  IconVideo,
  IconX,
  IconCheck,
} from '@tabler/icons-react';
import { useUpload } from '@/hooks/useUpload';
import { formatFileSize } from '@/lib/utils';
import UploadProgress from './UploadProgress';
import UrlInput from './UrlInput';
import { cn } from '@/lib/utils';

const ACCEPTED_TYPES = {
  'video/mp4': ['.mp4'],
  'video/quicktime': ['.mov'],
  'video/x-msvideo': ['.avi'],
  'video/webm': ['.webm'],
  'video/x-matroska': ['.mkv'],
};

const MAX_SIZE = 500 * 1024 * 1024; // 500MB

export default function VideoUploader() {
  const router = useRouter();
  const { uploadFile, uploadUrl, isUploading, progress, error, file, reset } = useUpload();
  const [tab, setTab] = useState<'file' | 'url'>('file');
  const [isDone, setIsDone] = useState(false);

  const handleUpload = useCallback(
    async (f: File) => {
      const taskId = await uploadFile(f);
      if (taskId) {
        setIsDone(true);
        setTimeout(() => {
          router.push(`/analysis/${taskId}`);
        }, 800);
      } else {
        toast.error('Upload failed. Please try again.');
      }
    },
    [uploadFile, router]
  );

  const handleUrlAnalyze = useCallback(
    async (url: string) => {
      const taskId = await uploadUrl(url);
      if (taskId) {
        setIsDone(true);
        setTimeout(() => {
          router.push(`/analysis/${taskId}`);
        }, 800);
      } else {
        toast.error('URL analysis failed.');
      }
    },
    [uploadUrl, router]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles[0]) {
        handleUpload(acceptedFiles[0]);
      }
    },
    [handleUpload]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE,
    maxFiles: 1,
    disabled: isUploading || isDone,
  });

  const fileRejected = fileRejections[0];

  return (
    <div className="space-y-4">
      {/* Tab switcher */}
      <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/8">
        {(['file', 'url'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200',
              tab === t
                ? 'bg-finradar-cyan/10 text-finradar-cyan border border-finradar-cyan/20 shadow-[0_0_15px_rgba(0,212,255,0.1)]'
                : 'text-white/40 hover:text-white/70'
            )}
          >
            {t === 'file' ? '📁 Upload File' : '🔗 From URL'}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === 'file' ? (
          <motion.div
            key="file"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Dropzone */}
            {!isUploading && !isDone && (
              <div
                {...getRootProps()}
                className={cn(
                  'relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden min-h-[260px] flex flex-col items-center justify-center gap-4 p-8',
                  isDragActive
                    ? 'border-finradar-cyan bg-finradar-cyan/5 scale-[1.01] shadow-[0_0_40px_rgba(0,212,255,0.2)]'
                    : 'border-white/10 bg-white/2 hover:border-finradar-cyan/40 hover:bg-white/4 hover:shadow-[0_0_30px_rgba(0,212,255,0.1)]'
                )}
              >
                <input {...getInputProps()} />

                {/* Scanner animation when dragging */}
                {isDragActive && (
                  <div className="scanner-line" />
                )}

                {/* Animated upload icon */}
                <motion.div
                  className="relative"
                  animate={isDragActive ? { scale: 1.2, y: -8 } : { scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center"
                    style={{
                      background: isDragActive
                        ? 'rgba(0,212,255,0.15)'
                        : 'rgba(255,255,255,0.04)',
                      border: isDragActive
                        ? '1px solid rgba(0,212,255,0.5)'
                        : '1px solid rgba(255,255,255,0.08)',
                      boxShadow: isDragActive ? '0 0 30px rgba(0,212,255,0.3)' : 'none',
                    }}
                  >
                    <IconUpload
                      size={36}
                      className={isDragActive ? 'text-finradar-cyan' : 'text-white/30'}
                    />
                  </div>
                  {isDragActive && (
                    <div className="absolute -inset-2 rounded-3xl bg-finradar-cyan/10 blur-lg" />
                  )}
                </motion.div>

                <div className="text-center">
                  <p className="text-white/70 text-sm font-medium">
                    {isDragActive ? (
                      <span className="text-finradar-cyan font-bold">Drop the video file here</span>
                    ) : (
                      <>
                        <span className="text-finradar-cyan">Click to browse</span>{' '}
                        or drag & drop a video
                      </>
                    )}
                  </p>
                  <p className="text-white/30 text-xs mt-1">
                    Vertical videos preferred (1080×1920)
                  </p>
                </div>

                {/* Format badges */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {['MP4', 'MOV', 'AVI', 'WebM', 'MKV'].map((fmt) => (
                    <span
                      key={fmt}
                      className="text-xs font-mono px-2 py-0.5 rounded-full border border-white/10 text-white/30"
                    >
                      {fmt}
                    </span>
                  ))}
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full border border-white/10 text-white/30">
                    Max 500MB
                  </span>
                </div>

                {fileRejected && (
                  <p className="text-finradar-red text-xs font-mono">
                    {fileRejected.errors[0]?.message || 'File rejected'}
                  </p>
                )}
              </div>
            )}

            {/* Upload progress */}
            {isUploading && file && (
              <UploadProgress file={file} progress={progress} />
            )}

            {/* Done state */}
            {isDone && (
              <motion.div
                className="rounded-2xl border border-finradar-green/30 bg-finradar-green/5 min-h-[200px] flex flex-col items-center justify-center gap-3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.4)', boxShadow: '0 0 30px rgba(0,255,136,0.2)' }}
                >
                  <IconCheck size={32} className="text-finradar-green" />
                </div>
                <p className="text-finradar-green font-mono font-bold text-sm">UPLOAD COMPLETE</p>
                <p className="text-white/40 text-xs">Redirecting to analysis...</p>
              </motion.div>
            )}

            {/* Error */}
            {error && !isUploading && (
              <div className="rounded-xl border border-finradar-red/30 bg-finradar-red/5 p-4 flex items-center gap-3">
                <IconX size={18} className="text-finradar-red flex-shrink-0" />
                <p className="text-finradar-red text-sm">{error}</p>
                <button onClick={reset} className="ml-auto text-white/40 hover:text-white text-xs">
                  Retry
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="url"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <UrlInput onAnalyze={handleUrlAnalyze} isLoading={isUploading} progress={progress} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* File info when file is selected */}
      {file && !isDone && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex items-center gap-3 p-3 rounded-xl border border-white/8 bg-white/3"
        >
          <IconVideo size={20} className="text-finradar-cyan flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white/80 truncate font-medium">{file.name}</p>
            <p className="text-xs text-white/40">{formatFileSize(file.size)}</p>
          </div>
          <IconVideo size={16} className="text-white/20" />
        </motion.div>
      )}
    </div>
  );
}
