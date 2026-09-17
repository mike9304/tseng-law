import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { installPublicHeaderOffset } from '@/components/Header';

vi.mock('next/navigation', () => ({ usePathname: () => '/ja/pricing' }));

function makeStyle() {
  const values = new Map<string, { value: string; priority: string }>();
  return {
    getPropertyValue: (name: string) => values.get(name)?.value ?? '',
    getPropertyPriority: (name: string) => values.get(name)?.priority ?? '',
    setProperty: vi.fn((name: string, value: string, priority = '') => {
      values.set(name, { value, priority });
    }),
    removeProperty: vi.fn((name: string) => { values.delete(name); }),
  };
}

function fixture(height = 67) {
  const style = makeStyle();
  const attrs = new Map<string, string>();
  const site = {
    setAttribute: (name: string, value: string) => attrs.set(name, value),
    removeAttribute: (name: string) => attrs.delete(name),
    getAttribute: (name: string) => attrs.get(name) ?? null,
  };
  const dimensions = { height };
  const header = {
    closest: () => site,
    ownerDocument: { documentElement: { style } },
    getBoundingClientRect: () => dimensions,
  } as unknown as HTMLElement;
  return { header, dimensions, style, site };
}

let observerCallback: ResizeObserverCallback;
let frames: Map<number, FrameRequestCallback>;
let listeners: Map<string, EventListener>;
const observe = vi.fn();
const disconnect = vi.fn();
function flushFrame() {
  const pending = [...frames.values()];
  frames.clear();
  pending.forEach((callback) => callback(0));
}
function notifyResize() { observerCallback([], {} as ResizeObserver); }

beforeEach(() => {
  vi.clearAllMocks();
  frames = new Map();
  listeners = new Map();
  let frameId = 0;
  vi.stubGlobal('window', {
    requestAnimationFrame: vi.fn((callback: FrameRequestCallback) => {
      frames.set(++frameId, callback);
      return frameId;
    }),
    cancelAnimationFrame: vi.fn((id: number) => { frames.delete(id); }),
    addEventListener: vi.fn((name: string, callback: EventListener) => { listeners.set(name, callback); }),
    removeEventListener: vi.fn((name: string) => { listeners.delete(name); }),
  });
  vi.stubGlobal('ResizeObserver', class {
    observe = observe;
    disconnect = disconnect;
    constructor(callback: ResizeObserverCallback) { observerCallback = callback; }
  });
});
afterEach(() => vi.unstubAllGlobals());

it('measures the actual header immediately and coalesces resize notifications without repeated style writes', () => {
  const { header, dimensions, style, site } = fixture(67.25);
  const cleanup = installPublicHeaderOffset(header);
  expect(style.getPropertyValue('--header-offset-desktop')).toBe('68px');
  expect(site.getAttribute('data-public-header-measured')).toBe('true');
  expect(observe).toHaveBeenCalledWith(header);
  dimensions.height = 139.5;
  notifyResize(); notifyResize(); notifyResize();
  expect(frames.size).toBe(1);
  flushFrame();
  expect(style.getPropertyValue('--header-offset-desktop')).toBe('140px');
  notifyResize(); flushFrame();
  expect(style.setProperty).toHaveBeenCalledTimes(2);
  cleanup();
});

it('releases the measured offset when the native header is hidden and measures it when shown again', () => {
  const { header, dimensions, style, site } = fixture();
  const cleanup = installPublicHeaderOffset(header);
  dimensions.height = 0;
  notifyResize(); flushFrame();
  expect(style.getPropertyValue('--header-offset-desktop')).toBe('');
  expect(site.getAttribute('data-public-header-measured')).toBeNull();
  dimensions.height = 110;
  notifyResize(); flushFrame();
  expect(style.getPropertyValue('--header-offset-desktop')).toBe('110px');
  cleanup();
});

it('restores the prior inline value and priority, disconnects, cancels pending work and ignores late notifications', () => {
  const { header, dimensions, style, site } = fixture();
  style.setProperty('--header-offset-desktop', '123px', 'important');
  const cleanup = installPublicHeaderOffset(header);
  dimensions.height = 200;
  notifyResize();
  cleanup();
  expect(disconnect).toHaveBeenCalledOnce();
  expect(frames.size).toBe(0);
  expect(listeners.size).toBe(0);
  expect(style.getPropertyValue('--header-offset-desktop')).toBe('123px');
  expect(style.getPropertyPriority('--header-offset-desktop')).toBe('important');
  expect(site.getAttribute('data-public-header-measured')).toBeNull();
  notifyResize(); flushFrame();
  expect(style.getPropertyValue('--header-offset-desktop')).toBe('123px');
});

it('does not overwrite a later external owner of the offset during cleanup', () => {
  const { header, style } = fixture();
  const cleanup = installPublicHeaderOffset(header);
  style.setProperty('--header-offset-desktop', '222px');
  cleanup();
  expect(style.getPropertyValue('--header-offset-desktop')).toBe('222px');
});

it('keeps a window-resize fallback when ResizeObserver is unavailable', () => {
  vi.stubGlobal('ResizeObserver', undefined);
  const { header, dimensions, style } = fixture();
  const cleanup = installPublicHeaderOffset(header);
  dimensions.height = 111;
  listeners.get('resize')?.(new Event('resize'));
  flushFrame();
  expect(style.getPropertyValue('--header-offset-desktop')).toBe('111px');
  cleanup();
});

it('does not modify offsets or install observers for a header outside the public site', () => {
  const { header, style } = fixture();
  header.closest = () => null;
  installPublicHeaderOffset(header)();
  expect(style.setProperty).not.toHaveBeenCalled();
  expect(observe).not.toHaveBeenCalled();
  expect(listeners.size).toBe(0);
});
