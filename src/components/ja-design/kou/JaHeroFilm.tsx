'use client';

import { useEffect, useRef, useState } from 'react';
import DecorativeAutoplayVideo from '@/components/DecorativeAutoplayVideo';
import { DECORATIVE_VIDEO_CONTROL_LABELS } from '@/components/decorative-video-controls';
import { KOU } from './ja-kou-media';
import h from './JaHero.module.css';

/**
 * C0 media: the vermilion light on washi (S1 still + V1 loop). The still is the poster and stays for reduced motion
 * and Save-Data. While the scroll push has covered the loop with the sharp still (past 55 % of the runway), the loop is
 * held paused through DecorativeAutoplayVideo's optional `paused` prop (L1).
 */
export default function JaHeroFilm() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const sentinel = wrap?.closest('[data-ja-stage]')?.querySelector<HTMLElement>('[data-pause-sentinel]');
    if (!sentinel || typeof IntersectionObserver === 'undefined') return;
    const header = document.querySelector<HTMLElement>('header.header');
    const hdr = header ? header.getBoundingClientRect().height : 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        const above = !entry.isIntersecting && entry.boundingClientRect.top < (entry.rootBounds?.top ?? 0);
        setPaused(above);
      },
      { rootMargin: `-${Math.round(hdr)}px 0px 0px 0px` },
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className={h.mediaWrap}>
      <DecorativeAutoplayVideo
        className={h.media}
        imageClassName={h.poster}
        videoClassName={h.video}
        poster={KOU.hero.poster}
        mobilePoster={KOU.hero.posterMobile}
        mp4Src={KOU.hero.mp4}
        webmSrc={KOU.hero.webm}
        mobileMp4Src={KOU.hero.mp4Mobile}
        mobileWebmSrc={KOU.hero.webmMobile}
        mobileMediaQuery={KOU.hero.mobileQuery}
        alt=""
        sizes="100vw"
        priority
        posterUnoptimized
        deferVideoUntilPosterPaint
        rootMargin="0px"
        paused={paused}
        controlLabels={DECORATIVE_VIDEO_CONTROL_LABELS.ja}
      />
    </div>
  );
}
