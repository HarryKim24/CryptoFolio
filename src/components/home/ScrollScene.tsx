'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollScene = () => {
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('.panel')
    );
    const layers = Array.from(
      document.querySelectorAll<HTMLElement>('.bg-global')
    );

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