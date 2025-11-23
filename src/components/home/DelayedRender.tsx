'use client';

import { useState, useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type DelayedRenderProps = {
  children: React.ReactNode;
  delay: number;
  fallback?: React.ReactNode;
};

function DelayedRender({ children, delay, fallback = null }: DelayedRenderProps) {
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setIsShown(true);
    }, delay);

    return () => window.clearTimeout(timerId);
  }, [delay]);

  useEffect(() => {
    if (!isShown) return;

    const refreshId = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => window.clearTimeout(refreshId);
  }, [isShown]);

  return <>{isShown ? children : fallback}</>;
}

export default DelayedRender;