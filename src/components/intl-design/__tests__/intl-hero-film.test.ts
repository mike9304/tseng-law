import { describe, expect, it, vi } from 'vitest';
import { INTL_HERO_FILM_QUERY, mountIntlHeroFilm } from '@/components/HeroMediaBackground';

/**
 * Lifecycle of the Folio hero film (review round 2): eligibility is read again whenever it can change, not only at
 * mount, and the film pauses or is removed (download stopped) when a condition fails. Plain fakes, no DOM library.
 */

type Listener = (...args: unknown[]) => void;

class Emitter {
  listeners = new Map<string, Set<Listener>>();
  addEventListener = vi.fn((type: string, fn: Listener) => {
    (this.listeners.get(type) ?? this.listeners.set(type, new Set()).get(type)!).add(fn);
  });
  removeEventListener = vi.fn((type: string, fn: Listener) => {
    this.listeners.get(type)?.delete(fn);
  });
  emit(type: string, ...args: unknown[]) {
    for (const fn of [...(this.listeners.get(type) ?? [])]) fn(...args);
  }
  count(type: string) {
    return this.listeners.get(type)?.size ?? 0;
  }
}

class FakeVideo extends Emitter {
  tagName = 'VIDEO';
  muted = false;
  defaultMuted = false;
  playsInline = false;
  preload = '';
  tabIndex = 0;
  paused = true;
  attributes = new Map<string, string>();
  children: unknown[] = [];
  removed = false;
  playResult: Promise<void> = Promise.resolve();
  play = vi.fn(() => {
    this.paused = false;
    return this.playResult;
  });
  pause = vi.fn(() => {
    this.paused = true;
  });
  load = vi.fn();
  setAttribute(name: string, value: string) {
    this.attributes.set(name, value);
  }
  removeAttribute(name: string) {
    this.attributes.delete(name);
  }
  appendChild(child: unknown) {
    this.children.push(child);
  }
  replaceChildren() {
    this.children = [];
  }
  remove() {
    this.removed = true;
  }
}

function setup({ wide = true, saveData = false, readyState = 'complete' as DocumentReadyState } = {}) {
  const state = { wide, saveData };
  // defineProperty, not Object.assign: the fakes must read the current state (Object.assign copies a getter's value).
  const mql = Object.defineProperty(new Emitter(), 'matches', { get: () => state.wide });
  const connection = Object.defineProperty(new Emitter(), 'saveData', { get: () => state.saveData });
  const videos: FakeVideo[] = [];
  const doc = Object.assign(new Emitter(), {
    readyState,
    visibilityState: 'visible' as DocumentVisibilityState,
    createElement: vi.fn((tag: string) => {
      if (tag === 'video') {
        const video = new FakeVideo();
        videos.push(video);
        return video;
      }
      return { tag, src: '', type: '' };
    }),
  });
  const idle: Array<() => void> = [];
  const observers: FakeObserver[] = [];
  class FakeObserver {
    observed: unknown[] = [];
    disconnect = vi.fn();
    constructor(public callback: (entries: Array<{ isIntersecting: boolean }>) => void) {
      observers.push(this);
    }
    observe(target: unknown) {
      this.observed.push(target);
    }
    fire(isIntersecting: boolean) {
      this.callback([{ isIntersecting }]);
    }
  }
  const win = Object.assign(new Emitter(), {
    matchMedia: vi.fn((query: string) => {
      expect(query).toBe(INTL_HERO_FILM_QUERY);
      return mql;
    }),
    navigator: { connection },
    requestIdleCallback: vi.fn((cb: () => void) => idle.push(cb)),
    cancelIdleCallback: vi.fn(),
    setTimeout: vi.fn(),
    clearTimeout: vi.fn(),
    IntersectionObserver: FakeObserver,
  });
  const slot = Object.assign(new Emitter(), {
    attributes: new Map<string, string>(),
    appended: [] as unknown[],
    appendChild(child: unknown) {
      this.appended.push(child);
    },
    setAttribute(name: string, value: string) {
      this.attributes.set(name, value);
    },
    removeAttribute(name: string) {
      this.attributes.delete(name);
    },
  });
  const dispose = mountIntlHeroFilm(
    slot as unknown as HTMLElement,
    { webm: '/f.webm', mp4: '/f.mp4' },
    win as unknown as Parameters<typeof mountIntlHeroFilm>[2],
    doc as unknown as Parameters<typeof mountIntlHeroFilm>[3],
  );
  const runIdle = () => idle.splice(0).forEach((cb) => cb());
  const setWide = (next: boolean) => {
    state.wide = next;
    mql.emit('change');
  };
  const setSaveData = (next: boolean) => {
    state.saveData = next;
    connection.emit('change');
  };
  const setVisibility = (next: DocumentVisibilityState) => {
    doc.visibilityState = next;
    doc.emit('visibilitychange');
  };
  return { win, doc, mql, connection, slot, videos, observers, dispose, runIdle, setWide, setSaveData, setVisibility };
}

/** Lets a rejected play() promise settle. */
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('Folio hero film lifecycle', () => {
  it('injects nothing before load and idle, then one muted, inline, non-interactive film once on screen', () => {
    const t = setup({ readyState: 'loading' });
    expect(t.win.requestIdleCallback).not.toHaveBeenCalled();
    t.win.emit('load');
    expect(t.videos).toHaveLength(0);
    t.runIdle();
    expect(t.videos).toHaveLength(0);
    t.observers[0].fire(true);
    expect(t.videos).toHaveLength(1);
    const [film] = t.videos;
    expect(film.muted && film.playsInline && film.preload === 'none' && film.tabIndex === -1).toBe(true);
    expect(film.attributes.get('aria-hidden')).toBe('true');
    expect(film.play).toHaveBeenCalledTimes(1);
    film.emit('playing');
    expect(t.slot.attributes.has('data-playing')).toBe(true);
  });

  it('rechecks eligibility at the deferred start: a narrowed screen before idle never downloads the film', () => {
    const t = setup();
    t.setWide(false);
    t.runIdle();
    t.observers[0].fire(true);
    expect(t.doc.createElement).not.toHaveBeenCalled();
  });

  it('keeps listening: a screen that becomes eligible later starts the film then', () => {
    const t = setup({ wide: false });
    t.runIdle();
    t.observers[0].fire(true);
    expect(t.videos).toHaveLength(0);
    t.setWide(true);
    expect(t.videos).toHaveLength(1);
  });

  it('never starts with Save-Data, and removes a playing film when Save-Data is turned on', () => {
    const t = setup({ saveData: true });
    t.runIdle();
    t.observers[0].fire(true);
    expect(t.videos).toHaveLength(0);
    t.setSaveData(false);
    expect(t.videos).toHaveLength(1);
    t.setSaveData(true);
    expect(t.videos[0].removed).toBe(true);
  });

  it('stops the download and removes the film when reduced motion or a narrow screen arrives mid-play', () => {
    const t = setup();
    t.runIdle();
    t.observers[0].fire(true);
    const [film] = t.videos;
    film.emit('playing');
    t.setWide(false);
    expect(film.pause).toHaveBeenCalled();
    expect(film.children).toHaveLength(0);
    expect(film.load).toHaveBeenCalled();
    expect(film.removed).toBe(true);
    expect(t.slot.attributes.has('data-playing')).toBe(false);
  });

  it('pauses while the tab is hidden or the plate is off screen, and resumes when both are back', () => {
    const t = setup();
    t.runIdle();
    t.observers[0].fire(true);
    const [film] = t.videos;
    t.setVisibility('hidden');
    expect(film.paused).toBe(true);
    t.setVisibility('visible');
    expect(film.paused).toBe(false);
    expect(film.play).toHaveBeenCalledTimes(2);
    t.observers[0].fire(false);
    expect(film.paused).toBe(true);
    t.observers[0].fire(true);
    expect(film.play).toHaveBeenCalledTimes(3);
    expect(t.videos).toHaveLength(1);
  });

  it('waits for a visible tab before the first injection', () => {
    const t = setup();
    t.doc.visibilityState = 'hidden';
    t.runIdle();
    t.observers[0].fire(true);
    expect(t.videos).toHaveLength(0);
    t.setVisibility('visible');
    expect(t.videos).toHaveLength(1);
  });

  it('rests on its last frame after ending and is never injected or replayed again', () => {
    const t = setup();
    t.runIdle();
    t.observers[0].fire(true);
    const [film] = t.videos;
    film.emit('ended');
    film.paused = true;
    t.setVisibility('hidden');
    t.setVisibility('visible');
    t.observers[0].fire(true);
    expect(film.play).toHaveBeenCalledTimes(1);
    expect(film.removed).toBe(false);
    expect(t.videos).toHaveLength(1);
  });

  it('keeps the still when play() is refused and does not retry', async () => {
    const t = setup();
    t.runIdle();
    const refused = Promise.reject(Object.assign(new Error('autoplay blocked'), { name: 'NotAllowedError' }));
    refused.catch(() => undefined);
    t.doc.createElement.mockImplementationOnce(() => {
      const video = new FakeVideo();
      video.playResult = refused;
      t.videos.push(video);
      return video;
    });
    t.observers[0].fire(true);
    await flush();
    expect(t.videos[0].removed).toBe(true);
    t.setVisibility('hidden');
    t.setVisibility('visible');
    expect(t.videos).toHaveLength(1);
  });

  it('treats the AbortError of its own pause() as a pause, not a refusal, and resumes on return', async () => {
    const t = setup();
    t.runIdle();
    // The first play() is still pending (preload none, data not yet there) when the plate leaves the screen: pause()
    // rejects it with AbortError, as the HTML spec says.
    const aborted = Promise.reject(Object.assign(new Error('The play() request was interrupted by a call to pause()'), { name: 'AbortError' }));
    aborted.catch(() => undefined);
    t.doc.createElement.mockImplementationOnce(() => {
      const video = new FakeVideo();
      video.playResult = aborted;
      t.videos.push(video);
      return video;
    });
    t.observers[0].fire(true);
    const [film] = t.videos;
    t.observers[0].fire(false);
    await flush();
    expect(film.removed).toBe(false);
    film.playResult = Promise.resolve();
    t.observers[0].fire(true);
    expect(film.play).toHaveBeenCalledTimes(2);
    expect(film.paused).toBe(false);
    expect(t.videos).toHaveLength(1);
  });

  it('removes its listeners, observer, pending idle callback and film on cleanup', () => {
    const t = setup({ readyState: 'loading' });
    t.dispose();
    expect(t.mql.count('change')).toBe(0);
    expect(t.connection.count('change')).toBe(0);
    expect(t.doc.count('visibilitychange')).toBe(0);
    expect(t.win.count('load')).toBe(0);

    const u = setup();
    u.runIdle();
    u.observers[0].fire(true);
    const [film] = u.videos;
    u.dispose();
    expect(u.observers[0].disconnect).toHaveBeenCalled();
    expect(film.removed).toBe(true);
    u.setWide(true);
    u.setVisibility('visible');
    expect(u.videos).toHaveLength(1);

    const v = setup();
    v.dispose();
    expect(v.win.cancelIdleCallback).toHaveBeenCalled();
  });
});
