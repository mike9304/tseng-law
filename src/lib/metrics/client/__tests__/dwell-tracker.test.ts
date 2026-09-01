import { describe, expect, it } from 'vitest';

import { createDwellTracker } from '@/lib/metrics/client/dwell-tracker';

function createFakeClock() {
  let current = 0;

  return {
    now: () => current,
    set: (next: number) => {
      current = next;
    },
  };
}

describe('createDwellTracker', () => {
  it('returns null when flushed before start', () => {
    const clock = createFakeClock();
    const tracker = createDwellTracker({ now: clock.now });

    expect(tracker.flush()).toBeNull();
  });

  it('counts only visible time across hidden intervals', () => {
    const clock = createFakeClock();
    const tracker = createDwellTracker({ now: clock.now });

    tracker.start('/ko');
    clock.set(10_000);
    tracker.setVisible(false);
    clock.set(15_000);
    tracker.setVisible(true);
    clock.set(18_000);

    expect(tracker.flush()).toEqual({ path: '/ko', dwellMs: 13_000 });
  });

  it('returns the previous path when switching paths', () => {
    const clock = createFakeClock();
    const tracker = createDwellTracker({ now: clock.now });

    tracker.start('/ko');
    clock.set(2_500);

    expect(tracker.switchPath('/en')).toEqual({
      path: '/ko',
      dwellMs: 2_500,
    });

    clock.set(4_000);
    expect(tracker.flush()).toEqual({ path: '/en', dwellMs: 1_500 });
  });

  it('does not count the same interval in consecutive flushes', () => {
    const clock = createFakeClock();
    const tracker = createDwellTracker({ now: clock.now });

    tracker.start('/ko/services');
    clock.set(1_000);

    expect(tracker.flush()).toEqual({
      path: '/ko/services',
      dwellMs: 1_000,
    });
    expect(tracker.flush()).toBeNull();
  });

  it('caps visible dwell at the default 30 minute maximum', () => {
    const clock = createFakeClock();
    const tracker = createDwellTracker({ now: clock.now });

    tracker.start('/ko/contact');
    clock.set(35 * 60 * 1_000);

    expect(tracker.flush()).toEqual({
      path: '/ko/contact',
      dwellMs: 1_800_000,
    });
  });

  it('uses the maximum observed scroll percentage', () => {
    const clock = createFakeClock();
    const tracker = createDwellTracker({ now: clock.now });

    tracker.start('/ko/columns');
    tracker.noteScrollPct(25);
    tracker.noteScrollPct(80);
    tracker.noteScrollPct(45);
    clock.set(1);

    expect(tracker.flush()).toEqual({
      path: '/ko/columns',
      dwellMs: 1,
      scrollPct: 80,
    });
  });

  it('clamps scroll percentages to the 0 through 100 range', () => {
    const clock = createFakeClock();
    const tracker = createDwellTracker({ now: clock.now });

    tracker.start('/ko/about');
    tracker.noteScrollPct(-20);
    tracker.noteScrollPct(140);
    clock.set(1);

    expect(tracker.flush()).toEqual({
      path: '/ko/about',
      dwellMs: 1,
      scrollPct: 100,
    });
  });

  it('ignores non-finite scroll percentages', () => {
    const clock = createFakeClock();
    const tracker = createDwellTracker({ now: clock.now });

    tracker.start('/ja');
    tracker.noteScrollPct(Number.NaN);
    tracker.noteScrollPct(Number.POSITIVE_INFINITY);
    clock.set(1);

    expect(tracker.flush()).toEqual({ path: '/ja', dwellMs: 1 });
  });

  it('does not add time when the injected clock moves backwards', () => {
    const clock = createFakeClock();
    const tracker = createDwellTracker({ now: clock.now });

    clock.set(10_000);
    tracker.start('/en');
    clock.set(5_000);
    expect(tracker.flush()).toBeNull();
    clock.set(12_000);

    expect(tracker.flush()).toEqual({ path: '/en', dwellMs: 2_000 });
  });

  it('returns null when the entire interval is hidden', () => {
    const clock = createFakeClock();
    const tracker = createDwellTracker({ now: clock.now });

    tracker.start('/zh-hant');
    tracker.setVisible(false);
    clock.set(5_000);

    expect(tracker.flush()).toBeNull();
  });
});
