'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { Locale } from '@/lib/locales';
import { siteContent } from '@/data/site-content';
import SectionLabel from '@/components/SectionLabel';
import SmartLink from '@/components/SmartLink';

export default function AchievementsCarousel({ locale }: { locale: Locale }) {
  const { achievements } = siteContent[locale];
  const prevLabel = locale === 'ko' ? '이전 실적' : locale === 'zh-hant' ? '上一則' : 'Previous result';
  const nextLabel = locale === 'ko' ? '다음 실적' : locale === 'zh-hant' ? '下一則' : 'Next result';
  const detailLabel = locale === 'ko' ? '자세히 보기' : locale === 'zh-hant' ? '了解更多' : 'Read more';
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const total = achievements.items.length;

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handle = () => setReducedMotion(media.matches);
    handle();
    media.addEventListener('change', handle);
    return () => media.removeEventListener('change', handle);
  }, []);

  useEffect(() => {
    if (total <= 1 || paused || reducedMotion) return;
    const id = window.setInterval(() => {
      setIndex((value) => (value + 1) % total);
    }, 6000);
    return () => window.clearInterval(id);
  }, [paused, reducedMotion, total]);

  useEffect(() => {
    if (index >= total) {
      setIndex(0);
    }
  }, [index, total]);

  if (!total) return null;

  return (
    <section
      className="section section--light carousel-section"
      id="achievements"
      data-tone="light"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="container">
        <SectionLabel>{achievements.label}</SectionLabel>
        <h2 className="section-title">{achievements.title}</h2>
        <div className="carousel-wrapper">
          <button
            type="button"
            className="carousel-arrow carousel-prev"
            aria-label={prevLabel}
            onClick={() => setIndex((value) => (value - 1 + total) % total)}
          >
            <svg viewBox="0 0 24 24" aria-hidden>
              <polyline points="15,4 7,12 15,20" />
            </svg>
          </button>
          <div className="carousel-viewport">
            <div
              className="carousel-track"
              style={{
                transform: `translateX(-${index * 100}%)`,
                transition: reducedMotion ? 'none' : 'transform 0.82s cubic-bezier(0.22, 1, 0.36, 1)'
              }}
            >
              {achievements.items.map((item, itemIndex) => (
                <article
                  key={`${item.title}-${item.amount}`}
                  className={`carousel-slide achievement-slide${index === itemIndex ? ' is-active' : ''}`}
                >
                  <div className="slide-image">
                    <Image src={item.image} alt={item.title} width={960} height={680} />
                  </div>
                  <div className="slide-content">
                    <div className="achievement-amount stat-number">{item.amount}</div>
                    <h3 className="slide-title">{item.title}</h3>
                    <div className="slide-divider" />
                    <p className="slide-text">{item.summary}</p>
                    <div className="achievement-footer">
                      {item.tag ? <span className="tag">{item.tag}</span> : null}
                      <SmartLink className="link-underline" href={item.href}>
                        {detailLabel} →
                      </SmartLink>
                    </div>
                    {total > 1 ? (
                      <div className="slide-dots" role="tablist" aria-label={achievements.title}>
                        {achievements.items.map((dotItem, dotIndex) => (
                          <button
                            key={`${dotItem.title}-${dotIndex}`}
                            type="button"
                            className={`carousel-dot${dotIndex === index ? ' active' : ''}`}
                            role="tab"
                            aria-selected={dotIndex === index}
                            aria-label={`${dotIndex + 1}`}
                            onClick={() => setIndex(dotIndex)}
                          />
                        ))}
                      </div>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
          <button
            type="button"
            className="carousel-arrow carousel-next"
            aria-label={nextLabel}
            onClick={() => setIndex((value) => (value + 1) % total)}
          >
            <svg viewBox="0 0 24 24" aria-hidden>
              <polyline points="9,4 17,12 9,20" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
