import { afterEach, describe, expect, it, vi } from 'vitest';
import { autoplayColumnVideoWhenVisible } from '../column-video-autoplay';

class Video extends EventTarget {
  muted = false;
  autoplay = false;
  play = vi.fn().mockResolvedValue(undefined);
}

function setup(reducedMotion = false) {
  let notify: (entries: { isIntersecting: boolean; intersectionRatio: number }[]) => void;
  const disconnect = vi.fn();
  vi.stubGlobal('window', { matchMedia: () => ({ matches: reducedMotion }) });
  vi.stubGlobal('IntersectionObserver', class {
    constructor(callback: typeof notify) { notify = callback; }
    observe = vi.fn();
    disconnect = disconnect;
  });
  const video = new Video();
  const cleanup = autoplayColumnVideoWhenVisible(video as unknown as HTMLVideoElement);
  return { video, cleanup, disconnect, visible: () => notify?.([{ isIntersecting: true, intersectionRatio: 0.5 }]), hidden: () => notify?.([{ isIntersecting: false, intersectionRatio: 0 }]) };
}

afterEach(() => vi.unstubAllGlobals());

describe('column video autoplay', () => {
  it('starts muted when it first becomes visible, without a click', () => {
    const { video, visible, hidden } = setup();
    hidden();
    expect(video.play).not.toHaveBeenCalled();
    visible();
    expect(video.muted).toBe(true);
    expect(video.autoplay).toBe(true);
    expect(video.play).toHaveBeenCalledTimes(1);
  });

  it('does not restart a manually paused or finished film on later scrolling', () => {
    const { video, visible, hidden } = setup();
    visible();
    video.dispatchEvent(new Event('pause'));
    hidden();
    visible();
    expect(video.play).toHaveBeenCalledTimes(1);
  });

  it.each(['pointerdown', 'keydown', 'play'])('lets prior %s interaction take priority over automatic start', (event) => {
    const { video, visible } = setup();
    video.dispatchEvent(new Event(event));
    visible();
    expect(video.play).not.toHaveBeenCalled();
  });

  it('respects reduced motion and component cleanup', () => {
    const reduced = setup(true);
    reduced.visible();
    expect(reduced.video.play).not.toHaveBeenCalled();
    const normal = setup();
    normal.cleanup();
    normal.visible();
    expect(normal.video.play).not.toHaveBeenCalled();
  });

  it('leaves manual controls available when the browser rejects autoplay', async () => {
    const { video, visible } = setup();
    video.play.mockRejectedValueOnce(new Error('NotAllowedError'));
    visible();
    await Promise.resolve();
    expect(video.play).toHaveBeenCalledTimes(1);
  });
});
