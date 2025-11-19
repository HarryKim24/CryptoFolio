import { useEffect, useRef, useState } from 'react';
import { useMotionValue, animate, useMotionValueEvent } from 'framer-motion';

type Options = {
  duration?: number;
  initial?: number;
  trigger?: boolean;
  delay?: number;
};

const useAnimatedNumber = (target: number, options?: Options): number => {
  const { 
    duration = 1000, 
    initial = 0, 
    trigger = true,
    delay = 0 
  } = options || {};

  const mv = useMotionValue(initial);
  const [displayValue, setDisplayValue] = useState(initial);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!trigger) return;

    const controls = animate(mv, target, {
      duration: duration / 1000,
      delay: delay,
      ease: 'easeOut',
    });

    return () => {
      controls.stop();
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [target, duration, trigger, delay, mv]);

  useMotionValueEvent(mv, 'change', (latest) => {
    if (frameRef.current !== null) return;

    frameRef.current = requestAnimationFrame(() => {
      setDisplayValue(Math.round(latest as number));
      frameRef.current = null;
    });
  });

  return displayValue;
};

export { useAnimatedNumber };