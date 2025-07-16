'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sections = document.querySelectorAll('.panel')
    const layers = document.querySelectorAll<HTMLElement>('.bg-global')
  
    layers.forEach((el, i) => {
      gsap.set(el, { zIndex: i })
  
      gsap.to(el, {
        opacity: 1,
        duration: 1.2,
        ease: 'power2.out',
        immediateRender: false,
        scrollTrigger: {
          trigger: sections[i],
          start: 'top center',
          end: 'bottom center',
          scrub: 0.5,
          toggleActions: 'play reverse play reverse',
        },
      })
  
      if (i > 0) {
        gsap.to(layers[i - 1], {
          opacity: 0,
          duration: 1,
          ease: 'power2.inOut',
          immediateRender: false,
          scrollTrigger: {
            trigger: sections[i],
            start: 'top center',
            end: 'bottom center',
            scrub: 0.5,
          },
        })
      }
    })
  }, [])

  return (
    <div ref={container} className="relative text-neutral-100 overflow-x-hidden">
      <div className="bg-global bg-main-gradient fixed inset-0 z-0 opacity-1 pointer-events-none" />
      <div className="bg-global bg-chart-gradient fixed inset-0 z-0 opacity-0 pointer-events-none" />
      <div className="bg-global bg-trends-gradient fixed inset-0 z-0 opacity-0 pointer-events-none" />
      <div className="bg-global bg-portfolio-gradient fixed inset-0 z-0 opacity-0 pointer-events-none" />
      <div className="bg-global fixed inset-0 z-0 opacity-0 pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}