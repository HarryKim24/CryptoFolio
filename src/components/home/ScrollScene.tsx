'use client';

import { useLayoutEffect, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const ScrollScene = () => {
  useIsomorphicLayoutEffect(() => {
    const sections = gsap.utils.toArray<HTMLElement>('.panel');
    const layers = gsap.utils.toArray<HTMLElement>('.bg-global');

    if (!sections.length || !layers.length) return;

    const ctx = gsap.context(() => {
      const count = Math.min(sections.length, layers.length);

      for (let i = 0; i < count; i++) {
        const section = sections[i];
        const layer = layers[i];

        gsap.set(layer, { zIndex: i });

        gsap.to(layer, {
          opacity: 1,
          duration: 1.2,
          ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: section,
            start: 'top center',
            end: 'bottom center',
            scrub: 0.5,
            toggleActions: 'play reverse play reverse',
          },
        });

        if (i > 0) {
          const prevLayer = layers[i - 1];
          gsap.to(prevLayer, {
            opacity: 0,
            duration: 1,
            ease: 'power2.inOut',
            immediateRender: false,
            scrollTrigger: {
              trigger: section,
              start: 'top center',
              end: 'bottom center',
              scrub: 0.5,
            },
          });
        }
      }
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return null;
};

export default ScrollScene;