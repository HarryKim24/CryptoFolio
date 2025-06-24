'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

const MainSection = () => {
  const router = useRouter()
  const { data: session } = useSession()

  const [assetCount, setAssetCount] = useState(0)
  const [marketCount, setMarketCount] = useState(0)

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const res = await fetch('https://api.upbit.com/v1/market/all?isDetails=false')
        const data = await res.json()

        const markets = data.map((item: { market: string }) => item.market)
        const assets = new Set(markets.map((m: string) => m.split('-')[1])) // BTC, ETH 등

        setMarketCount(markets.length)
        setAssetCount(assets.size)
      } catch (error) {
        console.error('업비트 API 데이터 로드 실패:', error)
      }
    }

    fetchMarketData()
  }, [])

  const handleMainAction = () => {
    router.push(session ? '/portfolio' : '/login')
  }

  return (
    <div className="flex flex-col items-center justify-center text-center px-4 h-full relative">
      <div className="space-y-6 z-10">
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">
          신뢰할 수 있는 암호화폐 자산 포트폴리오 플랫폼
        </h1>
        <p className="text-neutral-300 text-sm md:text-lg">
          암호화폐 가격을 실시간으로 조회하고, 
          트렌드를 분석하여 맞춤형 포트폴리오를 만들어보세요.
        </p>

        <div className="flex items-center justify-center gap-2 xs:gap-20 mt-12">
          <div>
            <p className="text-4xl md:text-5xl font-bold">{assetCount}</p>
            <p className="text-sm text-neutral-300 min-w-[90px]">Digital Assets</p>
          </div>
          <div>
            <p className="text-4xl md:text-5xl font-bold">{marketCount}</p>
            <p className="text-sm text-neutral-300 min-w-[90px]">Markets</p>
          </div>
        </div>

        <div className="flex flex-col xs:flex-row items-center justify-center gap-4 mt-12">
          <button
            onClick={() => router.push('/chart/KRW-BTC')}
            className="bg-chart text-neutral-100 text-2xl font-semibold py-2 px-6 rounded transition"
          >
            차트 확인하기
          </button>
          <button
            onClick={handleMainAction}
            className="bg-portfolio text-neutral-100 text-2xl font-semibold py-2 px-6 rounded transition"
          >
            {session ? '내 포트폴리오' : '로그인'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default MainSection