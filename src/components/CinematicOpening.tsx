'use client';

import Image from 'next/image';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';
import type { SiteLocale } from '@/lib/locales';
import DecorativeAutoplayVideo, {
  DECORATIVE_VIDEO_CONTROL_LABELS,
} from '@/components/DecorativeAutoplayVideo';

export const CINEMATIC_OPENING_MEDIA = {
  desktop: {
    poster: '/images/editorial/taiwan-central-mountains-cloud-flight-v2.webp',
    webm: '/videos/taiwan-central-mountains-cloud-flight-v2.webm',
    mp4: '/videos/taiwan-central-mountains-cloud-flight-v2.mp4',
  },
  mobile: {
    poster: '/images/editorial/taiwan-central-mountains-cloud-flight-v2-mobile.webp',
    webm: '/videos/taiwan-central-mountains-cloud-flight-v2-mobile.webm',
    mp4: '/videos/taiwan-central-mountains-cloud-flight-v2-mobile.mp4',
  },
} as const;

export const CINEMATIC_OPENING_SEAL_SIZES =
  '(max-width: 800px) 88px, (max-width: 1272px) 11vw, 140px';

export const CINEMATIC_OPENING_WHEEL_THRESHOLD = 1;
export const CINEMATIC_OPENING_TOUCH_THRESHOLD = 44;

const CINEMATIC_OPENING_TOP_TOLERANCE = 24;
const CINEMATIC_OPENING_WHEEL_RESET_MS = 180;
const CINEMATIC_OPENING_TRANSITION_TIMEOUT_MS = 900;
const CINEMATIC_HOME_HERO_SELECTORS = [
  '#hero',
  '.hero',
  '[data-node-id="home-hero-root"]',
  '[data-node-id="home-hero"]',
] as const;

interface CinematicOpeningInputHost {
  readonly innerHeight: number;
  addEventListener(
    type: string,
    listener: EventListener,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListener,
    options?: boolean | EventListenerOptions,
  ): void;
  setTimeout(callback: () => void, delay: number): number;
  clearTimeout(timer: number): void;
}

export function accumulateOpeningWheelDelta(
  accumulatedDelta: number,
  deltaY: number,
  deltaMode: number,
  viewportHeight: number,
): {
  accumulatedDelta: number;
  shouldTransition: boolean;
} {
  if (deltaY <= 0) {
    return { accumulatedDelta: 0, shouldTransition: false };
  }

  const pixelDelta = deltaMode === 1
    ? deltaY * 16
    : deltaMode === 2
      ? deltaY * Math.max(viewportHeight, 1)
      : deltaY;
  const nextDelta = accumulatedDelta + Math.max(1, pixelDelta);

  return {
    accumulatedDelta: nextDelta,
    shouldTransition: nextDelta >= CINEMATIC_OPENING_WHEEL_THRESHOLD,
  };
}

export function isOpeningNearViewportTop({
  scrollY,
  sectionTop,
  sectionBottom,
  viewportHeight,
}: {
  scrollY: number;
  sectionTop: number;
  sectionBottom: number;
  viewportHeight: number;
}): boolean {
  return (
    scrollY <= CINEMATIC_OPENING_TOP_TOLERANCE
    && sectionTop >= -CINEMATIC_OPENING_TOP_TOLERANCE
    && sectionTop <= CINEMATIC_OPENING_TOP_TOLERANCE
    && sectionBottom >= Math.max(1, viewportHeight * 0.6)
  );
}

export function isOpeningForwardKey({
  key,
  shiftKey = false,
  altKey = false,
  ctrlKey = false,
  metaKey = false,
}: {
  key: string;
  shiftKey?: boolean;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
}): boolean {
  if (shiftKey || altKey || ctrlKey || metaKey) return false;
  return ['ArrowDown', 'PageDown', ' ', 'Spacebar'].includes(key);
}

export function resolveCinematicHomeScrollTop(
  target: HTMLElement,
  currentScrollY: number,
): number {
  const main = target.closest('main') ?? target.parentElement;
  let hero: HTMLElement | null = null;
  for (const selector of CINEMATIC_HOME_HERO_SELECTORS) {
    hero = main?.querySelector<HTMLElement>(selector) ?? null;
    if (hero) break;
  }
  const visualTarget = hero ?? target;
  return currentScrollY + visualTarget.getBoundingClientRect().top;
}

export function bindCinematicOpeningInputHandlers({
  host,
  isCaptureActive,
  isTransitionLocked,
  transitionToContent,
  isFormControl = (target) => (
    target instanceof Element
    && Boolean(
      target.closest(
        'input, textarea, select, button, [contenteditable=""], [contenteditable="true"], [role="textbox"]',
      ),
    )
  ),
}: {
  host: CinematicOpeningInputHost;
  isCaptureActive: () => boolean;
  isTransitionLocked: () => boolean;
  transitionToContent: () => boolean;
  isFormControl?: (target: EventTarget | null) => boolean;
}): () => void {
  let wheelDelta = 0;
  let wheelGestureCaptured = false;
  let wheelIdleTimer: number | null = null;
  let touchStartY: number | null = null;

  const clearWheelIdleTimer = () => {
    if (wheelIdleTimer !== null) {
      host.clearTimeout(wheelIdleTimer);
      wheelIdleTimer = null;
    }
  };
  const releaseWheelGesture = () => {
    clearWheelIdleTimer();
    wheelDelta = 0;
    wheelGestureCaptured = false;
  };
  const releaseWheelGestureAfterIdle = () => {
    clearWheelIdleTimer();
    wheelIdleTimer = host.setTimeout(() => {
      wheelIdleTimer = null;
      wheelDelta = 0;
      wheelGestureCaptured = false;
    }, CINEMATIC_OPENING_WHEEL_RESET_MS);
  };

  const handleWheel = ((inputEvent: Event) => {
    const event = inputEvent as WheelEvent;
    if (
      event.defaultPrevented
      || event.altKey
      || event.ctrlKey
      || event.metaKey
      || event.shiftKey
      || isFormControl(event.target)
    ) {
      return;
    }

    if (event.deltaY <= 0) {
      releaseWheelGesture();
      return;
    }
    if (isTransitionLocked()) {
      if (wheelGestureCaptured) {
        if (event.cancelable) event.preventDefault();
        releaseWheelGestureAfterIdle();
      }
      return;
    }
    if (!isCaptureActive()) {
      releaseWheelGesture();
      return;
    }

    if (event.cancelable) event.preventDefault();
    const result = accumulateOpeningWheelDelta(
      wheelDelta,
      event.deltaY,
      event.deltaMode,
      host.innerHeight,
    );
    wheelDelta = result.accumulatedDelta;

    if (result.shouldTransition) {
      wheelGestureCaptured = transitionToContent();
    }
    releaseWheelGestureAfterIdle();
  }) as EventListener;

  const handleKeyDown = ((inputEvent: Event) => {
    const event = inputEvent as KeyboardEvent;
    if (
      event.defaultPrevented
      || event.repeat
      || isFormControl(event.target)
      || !isOpeningForwardKey(event)
      || isTransitionLocked()
      || !isCaptureActive()
    ) {
      return;
    }

    if (transitionToContent()) event.preventDefault();
  }) as EventListener;

  const handleTouchStart = ((inputEvent: Event) => {
    const event = inputEvent as TouchEvent;
    if (
      event.touches.length !== 1
      || isFormControl(event.target)
      || !isCaptureActive()
    ) {
      touchStartY = null;
      return;
    }
    touchStartY = event.touches[0]?.clientY ?? null;
  }) as EventListener;

  const handleTouchMove = ((inputEvent: Event) => {
    const event = inputEvent as TouchEvent;
    const currentY = event.touches[0]?.clientY;
    if (
      touchStartY === null
      || currentY === undefined
      || event.touches.length !== 1
    ) {
      return;
    }

    const upwardDistance = touchStartY - currentY;
    if (upwardDistance <= 0) return;

    if (isTransitionLocked()) {
      if (event.cancelable) event.preventDefault();
      return;
    }
    if (!isCaptureActive()) return;

    if (event.cancelable) event.preventDefault();
    if (upwardDistance >= CINEMATIC_OPENING_TOUCH_THRESHOLD) {
      transitionToContent();
    }
  }) as EventListener;

  const clearTouch = (() => {
    touchStartY = null;
  }) as EventListener;

  host.addEventListener('wheel', handleWheel, { passive: false, capture: true });
  host.addEventListener('keydown', handleKeyDown, { capture: true });
  host.addEventListener('touchstart', handleTouchStart, {
    passive: true,
    capture: true,
  });
  host.addEventListener('touchmove', handleTouchMove, {
    passive: false,
    capture: true,
  });
  host.addEventListener('touchend', clearTouch, { capture: true });
  host.addEventListener('touchcancel', clearTouch, { capture: true });

  return () => {
    host.removeEventListener('wheel', handleWheel, true);
    host.removeEventListener('keydown', handleKeyDown, true);
    host.removeEventListener('touchstart', handleTouchStart, true);
    host.removeEventListener('touchmove', handleTouchMove, true);
    host.removeEventListener('touchend', clearTouch, true);
    host.removeEventListener('touchcancel', clearTouch, true);
    releaseWheelGesture();
    touchStartY = null;
  };
}

export function hasPositiveIntersection(entry: IntersectionObserverEntry): boolean {
  return (
    entry.isIntersecting
    && entry.intersectionRatio > 0
    && entry.intersectionRect.width > 0
    && entry.intersectionRect.height > 0
  );
}

export const CINEMATIC_OPENING_COPY: Record<
  SiteLocale,
  {
    primary: string;
    secondary: string;
    scroll: string;
    mediaAlt: string;
  }
> = {
  ko: {
    primary: '법무법인 호정',
    secondary: 'HOVERING INTERNATIONAL LAW FIRM',
    scroll: '본문으로 스크롤',
    mediaAlt: '밝은 자연광 아래 대만 중앙산맥과 운해 위를 비행하는 항공 전경',
  },
  'zh-hant': {
    primary: '昊鼎國際法律事務所',
    secondary: 'HOVERING INTERNATIONAL LAW FIRM',
    scroll: '向下捲動',
    mediaAlt: '明亮自然光下飛越臺灣中央山脈與雲海的空中景觀',
  },
  en: {
    primary: 'HOVERING INTERNATIONAL LAW FIRM',
    secondary: 'ATTORNEYS AT LAW IN TAIWAN',
    scroll: 'Scroll to continue',
    mediaAlt: 'Bright aerial flight over Taiwan’s Central Mountain Range and sea of clouds',
  },
  ja: {
    primary: '昊鼎国際法律事務所',
    secondary: 'HOVERING INTERNATIONAL LAW FIRM',
    scroll: '下にスクロール',
    mediaAlt: '明るい自然光の中、台湾中央山脈と雲海の上空を飛ぶ空撮風景',
  },
};

export default function CinematicOpening({
  locale,
  deferredContent,
}: {
  locale: SiteLocale;
  deferredContent?: ReactNode;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const siteRef = useRef<HTMLElement | null>(null);
  const transitionLockedRef = useRef(false);
  const transitionCleanupRef = useRef<(() => void) | null>(null);
  const [introVisible, setIntroVisibleState] = useState(true);
  const copy = CINEMATIC_OPENING_COPY[locale];

  const setIntroVisible = useCallback((visible: boolean) => {
    const site = siteRef.current;
    if (site) {
      site.dataset.cinematicIntroVisible = visible ? 'true' : 'false';
    }
    document.documentElement.dataset.cinematicIntroVisible = visible
      ? 'true'
      : 'false';
    setIntroVisibleState(visible);
  }, []);

  const releaseTransitionLock = useCallback(() => {
    transitionCleanupRef.current?.();
    transitionCleanupRef.current = null;
    transitionLockedRef.current = false;
  }, []);

  const transitionToContent = useCallback(() => {
    if (transitionLockedRef.current) return true;

    const target = document.getElementById('cinematic-home-content');
    if (!target) return false;

    transitionLockedRef.current = true;

    setIntroVisible(false);
    const settleFrame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'auto' });
    });
    const transitionTimer = window.setTimeout(
      releaseTransitionLock,
      CINEMATIC_OPENING_TRANSITION_TIMEOUT_MS,
    );

    transitionCleanupRef.current = () => {
      window.cancelAnimationFrame(settleFrame);
      window.clearTimeout(transitionTimer);
    };

    window.history.replaceState(
      window.history.state,
      '',
      `${window.location.pathname}${window.location.search}`,
    );
    window.scrollTo({ top: 0, behavior: 'auto' });
    return true;
  }, [releaseTransitionLock, setIntroVisible]);

  useEffect(() => {
    const section = sectionRef.current;
    const site = section?.closest<HTMLElement>('[data-cinematic-home]');
    if (!section || !site) return;

    siteRef.current = site;
    setIntroVisible(true);

    if (typeof IntersectionObserver === 'undefined') {
      setIntroVisible(false);
      return () => {
        delete site.dataset.cinematicIntroVisible;
        delete document.documentElement.dataset.cinematicIntroVisible;
        siteRef.current = null;
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIntroVisible(Boolean(entry && hasPositiveIntersection(entry))),
      { threshold: [0, 0.01] },
    );
    observer.observe(section);

    return () => {
      observer.disconnect();
      delete site.dataset.cinematicIntroVisible;
      delete document.documentElement.dataset.cinematicIntroVisible;
      siteRef.current = null;
    };
  }, [setIntroVisible]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const isCaptureActive = () => {
      const rect = section.getBoundingClientRect();
      return isOpeningNearViewportTop({
        scrollY: window.scrollY,
        sectionTop: rect.top,
        sectionBottom: rect.bottom,
        viewportHeight: window.innerHeight,
      });
    };
    const cleanupInputHandlers = bindCinematicOpeningInputHandlers({
      host: window as unknown as CinematicOpeningInputHost,
      isCaptureActive,
      isTransitionLocked: () => transitionLockedRef.current,
      transitionToContent,
    });

    return () => {
      cleanupInputHandlers();
      releaseTransitionLock();
    };
  }, [releaseTransitionLock, transitionToContent]);

  const handleScrollClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented
      || event.button !== 0
      || event.metaKey
      || event.ctrlKey
      || event.shiftKey
      || event.altKey
    ) {
      return;
    }

    if (transitionToContent()) event.preventDefault();
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="cinematic-opening"
        aria-label={copy.primary}
      >
        <DecorativeAutoplayVideo
          className="cinematic-opening__media"
          imageClassName="cinematic-opening__poster"
          videoClassName="cinematic-opening__video"
          poster={CINEMATIC_OPENING_MEDIA.desktop.poster}
          webmSrc={CINEMATIC_OPENING_MEDIA.desktop.webm}
          mp4Src={CINEMATIC_OPENING_MEDIA.desktop.mp4}
          mobilePoster={CINEMATIC_OPENING_MEDIA.mobile.poster}
          mobileWebmSrc={CINEMATIC_OPENING_MEDIA.mobile.webm}
          mobileMp4Src={CINEMATIC_OPENING_MEDIA.mobile.mp4}
          alt={copy.mediaAlt}
          sizes="100vw"
          eagerVideoMount
          deferVideoUntilPosterPaint
          priority
          rootMargin="0px"
          controlLabels={DECORATIVE_VIDEO_CONTROL_LABELS[locale]}
        />
        <div className="cinematic-opening__veil" aria-hidden="true" />
        <div className="cinematic-opening__brand">
          <Image
            className="cinematic-opening__seal"
            src="/images/brand/hovering-seal-official-opening.webp"
            alt=""
            aria-hidden="true"
            width={280}
            height={268}
            sizes={CINEMATIC_OPENING_SEAL_SIZES}
            unoptimized
            priority
            fetchPriority="high"
          />
          <p className="cinematic-opening__primary">{copy.primary}</p>
          <p className="cinematic-opening__secondary">{copy.secondary}</p>
        </div>
        <a
          className="cinematic-opening__scroll"
          href="#cinematic-home-content"
          onClick={handleScrollClick}
        >
          <span>{copy.scroll}</span>
          <span className="cinematic-opening__scroll-mark" aria-hidden="true">
            ↓
          </span>
        </a>
      </section>
      {!introVisible ? deferredContent : null}
    </>
  );
}
