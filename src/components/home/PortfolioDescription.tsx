'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRouter } from 'next/navigation'

gsap.registerPlugin(ScrollTrigger)

const PortfolioDescription = () => {
  const ref = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (!ref.current || window.innerWidth < 768) {
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
      return 
    }

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
  }, [])

  useEffect(() => {
    if (!buttonRef.current) return

    gsap.fromTo(
      buttonRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: buttonRef.current,
          start: 'top 95%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  }, [])

  return (
    <div
      ref={ref}
      className="z-100 px-4 text-neutral-100 text-5xl font-bold pt-6 text-left tracking-tight leading-snug"
    >
      <div className="flex flex-col items-start space-y-3">
        <span className="whitespace-nowrap">나만의 전략으로</span>
        <span className="whitespace-nowrap">완성해가는</span>
        <span>
          <span className="text-portfolio brightness-200 whitespace-nowrap">포트폴리오</span>
        </span>
        <div className="md:pt-6">
          <button
            ref={buttonRef}
            onClick={() => router.push('/portfolio')}
            className="bg-portfolio brightness-200 min-w-[188px] text-neutral-100 text-2xl font-semibold py-2 px-6 rounded transition pointer-events-auto"
          >
            포트폴리오 만들기
          </button>
        </div>
      </div>
    </div>
  )
}

export default PortfolioDescription