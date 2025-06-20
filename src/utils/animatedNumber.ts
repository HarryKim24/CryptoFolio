// utils/useAnimatedNumber.ts
import { useEffect, useState } from 'react'
import { useMotionValue, animate } from 'framer-motion'

export function useAnimatedNumber(target: number, duration = 1000) {
  const motionValue = useMotionValue(0)
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const controls = animate(motionValue, target, {
      duration: duration / 1000,
      ease: 'easeOut',
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest))
      },
    })

    return () => controls.stop()
  }, [target, duration, motionValue])

  return displayValue
}