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

type SaveDataConnection = { saveData?: boolean } & Partial<Pick<EventTarget, 'addEventListener' | 'removeEventListener'>>;
type NavigatorWithConnection = Navigator & { connection?: SaveDataConnection };

/** True when the plate may play its film: wide screen, motion allowed, no Save-Data. */
export function intlHeroFilmAllowed(win: Pick<Window, 'matchMedia' | 'navigator'>): boolean {
  if (typeof win.matchMedia !== 'function' || !win.matchMedia(INTL_HERO_FILM_QUERY).matches) return false;
  return !(win.navigator as NavigatorWithConnection).connection?.saveData;
}

type FilmWindow = Pick<Window, 'matchMedia' | 'navigator' | 'addEventListener' | 'removeEventListener' | 'setTimeout' | 'clearTimeout'> & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
  IntersectionObserver?: typeof IntersectionObserver;
};
type FilmDocument = Pick<Document, 'readyState' | 'visibilityState' | 'createElement' | 'addEventListener' | 'removeEventListener'>;

/**
 * Runs the Folio hero film in `slot` and returns its cleanup. Every condition is read again whenever it can change
 * (screen width and motion preference, Save-Data, tab visibility, the plate on screen), not only at mount:
 * - the film is injected only once all of them hold, after `load` and an idle moment;
 * - it pauses while the tab is hidden or the plate is off screen, and resumes when both are back;
 * - it is removed, and its download stopped, as soon as the screen narrows, reduced motion or Save-Data is turned on;
 *   it may start again if they are turned off before it has played to the end;
 * - once it has ended (resting on its last frame) or play() was refused, it is never injected again.
 */
export function mountIntlHeroFilm(
  slot: HTMLElement,
  { webm, mp4 }: { webm: string; mp4: string },
  win: FilmWindow = window,
  doc: FilmDocument = document,
): () => void {
  const media = typeof win.matchMedia === 'function' ? win.matchMedia(INTL_HERO_FILM_QUERY) : null;
  const connection = (win.navigator as NavigatorWithConnection).connection;
  let disposed = false;
  let armed = false;
  let done = false;
  let onScreen = false;
  let video: HTMLVideoElement | null = null;
  let observer: IntersectionObserver | null = null;
  let cancelScheduled: (() => void) | null = null;

  const removeVideo = () => {
    if (!video) return;
    const film = video;
    video = null;
    film.pause();
    // Without sources, load() aborts a download in progress.
    film.replaceChildren();
    film.removeAttribute('src');
    film.load();
    film.remove();
    slot.removeAttribute('data-playing');
  };

  const refuse = (film: HTMLVideoElement) => {
    if (video !== film) return;
    done = true;
    removeVideo();
  };

  const play = (film: HTMLVideoElement) => {
    const played = film.play();
    if (played && typeof played.catch === 'function') played.catch(() => refuse(film));
  };

  const inject = () => {
    const film = doc.createElement('video');
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
      const source = doc.createElement('source');
      source.src = src;
      source.type = type;
      film.appendChild(source);
    }
    film.addEventListener('playing', () => slot.setAttribute('data-playing', ''), { once: true });
    film.addEventListener('ended', () => { done = true; }, { once: true });
    film.addEventListener('error', () => refuse(film), { once: true });
    video = film;
    slot.appendChild(film);
    play(film);
  };

  const sync = () => {
    if (disposed || !armed) return;
    if (!intlHeroFilmAllowed(win)) {
      removeVideo();
      return;
    }
    const showing = onScreen && doc.visibilityState === 'visible';
    if (video) {
      if (done) return;
      if (!showing) video.pause();
      else if (video.paused) play(video);
      return;
    }
    if (!done && showing) inject();
  };

  const arm = () => {
    cancelScheduled = null;
    if (disposed) return;
    armed = true;
    if (typeof win.IntersectionObserver !== 'function') {
      onScreen = true;
    } else {
      observer = new win.IntersectionObserver((entries) => {
        onScreen = entries.some((entry) => entry.isIntersecting);
        sync();
      });
      observer.observe(slot);
    }
    sync();
  };

  const schedule = () => {
    if (disposed) return;
    if (win.requestIdleCallback && win.cancelIdleCallback) {
      const handle = win.requestIdleCallback(arm, { timeout: 2000 });
      cancelScheduled = () => win.cancelIdleCallback?.(handle);
    } else {
      const handle = win.setTimeout(arm, 200);
      cancelScheduled = () => win.clearTimeout(handle);
    }
  };

  // Older Safari only has addListener on MediaQueryList.
  if (media) {
    if (typeof media.addEventListener === 'function') media.addEventListener('change', sync);
    else media.addListener?.(sync);
  }
  connection?.addEventListener?.('change', sync);
  doc.addEventListener('visibilitychange', sync);
  if (doc.readyState === 'complete') schedule();
  else win.addEventListener('load', schedule, { once: true });

  return () => {
    disposed = true;
    if (media) {
      if (typeof media.removeEventListener === 'function') media.removeEventListener('change', sync);
      else media.removeListener?.(sync);
    }
    connection?.removeEventListener?.('change', sync);
    doc.removeEventListener('visibilitychange', sync);
    win.removeEventListener('load', schedule);
    observer?.disconnect();
    cancelScheduled?.();
    removeVideo();
  };
}

/**
 * Folio hero plate film (id, th and the 27 European locales; ~/tseng-country-design-20261013/intl/DIRECTION.md §5).
 * It lives in this module, which the guidance home already loads, rather than in a new client module: a new client
 * component on that route re-grouped Next's CSS chunks for every locale (review round 1, measured on static builds).
 *
 * The hero plate's 5 s film. Nothing is in the server HTML but this empty slot; `mountIntlHeroFilm` injects a muted,
 * inline, non-looping <video> after `load` and an idle moment, only while it is allowed and seen. It fades in once it
 * is actually playing (its first frame is the still underneath) and rests on its last frame. Phones, reduced motion,
 * Save-Data, no JS or a refused play() keep the still.
 */
export function IntlHeroFilm({ webm, mp4 }: { webm: string; mp4: string }) {
  const slotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slot = slotRef.current;
    return slot ? mountIntlHeroFilm(slot, { webm, mp4 }) : undefined;
  }, [webm, mp4]);

  return <div ref={slotRef} aria-hidden="true" />;
}
