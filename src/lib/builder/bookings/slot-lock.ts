/**
 * PR #20 follow-up — best-effort booking slot lock.
 *
 * Holds a per-`(serviceId,staffId,startAt)` lock during the window between
 * isSlotAvailable() and saveBooking(). Two concurrent /api/booking/book
 * requests for the same slot can otherwise both pass availability and
 * create duplicate bookings.
 *
 * Per-process Set keyed on the slot tuple. This is single-instance only —
 * a real distributed setup (multiple Vercel functions) would need
 * Upstash/Redis SETNX. Documented limitation; acceptable for the current
 * traffic profile.
 */

const heldUntil = new Map<string, number>();
const HOLD_MS = 15_000;

function slotKey(args: { serviceId: string; staffId: string; startAt: string }): string {
  return `${args.serviceId}|${args.staffId}|${args.startAt}`;
}

export function acquireSlotLock(args: { serviceId: string; staffId: string; startAt: string }): boolean {
  const key = slotKey(args);
  const now = Date.now();
  const existing = heldUntil.get(key);
  if (existing && existing > now) return false;
  heldUntil.set(key, now + HOLD_MS);
  return true;
}

export function releaseSlotLock(args: { serviceId: string; staffId: string; startAt: string }): void {
  heldUntil.delete(slotKey(args));
}
