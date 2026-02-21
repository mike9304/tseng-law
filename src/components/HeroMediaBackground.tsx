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

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReducedMotion(media.matches);
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setInterval(() => {
      setIndex((value) => (value + 1) % slides.length);
    }, 5600);
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  return (
    <div className="hero-media" aria-hidden>
      {slides.map((slide, slideIndex) => (
        <div key={slide.image} className="hero-media-item" data-active={slideIndex === index}>
          <div className="hero-media-fallback" style={{ backgroundImage: `url(${slide.image})` }} />
        </div>
      ))}
    </div>
  );
}
