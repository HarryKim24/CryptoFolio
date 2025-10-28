"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ScrollScene = () => {
  useEffect(() => {
    const sections = document.querySelectorAll(".panel");
    const layers = document.querySelectorAll<HTMLElement>(".bg-global");

    layers.forEach((el, i) => {
      gsap.set(el, { zIndex: i });

      gsap.to(el, {
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
        immediateRender: false,
        scrollTrigger: {
          trigger: sections[i],
          start: "top center",
          end: "bottom center",
          scrub: 0.5,
          toggleActions: "play reverse play reverse",
        },
      });

      if (i > 0) {
        gsap.to(layers[i - 1], {
          opacity: 0,
          duration: 1,
          ease: "power2.inOut",
          immediateRender: false,
          scrollTrigger: {
            trigger: sections[i],
            start: "top center",
            end: "bottom center",
            scrub: 0.5,
          },
        });
      }
    });
  }, []);

  return null;
};

export default ScrollScene;