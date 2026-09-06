import { readFileSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {
  act,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

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
  CINEMATIC_OPENING_FORCE_QUERY_PARAM,
  CINEMATIC_OPENING_MEDIA,
  CINEMATIC_OPENING_PRE_HYDRATION_SCRIPT,
  CINEMATIC_OPENING_SEAL_SIZES,
  CINEMATIC_OPENING_SEEN_STORAGE_KEY,
  CINEMATIC_OPENING_TOUCH_THRESHOLD,
  CINEMATIC_OPENING_WHEEL_THRESHOLD,
  hasPositiveIntersection,
  hasSeenCinematicOpening,
  isOpeningForwardKey,
  isOpeningNearViewportTop,
  markCinematicOpeningSeen,
  resolveCinematicHomeScrollTop,
  resolveCinematicOpeningStartState,
  shouldForceCinematicOpening,
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
} as const;

function htmlEncodedText(value: string): string {
  return value.replace(/&/g, '&amp;');
}

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
    const serviceParagraph = html.match(
      /class="cinematic-opening__service"[^>]*>([^<]*)</,
    )?.[1] ?? '';
    expect(serviceParagraph.replace(/&amp;/g, '&')).toBe(copy.service);
    expect(html).toContain(htmlEncodedText(copy.service));
    expect(html).toContain(copy.contact);
    expect(html).toContain(`href="/${locale}/contact"`);
    expect(html).toContain(`alt="${copy.mediaAlt}"`);
    expect(html).not.toContain('<h1');
    expect(html).toContain('<section');
    expect(html).toContain(`aria-label="${copy.primary}"`);
    expect(html).toContain('class="cinematic-opening__contact"');
  });

  it('uses a real anchor with an exact scroll handoff', () => {
    const html = renderToStaticMarkup(<CinematicOpening locale="en" />);

    expect(html).toContain(
      '<a class="cinematic-opening__scroll" href="#cinematic-home-content">',
    );
  });

  it('exposes a real locale contact link under the brand without intercepting it', () => {
    const html = renderToStaticMarkup(<CinematicOpening locale="ko" />);
    expect(html).toContain('class="cinematic-opening__contact"');
    expect(html).toContain('href="/ko/contact"');
    expect(html).toContain('상담 연락처');
    expect(html).not.toContain('cinematic-opening__contact" tabindex="-1"');
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

    const veilRule = globals.match(
      /(?:^|\})\s*\.cinematic-opening__veil\s*\{([^}]*)\}/,
    )?.[1];
    const primaryRule = globals.match(
      /(?:^|\})\s*\.cinematic-opening__primary\s*\{([^}]*)\}/,
    )?.[1];
    const secondaryRule = globals.match(
      /(?:^|\})\s*\.cinematic-opening__secondary\s*\{([^}]*)\}/,
    )?.[1];
    expect(veilRule).toContain('rgba(7, 25, 40, 0.24) 0%');
    expect(primaryRule).toContain('color: #f8fbfc;');
    expect(primaryRule).toContain('text-shadow:');

    // Small subtitle text must remain readable over the brightest poster
    // pixels. Measure the declared translucent backplate over a white image
    // instead of requiring the previous standalone gold color anywhere in CSS.
    const foreground = secondaryRule?.match(/(?:^|;)\s*color:\s*#([\da-f]{6})\s*;/i)?.[1];
    const background = secondaryRule?.match(
      /background:\s*rgba\(\s*([\d.]+),\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)\s*\)/,
    );
    expect(foreground).toBeDefined();
    expect(background).not.toBeNull();
    if (!foreground || !background) throw new Error('Opening subtitle needs explicit text and backplate colors');
    const luminance = (channels: number[]) => channels.reduce((sum, channel, index) => {
      const normalized = channel / 255;
      const linear = normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
      return sum + linear * [0.2126, 0.7152, 0.0722][index];
    }, 0);
    const alpha = Number(background[4]);
    const textLuminance = luminance([0, 2, 4].map(offset => parseInt(foreground.slice(offset, offset + 2), 16)));
    const backdropLuminance = luminance(background.slice(1, 4).map(channel => Number(channel) * alpha + 255 * (1 - alpha)));
    expect((textLuminance + 0.05) / (backdropLuminance + 0.05)).toBeGreaterThanOrEqual(4.5);
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

  it('does not capture opening input while a form control is focused', () => {
    const host = new FakeInputHost();
    const transitionToContent = vi.fn(() => true);
    const cleanup = bindCinematicOpeningInputHandlers({
      host,
      isCaptureActive: () => true,
      isTransitionLocked: () => false,
      transitionToContent,
      isFormControl: () => true,
    });
    const space = keyboardEvent(' ');
    const wheel = wheelEvent(CINEMATIC_OPENING_WHEEL_THRESHOLD);

    host.dispatch('keydown', space);
    host.dispatch('wheel', wheel);

    expect(space.preventDefault).not.toHaveBeenCalled();
    expect(wheel.preventDefault).not.toHaveBeenCalled();
    expect(transitionToContent).not.toHaveBeenCalled();
    cleanup();
  });
});

class FakeSessionStorage {
  readonly store = new Map<string, string>();

  getItem(key: string) {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.store.set(key, String(value));
  }
}

const throwingStorage = {
  getItem: () => {
    throw new Error('SecurityError');
  },
  setItem: () => {
    throw new Error('QuotaExceededError');
  },
};

type ProbeProps = { children?: ReactNode; [key: string]: unknown };

function findElement(
  tree: ReactNode,
  predicate: (element: ReactElement<ProbeProps>) => boolean,
): ReactElement<ProbeProps> | undefined {
  if (Array.isArray(tree)) {
    for (const child of tree) {
      const found = findElement(child, predicate);
      if (found) return found;
    }
    return undefined;
  }
  if (!isValidElement<ProbeProps>(tree)) return undefined;
  if (predicate(tree)) return tree;
  return findElement(tree.props.children, predicate);
}

const roots: Root[] = [];

// Same host-less probe as columns-filter-recovery: React state/effect
// scheduling is real, refs stay null (no host nodes), and window/document are
// the minimal stubs the opening touches.
async function mountOpening({
  search = '',
  storage = new FakeSessionStorage(),
  locale = 'ko' as (typeof locales)[number],
} = {}) {
  const url = new URL(`http://localhost/${locale}${search}`);
  const target = { focus: vi.fn(), closest: () => null, parentElement: null };
  const documentElement = {
    dataset: {} as Record<string, string | undefined>,
    namespaceURI: 'http://www.w3.org/1999/xhtml',
  };
  const document = {
    activeElement: null,
    body: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    documentElement,
    nodeType: 9,
    getElementById: (id: string) => (id === 'cinematic-home-content' ? target : null),
  };
  const container = {
    addEventListener: vi.fn(), removeEventListener: vi.fn(), appendChild: vi.fn(), removeChild: vi.fn(),
    namespaceURI: 'http://www.w3.org/1999/xhtml', nodeName: 'DIV', nodeType: 1,
    ownerDocument: document, tagName: 'DIV', textContent: '',
  };
  const window = {
    location: url,
    sessionStorage: storage,
    history: { state: null, replaceState: vi.fn() },
    requestAnimationFrame: vi.fn(() => 1),
    cancelAnimationFrame: vi.fn(),
    setTimeout: vi.fn(() => 1),
    clearTimeout: vi.fn(),
    scrollTo: vi.fn(),
    scrollY: 0,
    innerHeight: 900,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  };
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  vi.stubGlobal('window', window);
  vi.stubGlobal('document', document);
  vi.stubGlobal('HTMLIFrameElement', function HTMLIFrameElement() {});
  vi.stubGlobal('HTMLElement', function HTMLElement() {});
  Object.assign(window, { HTMLIFrameElement: globalThis.HTMLIFrameElement });

  let tree: ReactNode;
  function Probe() {
    tree = CinematicOpening({
      locale,
      deferredContent: <div data-deferred="true">DEFERRED</div>,
    });
    return null;
  }
  const root = createRoot(container as unknown as Element);
  roots.push(root);
  await act(async () => root.render(<Probe />));

  return {
    storage,
    target,
    documentElement,
    window,
    section: () => findElement(tree, (element) => element.type === 'section'),
    skip: () => findElement(tree, (element) => element.props['data-skip'] === 'true'),
    deferred: () => findElement(tree, (element) => element.props['data-deferred'] === 'true'),
  };
}

function runPreHydrationScript({
  search,
  storage,
  site,
}: {
  search: string;
  storage: Pick<Storage, 'getItem'>;
  site: { setAttribute: ReturnType<typeof vi.fn> } | null;
}) {
  const documentElement = { setAttribute: vi.fn() };
  const script = { parentElement: { closest: vi.fn(() => site) } };
  vm.runInNewContext(CINEMATIC_OPENING_PRE_HYDRATION_SCRIPT, {
    URLSearchParams,
    location: { search },
    sessionStorage: storage,
    document: { currentScript: script, documentElement },
  });
  return { documentElement, closest: script.parentElement.closest };
}

afterEach(async () => {
  for (const root of roots.splice(0)) await act(async () => root.unmount());
  vi.unstubAllGlobals();
});

describe('WI-11 cinematic opening once per session', () => {
  it('plays on the first visit and reads the completed state once the marker exists', () => {
    const storage = new FakeSessionStorage();
    expect(CINEMATIC_OPENING_SEEN_STORAGE_KEY).toBe('hojeong.cinematic.seen');
    expect(resolveCinematicOpeningStartState({ search: '', storage })).toBe('opening');
    expect(hasSeenCinematicOpening(storage)).toBe(false);

    markCinematicOpeningSeen(storage);

    expect(storage.getItem(CINEMATIC_OPENING_SEEN_STORAGE_KEY)).toBe('1');
    expect(hasSeenCinematicOpening(storage)).toBe(true);
    expect(resolveCinematicOpeningStartState({ search: '', storage })).toBe('completed');
    expect(resolveCinematicOpeningStartState({ search: '?utm=x', storage })).toBe('completed');
  });

  it('forces the opening with ?intro=1 and only with that value', () => {
    const storage = new FakeSessionStorage();
    markCinematicOpeningSeen(storage);

    expect(CINEMATIC_OPENING_FORCE_QUERY_PARAM).toBe('intro');
    expect(shouldForceCinematicOpening('?intro=1')).toBe(true);
    expect(shouldForceCinematicOpening('?utm=x&intro=1')).toBe(true);
    expect(shouldForceCinematicOpening('?intro=0')).toBe(false);
    expect(shouldForceCinematicOpening('')).toBe(false);
    expect(resolveCinematicOpeningStartState({ search: '?intro=1', storage })).toBe('opening');
    expect(resolveCinematicOpeningStartState({ search: '?intro=0', storage })).toBe('completed');
  });

  it('treats unavailable or throwing storage as a first visit and never throws', () => {
    expect(resolveCinematicOpeningStartState({ search: '', storage: null })).toBe('opening');
    expect(resolveCinematicOpeningStartState({ search: '', storage: throwingStorage })).toBe('opening');
    expect(() => markCinematicOpeningSeen(throwingStorage)).not.toThrow();
    expect(() => markCinematicOpeningSeen(null)).not.toThrow();
  });

  it('server-renders the pre-hydration gate before the opening markup', () => {
    const html = renderToStaticMarkup(<CinematicOpening locale="ko" />);
    const scriptIndex = html.indexOf('<script>');
    const sectionIndex = html.indexOf('<section');

    expect(scriptIndex).toBeGreaterThanOrEqual(0);
    expect(scriptIndex).toBeLessThan(sectionIndex);
    expect(html).toContain(CINEMATIC_OPENING_PRE_HYDRATION_SCRIPT);
    expect(CINEMATIC_OPENING_PRE_HYDRATION_SCRIPT).toContain(CINEMATIC_OPENING_SEEN_STORAGE_KEY);
    expect(CINEMATIC_OPENING_PRE_HYDRATION_SCRIPT).not.toContain('</script');
  });

  it('pre-hydration gate flips the site and html flags only for a returning visitor', () => {
    const seen = new FakeSessionStorage();
    markCinematicOpeningSeen(seen);
    const site = { setAttribute: vi.fn() };

    const returning = runPreHydrationScript({ search: '', storage: seen, site });
    expect(returning.closest).toHaveBeenCalledWith('[data-cinematic-home]');
    expect(site.setAttribute).toHaveBeenCalledWith('data-cinematic-intro-visible', 'false');
    expect(returning.documentElement.setAttribute).toHaveBeenCalledWith(
      'data-cinematic-intro-visible',
      'false',
    );

    const firstVisitSite = { setAttribute: vi.fn() };
    const firstVisit = runPreHydrationScript({
      search: '',
      storage: new FakeSessionStorage(),
      site: firstVisitSite,
    });
    expect(firstVisitSite.setAttribute).not.toHaveBeenCalled();
    expect(firstVisit.documentElement.setAttribute).not.toHaveBeenCalled();

    const forcedSite = { setAttribute: vi.fn() };
    const forced = runPreHydrationScript({ search: '?intro=1', storage: seen, site: forcedSite });
    expect(forcedSite.setAttribute).not.toHaveBeenCalled();
    expect(forced.documentElement.setAttribute).not.toHaveBeenCalled();

    expect(() => runPreHydrationScript({ search: '', storage: throwingStorage, site })).not.toThrow();
    expect(() => runPreHydrationScript({ search: '', storage: seen, site: null })).not.toThrow();
  });

  it('mounts the opening on a first visit and completes it from the skip button', async () => {
    const opening = await mountOpening();

    expect(opening.section()).toBeDefined();
    expect(opening.deferred()).toBeUndefined();
    const skip = opening.skip();
    expect(skip?.type).toBe('button');
    expect(skip?.props.type).toBe('button');
    expect(skip?.props.children).toBe('건너뛰기');
    expect(opening.storage.getItem(CINEMATIC_OPENING_SEEN_STORAGE_KEY)).toBeNull();

    await act(async () => {
      (skip?.props.onClick as () => void)();
    });

    expect(opening.storage.getItem(CINEMATIC_OPENING_SEEN_STORAGE_KEY)).toBe('1');
    expect(opening.documentElement.dataset.cinematicIntroVisible).toBe('false');
    expect(opening.deferred()).toBeDefined();
    expect(opening.window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'auto' });
    expect(opening.window.history.replaceState).toHaveBeenCalledWith(null, '', '/ko');
  });

  it('renders the completed state immediately on a second mount in the same session', async () => {
    const storage = new FakeSessionStorage();
    markCinematicOpeningSeen(storage);

    const opening = await mountOpening({ storage });

    expect(opening.section()).toBeUndefined();
    expect(opening.skip()).toBeUndefined();
    expect(opening.deferred()).toBeDefined();
    expect(opening.documentElement.dataset.cinematicIntroVisible).toBe('false');
    expect(opening.window.addEventListener).not.toHaveBeenCalled();
  });

  it('replays the opening for ?intro=1 even when the session marker exists', async () => {
    const storage = new FakeSessionStorage();
    markCinematicOpeningSeen(storage);

    const opening = await mountOpening({ storage, search: '?intro=1' });

    expect(opening.section()).toBeDefined();
    expect(opening.skip()).toBeDefined();
    expect(opening.deferred()).toBeUndefined();
  });

  it('decides the start state before paint and moves focus to the skip control on mount', () => {
    const source = readFileSync(
      path.join(process.cwd(), 'src/components/CinematicOpening.tsx'),
      'utf8',
    );

    expect(source).toContain(
      "typeof window === 'undefined' ? useEffect : useLayoutEffect",
    );
    expect(source).toContain('useBrowserLayoutEffect(() => {');
    expect(source).toContain('skipButtonRef.current?.focus({ preventScroll: true })');
    expect(source).toContain('target.focus({ preventScroll: true })');
    expect(source).toContain('markCinematicOpeningSeen(readSessionStorage())');
  });
});

describe('WI-11 cinematic opening skip control and accessibility tree', () => {
  it.each(locales)('renders a localized, focusable %s skip button with a 44px target', (locale) => {
    const html = renderToStaticMarkup(<CinematicOpening locale={locale} />);
    const button = html.match(/<button[^>]*data-skip="true"[^>]*>([^<]*)<\/button>/);
    const moduleCss = readFileSync(
      path.join(process.cwd(), 'src/components/CinematicOpening.module.css'),
      'utf8',
    );

    expect(button).not.toBeNull();
    expect(button?.[0]).toContain('type="button"');
    expect(button?.[0]).toContain('cinematic-opening__skip');
    expect(button?.[0]).not.toContain('tabindex="-1"');
    expect(button?.[0]).not.toContain('aria-hidden');
    expect(button?.[1]).toBe(expectedOpeningCopy[locale].skip);
    expect(moduleCss).toContain('min-width: 44px;');
    expect(moduleCss).toContain('min-height: 44px;');
    expect(moduleCss).toContain('var(--gold');
    expect(moduleCss).toContain('var(--white)');
    expect(moduleCss).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(moduleCss).toContain('.skip:focus-visible');
  });

  it('keeps the skip button inside the keyboard handoff instead of treating it as a form control', () => {
    const source = readFileSync(
      path.join(process.cwd(), 'src/components/CinematicOpening.tsx'),
      'utf8',
    );
    expect(source).toContain('button:not([data-skip="true"])');

    class FakeElement {
      constructor(readonly skip: boolean) {}
      closest(selector: string) {
        if (!selector.includes('button')) return null;
        if (this.skip && selector.includes('button:not([data-skip="true"])')) return null;
        return this;
      }
    }
    vi.stubGlobal('Element', FakeElement);
    const host = new FakeInputHost();
    const transitionToContent = vi.fn(() => true);
    const cleanup = bindCinematicOpeningInputHandlers({
      host,
      isCaptureActive: () => true,
      isTransitionLocked: () => false,
      transitionToContent,
    });

    const onSkip = { ...keyboardEvent('ArrowDown'), target: new FakeElement(true) };
    host.dispatch('keydown', onSkip);
    expect(transitionToContent).toHaveBeenCalledOnce();
    expect(onSkip.preventDefault).toHaveBeenCalledOnce();

    const onOtherButton = { ...keyboardEvent('ArrowDown'), target: new FakeElement(false) };
    host.dispatch('keydown', onOtherButton);
    expect(transitionToContent).toHaveBeenCalledOnce();
    expect(onOtherButton.preventDefault).not.toHaveBeenCalled();
    cleanup();
  });

  it('never removes the header, skip-link host or main from the accessibility tree', () => {
    const html = renderRouteShell('/ko');
    const openingSource = readFileSync(
      path.join(process.cwd(), 'src/components/CinematicOpening.tsx'),
      'utf8',
    );
    const shellSource = readFileSync(
      path.join(process.cwd(), 'src/components/CinematicRouteShell.tsx'),
      'utf8',
    );
    const headerHost = html.match(/<div[^>]*data-cinematic-chrome="header"[^>]*>/)?.[0];
    const main = html.match(/<main[^>]*>/)?.[0];
    const section = html.match(/<section[^>]*>/)?.[0];
    const sentinel = html.match(/<div[^>]*id="cinematic-home-content"[^>]*>/)?.[0];

    expect(headerHost).toBeDefined();
    expect(headerHost).not.toContain('aria-hidden');
    expect(headerHost).not.toMatch(/\binert\b/);
    expect(main).toBe('<main id="main">');
    expect(section).not.toContain('aria-hidden');
    expect(section).not.toMatch(/\binert\b/);
    expect(section).toContain('aria-label=');
    expect(sentinel).toContain('tabindex="-1"');
    expect(sentinel).not.toContain('aria-hidden');
    expect(openingSource).not.toMatch(/\binert\b/);
    expect(openingSource).not.toContain("setAttribute('aria-hidden'");
    expect(openingSource).not.toMatch(/\.ariaHidden\s*=/);
    expect(shellSource).toContain('suppressHydrationWarning');
  });
});
