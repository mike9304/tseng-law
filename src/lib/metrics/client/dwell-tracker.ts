export interface DwellFlush {
  path: string;
  dwellMs: number;
  scrollPct?: number;
}

const DEFAULT_MAX_DWELL_MS = 1_800_000;

export function createDwellTracker(opts: {
  now?: () => number;
  maxDwellMs?: number;
}): {
  start(path: string): void;
  setVisible(visible: boolean): void;
  noteScrollPct(pct: number): void;
  switchPath(path: string): DwellFlush | null;
  flush(): DwellFlush | null;
} {
  const now = opts.now ?? Date.now;
  const maxDwellMs = opts.maxDwellMs ?? DEFAULT_MAX_DWELL_MS;

  let currentPath: string | null = null;
  let dwellMs = 0;
  let scrollPct: number | undefined;
  let visible = false;
  let visibleSince: number | null = null;

  const accrueVisibleTime = (timestamp: number) => {
    if (!visible || visibleSince === null || currentPath === null) return;

    const delta = timestamp - visibleSince;
    if (delta > 0) {
      dwellMs = Math.min(maxDwellMs, dwellMs + delta);
      visibleSince = timestamp;
    }
  };

  const start = (path: string) => {
    currentPath = path;
    dwellMs = 0;
    scrollPct = undefined;
    visible = true;
    visibleSince = now();
  };

  const setVisible = (nextVisible: boolean) => {
    if (nextVisible === visible) return;

    if (nextVisible) {
      visible = true;
      visibleSince = now();
      return;
    }

    accrueVisibleTime(now());
    visible = false;
    visibleSince = null;
  };

  const noteScrollPct = (pct: number) => {
    if (currentPath === null || !Number.isFinite(pct)) return;

    const clampedPct = Math.min(100, Math.max(0, pct));
    scrollPct = Math.max(scrollPct ?? 0, clampedPct);
  };

  const flush = (): DwellFlush | null => {
    if (currentPath === null) return null;

    accrueVisibleTime(now());
    const flushed = dwellMs > 0
      ? {
          path: currentPath,
          dwellMs,
          ...(scrollPct === undefined ? {} : { scrollPct }),
        }
      : null;

    dwellMs = 0;
    scrollPct = undefined;
    return flushed;
  };

  const switchPath = (path: string): DwellFlush | null => {
    const flushed = flush();
    start(path);
    return flushed;
  };

  return {
    start,
    setVisible,
    noteScrollPct,
    switchPath,
    flush,
  };
}
