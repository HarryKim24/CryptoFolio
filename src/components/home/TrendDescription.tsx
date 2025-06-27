'use client'

import { useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const TrendDescription = () => {
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

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
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  }, [])

  const handleTrendClick = () => {
    router.push('/trends')
  }

  return (
    <div
      ref={ref}
      className="items-start px-4 text-white text-5xl font-bold pt-6 text-left tracking-tight leading-snug"
    >
      <div className="flex flex-col items-start space-y-3">
        <span>한눈에 보는</span>
        <span>변화하는</span>
        <span>
          시장{' '}
          <span
            onClick={handleTrendClick}
            className="text-trend brightness-200 whitespace-nowrap cursor-pointer"
          >
            트렌드
          </span>
        </span>
      </div>
    </div>
  )
}

export default TrendDescription