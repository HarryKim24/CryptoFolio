/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import { useMotionValue, animate, useMotionValueEvent } from 'framer-motion';

type Options = {
  duration?: number;
  trigger?: unknown;
};

const useAnimatedNumber = (target: number, options?: Options): number => {
  const mv = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(
    () => Math.round(mv.get() as number)
  );
  const durationSec = (options?.duration ?? 1000) / 1000;
  const trigger = options?.trigger;
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const controls = animate(mv, target, {
      duration: durationSec,
      ease: 'easeOut',
    });

    return () => {
      controls.stop();
      if (frameRef.current != null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [target, durationSec, trigger]);

  useMotionValueEvent(mv, 'change', (latest) => {
    if (frameRef.current != null) return;

    frameRef.current = requestAnimationFrame(() => {
      setDisplayValue(Math.round(latest as number));
      frameRef.current = null;
    });
  });

  return displayValue;
};

export { useAnimatedNumber };