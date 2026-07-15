'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

const DELAYED_VIEWPORT_CHECK_MS = 1_400;

export function installRevealLifecycle(element: HTMLDivElement, onReveal: () => void): () => void {
  let disposed = false;
  let revealed = false;
  let delayedViewportCheckTimer = 0;
  let viewportCheckTimer = 0;
  let animationFrame = 0;
  let observer: IntersectionObserver | null = null;
  let fallbackListenersAttached = false;
  let revealIfNearViewport = () => {};

  const detachFallbackListeners = () => {
    if (!fallbackListenersAttached) return;

    window.removeEventListener('scroll', revealIfNearViewport, true);
    window.removeEventListener('resize', revealIfNearViewport);
    document.removeEventListener('visibilitychange', revealIfNearViewport);
    fallbackListenersAttached = false;
  };

  const clearScheduledChecks = () => {
    window.clearTimeout(delayedViewportCheckTimer);
    window.clearTimeout(viewportCheckTimer);
    window.cancelAnimationFrame(animationFrame);
    detachFallbackListeners();
  };

  const revealNow = () => {
    if (disposed || revealed) return;

    revealed = true;
    clearScheduledChecks();
    observer?.disconnect();
    onReveal();
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealNow();
    return () => {
      disposed = true;
    };
  }

  // Treat an effective zero-duration style like reduced motion so visibility
  // never depends on an observer firing.
  const transitionDurations = getComputedStyle(element).transitionDuration
    .split(',')
    .map((duration) => Number.parseFloat(duration) || 0);
  if (transitionDurations.length > 0 && transitionDurations.every((duration) => duration === 0)) {
    revealNow();
    return () => {
      disposed = true;
    };
  }

  const revealBuffer = Math.min(240, window.innerHeight * 0.25);
  const isNearViewport = () => {
    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight + revealBuffer && rect.bottom > -revealBuffer;
  };

  if (isNearViewport()) {
    revealNow();
    return () => {
      disposed = true;
    };
  }

  if (!('IntersectionObserver' in window)) {
    revealNow();
    return () => {
      disposed = true;
    };
  }

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        revealNow();
      }
    },
    { rootMargin: '96px 0px', threshold: 0.06 }
  );

  revealIfNearViewport = () => {
    if (isNearViewport()) revealNow();
  };

  window.addEventListener('scroll', revealIfNearViewport, { capture: true, passive: true });
  window.addEventListener('resize', revealIfNearViewport, { passive: true });
  document.addEventListener('visibilitychange', revealIfNearViewport);
  fallbackListenersAttached = true;

  animationFrame = window.requestAnimationFrame(revealIfNearViewport);
  viewportCheckTimer = window.setTimeout(revealIfNearViewport, 320);
  delayedViewportCheckTimer = window.setTimeout(
    revealIfNearViewport,
    DELAYED_VIEWPORT_CHECK_MS,
  );

  observer.observe(element);
  return () => {
    disposed = true;
    clearScheduledChecks();
    observer?.disconnect();
  };
}

export default function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    return installRevealLifecycle(element, () => setVisible(true));
  }, []);

  return (
    <div ref={ref} className={`reveal${visible ? ' is-visible' : ''}`}>
      {children}
    </div>
  );
}
