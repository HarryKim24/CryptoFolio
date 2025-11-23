'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useInView } from 'framer-motion';
import { useAnimatedNumber } from '@/utils/animatedNumber';
import TrendDescription from '@/components/home/TrendDescription';
import { Market } from '@/types/upbitTypes';

gsap.registerPlugin(ScrollTrigger);

type CoinChange = {
  market: string;
  korean_name: string;
  trade_price: number;
  signed_change_rate: number;
};

type TrendData = {
  ubmiValue: number;
  ubaiValue: number;
  topRise: CoinChange[];
  topFall: CoinChange[];
};

type UpbitTicker = {
  market: string;
  trade_price: number;
  acc_trade_volume_24h: number;
  signed_change_rate: number;
};

const useTrendData = () => {
  const [data, setData] = useState<TrendData>({
    ubmiValue: 0,
    ubaiValue: 0,
    topRise: [],
    topFall: [],
  });

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const marketRes = await fetch('/api/proxy/market');
        if (!marketRes.ok) {
          throw new Error('마켓 API 오류');
        }

        const markets: Market[] = await marketRes.json();
        const krwMarkets = markets.filter((item) =>
          item.market.startsWith('KRW-')
        );

        if (!krwMarkets.length) return;

        const marketList = krwMarkets.map((item) => item.market).join(',');
        const tickerRes = await fetch(
          `/api/proxy/ticker?markets=${encodeURIComponent(marketList)}`
        );
        if (!tickerRes.ok) {
          throw new Error('티커 API 오류');
        }

        const tickersRaw = await tickerRes.json();
        if (cancelled || !Array.isArray(tickersRaw)) return;

        const tickers = tickersRaw as UpbitTicker[];

        let ubmiSum = 0;
        let ubaiSum = 0;

        const enriched: CoinChange[] = tickers.map((ticker) => {
          const info = krwMarkets.find(
            (item) => item.market === ticker.market
          );
          const volumeValue =
            ticker.trade_price * ticker.acc_trade_volume_24h;

          ubmiSum += volumeValue;
          if (ticker.market !== 'KRW-BTC') {
            ubaiSum += volumeValue;
          }

          return {
            market: ticker.market,
            korean_name: info?.korean_name ?? ticker.market,
            trade_price: ticker.trade_price,
            signed_change_rate: ticker.signed_change_rate,
          };
        });

        enriched.sort(
          (a, b) => b.signed_change_rate - a.signed_change_rate
        );

        setData({
          ubmiValue: ubmiSum,
          ubaiValue: ubaiSum,
          topRise: enriched.slice(0, 5),
          topFall: [...enriched].reverse().slice(0, 5),
        });
      } catch (error) {
        if (!cancelled) {
          console.error('Trend data fetch failed:', error);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  return data;
};

type VolumeDisplayProps = {
  label: string;
  value: number;
};

const VolumeDisplay = ({ label, value }: VolumeDisplayProps) => {
  return (
    <div>
      <p className="text-neutral-400 text-lg pb-1">{label}</p>
      <p className="text-3xl font-bold text-neutral-100">
        {(value / 1e8).toFixed(0)}억 원
      </p>
    </div>
  );
};

type CoinListCardProps = {
  title: string;
  coins: CoinChange[];
  isRise: boolean;
};

const CoinListCard = ({ title, coins, isRise }: CoinListCardProps) => {
  return (
    <div className="bg-white/5 rounded-xl p-4 shadow min-w-[320px] md:w-[380px] overflow-x-auto whitespace-nowrap">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <ol className="space-y-0.5 text-sm text-left">
        {coins.map((coin, index) => (
          <li key={coin.market}>
            <Link
              href={`/chart/${coin.market}`}
              className="flex justify-between items-center p-1 -mx-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
            >
              <span className="truncate min-w-[160px] xs:min-w-[200px]">
                {index + 1}. {coin.korean_name} ({coin.market})
              </span>
              <span className="flex pl-1 gap-1">
                <span className="min-w-16 text-right">
                  {coin.trade_price.toLocaleString()} 원
                </span>
                <span
                  className={`w-16 pr-2 xs:pr-0 text-right ${
                    isRise ? 'text-red-400' : 'text-blue-400'
                  }`}
                >
                  {isRise ? '+' : ''}
                  {(coin.signed_change_rate * 100).toFixed(1)}%
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
};

const TrendSection = () => {
  const { ubmiValue, ubaiValue, topRise, topFall } = useTrendData();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);

  const isInView = useInView(leftRef, { amount: 0.5 });

  const animatedUBMV = useAnimatedNumber(
    isInView ? ubmiValue : 0,
    { duration: 2000, trigger: isInView }
  );

  const animatedUBAV = useAnimatedNumber(
    isInView ? ubaiValue : 0,
    { duration: 2000, trigger: isInView }
  );

  useEffect(() => {
    const container = containerRef.current;
    const left = leftRef.current;
    const right = rightRef.current;

    if (!container || !left || !right) return;
    if (window.innerWidth < 768) return;

    const ctx = gsap.context(() => {
      const scrollTrigger = {
        trigger: container,
        start: 'center bottom',
        end: 'center top',
        scrub: true,
      };

      gsap.fromTo(left, { y: 160 }, { y: 0, ease: 'none', scrollTrigger });
      gsap.fromTo(right, { y: 0 }, { y: 0, ease: 'none', scrollTrigger });
    }, container);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="text-center space-y-10 px-6">
      <div className="flex flex-col justify-center items-stretch px-6 md:px-0">
        <TrendDescription />

        <div className="flex flex-col md:flex-row gap-6 md:gap-12 mt-6 md:mt-0">
          <div
            ref={leftRef}
            className="flex-1 bg-white/5 rounded-xl px-6 py-6 shadow flex flex-col gap-4 justify-center md:max-h-[300px]"
          >
            <div>
              <h2 className="text-2xl font-bold text-neutral-100 mb-8">
                디지털 자산 거래규모
              </h2>
              <div className="space-y-6">
                <VolumeDisplay
                  label="Market 거래규모"
                  value={animatedUBMV}
                />
                <VolumeDisplay
                  label="Altcoin 거래규모"
                  value={animatedUBAV}
                />
              </div>
            </div>
          </div>

          <div className="flex-1 grid sm:grid-cols-2 gap-6 md:gap-12">
            <CoinListCard
              title="오늘의 급등 Top 5"
              coins={topRise}
              isRise
            />
            <CoinListCard
              title="오늘의 급락 Top 5"
              coins={topFall}
              isRise={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendSection;