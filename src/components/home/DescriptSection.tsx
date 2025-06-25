'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const DescriptSection = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    gsap.fromTo(
      ref.current,
      { y: 0 },
      {
        y: -300,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    )
  }, [])

  return (
    <div
      ref={ref}
      className="px-4 text-white text-5xl font-bold py-6 text-left tracking-tight leading-snug"
    >
      <div className="flex flex-col items-start space-y-6">
        <span>실시간으로</span>
        <span>
          확인할 수 있는 <span className="text-chart brightness-200">차트</span>
        </span>
      </div>
    </div>
  )
}

export default DescriptSection