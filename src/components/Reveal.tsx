'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

export default function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    const revealBuffer = Math.min(240, window.innerHeight * 0.25);
    const isNearViewport = () => {
      const rect = element.getBoundingClientRect();
      return rect.top < window.innerHeight + revealBuffer && rect.bottom > -revealBuffer;
    };

    if (isNearViewport()) {
      setVisible(true);
      return;
    }

    let fallbackTimer = 0;
    let viewportCheckTimer = 0;
    let animationFrame = 0;
    let observer: IntersectionObserver | null = null;
    const revealNow = () => {
      window.clearTimeout(fallbackTimer);
      window.clearTimeout(viewportCheckTimer);
      window.cancelAnimationFrame(animationFrame);
      setVisible(true);
      observer?.disconnect();
    };
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          revealNow();
        }
      },
      { rootMargin: '160px 0px', threshold: 0.01 }
    );

    const revealIfNearViewport = () => {
      if (isNearViewport()) revealNow();
    };

    animationFrame = window.requestAnimationFrame(revealIfNearViewport);
    viewportCheckTimer = window.setTimeout(revealIfNearViewport, 120);
    fallbackTimer = window.setTimeout(() => {
      revealNow();
    }, 160);

    observer.observe(element);
    return () => {
      window.clearTimeout(fallbackTimer);
      window.clearTimeout(viewportCheckTimer);
      window.cancelAnimationFrame(animationFrame);
      observer?.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={`reveal${visible ? ' is-visible' : ''}`}>
      {children}
    </div>
  );
}
