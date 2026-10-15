'use client';

import { useEffect, useRef } from 'react';
import DecorativeAutoplayVideo, {
  DECORATIVE_VIDEO_CONTROL_LABELS,
} from '@/components/DecorativeAutoplayVideo';
import type { DecorativeVideoControlLabels } from '@/components/decorative-video-controls';
import type { SiteLocale } from '@/lib/locales';

type HeroMediaSlide = {
  image: string;
  mp4: string;
  webm: string;
  mobileImage: string;
  mobileMp4: string;
  mobileWebm: string;
};

const defaultSlides: HeroMediaSlide[] = [
  {
    image: '/images/editorial/taichung-courthouse-civic-daylight-v2.webp',
    mp4: '/videos/taichung-courthouse-civic-daylight-v2.mp4',
    webm: '/videos/taichung-courthouse-civic-daylight-v2.webm',
    mobileImage:
      '/images/editorial/taichung-courthouse-civic-daylight-v2-mobile.webp',
    mobileMp4:
      '/videos/taichung-courthouse-civic-daylight-v2-mobile.mp4',
    mobileWebm:
      '/videos/taichung-courthouse-civic-daylight-v2-mobile.webm',
  },
];

// 전 로케일 공통: ko 사이트 기준 로테이터 (2026-07-28 사용자 지시 — zh-hant 야경 단일컷 예외 폐지)
const slidesByLocale: Partial<Record<SiteLocale, HeroMediaSlide[]>> = {};

/**
 * `controlLabels` lets the guidance locales (vi/id/th/fil) reuse this exact
 * markup with their own decorative-video labels. Omitting it keeps the
 * existing four-language output byte-for-byte identical.
 */
export default function HeroMediaBackground({
  locale,
  controlLabels,
}: { locale?: SiteLocale; controlLabels?: DecorativeVideoControlLabels } = {}) {
  const slides = (locale && slidesByLocale[locale]) || defaultSlides;
  const slide = slides[0];

  return (
    <div className="hero-media">
      <div className="hero-media-item" data-active="true">
        <div className="hero-media-fallback">
          <DecorativeAutoplayVideo
            className="hero-media-video-shell"
            imageClassName="hero-media-image"
            videoClassName="hero-media-video"
            poster={slide.image}
            mp4Src={slide.mp4}
            webmSrc={slide.webm}
            mobilePoster={slide.mobileImage}
            mobileMp4Src={slide.mobileMp4}
            mobileWebmSrc={slide.mobileWebm}
            alt=""
            sizes="100vw"
            rootMargin="-1px 0px"
            controlLabels={
              controlLabels ?? DECORATIVE_VIDEO_CONTROL_LABELS[locale ?? 'ko']
            }
          />
        </div>
      </div>
    </div>
  );
}

/* ---------- Folio hero plate film ------------------------------------------------------------------------------- */
export const INTL_HERO_FILM_QUERY = '(min-width: 48rem) and (prefers-reduced-motion: no-preference)';

type NavigatorWithConnection = Navigator & { connection?: { saveData?: boolean } };

/** True when the plate may play its film: wide screen, motion allowed, no Save-Data. */
export function intlHeroFilmAllowed(win: Pick<Window, 'matchMedia' | 'navigator'>): boolean {
  if (typeof win.matchMedia !== 'function' || !win.matchMedia(INTL_HERO_FILM_QUERY).matches) return false;
  return !(win.navigator as NavigatorWithConnection).connection?.saveData;
}

/**
 * Folio hero plate film (id, th and the 27 European locales; ~/tseng-country-design-20261013/intl/DIRECTION.md §5).
 * It lives in this module, which the guidance home already loads, rather than in a new client module: a new client
 * component on that route re-grouped Next's CSS chunks for every locale (review round 1, measured on static builds).
 *
 * The hero plate's 5 s film. Nothing is in the server HTML but this empty slot: after `load` and an idle
 * moment, and only while the plate is on screen and the tab is visible, a muted, inline, non-looping <video> is
 * injected; it fades in once it is actually playing (its first frame is the still underneath) and rests on its last
 * frame. Phones, reduced motion, Save-Data, no JS or a refused play() keep the still.
 */
export function IntlHeroFilm({ webm, mp4 }: { webm: string; mp4: string }) {
  const slotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slot = slotRef.current;
    if (!slot || !intlHeroFilmAllowed(window)) return undefined;

    let disposed = false;
    let video: HTMLVideoElement | null = null;
    let observer: IntersectionObserver | null = null;
    let cancelScheduled: (() => void) | null = null;
    let onScreen = false;

    const removeVideo = () => {
      if (!video) return;
      video.pause();
      video.remove();
      video = null;
      slot.removeAttribute('data-playing');
    };

    const start = () => {
      if (disposed || video || !onScreen || document.visibilityState !== 'visible') return;
      observer?.disconnect();
      document.removeEventListener('visibilitychange', start);
      const film = document.createElement('video');
      film.muted = true;
      film.defaultMuted = true;
      film.playsInline = true;
      film.preload = 'none';
      film.setAttribute('muted', '');
      film.setAttribute('playsinline', '');
      film.setAttribute('disablepictureinpicture', '');
      film.setAttribute('aria-hidden', 'true');
      film.tabIndex = -1;
      for (const [src, type] of [
        [webm, 'video/webm'],
        [mp4, 'video/mp4'],
      ] as const) {
        const source = document.createElement('source');
        source.src = src;
        source.type = type;
        film.appendChild(source);
      }
      film.addEventListener('playing', () => slot.setAttribute('data-playing', ''), { once: true });
      film.addEventListener('error', removeVideo, { once: true });
      video = film;
      slot.appendChild(film);
      const played = film.play();
      if (played && typeof played.catch === 'function') played.catch(removeVideo);
    };

    const arm = () => {
      cancelScheduled = null;
      if (disposed) return;
      if (typeof IntersectionObserver === 'undefined') {
        onScreen = true;
      } else {
        observer = new IntersectionObserver((entries) => {
          onScreen = entries.some((entry) => entry.isIntersecting);
          start();
        });
        observer.observe(slot);
      }
      document.addEventListener('visibilitychange', start);
      start();
    };

    const schedule = () => {
      const idleWindow = window as Window & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
        cancelIdleCallback?: (handle: number) => void;
      };
      if (idleWindow.requestIdleCallback && idleWindow.cancelIdleCallback) {
        const handle = idleWindow.requestIdleCallback(arm, { timeout: 2000 });
        cancelScheduled = () => idleWindow.cancelIdleCallback?.(handle);
      } else {
        const handle = window.setTimeout(arm, 200);
        cancelScheduled = () => window.clearTimeout(handle);
      }
    };

    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });

    return () => {
      disposed = true;
      window.removeEventListener('load', schedule);
      document.removeEventListener('visibilitychange', start);
      observer?.disconnect();
      cancelScheduled?.();
      removeVideo();
    };
  }, [webm, mp4]);

  return <div ref={slotRef} aria-hidden="true" />;
}
