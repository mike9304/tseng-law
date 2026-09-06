'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';
import type { SiteLocale } from '@/lib/locales';
import DecorativeAutoplayVideo, {
  DECORATIVE_VIDEO_CONTROL_LABELS,
} from '@/components/DecorativeAutoplayVideo';
import styles from './CinematicOpening.module.css';

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
const CINEMATIC_SITE_SELECTOR = '[data-cinematic-home]';

/* WI-11: the opening plays at most once per browser session. The marker is
   written after the opening completes; `?intro=1` forces a replay for QA. */
export const CINEMATIC_OPENING_SEEN_STORAGE_KEY = 'hojeong.cinematic.seen';
export const CINEMATIC_OPENING_FORCE_QUERY_PARAM = 'intro';

export type CinematicOpeningStartState = 'opening' | 'completed';

type SeenStorage = Pick<Storage, 'getItem'>;

export function shouldForceCinematicOpening(search: string): boolean {
  try {
    return new URLSearchParams(search).get(CINEMATIC_OPENING_FORCE_QUERY_PARAM) === '1';
  } catch {
    return false;
  }
}

export function hasSeenCinematicOpening(
  storage: SeenStorage | null | undefined,
): boolean {
  try {
    return storage?.getItem(CINEMATIC_OPENING_SEEN_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function resolveCinematicOpeningStartState({
  search,
  storage,
}: {
  search: string;
  storage: SeenStorage | null | undefined;
}): CinematicOpeningStartState {
  if (shouldForceCinematicOpening(search)) return 'opening';
  return hasSeenCinematicOpening(storage) ? 'completed' : 'opening';
}

export function markCinematicOpeningSeen(
  storage: Pick<Storage, 'setItem'> | null | undefined,
): void {
  try {
    storage?.setItem(CINEMATIC_OPENING_SEEN_STORAGE_KEY, '1');
  } catch {
    // Storage can be unavailable (private mode, quota, disabled cookies).
  }
}

function readSessionStorage(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

/* Runs while the HTML is still being parsed, before the opening markup exists,
   so a returning visitor never paints the opening (no flash) and no React
   state is involved. It flips the same `.site` / `<html>` dataset flag that
   `setIntroVisible(false)` writes after a completed opening, which globals.css
   already maps to "opening hidden, header + main shown". The hydrated shell
   carries `suppressHydrationWarning` for this attribute; React never patches
   attribute differences during hydration, so the DOM value survives. */
export const CINEMATIC_OPENING_PRE_HYDRATION_SCRIPT = [
  '(function(){try{',
  `if(new URLSearchParams(location.search).get(${JSON.stringify(
    CINEMATIC_OPENING_FORCE_QUERY_PARAM,
  )})==='1')return;`,
  `if(sessionStorage.getItem(${JSON.stringify(
    CINEMATIC_OPENING_SEEN_STORAGE_KEY,
  )})!=='1')return;`,
  'var s=document.currentScript;',
  `var site=s&&s.parentElement&&s.parentElement.closest(${JSON.stringify(
    CINEMATIC_SITE_SELECTOR,
  )});`,
  'if(!site)return;',
  "site.setAttribute('data-cinematic-intro-visible','false');",
  "document.documentElement.setAttribute('data-cinematic-intro-visible','false');",
  '}catch(_){}})();',
].join('');

// The session gate must flip before the first client paint (hard load: after
// hydration; client navigation: right after the section is inserted). On the
// server there is nothing to flip, so fall back to a no-op passive effect and
// avoid react-dom/server's useLayoutEffect warning.
const useBrowserLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

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
        'input, textarea, select, button:not([data-skip="true"]), [contenteditable=""], [contenteditable="true"], [role="textbox"]',
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
    skip: string;
    mediaAlt: string;
    service: string;
    contact: string;
  }
> = {
  ko: {
    primary: '법무법인 호정',
    secondary: 'HOVERING INTERNATIONAL LAW FIRM',
    scroll: '본문으로 스크롤',
    skip: '건너뛰기',
    mediaAlt: '밝은 자연광 아래 대만 중앙산맥과 운해 위를 비행하는 항공 전경',
    service: '대만 법률 상담 · 한국어·일본어·영어 소통',
    contact: '상담 연락처',
  },
  'zh-hant': {
    primary: '昊鼎國際法律事務所',
    secondary: 'HOVERING INTERNATIONAL LAW FIRM',
    scroll: '向下捲動',
    skip: '略過',
    mediaAlt: '明亮自然光下飛越臺灣中央山脈與雲海的空中景觀',
    service: '台灣法律諮詢 · 韓語、日語、英語溝通',
    contact: '諮詢聯絡方式',
  },
  en: {
    primary: 'HOVERING INTERNATIONAL LAW FIRM',
    secondary: 'ATTORNEYS AT LAW IN TAIWAN',
    scroll: 'Scroll to continue',
    skip: 'Skip intro',
    mediaAlt: 'Bright aerial flight over Taiwan’s Central Mountain Range and sea of clouds',
    service: 'Taiwan legal support · English, Japanese & Korean',
    contact: 'Contact the firm',
  },
  ja: {
    primary: '昊鼎国際法律事務所',
    secondary: 'HOVERING INTERNATIONAL LAW FIRM',
    scroll: '下にスクロール',
    skip: 'スキップ',
    mediaAlt: '明るい自然光の中、台湾中央山脈と雲海の上空を飛ぶ空撮風景',
    service: '台湾の法律相談 · 日本語・英語・韓国語で対応',
    contact: '相談窓口',
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
  const skipButtonRef = useRef<HTMLButtonElement>(null);
  const siteRef = useRef<HTMLElement | null>(null);
  const transitionLockedRef = useRef(false);
  const transitionCleanupRef = useRef<(() => void) | null>(null);
  // Decided synchronously on mount (before paint); effects that belong to a
  // playing opening read the ref because the first commit's passive effects
  // run before the state update below re-renders.
  const startStateRef = useRef<CinematicOpeningStartState>('opening');
  const [introVisible, setIntroVisibleState] = useState(true);
  const [phase, setPhase] = useState<CinematicOpeningStartState>('opening');
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
    markCinematicOpeningSeen(readSessionStorage());
    // The opening is display:none from here on. Focus that was inside it (the
    // skip control receives focus on mount) would silently drop to <body>;
    // hand it to the content sentinel at the top of <main> instead so the
    // next Tab lands on the first real page control.
    const activeElement = document.activeElement;
    const section = sectionRef.current;
    if (activeElement && section?.contains(activeElement)) {
      target.focus({ preventScroll: true });
    }
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

  // Session gate. Runs before the first client paint: a returning visitor
  // (or a client-side navigation back to the home) gets the completed state
  // immediately and the opening subtree is unmounted, while a first visit (or
  // `?intro=1`) keeps the opening and moves focus to the skip control so
  // keyboard and assistive-technology users meet the exit first.
  useBrowserLayoutEffect(() => {
    const section = sectionRef.current;
    siteRef.current = section?.closest<HTMLElement>(CINEMATIC_SITE_SELECTOR) ?? null;

    const startState = resolveCinematicOpeningStartState({
      search: window.location.search,
      storage: readSessionStorage(),
    });
    startStateRef.current = startState;

    if (startState === 'completed') {
      setIntroVisible(false);
      setPhase('completed');
      return;
    }

    const activeElement = document.activeElement;
    if (!activeElement || activeElement === document.body) {
      skipButtonRef.current?.focus({ preventScroll: true });
    }
  }, [setIntroVisible]);

  useEffect(() => {
    const site = siteRef.current;
    return () => {
      if (site) delete site.dataset.cinematicIntroVisible;
      delete document.documentElement.dataset.cinematicIntroVisible;
      siteRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (phase !== 'opening' || startStateRef.current !== 'opening') return;
    const section = sectionRef.current;
    const site = siteRef.current;
    if (!section || !site) return;

    setIntroVisible(true);

    if (typeof IntersectionObserver === 'undefined') {
      setIntroVisible(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIntroVisible(Boolean(entry && hasPositiveIntersection(entry))),
      { threshold: [0, 0.01] },
    );
    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, [phase, setIntroVisible]);

  useEffect(() => {
    if (phase !== 'opening' || startStateRef.current !== 'opening') return;
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
  }, [phase, releaseTransitionLock, transitionToContent]);

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

  const handleSkipClick = () => {
    transitionToContent();
  };

  if (phase === 'completed') {
    return <>{deferredContent}</>;
  }

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: CINEMATIC_OPENING_PRE_HYDRATION_SCRIPT }}
      />
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
          <div className="cinematic-opening__info">
            <p className="cinematic-opening__service">{copy.service}</p>
            <Link className="cinematic-opening__contact" href={`/${locale}/contact`}>
              {copy.contact}
            </Link>
          </div>
        </div>
        <button
          ref={skipButtonRef}
          type="button"
          className={`cinematic-opening__skip ${styles.skip}`}
          data-skip="true"
          onClick={handleSkipClick}
        >
          {copy.skip}
        </button>
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
