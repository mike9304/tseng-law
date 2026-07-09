'use client';

import { useEffect, useState } from 'react';

type HeroMediaSlide = {
  image: string;
};

const slides: HeroMediaSlide[] = [
  { image: '/images/hero-bg-01.webp' },
  { image: '/images/hero-bg-02.webp' },
  { image: '/images/hero-bg-03.webp' }
];

export default function HeroMediaBackground() {
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  // LCP: only the first frame is rendered on the server / first paint. The other
  // rotator frames (hero-bg-02 ~609KB, hero-bg-03) are mounted after the page goes
  // idle (post-LCP), so their images never compete for bandwidth during the LCP
  // window. Rotation begins once the rest are mounted (well before the first 5.6s
  // rotation). No-JS visitors see the first frame (rotation is an enhancement).
  const [hydrateRest, setHydrateRest] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReducedMotion(media.matches);
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const idle = window.requestIdleCallback;
    if (typeof idle === 'function') {
      const id = idle(() => setHydrateRest(true), { timeout: 2500 });
      return () => window.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => setHydrateRest(true), 2000);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (reducedMotion || !hydrateRest) return;
    const id = window.setInterval(() => {
      setIndex((value) => (value + 1) % slides.length);
    }, 5600);
    return () => window.clearInterval(id);
  }, [reducedMotion, hydrateRest]);

  const rendered = hydrateRest ? slides : slides.slice(0, 1);

  return (
    <div className="hero-media" aria-hidden>
      {rendered.map((slide, slideIndex) => (
        <div key={slide.image} className="hero-media-item" data-active={slideIndex === index}>
          {/* eager CSS-bg fallback only on the first (preloaded) frame — it is the LCP
              element and needs a paint before its <img> decodes; later frames rely on
              their lazy <img> and only mount post-LCP. */}
          <div
            className="hero-media-fallback"
            style={slideIndex === 0 ? { backgroundImage: `url(${slide.image})` } : undefined}
          >
            <img
              className="hero-media-image"
              src={slide.image}
              alt=""
              loading={slideIndex === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
