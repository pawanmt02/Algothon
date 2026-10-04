'use client';

import { useState, useCallback, useRef } from 'react';
import { api } from '@/lib/api';
import type { UploadState } from '@/lib/types';

export function useUpload() {
  const [state, setState] = useState<UploadState>({
    file: null,
    progress: 0,
    isUploading: false,
    taskId: null,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const setFile = useCallback((file: File | null) => {
    setState((prev) => ({ ...prev, file, error: null, progress: 0, taskId: null }));
  }, []);

  const uploadFile = useCallback(
    async (file: File): Promise<string | null> => {
      setState((prev) => ({
        ...prev,
        file,
        isUploading: true,
        progress: 0,
        error: null,
        taskId: null,
      }));

      try {
        const result = await api.analyzeFile(file, (progress) => {
          setState((prev) => ({ ...prev, progress }));
        });

        setState((prev) => ({
          ...prev,
          isUploading: false,
          progress: 100,
          taskId: result.task_id,
        }));

        return result.task_id;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Upload failed. Please try again.';
        setState((prev) => ({
          ...prev,
          isUploading: false,
          progress: 0,
          error: message,
        }));
        return null;
      }
    },
    []
  );

  const uploadUrl = useCallback(async (url: string): Promise<string | null> => {
    setState((prev) => ({
      ...prev,
      isUploading: true,
      progress: 10,
      error: null,
      taskId: null,
    }));

    try {
      // Simulate progress for URL analysis
      const interval = setInterval(() => {
        setState((prev) => ({
          ...prev,
          progress: Math.min(prev.progress + 15, 85),
        }));
      }, 400);

      const result = await api.analyzeUrl(url);
      clearInterval(interval);

      setState((prev) => ({
        ...prev,
        isUploading: false,
        progress: 100,
        taskId: result.task_id,
      }));

      return result.task_id;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'URL analysis failed. Please try again.';
      setState((prev) => ({
        ...prev,
        isUploading: false,
        progress: 0,
        error: message,
      }));
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      file: null,
      progress: 0,
      isUploading: false,
      taskId: null,
      error: null,
    });
  }, []);

  const cancel = useCallback(() => {
    abortControllerRef.current?.abort();
    reset();
  }, [reset]);

  return {
    ...state,
    setFile,
    uploadFile,
    uploadUrl,
    reset,
    cancel,
  };
}
