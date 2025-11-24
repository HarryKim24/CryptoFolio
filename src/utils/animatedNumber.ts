import { useEffect, useRef, useState } from 'react';
import { useMotionValue, animate, useMotionValueEvent } from 'framer-motion';

type Options = {
  duration?: number;
  initial?: number;
  trigger?: boolean;
  delay?: number;
};

const useAnimatedNumber = (target: number, options?: Options): number => {
  const safeOptions = options || {};
  const duration = safeOptions.duration ?? 1000;
  const initial = safeOptions.initial ?? 0;
  const trigger = safeOptions.trigger ?? true;
  const delay = safeOptions.delay ?? 0;

  const motionValue = useMotionValue(initial);
  const [displayValue, setDisplayValue] = useState(initial);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!trigger) {
      return;
    }

    const animationControls = animate(motionValue, target, {
      duration: duration / 1000,
      delay: delay,
      ease: 'easeOut',
    });

    return () => {
      animationControls.stop();

      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [target, duration, trigger, delay, motionValue]);

  useMotionValueEvent(motionValue, 'change', (latest) => {
    if (frameRef.current !== null) {
      return;
    }

    frameRef.current = requestAnimationFrame(() => {
      const latestNumber = latest as number;
      const rounded = Math.round(latestNumber);
      setDisplayValue(rounded);
      frameRef.current = null;
    });
  });

  return displayValue;
};

export { useAnimatedNumber };