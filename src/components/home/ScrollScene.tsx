"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ScrollScene = () => {
  useEffect(() => {
    const sections = gsap.utils.toArray<HTMLElement>(".panel");
    const layers = gsap.utils.toArray<HTMLElement>(".bg-global");

    if (!sections.length || !layers.length) return;

    const ctx = gsap.context(() => {
      const count = Math.min(sections.length, layers.length);

      for (let i = 0; i < count - 1; i++) {
        const currentLayer = layers[i];
        const nextLayer = layers[i + 1];
        const triggerSection = sections[i + 1];

        gsap.set(nextLayer, { zIndex: i + 1 });

        gsap.timeline({
          scrollTrigger: {
            trigger: triggerSection,
            start: "top center",
            end: "bottom center",
            scrub: true,
          },
        })
          .to(currentLayer, {
            opacity: 0,
            ease: "power2.out",
          })
          .to(
            nextLayer,
            {
              opacity: 1,
              ease: "power2.out",
            },
            "<"
          );
      }
    });

    return () => ctx.revert();
  }, []);

  return null;
};

export default ScrollScene;