'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useAnimatedNumber } from '@/utils/animatedNumber'
import { useInView } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

const MainSection = () => {
  const router = useRouter()
  const { data: session } = useSession()

  const [assetCount, setAssetCount] = useState(0)
  const [marketCount, setMarketCount] = useState(0)

  const sectionRef = useRef<HTMLDivElement>(null)
  const statRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(statRef, { amount: 0.5 })

  const animatedAssetCount = useAnimatedNumber(isInView ? assetCount : 0, {
    duration: 4000,
    trigger: isInView,
  })

  const animatedMarketCount = useAnimatedNumber(isInView ? marketCount : 0, {
    duration: 4000,
    trigger: isInView,
  })

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const res = await fetch('https://api.upbit.com/v1/market/all?isDetails=false')
        const data = await res.json()
        const markets = data.map((item: { market: string }) => item.market)
        const assets = new Set(markets.map((m: string) => m.split('-')[1]))
        setMarketCount(markets.length)
        setAssetCount(assets.size)
      } catch (error) {
        console.error('업비트 API 데이터 로드 실패:', error)
      }
    }

    fetchMarketData()
  }, [])

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(sectionRef.current, {
        opacity: 0,
        scale: 5,
        ease: 'power2.out',
        transformOrigin: 'center center',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'center center',
          end: 'bottom top',
          scrub: 0.8,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleMainAction = () => {
    router.push(session ? '/portfolio' : '/login')
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        ref={sectionRef}
        className="absolute inset-0 max-w-[100vw] flex flex-col items-center justify-center text-center px-4 will-change-[opacity,transform] pointer-events-none"
      >
        <div className="space-y-6 pt-32 pb-48">
          <motion.h1
            initial={{ opacity: 0, scale: 20 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="text-3xl md:text-4xl font-bold leading-tight"
          >
            신뢰할 수 있는 암호화폐 자산 포트폴리오 플랫폼
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 1 }}
            className="text-neutral-300 text-sm md:text-lg"
          >
            암호화폐 가격을 실시간으로 조회하고,
            트렌드를 분석하여 맞춤형 포트폴리오를 만들어보세요.
          </motion.p>

          <motion.div
            ref={statRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1, ease: 'easeOut' }}
            className="flex items-center justify-center gap-2 xs:gap-20 mt-12"
          >
            <div>
              <p className="text-4xl md:text-5xl font-bold">{Math.round(animatedAssetCount)}</p>
              <p className="text-sm text-neutral-300 min-w-[90px]">Digital Assets</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold">{Math.round(animatedMarketCount)}</p>
              <p className="text-sm text-neutral-300 min-w-[90px]">Markets</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1, ease: 'easeOut' }}
            className="flex flex-col xs:flex-row items-center justify-center gap-4 mt-12"
          >
            <button
              onClick={() => router.push('/chart/KRW-BTC')}
              className="bg-chart/70 hover:brightness-105 min-w-[188px] text-neutral-100 text-2xl font-semibold py-2 px-6 rounded transition pointer-events-auto"
            >
              차트 확인하기
            </button>
            <button
              onClick={handleMainAction}
              className="bg-portfolio/70 hover:brightness-105 min-w-[188px] text-neutral-100 text-2xl font-semibold py-2 px-6 rounded transition pointer-events-auto"
            >
              {session ? '내 포트폴리오' : '로그인'}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default MainSection