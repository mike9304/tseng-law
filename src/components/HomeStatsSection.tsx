'use client';

import { useEffect, useRef, useState } from 'react';
import type { Locale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';
import SectionLabel from '@/components/SectionLabel';
import ScrollHighlightText from '@/components/ScrollHighlightText';

function easeOutCubic(progress: number) {
  return 1 - Math.pow(1 - progress, 3);
}

export default function HomeStatsSection({ locale }: { locale: Locale }) {
  const stats = siteContent[locale].stats;
  const [counts, setCounts] = useState(() => stats.items.map(() => 0));
  const [done, setDone] = useState(() => stats.items.map(() => false));
  const [started, setStarted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handle = () => setReducedMotion(media.matches);
    handle();
    media.addEventListener('change', handle);
    return () => media.removeEventListener('change', handle);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    if (reducedMotion) {
      setCounts(stats.items.map((item) => item.target));
      setDone(stats.items.map(() => true));
      return;
    }

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const duration = isMobile ? 1500 : 2000;
    const rafIds: number[] = [];
    const timeouts: number[] = [];

    const animate = (index: number, target: number) => {
      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        const value = Math.round(target * eased);
        setCounts((prev) => prev.map((count, i) => (i === index ? value : count)));
        if (progress < 1) {
          rafIds[index] = requestAnimationFrame(tick);
        } else {
          setDone((prev) => prev.map((valueDone, i) => (i === index ? true : valueDone)));
        }
      };
      rafIds[index] = requestAnimationFrame(tick);
    };

    stats.items.forEach((item, index) => {
      const timeout = window.setTimeout(() => animate(index, item.target), index * 200);
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach((id) => window.clearTimeout(id));
      rafIds.forEach((id) => window.cancelAnimationFrame(id));
    };
  }, [reducedMotion, started, stats.items]);

  return (
    <section className="section section--light stats-section" id="stats" data-tone="light" ref={rootRef}>
      <div className="container">
        <SectionLabel>{stats.label}</SectionLabel>
        <h2 className="section-title">{stats.title}</h2>
        <ScrollHighlightText
          className="section-lede"
          text={stats.description}
          highlightWords={stats.highlightWords}
        />
        <div className="stats-grid reveal-stagger">
          {stats.items.map((item, index) => {
            const progress = item.target ? Math.min(counts[index] / item.target, 1) : 0;
            return (
              <article key={item.label} className={`stat-card${done[index] ? ' done' : ''}`}>
                <div className="stat-number" data-count={item.target} data-suffix={item.suffix ?? ''}>
                  {counts[index].toLocaleString()}
                  {item.suffix ?? ''}
                </div>
                <p className="stat-label">{item.label}</p>
                <div className="stat-progress" aria-hidden>
                  <span style={{ transform: `scaleX(${progress})` }} />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
