import { appendErrorLog, makeErrorId } from './storage';
import { forwardToSentry } from './sentry-adapter';
import { alertSlackForError } from './slack-adapter';
import type { CapturedError, ErrorOrigin, ErrorSeverity } from './types';

export interface CaptureArgs {
  origin: ErrorOrigin;
  severity?: ErrorSeverity;
  error: unknown;
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
}

/**
 * PR #16 — Central error capture.
 *
 * Always writes to the local log (Vercel Blob or file fallback) so admins
 * can audit issues even when Sentry is offline. Best-effort forwards to
 * Sentry if SENTRY_DSN is configured. Fire-and-forget: never throws and
 * never blocks the caller (the storage write is awaited but caught).
 */
function safeStringifyError(err: unknown): string {
  // captureBuilderError must never throw (it IS the error path). Raw JSON.stringify
  // throws on circular refs / BigInt, so fall back to String() then a constant.
  try {
    return JSON.stringify(err) ?? String(err);
  } catch {
    try {
      return String(err);
    } catch {
      return '[unserializable error]';
    }
  }
}

export async function captureBuilderError(args: CaptureArgs): Promise<CapturedError> {
  const err = args.error;
  const message = err instanceof Error ? err.message : typeof err === 'string' ? err : safeStringifyError(err);
  const stack = err instanceof Error ? err.stack : undefined;
  const entry: CapturedError = {
    errorId: makeErrorId(),
    origin: args.origin,
    severity: args.severity ?? 'error',
    message: message.slice(0, 2000),
    stack: stack ? stack.slice(0, 8000) : undefined,
    tags: args.tags,
    extra: args.extra,
    capturedAt: new Date().toISOString(),
    forwardedToSentry: false,
  };
  let forwarded = false;
  try {
    forwarded = await forwardToSentry(entry);
  } catch {
    /* swallow */
  }
  entry.forwardedToSentry = forwarded;
  try {
    await appendErrorLog(entry);
  } catch (saveErr) {
    console.warn('[errors] failed to persist captured error', saveErr);
  }
  // Slack side-channel: fire-and-forget for error/fatal only.
  void alertSlackForError(entry).catch(() => undefined);
  return entry;
}

/**
 * Convenience wrapper for one-liner sites: returns nothing, never awaits.
 */
export function captureBuilderErrorAsync(args: CaptureArgs): void {
  void captureBuilderError(args).catch(() => undefined);
}
