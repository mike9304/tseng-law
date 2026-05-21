/**
 * F96 — Per-(site,page) canvas write mutex (mitigation slice).
 *
 * Until a real CRDT decision lands, concurrent canvas writes can race
 * inside the comments/presence/edit-store layers. This mutex serializes
 * writes per (siteId, pageId) so the LAST writer wins deterministically
 * — it does NOT solve the merge problem (visible "your edit was lost"
 * feedback still needs CRDT or operational transform), but it prevents
 * store-level corruption.
 *
 * Usage:
 *   await withCanvasMutex(siteId, pageId, async () => {
 *     const current = await readPageCanvas(...);
 *     // ...mutate...
 *     await writePageCanvas(..., next);
 *   });
 *
 * The mutex is process-local (Map in memory). Multi-process deployments
 * still need a distributed lock (e.g. Vercel KV `set ... NX`) — out of
 * scope for this first slice.
 */

interface PendingEntry {
  promise: Promise<void>;
  resolve: () => void;
}

const queues = new Map<string, PendingEntry[]>();

function lockKey(siteId: string, pageId: string): string {
  return `${siteId}::${pageId}`;
}

export async function withCanvasMutex<T>(
  siteId: string,
  pageId: string,
  task: () => Promise<T>,
): Promise<T> {
  const key = lockKey(siteId, pageId);
  const queue = queues.get(key) ?? [];

  let release!: () => void;
  const acquired = new Promise<void>((resolve) => {
    release = resolve;
  });

  // Wait for the most-recent pending entry (if any) to finish before
  // we proceed. Each new entry is "chained" to the prior one so the
  // queue stays strictly FIFO.
  const previous = queue[queue.length - 1];
  queue.push({ promise: acquired, resolve: release });
  queues.set(key, queue);

  if (previous) {
    await previous.promise.catch(() => undefined);
  }

  try {
    return await task();
  } finally {
    release();
    // Garbage-collect: drop completed entries from the front.
    const remaining = queues.get(key);
    if (remaining) {
      const idx = remaining.findIndex((entry) => entry.resolve === release);
      if (idx >= 0) remaining.splice(idx, 1);
      if (remaining.length === 0) queues.delete(key);
    }
  }
}

/** Test-only helper to inspect the mutex state. */
export function __getCanvasMutexQueueDepth(siteId: string, pageId: string): number {
  return queues.get(lockKey(siteId, pageId))?.length ?? 0;
}

/** Test-only helper to reset the in-memory state. */
export function __resetCanvasMutexForTests(): void {
  queues.clear();
}
