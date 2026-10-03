'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import r from './JaRead.module.css';

/**
 * The column gallery's track and paddles (CONCEPT-V2 §5 C5, §7.4). Native horizontal scrolling with snap; the paddles
 * scroll one card and are disabled at the ends; no auto-advance. The track is focusable so arrow keys scroll it.
 */
export default function JaGallery({
  labelledBy,
  prevLabel,
  nextLabel,
  children,
}: {
  labelledBy: string;
  prevLabel: string;
  nextLabel: string;
  children: ReactNode;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      setAtStart(track.scrollLeft <= 4);
      setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 4);
    };
    update();
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    return () => {
      track.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const page = (direction: 1 | -1) => {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>('li');
    if (!track || !card) return;
    const gap = parseFloat(getComputedStyle(track.querySelector('ul') as HTMLElement).columnGap) || 0;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <div className={r.galleryBody}>
      <div ref={trackRef} className={r.track} role="region" aria-labelledby={labelledBy} tabIndex={0}>
        {children}
      </div>
      <div className={r.controls}>
        <div className={r.progress} aria-hidden="true">
          <i />
        </div>
        <div className={r.paddles}>
          <button type="button" className={r.paddle} onClick={() => page(-1)} disabled={atStart}>
            <svg width="10" height="16" viewBox="0 0 10 16" aria-hidden="true" focusable="false">
              <path d="M8 2L2 8l6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={r.vh}>{prevLabel}</span>
          </button>
          <button type="button" className={r.paddle} onClick={() => page(1)} disabled={atEnd}>
            <svg width="10" height="16" viewBox="0 0 10 16" aria-hidden="true" focusable="false">
              <path d="M2 2l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={r.vh}>{nextLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
