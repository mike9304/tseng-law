export type ErrorOrigin = 'builder' | 'site' | 'api' | 'client';
export type ErrorSeverity = 'info' | 'warning' | 'error' | 'fatal';

export interface CapturedError {
  errorId: string;
  origin: ErrorOrigin;
  severity: ErrorSeverity;
  message: string;
  stack?: string;
  /** Free-form tags (e.g. route name, locale). */
  tags?: Record<string, string>;
  /** Free-form structured context (request id, user agent, etc.). */
  extra?: Record<string, unknown>;
  capturedAt: string;
  /** Whether Sentry accepted the event (best-effort tag, not load-bearing). */
  forwardedToSentry: boolean;
}
