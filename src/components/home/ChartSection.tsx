'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CoinDetail from '@/components/chart/CoinDetail'
import CoinChart from '@/components/chart/CoinChartWrapper'
import ChartDescription from '@/components/home/ChartDescription'

gsap.registerPlugin(ScrollTrigger)

const ChartSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<HTMLDivElement>(null)

  const market = 'KRW-BTC'
  const isMobile = false
  const view = 'chart'

  useEffect(() => {
    const chartEl = chartRef.current
    const sectionEl = sectionRef.current
    if (!chartEl || !sectionEl) return

    const updateScale = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const cw = chartEl.offsetWidth
      const ch = chartEl.offsetHeight

      const scaleX = vw / cw
      const scaleY = vh / ch
      const scale = Math.min(scaleX, scaleY)

      gsap.set(chartEl, {
        scale,
        transformOrigin: 'bottom center',
      })

      gsap.to(chartEl, {
        scale: 1,
        y: 0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top 60%',
          end: 'top top',
          scrub: true,
        },
      })
    }

    requestAnimationFrame(() => {
      setTimeout(updateScale, 32)
    })

    window.addEventListener('resize', updateScale)

    return () => {
      window.removeEventListener('resize', updateScale)
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="w-full p-8 md:p-20 lg:p-40 min-w-[320px] flex flex-col items-center justify-start gap-12"
    >
      <div
        ref={chartRef}
        className="w-full max-w-7xl h-[520px] xs:h-[600px] text-sm flex flex-col bg-white/5 rounded-xl shadow overflow-visible"
      >
        <CoinDetail
          market={market}
          isMobile={isMobile}
          view={view}
          onToggleView={() => {}}
          isChartSection={true}
        />
        <div className="flex-1 relative min-h-0">
          <CoinChart market={market} disableZoom />
        </div>
      </div>

      <ChartDescription />
    </motion.div>
  )
}

export default ChartSection