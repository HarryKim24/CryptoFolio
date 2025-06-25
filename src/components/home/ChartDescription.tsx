'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ChartDescription = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    gsap.fromTo(
      ref.current,
      { y: 0 },
      {
        y: -200,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    )

    gsap.fromTo(
      ref.current,
      { opacity: 0 },
      {
        opacity: 1,
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

  return (
    <div
      ref={ref}
      className="px-4 text-white text-5xl font-bold py-6 text-left tracking-tight leading-snug"
    >
      <div className="flex flex-col items-start space-y-3">
        <span>실시간으로</span>
        <div className="flex flex-col space-y-3">
          <span>확인할 수 있는</span>
          <span className="text-chart brightness-200 whitespace-nowrap">차트</span>
        </div>
      </div>
    </div>
  )
}

export default ChartDescription