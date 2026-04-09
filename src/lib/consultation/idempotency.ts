/**
 * In-memory idempotency guard for consultation submissions.
 * Prevents the same sessionId from completing more than one successful submission.
 * Successful intakeIds are remembered for 24 hours.
 */

interface SubmitRecord {
  intakeId: string;
  timestamp: number;
}

const submitted = new Map<string, SubmitRecord>();

const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const CLEANUP_INTERVAL_MS = 600_000; // 10 minutes

export function hasAlreadySubmitted(sessionId: string): SubmitRecord | null {
  const record = submitted.get(sessionId);
  if (!record) return null;

  if (Date.now() - record.timestamp > TTL_MS) {
    submitted.delete(sessionId);
    return null;
  }

  return record;
}

export function markSubmitted(sessionId: string, intakeId: string): void {
  submitted.set(sessionId, { intakeId, timestamp: Date.now() });
}

function cleanup() {
  const now = Date.now();
  for (const [key, record] of submitted) {
    if (now - record.timestamp > TTL_MS) {
      submitted.delete(key);
    }
  }
}

if (typeof globalThis !== 'undefined') {
  const g = globalThis as unknown as { _consultationIdempotencyCleanup?: ReturnType<typeof setInterval> };
  if (!g._consultationIdempotencyCleanup) {
    g._consultationIdempotencyCleanup = setInterval(cleanup, CLEANUP_INTERVAL_MS);
    if (g._consultationIdempotencyCleanup.unref) {
      g._consultationIdempotencyCleanup.unref();
    }
  }
}
