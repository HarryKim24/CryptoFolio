'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRouter } from 'next/navigation'

gsap.registerPlugin(ScrollTrigger)

const PortfolioDescription = () => {
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (!ref.current) return

    if (window.innerWidth < 768) {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 240 },
        {
          opacity: 1,
          y: 160,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    } else {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: -80,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    }
  }, [])

  const handlePortfolioClick = () => {
    router.push('/portfolio')
  }

  return (
    <div
      ref={ref}
      className="z-100 px-4 text-neutral-100 text-5xl font-bold pt-6 text-left tracking-tight leading-snug"
    >
      <div className="flex flex-col items-start space-y-3">
        <span className="whitespace-nowrap">나만의 전략으로</span>
        <span className="whitespace-nowrap">완성해가는</span>
        <span
          onClick={handlePortfolioClick}
          className="text-portfolio brightness-200 whitespace-nowrap cursor-pointer"
        >
          포트폴리오
        </span>
      </div>
    </div>
  )
}

export default PortfolioDescription