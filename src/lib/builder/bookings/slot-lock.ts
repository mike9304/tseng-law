/**
 * PR #20 follow-up — best-effort booking slot lock.
 *
 * Holds a per-`(serviceId,staffId,startAt)` lock during the window between
 * isSlotAvailable() and saveBooking(). Resource-backed services also hold a
 * coarse per-`(resourceId,date)` lock so two different staff members cannot
 * race into the same room before either booking is persisted.
 *
 * Per-process Set keyed on the slot tuple. This is single-instance only —
 * a real distributed setup (multiple Vercel functions) would need
 * Upstash/Redis SETNX. Documented limitation; acceptable for the current
 * traffic profile.
 */

const heldUntil = new Map<string, number>();
const HOLD_MS = 15_000;

export interface SlotLockArgs {
  serviceId: string;
  staffId: string;
  startAt: string;
  resourceIds?: string[];
}

function slotKeys(args: SlotLockArgs): string[] {
  const keys = [`staff:${args.serviceId}|${args.staffId}|${args.startAt}`];
  const date = args.startAt.slice(0, 10);
  const resourceIds = Array.from(new Set(args.resourceIds ?? [])).sort();
  for (const resourceId of resourceIds) {
    keys.push(`resource:${resourceId}|${date}`);
  }
  return keys;
}

export function acquireSlotLock(args: SlotLockArgs): boolean {
  const keys = slotKeys(args);
  const now = Date.now();
  if (keys.some((key) => {
    const existing = heldUntil.get(key);
    return Boolean(existing && existing > now);
  })) {
    return false;
  }
  for (const key of keys) {
    heldUntil.set(key, now + HOLD_MS);
  }
  return true;
}

export function releaseSlotLock(args: SlotLockArgs): void {
  for (const key of slotKeys(args)) {
    heldUntil.delete(key);
  }
}
