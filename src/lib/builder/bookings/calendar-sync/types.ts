export type CalendarProvider = 'google' | 'outlook';

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
  createdAt: string;
  updatedAt: string;
}

export interface CalendarSyncResult {
  ok: boolean;
  pushed: number;
  pulled: number;
  errors: Array<{ kind: string; message: string }>;
}
