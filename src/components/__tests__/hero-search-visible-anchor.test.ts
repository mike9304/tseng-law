import type { MouseEvent } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { handleLegacyZhHeroScroll } from '../HeroSearch';

function element(top: number, height: number, display = 'block') {
  return {
    parentElement: null,
    computed: { display, visibility: 'visible', opacity: '1' },
    getBoundingClientRect: () => ({ top, height, width: height ? 700 : 0 }),
  };
}

describe('ZH hero duplicate visible anchor', () => {
  const scrollTo = vi.fn();
  const pushState = vi.fn();
  const querySelectorAll = vi.fn();
  const matchMedia = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
    querySelectorAll.mockImplementation((selector: string) => selector === 'header.header'
      ? [element(0, 95)] : [element(0, 0, 'none'), element(600, 450)]);
    matchMedia.mockReturnValue({ matches: true });
    vi.stubGlobal('document', { querySelectorAll });
    vi.stubGlobal('window', { scrollY: 200, scrollTo, matchMedia,
      location: { hash: '' }, history: { pushState },
      getComputedStyle: (node: ReturnType<typeof element>) => node.computed });
  });
  afterEach(() => { vi.unstubAllGlobals(); });
  function click(overrides: Record<string, unknown> = {}) {
    return { button: 0, defaultPrevented: false, preventDefault: vi.fn(),
      currentTarget: { getAttribute: () => '#insights' }, ...overrides } as unknown as MouseEvent<HTMLAnchorElement>;
  }

  it('skips the hidden first ID, scrolls below the actual header, and respects reduced motion', () => {
    const event = click();
    handleLegacyZhHeroScroll(event, 'zh-hant');
    expect(event.preventDefault).toHaveBeenCalledOnce();
    expect(scrollTo).toHaveBeenCalledWith({ top: 705, behavior: 'instant' });
    expect(pushState).toHaveBeenCalledWith(null, '', '#insights');
  });
  it('uses smooth scrolling when motion is allowed', () => {
    matchMedia.mockReturnValue({ matches: false });
    handleLegacyZhHeroScroll(click(), 'zh-hant');
    expect(scrollTo).toHaveBeenCalledWith({ top: 705, behavior: 'smooth' });
  });
  it('measures the visible builder header when the native header before it is hidden', () => {
    querySelectorAll.mockImplementation((selector: string) => selector === 'header.header'
      ? [element(0, 0, 'none'), element(0, 67)] : [element(0, 0, 'none'), element(600, 450)]);
    handleLegacyZhHeroScroll(click(), 'zh-hant');
    expect(scrollTo).toHaveBeenCalledWith({ top: 733, behavior: 'instant' });
  });
  it.each(['ko', 'en', 'ja'] as const)('retains native behavior for %s', (locale) => {
    const event = click(); handleLegacyZhHeroScroll(event, locale);
    expect(event.preventDefault).not.toHaveBeenCalled(); expect(scrollTo).not.toHaveBeenCalled();
  });
  it.each([{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }, { defaultPrevented: true }])(
    'retains modified or already handled clicks: %j', (options) => {
      const event = click(options); handleLegacyZhHeroScroll(event, 'zh-hant');
      expect(event.preventDefault).not.toHaveBeenCalled(); expect(scrollTo).not.toHaveBeenCalled();
    },
  );
  it.each(['#author-section', '/zh-hant/columns', 'https://example.test/#insights'])('retains the authored destination %s', (href) => {
    const event = click({ currentTarget: { getAttribute: () => href } });
    handleLegacyZhHeroScroll(event, 'zh-hant'); expect(event.preventDefault).not.toHaveBeenCalled();
  });
  it.each([[element(600, 450)], [element(600, 450), element(0, 0)], [element(0, 0), element(0, 0)]])(
    'only intercepts when the native first target is hidden and a visible duplicate exists', (...nodes) => {
      querySelectorAll.mockReturnValue(nodes); const event = click();
      handleLegacyZhHeroScroll(event, 'zh-hant'); expect(event.preventDefault).not.toHaveBeenCalled();
    },
  );
});
