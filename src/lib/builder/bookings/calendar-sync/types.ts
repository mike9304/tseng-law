export type CalendarProvider = 'google' | 'outlook';

export interface CalendarEventMapping {
  bookingId: string;
  externalId: string;
  lastPushedAt: string;
}

export interface CalendarConnection {
  connectionId: string;
  staffId: string;
  provider: CalendarProvider;
  /** External account email/UPN once known. */
  accountEmail?: string;
  /** Encrypted refresh token. Stored as `iv:cipher:authTag` (hex). */
  refreshTokenEncrypted: string;
  scope: string;
  status: 'connected' | 'error' | 'revoked';
  lastError?: string;
  lastSyncedAt?: string;
  lastSyncResult?: CalendarSyncResult;
  eventMappings?: CalendarEventMapping[];
  createdAt: string;
  updatedAt: string;
}

export interface CalendarSyncResult {
  ok: boolean;
  pushed: number;
  pulled: number;
  bookingUpdates: number;
  blockedUpdates: number;
  reconciliationFeed: CalendarSyncReconciliationEntry[];
  errors: Array<{ kind: string; message: string }>;
}

export interface CalendarSyncReconciliationEntry {
  externalId: string;
  summary: string;
  kind: 'booking' | 'block';
  status:
    | 'updated'
    | 'created'
    | 'cancelled'
    | 'removed'
    | 'ignored'
    | 'ignored-invalid-range'
    | 'ignored-own-event'
    | 'ignored-unmatched'
    | 'error';
  source?: 'token' | 'pull' | 'push';
  bookingId?: string;
  note?: string;
}

export interface ExternalCalendarEvent {
  provider: CalendarProvider;
  externalId: string;
  summary: string;
  start: string;
  end: string;
  status: 'confirmed' | 'cancelled';
  description?: string;
  attendees?: string[];
  updatedAt?: string;
  htmlLink?: string;
  bookingId?: string;
}
