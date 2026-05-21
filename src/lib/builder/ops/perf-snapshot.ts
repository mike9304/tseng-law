/**
 * Lightweight per-process performance snapshot. Server-side only —
 * we never expose raw V8 heap stats from the browser.
 */
export interface OpsPerfSnapshot {
  capturedAt: string;
  uptimeSeconds: number;
  memory: {
    rssBytes: number;
    heapTotalBytes: number;
    heapUsedBytes: number;
    externalBytes: number;
  };
  node: {
    version: string;
    platform: string;
    arch: string;
  };
}

export function capturePerfSnapshot(now: Date = new Date()): OpsPerfSnapshot {
  const mem = process.memoryUsage();
  return {
    capturedAt: now.toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    memory: {
      rssBytes: mem.rss,
      heapTotalBytes: mem.heapTotal,
      heapUsedBytes: mem.heapUsed,
      externalBytes: mem.external,
    },
    node: {
      version: process.version,
      platform: process.platform,
      arch: process.arch,
    },
  };
}