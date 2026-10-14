'use client';

import { useEffect, useRef } from 'react';
import { INTL_HERO_MEDIA } from '@/data/intl-design-site';

export const INTL_HERO_FILM_QUERY = '(min-width: 48rem) and (prefers-reduced-motion: no-preference)';

type NavigatorWithConnection = Navigator & { connection?: { saveData?: boolean } };

/** True when the plate may play its film: wide screen, motion allowed, no Save-Data. */
export function intlHeroFilmAllowed(win: Pick<Window, 'matchMedia' | 'navigator'>): boolean {
  if (typeof win.matchMedia !== 'function' || !win.matchMedia(INTL_HERO_FILM_QUERY).matches) return false;
  return !(win.navigator as NavigatorWithConnection).connection?.saveData;
}

/**
 * The hero plate's 5 s film (DIRECTION §5). Nothing is in the server HTML but this empty slot: after `load` and an idle
 * moment, and only while the plate is on screen and the tab is visible, a muted, inline, non-looping <video> is
 * injected; it fades in once it is actually playing (its first frame is the still underneath) and rests on its last
 * frame. Phones, reduced motion, Save-Data, no JS or a refused play() keep the still.
 */
export default function IntlHeroFilm() {
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
        [INTL_HERO_MEDIA.filmWebm, 'video/webm'],
        [INTL_HERO_MEDIA.filmMp4, 'video/mp4'],
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
  }, []);

  return <div ref={slotRef} aria-hidden="true" />;
}
