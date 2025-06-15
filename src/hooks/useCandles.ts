"use client";

import { useEffect, useState } from "react";
import { GetCandlesOptions, NormalizedCandle } from "@/types/upbitCandle";
import { fetchNormalizedCandles } from "@/utils/fetchCandles";

const useCandles = (options: GetCandlesOptions) => {
  const [data, setData] = useState<NormalizedCandle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        const candles = await fetchNormalizedCandles(options);
        if (!ignore) setData(candles);
      } catch (err) {
        if (!ignore) setError(err as Error);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [options]);

  return { data, loading, error };
};

export default useCandles;