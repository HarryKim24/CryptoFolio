'use client';

import { useEffect, useState } from 'react';
import { fetchNormalizedCandles } from '@/utils/fetchCandles';
import { GetCandlesOptions, NormalizedCandle } from '@/types/upbitTypes';

const useCandles = (options: GetCandlesOptions) => {
  const { market, candleType, unit, count, to } = options;

  const [data, setData] = useState<NormalizedCandle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!market) return;

    let isMounted = true;
    
    const loadCandles = async (isFirstLoad = false) => {
      if (isFirstLoad) {
        setLoading(true);
        setData([]);
        setError(null);
      }

      try {
        const candles = await fetchNormalizedCandles({
          market,
          candleType,
          unit,
          count,
          to
        });
        
        if (isMounted) {
          setData(candles);
        }
      } catch (err) {
        if (isMounted && isFirstLoad) {
          console.error('캔들 로딩 실패:', err);
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (isMounted && isFirstLoad) {
          setLoading(false);
        }
      }
    };

    loadCandles(true);

    const intervalId = setInterval(() => {
      loadCandles(false);
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [market, candleType, unit, count, to]); 

  return {
    data,
    loading,
    error,
  };
};

export default useCandles;