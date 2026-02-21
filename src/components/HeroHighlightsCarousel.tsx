'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { Locale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';
import SmartLink from '@/components/SmartLink';

export default function HeroHighlightsCarousel({ locale }: { locale: Locale }) {
  const { heroHighlights } = siteContent[locale];
  const itemCount = heroHighlights.items.length;
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const prevLabel = locale === 'ko' ? '이전' : locale === 'zh-hant' ? '上一則' : 'Previous';
  const nextLabel = locale === 'ko' ? '다음' : locale === 'zh-hant' ? '下一則' : 'Next';

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handle = () => setReducedMotion(media.matches);
    handle();
    if (media.addEventListener) {
      media.addEventListener('change', handle);
      return () => media.removeEventListener('change', handle);
    }
    media.addListener(handle);
    return () => media.removeListener(handle);
  }, []);

  useEffect(() => {
    if (activeIndex >= itemCount) {
      setActiveIndex(0);
    }
  }, [activeIndex, itemCount]);

  const goPrev = () => setActiveIndex((current) => (current - 1 + itemCount) % itemCount);
  const goNext = () => setActiveIndex((current) => (current + 1) % itemCount);

  useEffect(() => {
    if (itemCount <= 1 || reducedMotion || paused) return;
    const id = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % itemCount);
    }, 3200);
    return () => window.clearInterval(id);
  }, [itemCount, paused, reducedMotion]);

  if (!itemCount) {
    return null;
  }

  return (
    <div
      className="hero-highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="hero-highlights-header">
        <div className="section-label">{heroHighlights.label}</div>
      </div>
      <div className="hero-highlights-shell">
        <button className="hero-highlights-arrow left" type="button" onClick={goPrev} aria-label={prevLabel}>
          ‹
        </button>
        <div className="hero-highlights-viewport" role="region" aria-label={heroHighlights.label}>
          <div
            className="hero-highlights-track"
            style={{
              transform: `translate3d(${-activeIndex * 100}%, 0, 0)`,
              transition: reducedMotion ? 'none' : 'transform 520ms cubic-bezier(0.22, 1, 0.36, 1)'
            }}
            aria-live="polite"
          >
            {heroHighlights.items.map((item) => (
              <article key={item.title} className="hero-highlight-card">
                <div className="hero-highlight-media">
                  <Image src={item.image} alt={item.title} width={240} height={150} />
                </div>
                {item.meta ? <div className="hero-highlight-meta">{item.meta}</div> : null}
                <h3 className="hero-highlight-title">
                  <SmartLink className="link-underline" href={item.href}>
                    {item.title}
                  </SmartLink>
                </h3>
                <p className="hero-highlight-summary">{item.summary}</p>
              </article>
            ))}
          </div>
        </div>
        <button className="hero-highlights-arrow right" type="button" onClick={goNext} aria-label={nextLabel}>
          ›
        </button>
        {itemCount > 1 ? (
          <div className="hero-highlights-dots" role="tablist" aria-label={heroHighlights.label}>
            {heroHighlights.items.map((item, index) => (
              <button
                key={item.title}
                type="button"
                className={`hero-highlights-dot${index === activeIndex ? ' active' : ''}`}
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`${index + 1}`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
