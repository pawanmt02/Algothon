'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import type { AnalysisState, AnalysisResult } from '@/lib/types';

const POLL_INTERVAL = 2000;
const MAX_POLLS = 60;

export function useAnalysis() {
  const [state, setState] = useState<AnalysisState>({
    status: null,
    result: null,
    isLoading: false,
    error: null,
    progress: 0,
  });

  const pollCountRef = useRef(0);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentTaskRef = useRef<string | null>(null);

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  const pollStatus = useCallback(
    async (taskId: string) => {
      currentTaskRef.current = taskId;
      pollCountRef.current = 0;

      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        progress: 0,
      }));

      const poll = async () => {
        if (currentTaskRef.current !== taskId) return;
        if (pollCountRef.current >= MAX_POLLS) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: 'Analysis timed out. Please try again.',
          }));
          return;
        }

        pollCountRef.current++;

        try {
          const status = await api.getStatus(taskId);

          setState((prev) => ({
            ...prev,
            status,
            progress: status.progress ?? prev.progress,
          }));

          if (status.status === 'completed') {
            try {
              const result = await api.getResult(taskId);
              setState((prev) => ({
                ...prev,
                result,
                isLoading: false,
                progress: 100,
              }));
            } catch {
              setState((prev) => ({
                ...prev,
                isLoading: false,
                error: 'Failed to fetch analysis result.',
              }));
            }
          } else if (status.status === 'failed') {
            setState((prev) => ({
              ...prev,
              isLoading: false,
              error: status.message || 'Analysis failed.',
            }));
          } else {
            pollTimerRef.current = setTimeout(poll, POLL_INTERVAL);
          }
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Polling error';
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: message,
          }));
        }
      };

      poll();
    },
    []
  );

  const setResult = useCallback((result: AnalysisResult) => {
    setState((prev) => ({
      ...prev,
      result,
      isLoading: false,
      progress: 100,
    }));
  }, []);

  const reset = useCallback(() => {
    stopPolling();
    currentTaskRef.current = null;
    setState({
      status: null,
      result: null,
      isLoading: false,
      error: null,
      progress: 0,
    });
  }, [stopPolling]);

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    ...state,
    pollStatus,
    setResult,
    reset,
  };
}
