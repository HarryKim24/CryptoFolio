'use client'

import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useInView } from 'framer-motion'
import { useAnimatedNumber } from '@/utils/animatedNumber'
import TrendDescription from "@/components/home/TrendDescription"
import { Market } from '@/types/upbitTypes'

gsap.registerPlugin(ScrollTrigger)

type Ticker = {
  market: string
  trade_price: number
  acc_trade_volume_24h: number
  signed_change_rate: number
}

type CoinChange = {
  market: string
  korean_name: string
  trade_price: number
  signed_change_rate: number
}

const TrendSection = () => {
  const [ubmiValue, setUbmiValue] = useState<number>(0)
  const [ubaiValue, setUbaiValue] = useState<number>(0)
  const [topRise, setTopRise] = useState<CoinChange[]>([])
  const [topFall, setTopFall] = useState<CoinChange[]>([])

  const containerRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  const isInView = useInView(leftRef, { amount: 0.5 })
  const animatedUBMV = useAnimatedNumber(isInView ? ubmiValue : 0, { duration: 2000, trigger: isInView })
  const animatedUBAV = useAnimatedNumber(isInView ? ubaiValue : 0, { duration: 2000, trigger: isInView })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const marketRes = await fetch('https://api.upbit.com/v1/market/all')
        const markets = await marketRes.json()
        const krwMarkets = markets.filter((m: Market) => m.market.startsWith('KRW-'))

        const marketList = krwMarkets.map((m: Market) => m.market).join(',')
        const tickerRes = await fetch(`https://api.upbit.com/v1/ticker?markets=${marketList}`)
        const tickers: Ticker[] = await tickerRes.json()

        let ubmiSum = 0
        let ubaiSum = 0

        const enriched: CoinChange[] = tickers.map(t => {
          const info = krwMarkets.find((m: Market) => m.market === t.market)
          const volumeValue = t.trade_price * t.acc_trade_volume_24h
          ubmiSum += volumeValue
          if (t.market !== 'KRW-BTC') ubaiSum += volumeValue

          return {
            market: t.market,
            korean_name: info?.korean_name || t.market,
            trade_price: t.trade_price,
            signed_change_rate: t.signed_change_rate,
          }
        })

        const rises = [...enriched].sort((a, b) => b.signed_change_rate - a.signed_change_rate).slice(0, 5)
        const falls = [...enriched].sort((a, b) => a.signed_change_rate - b.signed_change_rate).slice(0, 5)

        setUbmiValue(ubmiSum)
        setUbaiValue(ubaiSum)
        setTopRise(rises)
        setTopFall(falls)
      } catch (err) {
        console.error('지수 계산 실패:', err)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (!containerRef.current || window.innerWidth < 768) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        leftRef.current,
        { y: 160 },
        {
          y: 80,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'center bottom',
            end: 'center top',
            scrub: true,
          },
        }
      )

      gsap.fromTo(
        rightRef.current,
        { y: 0 },
        {
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'center bottom',
            end: 'center top',
            scrub: true,
          },
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const renderList = (coins: CoinChange[], isRise: boolean) => (
    <ol className="space-y-2 text-sm text-left">
      {coins.map((coin, i) => (
        <li key={coin.market} className="flex justify-between">
          <span className="truncate min-w-[200px]">
            {i + 1}. {coin.korean_name} ({coin.market})
          </span>
          <span className="flex pl-2 gap-2">
            <span className="min-w-16 text-right">
              {coin.trade_price.toLocaleString()} 원
            </span>
            <span className={`w-16 pr-4 text-right ${isRise ? 'text-red-400' : 'text-blue-400'}`}>
              {(coin.signed_change_rate * 100).toFixed(2)}%
            </span>
          </span>
        </li>
      ))}
    </ol>
  )

  return (
    <div ref={containerRef} className="text-center space-y-10 px-2">
      <div className="flex flex-col justify-center items-stretch px-6 md:px-0">
        <TrendDescription />
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 mt-6 md:mt-0">
          <div
            ref={leftRef}
            className="flex-1 bg-white/5 rounded-xl px-6 py-6 shadow flex flex-col gap-4 justify-center md:max-h-[280px]"
          >
            <div>
              <h2 className="text-3xl font-bold text-neutral-100 mb-8">디지털 자산 거래규모</h2>
              <div className="space-y-6">
                <div>
                  <p className="text-neutral-400 text-lg pb-1">Market 거래규모</p>
                  <p className="text-3xl font-bold text-neutral-100">{(animatedUBMV / 1e8).toFixed(2)} 억 원</p>
                </div>
                <div>
                  <p className="text-neutral-400 text-lg pb-1">Altcoin 거래규모</p>
                  <p className="text-3xl font-bold text-neutral-100">{(animatedUBAV / 1e8).toFixed(2)} 억 원</p>
                </div>
              </div>
            </div>
          </div>

          <div ref={rightRef} className="flex-1 grid sm:grid-cols-2 gap-6 md:gap-12">
            <div className="bg-white/5 rounded-xl p-4 shadow min-w-[320px] md:min-w-0 overflow-x-auto whitespace-nowrap">
              <h3 className="text-xl font-semibold mb-4">오늘의 급등 Top 5</h3>
              {renderList(topRise, true)}
            </div>
            <div className="bg-white/5 rounded-xl p-4 shadow min-w-[320px] md:min-w-0 overflow-x-auto whitespace-nowrap">
              <h3 className="text-xl font-semibold mb-4">오늘의 급락 Top 5</h3>
              {renderList(topFall, false)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrendSection