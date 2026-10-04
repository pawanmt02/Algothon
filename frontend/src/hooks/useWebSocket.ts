'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

type WebSocketMessage = {
  type: string;
  data: unknown;
};

type WebSocketState = 'connecting' | 'open' | 'closed' | 'error';

export function useWebSocket(url: string | null) {
  const wsRef = useRef<WebSocket | null>(null);
  const [state, setState] = useState<WebSocketState>('closed');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const listenersRef = useRef<Map<string, (data: unknown) => void>>(new Map());

  const connect = useCallback(() => {
    if (!url || wsRef.current?.readyState === WebSocket.OPEN) return;

    setState('connecting');
    wsRef.current = new WebSocket(url);

    wsRef.current.onopen = () => setState('open');
    wsRef.current.onclose = () => setState('closed');
    wsRef.current.onerror = () => setState('error');
    wsRef.current.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        setLastMessage(message);
        const listener = listenersRef.current.get(message.type);
        if (listener) listener(message.data);
      } catch {
        // Ignore parse errors
      }
    };
  }, [url]);

  const disconnect = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
    setState('closed');
  }, []);

  const on = useCallback((type: string, handler: (data: unknown) => void) => {
    listenersRef.current.set(type, handler);
    return () => listenersRef.current.delete(type);
  }, []);

  const send = useCallback((message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  useEffect(() => {
    if (url) connect();
    return () => disconnect();
  }, [url, connect, disconnect]);

  return { state, lastMessage, connect, disconnect, on, send };
}
