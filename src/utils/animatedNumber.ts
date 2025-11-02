import { useEffect, useRef, useState } from 'react'
import { useMotionValue, animate, useMotionValueEvent } from 'framer-motion'

type Options = {
  duration?: number
  trigger?: unknown
}

const useAnimatedNumber = (target: number, options?: Options): number => {
  const [displayValue, setDisplayValue] = useState(0)
  const mv = useMotionValue(0)
  const durationSec = (options?.duration ?? 1000) / 1000
  const trigger = options?.trigger
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    setDisplayValue(Math.round(mv.get() as number))
  }, [mv])

  useEffect(() => {
    const controls = animate(mv, target, {
      duration: durationSec,
      ease: 'easeOut',
    })
    return () => {
      controls.stop()
      if (frameRef.current != null) {
        cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
    }
  }, [mv, target, durationSec, trigger])

  useMotionValueEvent(mv, 'change', (latest) => {
    if (frameRef.current != null) return
    frameRef.current = requestAnimationFrame(() => {
      setDisplayValue(Math.round(latest as number))
      frameRef.current = null
    })
  })

  return displayValue
}

export { useAnimatedNumber }