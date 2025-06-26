'use client'

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Doughnut } from 'react-chartjs-2'
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PortfolioDescription from '@/components/home/PortfolioDescription'

Chart.register(ArcElement, Tooltip, Legend)
gsap.registerPlugin(ScrollTrigger)

const PortfolioSection = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || window.innerWidth < 768) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        rightRef.current,
        { y: 0 },
        {
          y: -80,
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

  const data = {
    labels: ['ETH', 'BTC', 'ONDO', 'MEW', 'JTO', 'AXL'],
    datasets: [
      {
        data: [55.23, 28.68, 4.76, 4.07, 4.03, 3.22],
        backgroundColor: ['#6366f1', '#10b981', '#facc15', '#f472b6', '#60a5fa', '#fb923c'],
        borderWidth: 0,
      },
    ],
  }

  const options = {
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    cutout: '50%',
  }

  return (
    <div ref={containerRef} className="text-center space-y-10 px-2">
      <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 md:gap-12">
        <div className="flex-1 px-6 py-6 flex flex-col justify-center">
          <PortfolioDescription />
        </div>

        <motion.div
          ref={rightRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex-1 bg-white/5 rounded-xl shadow p-6 flex justify-center items-center"
        >
          <div className="w-[260px] h-[260px]">
            <Doughnut data={data} options={options} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PortfolioSection