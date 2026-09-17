import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { installPublicHeaderContentFit } from '@/components/Header';

vi.mock('next/navigation', () => ({ usePathname: () => '/en/pricing' }));

function fixture(options: { links?: 'current' | 'popup-free' | 'popup-only' } = {}) {
  const linkMode = options.links ?? 'current';
  const owned = new Set<unknown>();
  const attrs = new Map<string, string>();
  const doc: { activeElement: unknown } = { activeElement: null };

  const createEl = (selectors: string[]) => {
    const elAttrs: Record<string, string> = {};
    const nested = new Set<unknown>();
    const el = {
      matches: (selector: string) =>
        selector.split(',').some((part) => selectors.includes(part.trim())),
      contains: (node: unknown) => node === el || nested.has(node),
      getAttribute: (name: string) => (name in elAttrs ? elAttrs[name] : null),
      setAttribute: (name: string, value: string) => {
        elAttrs[name] = value;
      },
      focus: vi.fn(() => {
        doc.activeElement = el;
      }),
      adopt: (node: unknown) => {
        nested.add(node);
      },
    };
    owned.add(el);
    return el;
  };

  const probe = Object.assign(createEl(['[data-header-content-fit-probe]']), { scrollWidth: 980 });
  const slot = Object.assign(createEl(['[data-header-content-fit-slot]']), { clientWidth: 720 });
  const nav = { scrollWidth: 0, clientWidth: 100 };
  const toggle = createEl(['button.mobile-toggle']);
  toggle.setAttribute('aria-expanded', 'false');
  const lookalikeToggle = createEl(['button.mobile-toggle']);
  owned.delete(lookalikeToggle);
  const drawer = createEl(['#public-mobile-nav-drawer']);
  const drawerItem = createEl(['.header-utility a']);
  drawer.adopt(drawerItem);
  const cta = createEl(['.header-actions .nav-cta']);
  const utility = createEl(['.header-utility a', '.header-utility button']);
  const searchBtn = createEl(['.header-search-btn']);
  const logo = createEl(['.logo']);
  const outside = createEl(['outside']);
  owned.delete(outside);
  const body = createEl(['body']);
  owned.delete(body);
  doc.activeElement = body;

  const navSelectors = ['.main-nav .nav-link'];
  if (linkMode === 'current') navSelectors.push('.main-nav .nav-link[aria-current="page"]');
  if (linkMode === 'popup-free') navSelectors.push('.main-nav .nav-link:not([aria-haspopup])');
  const navLink = createEl(navSelectors);

  const nodes: Record<string, unknown> = {
    '[data-header-content-fit-probe]': probe,
    '[data-header-content-fit-slot]': slot,
    'button.mobile-toggle': toggle,
    '#public-mobile-nav-drawer': drawer,
    '.header-actions .nav-cta': cta,
    '.main-nav .nav-link': navLink,
  };
  if (linkMode === 'current') {
    nodes['.main-nav .nav-link[aria-current="page"]'] = navLink;
  }
  if (linkMode === 'popup-free') {
    nodes['.main-nav .nav-link:not([aria-haspopup])'] = navLink;
  }

  const header = {
    querySelector: (selector: string) => nodes[selector] ?? null,
    getAttribute: (name: string) => attrs.get(name) ?? null,
    setAttribute: (name: string, value: string) => {
      attrs.set(name, value);
    },
    removeAttribute: (name: string) => {
      attrs.delete(name);
    },
    contains: (node: unknown) => owned.has(node),
    ownerDocument: doc,
  } as unknown as HTMLElement;
  return {
    header,
    probe,
    slot,
    nav,
    doc,
    toggle,
    lookalikeToggle,
    drawer,
    drawerItem,
    navLink,
    cta,
    utility,
    searchBtn,
    logo,
    outside,
    body,
  };
}

let observerCallback: ResizeObserverCallback;
let frames: Map<number, FrameRequestCallback>;
let listeners: Map<string, EventListener>;
let mediaMatches = true;
const observe = vi.fn();
const disconnect = vi.fn();
const mediaAddEventListener = vi.fn();
const mediaRemoveEventListener = vi.fn();

function flushFrame() {
  const pending = [...frames.values()];
  frames.clear();
  pending.forEach((callback) => callback(0));
}

function notifyResize() {
  observerCallback([], {} as ResizeObserver);
}

beforeEach(() => {
  vi.clearAllMocks();
  frames = new Map();
  listeners = new Map();
  mediaMatches = true;
  let frameId = 0;
  vi.stubGlobal('window', {
    requestAnimationFrame: vi.fn((callback: FrameRequestCallback) => {
      frames.set(++frameId, callback);
      return frameId;
    }),
    cancelAnimationFrame: vi.fn((id: number) => {
      frames.delete(id);
    }),
    addEventListener: vi.fn((name: string, callback: EventListener) => {
      listeners.set(name, callback);
    }),
    removeEventListener: vi.fn((name: string) => {
      listeners.delete(name);
    }),
    matchMedia: vi.fn(() => ({
      get matches() {
        return mediaMatches;
      },
      addEventListener: mediaAddEventListener,
      removeEventListener: mediaRemoveEventListener,
    })),
  });
  vi.stubGlobal('ResizeObserver', class {
    observe = observe;
    disconnect = disconnect;
    constructor(callback: ResizeObserverCallback) {
      observerCallback = callback;
    }
  });
});

afterEach(() => vi.unstubAllGlobals());

it('compacts when the desktop candidate cannot fit even if nav scrollWidth is 0, does not restore on a 0 candidate, then restores and cleans up', () => {
  const { header, probe, slot, nav } = fixture();
  nav.scrollWidth = 0;
  probe.scrollWidth = 980;
  slot.clientWidth = 720;

  const cleanup = installPublicHeaderContentFit(header);
  expect(header.getAttribute('data-header-content-fit')).toBe('compact');
  expect(observe).toHaveBeenCalledWith(probe);
  expect(observe).toHaveBeenCalledWith(slot);

  probe.scrollWidth = 0;
  notifyResize();
  flushFrame();
  expect(header.getAttribute('data-header-content-fit')).toBe('compact');

  probe.scrollWidth = 320;
  notifyResize();
  flushFrame();
  expect(header.getAttribute('data-header-content-fit')).toBeNull();

  cleanup();
  expect(disconnect).toHaveBeenCalledOnce();
  expect(listeners.size).toBe(0);
  expect(mediaRemoveEventListener).toHaveBeenCalled();
  expect(header.getAttribute('data-header-content-fit')).toBeNull();

  probe.scrollWidth = 980;
  notifyResize();
  flushFrame();
  expect(header.getAttribute('data-header-content-fit')).toBeNull();
});

it('moves focus onto the closed mobile toggle when compacting from a visible desktop nav link', () => {
  const { header, probe, slot, doc, toggle, navLink } = fixture();
  probe.scrollWidth = 980;
  slot.clientWidth = 720;
  doc.activeElement = navLink;

  installPublicHeaderContentFit(header);

  expect(toggle.focus).toHaveBeenCalledOnce();
  expect(toggle.focus).toHaveBeenCalledWith({ preventScroll: true });
  expect(doc.activeElement).toBe(toggle);
});

it('moves focus onto the current nav link when restoring desktop from the owned mobile toggle', () => {
  const { header, probe, slot, doc, navLink } = fixture({ links: 'current' });
  probe.scrollWidth = 980;
  slot.clientWidth = 720;
  doc.activeElement = navLink;

  installPublicHeaderContentFit(header);

  probe.scrollWidth = 320;
  notifyResize();
  flushFrame();

  expect(navLink.focus).toHaveBeenCalledOnce();
  expect(navLink.focus).toHaveBeenCalledWith({ preventScroll: true });
  expect(doc.activeElement).toBe(navLink);
});

it('does not move focus from a lookalike mobile toggle when restoring desktop', () => {
  const { header, probe, slot, doc, toggle, navLink, lookalikeToggle, cta, drawerItem } = fixture();
  probe.scrollWidth = 980;
  slot.clientWidth = 720;

  installPublicHeaderContentFit(header);
  expect(header.getAttribute('data-header-content-fit')).toBe('compact');

  doc.activeElement = lookalikeToggle;
  probe.scrollWidth = 320;
  notifyResize();
  flushFrame();

  expect(toggle.focus).not.toHaveBeenCalled();
  expect(navLink.focus).not.toHaveBeenCalled();
  expect(lookalikeToggle.focus).not.toHaveBeenCalled();
  expect(cta.focus).not.toHaveBeenCalled();
  expect(drawerItem.focus).not.toHaveBeenCalled();
  expect(header.getAttribute('data-header-content-fit')).toBeNull();
  expect(doc.activeElement).toBe(lookalikeToggle);
});

it('moves focus onto the closed mobile toggle when compacting from the CTA', () => {
  const { header, probe, slot, doc, toggle, cta } = fixture();
  probe.scrollWidth = 980;
  slot.clientWidth = 720;
  doc.activeElement = cta;

  installPublicHeaderContentFit(header);

  expect(toggle.focus).toHaveBeenCalledOnce();
  expect(toggle.focus).toHaveBeenCalledWith({ preventScroll: true });
  expect(doc.activeElement).toBe(toggle);
});

it('moves focus onto the closed mobile toggle when compacting from a utility control', () => {
  const { header, probe, slot, doc, toggle, utility } = fixture();
  probe.scrollWidth = 980;
  slot.clientWidth = 720;
  doc.activeElement = utility;

  installPublicHeaderContentFit(header);

  expect(toggle.focus).toHaveBeenCalledOnce();
  expect(toggle.focus).toHaveBeenCalledWith({ preventScroll: true });
  expect(doc.activeElement).toBe(toggle);
});

it('does not move focus when compacting from the search button, logo, body, or an element outside the header', () => {
  for (const key of ['searchBtn', 'logo', 'body', 'outside'] as const) {
    const fx = fixture();
    const active = fx[key];
    fx.probe.scrollWidth = 980;
    fx.slot.clientWidth = 720;
    fx.doc.activeElement = active;

    installPublicHeaderContentFit(fx.header);

    expect(fx.toggle.focus).not.toHaveBeenCalled();
    expect(fx.navLink.focus).not.toHaveBeenCalled();
    expect(fx.cta.focus).not.toHaveBeenCalled();
    expect(fx.utility.focus).not.toHaveBeenCalled();
    expect(fx.searchBtn.focus).not.toHaveBeenCalled();
    expect(fx.logo.focus).not.toHaveBeenCalled();
    expect(fx.body.focus).not.toHaveBeenCalled();
    expect(fx.outside.focus).not.toHaveBeenCalled();
    expect(fx.header.getAttribute('data-header-content-fit')).toBe('compact');
    expect(fx.doc.activeElement).toBe(active);
  }
});

it('does not move focus when compacting from a nav link while the mobile toggle is expanded', () => {
  const { header, probe, slot, doc, toggle, navLink, cta, drawerItem } = fixture();
  probe.scrollWidth = 980;
  slot.clientWidth = 720;
  toggle.setAttribute('aria-expanded', 'true');
  doc.activeElement = navLink;

  installPublicHeaderContentFit(header);

  expect(toggle.focus).not.toHaveBeenCalled();
  expect(navLink.focus).not.toHaveBeenCalled();
  expect(cta.focus).not.toHaveBeenCalled();
  expect(drawerItem.focus).not.toHaveBeenCalled();
  expect(header.getAttribute('data-header-content-fit')).toBe('compact');
  expect(doc.activeElement).toBe(navLink);
});

it('does not move focus when compacting from a control inside the mobile drawer', () => {
  const { header, probe, slot, doc, toggle, navLink, cta, utility, drawerItem } = fixture();
  probe.scrollWidth = 980;
  slot.clientWidth = 720;
  doc.activeElement = drawerItem;

  installPublicHeaderContentFit(header);

  expect(toggle.focus).not.toHaveBeenCalled();
  expect(navLink.focus).not.toHaveBeenCalled();
  expect(cta.focus).not.toHaveBeenCalled();
  expect(utility.focus).not.toHaveBeenCalled();
  expect(drawerItem.focus).not.toHaveBeenCalled();
  expect(header.getAttribute('data-header-content-fit')).toBe('compact');
  expect(doc.activeElement).toBe(drawerItem);
});

it('moves focus onto a popup-free nav link when restoring desktop from the owned mobile toggle', () => {
  const { header, probe, slot, doc, navLink } = fixture({ links: 'popup-free' });
  probe.scrollWidth = 980;
  slot.clientWidth = 720;
  doc.activeElement = navLink;

  installPublicHeaderContentFit(header);

  probe.scrollWidth = 320;
  notifyResize();
  flushFrame();

  expect(navLink.focus).toHaveBeenCalledOnce();
  expect(navLink.focus).toHaveBeenCalledWith({ preventScroll: true });
  expect(doc.activeElement).toBe(navLink);
});

it('moves focus onto the first nav link when restoring desktop if every nav link has a popup', () => {
  const { header, probe, slot, doc, navLink } = fixture({ links: 'popup-only' });
  probe.scrollWidth = 980;
  slot.clientWidth = 720;
  doc.activeElement = navLink;

  installPublicHeaderContentFit(header);

  probe.scrollWidth = 320;
  notifyResize();
  flushFrame();

  expect(navLink.focus).toHaveBeenCalledOnce();
  expect(navLink.focus).toHaveBeenCalledWith({ preventScroll: true });
  expect(doc.activeElement).toBe(navLink);
});

it('does not move focus when releasing compact because the desktop media query no longer matches', () => {
  const { header, probe, slot, doc, toggle, navLink, cta, drawerItem } = fixture();
  probe.scrollWidth = 980;
  slot.clientWidth = 720;

  installPublicHeaderContentFit(header);
  expect(header.getAttribute('data-header-content-fit')).toBe('compact');

  doc.activeElement = toggle;
  mediaMatches = false;
  probe.scrollWidth = 320;
  notifyResize();
  flushFrame();

  expect(toggle.focus).not.toHaveBeenCalled();
  expect(navLink.focus).not.toHaveBeenCalled();
  expect(cta.focus).not.toHaveBeenCalled();
  expect(drawerItem.focus).not.toHaveBeenCalled();
  expect(header.getAttribute('data-header-content-fit')).toBeNull();
  expect(doc.activeElement).toBe(toggle);
});

it('does not move focus and removes the compact attribute on cleanup while the mobile toggle is focused', () => {
  const { header, probe, slot, doc, toggle, navLink, cta, drawerItem } = fixture();
  probe.scrollWidth = 980;
  slot.clientWidth = 720;

  const cleanup = installPublicHeaderContentFit(header);
  expect(header.getAttribute('data-header-content-fit')).toBe('compact');

  doc.activeElement = toggle;
  cleanup();

  expect(toggle.focus).not.toHaveBeenCalled();
  expect(navLink.focus).not.toHaveBeenCalled();
  expect(cta.focus).not.toHaveBeenCalled();
  expect(drawerItem.focus).not.toHaveBeenCalled();
  expect(header.getAttribute('data-header-content-fit')).toBeNull();
  expect(doc.activeElement).toBe(toggle);
});

it('does not move focus on a resize that does not change the compact state', () => {
  const { header, probe, slot, doc, toggle, navLink, cta, drawerItem } = fixture();
  probe.scrollWidth = 980;
  slot.clientWidth = 720;
  doc.activeElement = toggle;

  installPublicHeaderContentFit(header);
  expect(header.getAttribute('data-header-content-fit')).toBe('compact');

  notifyResize();
  flushFrame();

  expect(toggle.focus).not.toHaveBeenCalled();
  expect(navLink.focus).not.toHaveBeenCalled();
  expect(cta.focus).not.toHaveBeenCalled();
  expect(drawerItem.focus).not.toHaveBeenCalled();
  expect(header.getAttribute('data-header-content-fit')).toBe('compact');
  expect(doc.activeElement).toBe(toggle);
});
