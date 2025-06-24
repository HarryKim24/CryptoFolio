import { useEffect, useState } from 'react'
import { useMotionValue, animate } from 'framer-motion'

type Options = {
  duration?: number
  trigger?: unknown
}

export function useAnimatedNumber(target: number, options?: Options) {
  const motionValue = useMotionValue(0)
  const [displayValue, setDisplayValue] = useState(0)

  const duration = options?.duration ?? 1000
  const trigger = options?.trigger

  useEffect(() => {
    const controls = animate(motionValue, target, {
      duration: duration / 1000,
      ease: 'easeOut',
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest))
      },
    })

    return () => controls.stop()
  }, [motionValue, target, duration, trigger])

  return displayValue
}