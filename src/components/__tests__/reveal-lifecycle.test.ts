import { readFileSync } from 'node:fs';
import path from 'node:path';

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import RootLayout from '@/app/layout';
import { installRevealLifecycle } from '../Reveal';

const globalCss = readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');

type ObserverCallback = ConstructorParameters<typeof IntersectionObserver>[0];

class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];

  readonly callback: ObserverCallback;
  readonly options: IntersectionObserverInit | undefined;
  disconnect = vi.fn();
  observe = vi.fn();

  constructor(callback: ObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback;
    this.options = options;
    FakeIntersectionObserver.instances.push(this);
  }

  emit(isIntersecting: boolean) {
    this.callback([{ isIntersecting } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
}

function createOffscreenElement(): HTMLDivElement {
  return createPositionedElement({ bottom: 2_100, top: 2_000 });
}

function createPositionedElement(position: { bottom: number; top: number }): HTMLDivElement {
  return {
    getBoundingClientRect: () => ({
      bottom: position.bottom,
      top: position.top,
    }),
  } as unknown as HTMLDivElement;
}

describe('installRevealLifecycle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    FakeIntersectionObserver.instances = [];

    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
    vi.stubGlobal('getComputedStyle', () => ({ transitionDuration: '0.3s' }));
    const windowListeners = new Map<string, EventListener>();
    const documentListeners = new Map<string, EventListener>();
    vi.stubGlobal('window', {
      IntersectionObserver: FakeIntersectionObserver,
      addEventListener: vi.fn((type: string, listener: EventListener) => {
        windowListeners.set(type, listener);
      }),
      cancelAnimationFrame: vi.fn(),
      clearTimeout: (timer: number) => globalThis.clearTimeout(timer),
      dispatchFallbackEvent: (type: string) => windowListeners.get(type)?.(new Event(type)),
      innerHeight: 1_000,
      matchMedia: () => ({ matches: false }),
      removeEventListener: vi.fn((type: string) => {
        windowListeners.delete(type);
      }),
      requestAnimationFrame: vi.fn(() => 17),
      setTimeout: (callback: TimerHandler, delay?: number) => (
        globalThis.setTimeout(callback, delay) as unknown as number
      ),
    });
    vi.stubGlobal('document', {
      addEventListener: vi.fn((type: string, listener: EventListener) => {
        documentListeners.set(type, listener);
      }),
      removeEventListener: vi.fn((type: string) => {
        documentListeners.delete(type);
      }),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('keeps offscreen content hidden, then fails open near the viewport when IntersectionObserver is silent', () => {
    const onReveal = vi.fn();
    const position = { bottom: 2_100, top: 2_000 };
    installRevealLifecycle(createPositionedElement(position), onReveal);

    vi.advanceTimersByTime(5_000);
    expect(onReveal).not.toHaveBeenCalled();

    position.top = 1_100;
    position.bottom = 1_200;
    (window as unknown as { dispatchFallbackEvent: (type: string) => void })
      .dispatchFallbackEvent('scroll');

    expect(onReveal).toHaveBeenCalledOnce();
    expect(FakeIntersectionObserver.instances[0]?.disconnect).toHaveBeenCalledOnce();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('reveals immediately when reduced motion is requested', () => {
    const onReveal = vi.fn();
    window.matchMedia = vi.fn(() => ({ matches: true }) as MediaQueryList);

    const cleanup = installRevealLifecycle(createOffscreenElement(), onReveal);

    expect(onReveal).toHaveBeenCalledOnce();
    expect(FakeIntersectionObserver.instances).toHaveLength(0);
    expect(vi.getTimerCount()).toBe(0);
    cleanup();
  });

  it('reveals immediately when every computed transition duration is zero', () => {
    const onReveal = vi.fn();
    vi.stubGlobal('getComputedStyle', () => ({ transitionDuration: '0s, 0ms' }));

    const cleanup = installRevealLifecycle(createOffscreenElement(), onReveal);

    expect(onReveal).toHaveBeenCalledOnce();
    expect(FakeIntersectionObserver.instances).toHaveLength(0);
    expect(vi.getTimerCount()).toBe(0);
    cleanup();
  });

  it('reveals immediately when IntersectionObserver is unavailable', () => {
    const onReveal = vi.fn();
    Reflect.deleteProperty(window, 'IntersectionObserver');

    const cleanup = installRevealLifecycle(createOffscreenElement(), onReveal);

    expect(onReveal).toHaveBeenCalledOnce();
    expect(FakeIntersectionObserver.instances).toHaveLength(0);
    expect(vi.getTimerCount()).toBe(0);
    cleanup();
  });

  it('reveals immediately when initially near the viewport', () => {
    const onReveal = vi.fn();

    const cleanup = installRevealLifecycle(
      createPositionedElement({ bottom: 1_100, top: 1_050 }),
      onReveal,
    );

    expect(onReveal).toHaveBeenCalledOnce();
    expect(FakeIntersectionObserver.instances).toHaveLength(0);
    expect(vi.getTimerCount()).toBe(0);
    cleanup();
  });

  it('cleans up fallback checks and listeners on unmount without revealing afterward', () => {
    const onReveal = vi.fn();
    const cleanup = installRevealLifecycle(createOffscreenElement(), onReveal);

    cleanup();
    vi.advanceTimersByTime(5_000);

    expect(onReveal).not.toHaveBeenCalled();
    expect(FakeIntersectionObserver.instances[0]?.disconnect).toHaveBeenCalledOnce();
    expect(vi.getTimerCount()).toBe(0);
    expect(window.removeEventListener).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      true,
    );
    expect(window.removeEventListener).toHaveBeenCalledWith(
      'resize',
      expect.any(Function),
    );
    expect(document.removeEventListener).toHaveBeenCalledWith(
      'visibilitychange',
      expect.any(Function),
    );
  });

  it('reveals on intersection before the deadline and remains idempotent', () => {
    const onReveal = vi.fn();
    installRevealLifecycle(createOffscreenElement(), onReveal);
    const observer = FakeIntersectionObserver.instances[0];

    observer?.emit(true);
    observer?.emit(true);
    vi.advanceTimersByTime(5_000);

    expect(onReveal).toHaveBeenCalledOnce();
    expect(observer?.disconnect).toHaveBeenCalledOnce();
    expect(observer?.options).toEqual({ rootMargin: '96px 0px', threshold: 0.06 });
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe('Reveal no-JavaScript CSS contract', () => {
  const layoutSource = readFileSync(path.join(process.cwd(), 'src/app/layout.tsx'), 'utf8');

  const noScriptSelectors = ['.reveal', '.reveal-stagger > *'];
  const noScriptDeclarations = [
    'opacity:1',
    'transform:none',
    'pointer-events:auto',
    'transition:none',
  ];
  const collapse = (value: string): string => value.replace(/\s+/g, '');

  it('fails open the wrapper and stagger children when scripting is disabled (globals.css defense in depth)', () => {
    expect(globalCss).toContain(`@media (scripting: none) {
  .reveal,
  .reveal-stagger > * {
    opacity: 1;
    transform: none;
    pointer-events: auto;
    transition: none;
  }
}`);
  });

  it('injects a <noscript> CSS fallback in the root <head> targeting the same selectors and properties', () => {
    const headStart = layoutSource.indexOf('<head>');
    const headEnd = layoutSource.indexOf('</head>');
    expect(headStart).toBeGreaterThan(-1);
    expect(headEnd).toBeGreaterThan(headStart);

    const head = collapse(layoutSource.slice(headStart, headEnd));

    expect(head).toContain('<noscript');
    expect(head).toContain('<style>');
    expect(head).toContain('</style>');
    for (const selector of noScriptSelectors) {
      expect(head).toContain(collapse(selector));
    }
    for (const declaration of noScriptDeclarations) {
      expect(head).toContain(declaration);
    }
    expect(head).not.toContain('<script');
  });
});

describe('Reveal no-JavaScript server-rendered root layout', () => {
  // Render the real RootLayout through react-dom/server. The <noscript> fallback
  // must ship inside the initial server HTML, so this proves the rendered markup
  // rather than the layout source string alone.
  const markup = renderToStaticMarkup(
    createElement(RootLayout, null, 'body-marker'),
  );
  const noscriptMatch = markup.match(/<noscript>([\s\S]*?)<\/noscript>/);
  const noscriptInner = noscriptMatch ? noscriptMatch[1] : '';
  const styleMatch = noscriptInner.match(/<style[^>]*>([\s\S]*?)<\/style>/);
  const styleBody = styleMatch ? styleMatch[1] : '';

  it('renders exactly one <noscript> wrapping a single <style>', () => {
    expect((markup.match(/<noscript>/g) ?? []).length).toBe(1);
    expect((markup.match(/<\/noscript>/g) ?? []).length).toBe(1);
    expect(noscriptMatch).not.toBeNull();

    expect((noscriptInner.match(/<style/g) ?? []).length).toBe(1);
    expect((noscriptInner.match(/<\/style>/g) ?? []).length).toBe(1);
  });

  it('targets the exact fail-open selector list and no broader hidden-UI selectors', () => {
    const selectorList = styleBody.slice(0, styleBody.indexOf('{'));
    const collapsed = selectorList.replace(/\s+/g, '');

    expect(collapsed).toBe('.reveal,.reveal-stagger>*');

    expect(collapsed).not.toContain('[hidden]');
    expect(collapsed).not.toContain('[aria-hidden]');
    expect(collapsed).not.toContain('.hidden');
    expect(collapsed).not.toContain('[style');
    expect(collapsed).not.toMatch(/(^|,)\s*\*(,|$)/);
  });

  it('emits all four fail-open declarations and nothing extra', () => {
    const declarationBlock = styleBody
      .slice(styleBody.indexOf('{') + 1, styleBody.lastIndexOf('}'));
    const declarations = declarationBlock
      .split(';')
      .map((declaration) => declaration.trim())
      .filter(Boolean);

    expect(declarations).toHaveLength(4);
    expect(declarations).toEqual(
      expect.arrayContaining([
        'opacity:1',
        'transform:none',
        'pointer-events:auto',
        'transition:none',
      ]),
    );
  });

  it('keeps the <noscript> payload free of <script> tags', () => {
    expect(noscriptInner).not.toContain('<script');
    expect(noscriptInner).not.toContain('</script');
  });
});
