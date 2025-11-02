import { useEffect, useRef } from 'react'
import { useMotionValue, animate, useMotionValueEvent } from 'framer-motion'

type Options = {
  duration?: number
  trigger?: unknown
}

const useAnimatedNumber = (target: number, options?: Options) => {
  const nodeRef = useRef<HTMLElement | null>(null)
  const mv = useMotionValue(0)
  const duration = (options?.duration ?? 1000) / 1000
  const trigger = options?.trigger

  useEffect(() => {
    if (nodeRef.current) nodeRef.current.textContent = String(Math.round(mv.get()))
  }, [mv])

  useEffect(() => {
    const controls = animate(mv, target, {
      duration,
      ease: 'easeOut',
    })
    return () => controls.stop()
  }, [mv, target, duration, trigger])

  useMotionValueEvent(mv, 'change', (latest) => {
    if (nodeRef.current) nodeRef.current.textContent = String(Math.round(latest))
  })

  return nodeRef
}

export { useAnimatedNumber }