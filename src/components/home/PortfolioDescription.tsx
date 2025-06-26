'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PortfolioDescription = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  }, [])

  return (
    <div
      ref={ref}
      className="px-4 text-white text-5xl font-bold pt-6 text-left tracking-tight leading-snug"
    >
      <div className="flex flex-col items-start space-y-3">
        <span>나의 자산을</span>
        <span>한눈에 보는</span>
        <span className="text-portfolio brightness-200">포트폴리오</span>
      </div>
    </div>
  )
}

export default PortfolioDescription