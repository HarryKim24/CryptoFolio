'use client';

import React, { useState, useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface DelayedRenderProps {
  children: React.ReactNode;
  delay: number;
  fallback?: React.ReactNode;
}

const DelayedRender = ({ children, delay, fallback = null }: DelayedRenderProps) => {
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShown(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (isShown) {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }
  }, [isShown]);

  if (!isShown) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default DelayedRender;