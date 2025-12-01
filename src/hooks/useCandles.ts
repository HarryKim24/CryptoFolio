'use client';

import { useEffect, useRef, useState } from 'react';
import { fetchNormalizedCandles } from '@/utils/fetchCandles';
import { GetCandlesOptions, NormalizedCandle } from '@/types/upbitTypes';

const enableWebSocket = process.env.NEXT_PUBLIC_ENABLE_WEBSOCKET === 'true';

const useCandles = (options: GetCandlesOptions) => {
  // [수정 1] options 객체를 의존성 배열에 넣으면 무한 루프가 돌기 때문에,
  // 여기서 미리 값들을 꺼내서(Destructuring) 관리합니다.
  const { market, candleType, unit, count, to } = options;

  const [data, setData] = useState<NormalizedCandle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);

  // 1. 초기 데이터 로딩 (REST API)
  useEffect(() => {
    if (!market) return;

    let isMounted = true;

    const loadCandles = async () => {
      setLoading(true);
      setError(null);

      try {
        // [수정 2] API 함수에는 다시 객체로 묶어서 전달합니다.
        // 이렇게 하면 의존성 배열에는 원시값(string, number)만 들어가서 안전합니다.
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
        if (isMounted) {
          console.error('캔들 로딩 실패:', err);
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCandles();

    return () => {
      isMounted = false;
    };
  // [수정 3] options 객체 대신, 풀어서 쓴 값들을 의존성으로 넣습니다.
  }, [market, candleType, unit, count, to]); 

  // 2. 실시간 웹소켓 연결
  useEffect(() => {
    // 여기서도 market 변수를 사용
    if (!market || data.length === 0 || !enableWebSocket) {
      return;
    }

    if (wsRef.current) {
      wsRef.current.close();
    }

    const socket = new WebSocket('wss://api.upbit.com/websocket/v1');
    wsRef.current = socket;
    socket.binaryType = 'blob'; 

    socket.onopen = () => {
      const payload = [
        { ticket: 'realtime-candle' },
        { type: 'trade', codes: [market] } // options.market 대신 market 사용
      ];
      socket.send(JSON.stringify(payload));
    };

    socket.onmessage = async (event) => {
      try {
        let text = '';
        if (event.data instanceof Blob) {
          text = await event.data.text();
        } else {
          text = event.data;
        }

        if (!text) return;
        
        const raw = JSON.parse(text);
        
        setData((prev) => {
          if (prev.length === 0) return prev;

          const updated = [...prev];
          const lastIndex = updated.length - 1;
          const lastCandle = { ...updated[lastIndex] };

          const lastTime = lastCandle.date.getTime();
          const rawTime = raw.timestamp;
          const timeDiff = Math.abs(lastTime - rawTime);
          
          // options.unit 대신 unit 사용
          const intervalMs = getIntervalMs(unit, candleType);

          if (timeDiff < intervalMs) {
            lastCandle.close = raw.trade_price;
            lastCandle.high = Math.max(lastCandle.high, raw.trade_price);
            lastCandle.low = Math.min(lastCandle.low, raw.trade_price);
            lastCandle.volume = lastCandle.volume + raw.trade_volume;
            
            updated[lastIndex] = lastCandle;
          } 

          return updated;
        });

      } catch (e) {
        console.error('소켓 데이터 처리 에러', e);
      }
    };

    return () => {
      socket.close();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [market, enableWebSocket]); // data는 의존성에서 제외

  return {
    data,
    loading,
    error,
  };
};

function getIntervalMs(unit: number | undefined, type: string): number {
  if (type === 'days') return 24 * 60 * 60 * 1000;
  if (type === 'weeks') return 7 * 24 * 60 * 60 * 1000;
  if (type === 'months') return 30 * 24 * 60 * 60 * 1000;

  const minutes = unit ?? 1;
  return minutes * 60 * 1000;
}

export default useCandles;