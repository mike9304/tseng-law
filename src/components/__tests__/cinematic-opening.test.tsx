import { readFileSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const navigationState = vi.hoisted(() => ({
  pathname: '/ko' as string | null,
}));

vi.mock('next/navigation', () => ({
  usePathname: () => navigationState.pathname,
}));

import {
  accumulateOpeningWheelDelta,
  bindCinematicOpeningInputHandlers,
  CINEMATIC_OPENING_COPY,
  CINEMATIC_OPENING_MEDIA,
  CINEMATIC_OPENING_SEAL_SIZES,
  CINEMATIC_OPENING_TOUCH_THRESHOLD,
  CINEMATIC_OPENING_WHEEL_THRESHOLD,
  hasPositiveIntersection,
  isOpeningForwardKey,
  isOpeningNearViewportTop,
  resolveCinematicHomeScrollTop,
} from '../CinematicOpening';
import CinematicOpening from '../CinematicOpening';
import CinematicRouteShell, {
  CINEMATIC_CHROME_ATTRIBUTE,
  isCinematicHomepagePath,
} from '../CinematicRouteShell';

const locales = ['ko', 'zh-hant', 'en', 'ja'] as const;
const expectedOpeningCopy = {
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
} as const;

function renderRouteShell(pathname: string | null, locale: (typeof locales)[number] = 'ko') {
  navigationState.pathname = pathname;
  return renderToStaticMarkup(
    <CinematicRouteShell
      locale={locale}
      header={<div>HEADER</div>}
      footer={<div>FOOTER</div>}
      quickContact={<div>QUICK_CONTACT</div>}
      scrollTop={<div>SCROLL_TOP</div>}
      eventPopup={<div>EVENT_POPUP</div>}
    >
      <div>PAGE_CONTENT</div>
    </CinematicRouteShell>,
  );
}

class FakeInputHost {
  readonly innerHeight = 900;
  readonly listeners = new Map<string, Set<EventListener>>();
  readonly timers = new Map<number, () => void>();
  private nextTimer = 1;

  addEventListener(type: string, listener: EventListener) {
    const listeners = this.listeners.get(type) ?? new Set<EventListener>();
    listeners.add(listener);
    this.listeners.set(type, listeners);
  }

  removeEventListener(type: string, listener: EventListener) {
    this.listeners.get(type)?.delete(listener);
  }

  setTimeout(callback: () => void) {
    const timer = this.nextTimer;
    this.nextTimer += 1;
    this.timers.set(timer, callback);
    return timer;
  }

  clearTimeout(timer: number) {
    this.timers.delete(timer);
  }

  dispatch(type: string, event: object) {
    this.listeners.get(type)?.forEach((listener) => {
      listener(event as Event);
    });
  }

  runTimers() {
    const timers = [...this.timers.values()];
    this.timers.clear();
    timers.forEach((callback) => callback());
  }

  listenerCount() {
    return [...this.listeners.values()].reduce(
      (count, listeners) => count + listeners.size,
      0,
    );
  }
}

function wheelEvent(deltaY: number) {
  return {
    defaultPrevented: false,
    cancelable: true,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    target: null,
    deltaY,
    deltaMode: 0,
    preventDefault: vi.fn(),
  };
}

function keyboardEvent(key: string) {
  return {
    defaultPrevented: false,
    repeat: false,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    target: null,
    key,
    preventDefault: vi.fn(),
  };
}

describe('cinematic opening client-route gate', () => {
  it.each([
    ['/ko', 'ko'],
    ['/ko/', 'ko'],
    ['/zh-hant', 'zh-hant'],
    ['/zh-hant/', 'zh-hant'],
    ['/en', 'en'],
    ['/en/', 'en'],
    ['/ja', 'ja'],
    ['/ja/', 'ja'],
  ] as const)('includes the exact homepage pathname %s', (pathname, locale) => {
    expect(isCinematicHomepagePath(pathname, locale)).toBe(true);
    const html = renderRouteShell(pathname, locale);
    expect(html).toContain('data-cinematic-home="true"');
    expect(html).toContain('class="cinematic-opening"');
  });

  it.each([
    ['/ko/about', 'ko'],
    ['/zh-hant/builder-preview', 'zh-hant'],
    ['/en/admin-builder', 'en'],
    ['/ja/columns', 'ja'],
    ['/ko//', 'ko'],
    ['/', 'ko'],
    ['/ko?campaign=opening', 'ko'],
    ['/ko/#main', 'ko'],
    [null, 'ko'],
  ] as const)('excludes the non-home pathname %s', (pathname, locale) => {
    expect(isCinematicHomepagePath(pathname, locale)).toBe(false);
    const html = renderRouteShell(pathname, locale);
    expect(html).not.toContain('data-cinematic-home="true"');
    expect(html).not.toContain('class="cinematic-opening"');
  });

  it('re-evaluates home → subpage → home instead of caching the first layout path', () => {
    const homeBefore = renderRouteShell('/ko');
    const subpage = renderRouteShell('/ko/about');
    const homeAfter = renderRouteShell('/ko');

    expect(homeBefore).toContain('class="cinematic-opening"');
    expect(subpage).not.toContain('class="cinematic-opening"');
    expect(homeAfter).toContain('class="cinematic-opening"');
  });

  it('defers the event popup during the opening and mounts it normally off-home', () => {
    expect(renderRouteShell('/ko')).not.toContain('EVENT_POPUP');
    expect(renderRouteShell('/ko/about')).toContain('EVENT_POPUP');
  });
});

describe('cinematic opening layout integration', () => {
  it('uses a pathname-aware client boundary and keeps footer outside suppression', () => {
    const layoutSource = readFileSync(
      path.join(process.cwd(), 'src/app/[locale]/layout.tsx'),
      'utf8',
    );
    const shellSource = readFileSync(
      path.join(process.cwd(), 'src/components/CinematicRouteShell.tsx'),
      'utf8',
    );

    expect(layoutSource).toContain('<CinematicRouteShell');
    expect(layoutSource).not.toContain("headers } from 'next/headers'");
    expect(shellSource).toContain('usePathname()');
    expect(shellSource).toContain('data-cinematic-chrome="header"');
    expect(shellSource).toContain('data-cinematic-chrome="quick-contact"');
    expect(shellSource).toContain('data-cinematic-chrome="scroll-top"');
    expect(shellSource).not.toMatch(/data-cinematic-chrome="footer"/);
    expect(shellSource).toContain('deferredContent={eventPopup}');
    expect(shellSource).toContain('!showCinematicOpening ? eventPopup : null');
    expect(shellSource).toContain('id="cinematic-home-content"');
    expect(CINEMATIC_CHROME_ATTRIBUTE).toBe('data-cinematic-chrome');
  });
});

describe('cinematic opening content and semantics', () => {
  it.each(locales)('renders all required %s copy without adding an h1', (locale) => {
    const html = renderToStaticMarkup(<CinematicOpening locale={locale} />);
    const copy = expectedOpeningCopy[locale];

    expect(CINEMATIC_OPENING_COPY[locale]).toEqual(copy);
    expect(html).toContain(copy.primary);
    expect(html).toContain(copy.secondary);
    expect(html).toContain(copy.scroll);
    expect(html).toContain(`alt="${copy.mediaAlt}"`);
    expect(html).not.toContain('<h1');
    expect(html).toContain('<section');
    expect(html).toContain(`aria-label="${copy.primary}"`);
  });

  it('uses a real anchor with an exact scroll handoff', () => {
    const html = renderToStaticMarkup(<CinematicOpening locale="en" />);

    expect(html).toContain(
      '<a class="cinematic-opening__scroll" href="#cinematic-home-content">',
    );
  });

  it('keeps the opening server render poster-only so the seal can win LCP', () => {
    const html = renderToStaticMarkup(<CinematicOpening locale="ko" />);

    expect(html).toContain('data-video-mounted="false"');
    expect(html).not.toContain('<video');
    expect(html).toContain(
      'taiwan-central-mountains-cloud-flight-v2-mobile.webp',
    );
  });

  it('lands on the rendered hero top instead of the padded main sentinel', () => {
    const hero = {
      getBoundingClientRect: () => ({ top: 640 }),
    };
    const main = {
      querySelector: vi.fn(() => hero),
    };
    const target = {
      closest: vi.fn(() => main),
      parentElement: main,
      getBoundingClientRect: () => ({ top: 736 }),
    };

    expect(
      resolveCinematicHomeScrollTop(target as unknown as HTMLElement, 100),
    ).toBe(740);
    expect(main.querySelector).toHaveBeenCalledOnce();
  });

  it('requires positive intersection area instead of a boundary-only intersection', () => {
    const entry = (overrides: Partial<IntersectionObserverEntry>) => ({
      isIntersecting: true,
      intersectionRatio: 0.5,
      intersectionRect: { width: 100, height: 100 },
      ...overrides,
    } as IntersectionObserverEntry);

    expect(hasPositiveIntersection(entry({}))).toBe(true);
    expect(hasPositiveIntersection(entry({ intersectionRatio: 0 }))).toBe(false);
    expect(hasPositiveIntersection(entry({
      intersectionRect: { width: 100, height: 0 } as DOMRectReadOnly,
    }))).toBe(false);
    expect(hasPositiveIntersection(entry({ isIntersecting: false }))).toBe(false);
  });

  it('uses the responsive Taiwan Central Mountain Range flight asset contract', () => {
    const source = readFileSync(
      path.join(process.cwd(), 'src/components/CinematicOpening.tsx'),
      'utf8',
    );
    const globalCss = readFileSync(
      path.join(process.cwd(), 'src/app/globals.css'),
      'utf8',
    );
    const routeShellSource = readFileSync(
      path.join(process.cwd(), 'src/components/CinematicRouteShell.tsx'),
      'utf8',
    );

    expect(CINEMATIC_OPENING_MEDIA).toEqual({
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
    });
    expect(source).toContain('poster={CINEMATIC_OPENING_MEDIA.desktop.poster}');
    expect(source).toContain('webmSrc={CINEMATIC_OPENING_MEDIA.desktop.webm}');
    expect(source).toContain('mp4Src={CINEMATIC_OPENING_MEDIA.desktop.mp4}');
    expect(source).toContain('mobilePoster={CINEMATIC_OPENING_MEDIA.mobile.poster}');
    expect(source).toContain('mobileWebmSrc={CINEMATIC_OPENING_MEDIA.mobile.webm}');
    expect(source).toContain('mobileMp4Src={CINEMATIC_OPENING_MEDIA.mobile.mp4}');
    expect(source).toContain(
      'controlLabels={DECORATIVE_VIDEO_CONTROL_LABELS[locale]}',
    );
    expect(source).toContain('eagerVideoMount');
    expect(source).toContain('deferVideoUntilPosterPaint');
    expect(source).toContain('<DecorativeAutoplayVideo');
    expect(globalCss).toContain('content-visibility: hidden');
    expect(routeShellSource).toContain('content-visibility: visible !important');
  });

  it('prioritizes the opening seal with its real intrinsic aspect ratio', () => {
    const html = renderToStaticMarkup(<CinematicOpening locale="ko" />);
    const source = readFileSync(
      path.join(process.cwd(), 'src/components/CinematicOpening.tsx'),
      'utf8',
    );
    const sealTag = html.match(
      /<img[^>]*class="cinematic-opening__seal"[^>]*>/,
    )?.[0];

    expect(sealTag).toContain('hovering-seal-official-opening.webp');
    expect(sealTag).toContain('width="280"');
    expect(sealTag).toContain('height="268"');
    expect(sealTag).toContain('fetchpriority="high"');
    expect(source).toContain('unoptimized');
    expect(CINEMATIC_OPENING_SEAL_SIZES).toBe(
      '(max-width: 800px) 88px, (max-width: 1272px) 11vw, 140px',
    );
    expect(source).toContain('width={280}');
    expect(source).toContain('height={268}');
    expect(source).toContain('fetchPriority="high"');
    expect(source).toContain('priority');
  });

  it('preloads the opening seal on locale home routes without prioritizing the hidden header seal', () => {
    const layoutSource = readFileSync(
      path.join(process.cwd(), 'src/app/layout.tsx'),
      'utf8',
    );
    const headerSource = readFileSync(
      path.join(process.cwd(), 'src/components/Header.tsx'),
      'utf8',
    );

    expect(layoutSource).toContain(
      "const isLocaleHome = /^\\/(?:ko|zh-hant|en|ja)\\/?$/i.test(pathname ?? '');",
    );
    expect(layoutSource).toContain(
      'href="/images/brand/hovering-seal-official-opening.webp"',
    );
    expect(layoutSource).toContain('fetchPriority="high"');
    expect(headerSource).toContain(
      '<Image src="/images/brand/hovering-seal-official.png" alt="" width={40} height={40} />',
    );
  });

  it('keeps the long opening subtitle inside narrow mobile viewports', () => {
    const globals = readFileSync(
      path.join(process.cwd(), 'src/app/globals.css'),
      'utf8',
    );
    const mobileOpeningRules = globals.match(
      /@media \(max-width: 640px\) \{\s+\.cinematic-opening__brand[\s\S]*?\.cinematic-opening__scroll \{/,
    )?.[0];

    expect(mobileOpeningRules).toContain('.cinematic-opening__secondary');
    expect(mobileOpeningRules).toContain(
      'max-width: calc(100vw - 2.5rem);',
    );
    expect(mobileOpeningRules).toContain(
      'font-size: clamp(0.6rem, 2.6vw, 0.68rem);',
    );
    expect(mobileOpeningRules).toContain(
      'letter-spacing: clamp(0.06em, 0.25vw, 0.1em);',
    );
    expect(mobileOpeningRules).toContain('white-space: nowrap;');
  });

  it('keeps the city opening bright while using high-contrast light branding', () => {
    const globals = readFileSync(
      path.join(process.cwd(), 'src/app/globals.css'),
      'utf8',
    );

    expect(globals).toContain('rgba(7, 25, 40, 0.24) 0%');
    expect(globals).toContain('color: #f8fbfc;');
    expect(globals).toContain('color: #f1d8a6;');
    const openingMediaRule = globals.match(
      /\.cinematic-opening__poster,\s*\.cinematic-opening__video\s*\{([^}]*)\}/,
    )?.[1];
    expect(openingMediaRule).not.toContain('filter:');
  });

  it('crops the encoded top-edge strip without moving the fullscreen section', () => {
    const globals = readFileSync(
      path.join(process.cwd(), 'src/app/globals.css'),
      'utf8',
    );
    const openingRule = globals.match(
      /\.cinematic-opening\s*\{([^}]*)\}/,
    )?.[1];
    const openingMediaRule = globals.match(
      /\.cinematic-opening__media\s*\{([^}]*)\}/,
    )?.[1];

    expect(openingRule).toContain('overflow: hidden;');
    expect(openingRule).not.toContain('transform:');
    expect(openingMediaRule).toContain('inset-block: -4px;');
    expect(openingMediaRule).toContain('height: auto;');
  });
});

describe('cinematic opening single-action handoff', () => {
  it('transitions on the first positive wheel input without treating upward input as forward', () => {
    const first = accumulateOpeningWheelDelta(0, 0.1, 0, 900);
    const upward = accumulateOpeningWheelDelta(30, -2, 0, 900);

    expect(CINEMATIC_OPENING_WHEEL_THRESHOLD).toBe(1);
    expect(first).toEqual({ accumulatedDelta: 1, shouldTransition: true });
    expect(upward).toEqual({ accumulatedDelta: 0, shouldTransition: false });
  });

  it('normalizes line and page wheel units before applying the threshold', () => {
    expect(accumulateOpeningWheelDelta(0, 2, 1, 900)).toEqual({
      accumulatedDelta: 32,
      shouldTransition: true,
    });
    expect(accumulateOpeningWheelDelta(0, 1, 2, 900)).toEqual({
      accumulatedDelta: 900,
      shouldTransition: true,
    });
  });

  it('uses an immediate handoff without persisting the fallback anchor hash', () => {
    const source = readFileSync(
      path.join(process.cwd(), 'src/components/CinematicOpening.tsx'),
      'utf8',
    );
    const globals = readFileSync(
      path.join(process.cwd(), 'src/app/globals.css'),
      'utf8',
    );

    expect(source.indexOf('setIntroVisible(false)')).toBeLessThan(
      source.indexOf(
        'const settleFrame = window.requestAnimationFrame',
      ),
    );
    expect(source).toContain("window.scrollTo({ top: 0, behavior: 'auto' })");
    expect(source).toContain('window.cancelAnimationFrame(settleFrame)');
    expect(source).toContain('`${window.location.pathname}${window.location.search}`');
    expect(source).not.toContain("replaceState(null, '', '#cinematic-home-content')");
    expect(globals).toMatch(
      /\[data-cinematic-intro-visible='false'\][\s\S]*?\.cinematic-opening\s*\{\s*display:\s*none;/,
    );
  });

  it('captures only while the fullscreen opening is visible at the viewport top', () => {
    expect(isOpeningNearViewportTop({
      scrollY: 0,
      sectionTop: 0,
      sectionBottom: 900,
      viewportHeight: 900,
    })).toBe(true);
    expect(isOpeningNearViewportTop({
      scrollY: 25,
      sectionTop: -25,
      sectionBottom: 875,
      viewportHeight: 900,
    })).toBe(false);
    expect(isOpeningNearViewportTop({
      scrollY: 0,
      sectionTop: 0,
      sectionBottom: 0,
      viewportHeight: 900,
    })).toBe(false);
  });

  it.each(['ArrowDown', 'PageDown', ' ', 'Spacebar'])(
    'accepts the forward keyboard action %j',
    (key) => {
      expect(isOpeningForwardKey({ key })).toBe(true);
    },
  );

  it.each([
    { key: 'ArrowUp' },
    { key: 'PageUp' },
    { key: 'Home' },
    { key: 'End' },
    { key: ' ', shiftKey: true },
    { key: 'ArrowDown', ctrlKey: true },
    { key: 'End', metaKey: true },
  ])('does not capture upward or modified keyboard input: %o', (input) => {
    expect(isOpeningForwardKey(input)).toBe(false);
  });

  it('mounts and unmounts all input listeners and pending gesture timers', () => {
    const host = new FakeInputHost();
    const cleanup = bindCinematicOpeningInputHandlers({
      host,
      isCaptureActive: () => true,
      isTransitionLocked: () => false,
      transitionToContent: () => true,
      isFormControl: () => false,
    });

    expect(CINEMATIC_OPENING_TOUCH_THRESHOLD).toBe(44);
    expect(host.listenerCount()).toBe(6);

    host.dispatch('wheel', wheelEvent(4));
    expect(host.timers.size).toBe(1);

    cleanup();
    expect(host.listenerCount()).toBe(0);
    expect(host.timers.size).toBe(0);
  });

  it('absorbs only the triggering wheel gesture, then permits an intentional follow-up', () => {
    const host = new FakeInputHost();
    let transitionLocked = false;
    const transitionToContent = vi.fn(() => {
      transitionLocked = true;
      return true;
    });
    const cleanup = bindCinematicOpeningInputHandlers({
      host,
      isCaptureActive: () => true,
      isTransitionLocked: () => transitionLocked,
      transitionToContent,
      isFormControl: () => false,
    });

    const trigger = wheelEvent(CINEMATIC_OPENING_WHEEL_THRESHOLD);
    host.dispatch('wheel', trigger);
    expect(trigger.preventDefault).toHaveBeenCalledOnce();
    expect(transitionToContent).toHaveBeenCalledOnce();

    const inertialTail = wheelEvent(9);
    host.dispatch('wheel', inertialTail);
    expect(inertialTail.preventDefault).toHaveBeenCalledOnce();

    host.runTimers();
    const intentionalFollowUp = wheelEvent(80);
    host.dispatch('wheel', intentionalFollowUp);
    expect(intentionalFollowUp.preventDefault).not.toHaveBeenCalled();
    expect(transitionToContent).toHaveBeenCalledOnce();

    cleanup();
  });

  it('does not intercept End even while the opening is active', () => {
    const host = new FakeInputHost();
    const transitionToContent = vi.fn(() => true);
    const cleanup = bindCinematicOpeningInputHandlers({
      host,
      isCaptureActive: () => true,
      isTransitionLocked: () => false,
      transitionToContent,
      isFormControl: () => false,
    });
    const end = keyboardEvent('End');

    host.dispatch('keydown', end);

    expect(end.preventDefault).not.toHaveBeenCalled();
    expect(transitionToContent).not.toHaveBeenCalled();
    cleanup();
  });
});
