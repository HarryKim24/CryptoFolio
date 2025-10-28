'use client';

import { useEffect } from 'react';
import { useUpbitTickerStore } from '@/stores/useUpbitTickerStore';

export default function UpbitTickerController() {
  const init = useUpbitTickerStore((s) => s.init);

  useEffect(() => {
    init();
    return () => {
      const { stopLive, stopPolling } = useUpbitTickerStore.getState();
      stopLive();
      stopPolling();
    };
  }, [init]);

  return null;
}