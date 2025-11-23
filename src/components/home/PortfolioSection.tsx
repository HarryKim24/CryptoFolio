'use client';

import { useEffect, useRef, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PortfolioDescription from '@/components/home/PortfolioDescription';

Chart.register(ArcElement, Tooltip, Legend);
gsap.registerPlugin(ScrollTrigger);

function PortfolioSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(chartRef, { once: true });

  useEffect(() => {
    const container = containerRef.current;
    const right = rightRef.current;

    if (!container || !right) return;
    if (window.innerWidth < 768) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        right,
        { y: 0 },
        {
          y: -80,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'center bottom',
            end: 'center top',
            scrub: true,
          },
        }
      );
    }, container);

    return () => {
      ctx.revert();
    };
  }, []);

  const data = useMemo(
    () => ({
      datasets: [
        {
          data: [40, 25, 15, 10, 6, 4],
          backgroundColor: [
            '#6366f1',
            '#10b981',
            '#facc15',
            '#f472b6',
            '#60a5fa',
            '#fb923c',
          ],
          borderWidth: 0,
        },
      ],
    }),
    []
  );

  const options = useMemo(
    () => ({
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
      cutout: '50%',
      animation: {
        animateRotate: true,
        animateScale: false,
        duration: 1200,
        easing: 'easeOutCubic' as const,
      },
    }),
    []
  );

  return (
    <div ref={containerRef} className="text-center md:space-y-10 px-6">
      <div className="flex flex-col md:flex-row justify-center items-stretch gap-0 lg:gap-6">
        <div className="flex-1 px-6 py-6 flex flex-col justify-center">
          <PortfolioDescription />
        </div>

        <motion.div
          ref={rightRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex-1 p-6 flex justify-center items-center"
        >
          <div
            ref={chartRef}
            className="w-[300px] h-[300px] lg:w-[400px] lg:h-[400px]"
          >
            {isInView && <Doughnut data={data} options={options} />}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default PortfolioSection;