import type { Locale } from '@/lib/locales';
import type {
  ConsultationCategory,
  ConsultationRiskLevel,
} from '@/lib/consultation/types';
import { appendConsultationLogLine } from '@/lib/consultation/log-storage';

export type ConsultationFeedbackRating = 'helpful' | 'unhelpful';

export interface ConsultationFeedbackInput {
  sessionId: string;
  messageId: string;
  rating: ConsultationFeedbackRating;
  locale: Locale;
  classification?: ConsultationCategory;
  riskLevel?: ConsultationRiskLevel;
  comment?: string;
  userAgent?: string | null;
  ipAddress?: string | null;
}

interface ConsultationFeedbackRecord {
  timestamp: string;
  sessionId: string;
  messageId: string;
  rating: ConsultationFeedbackRating;
  locale: Locale;
  classification?: ConsultationCategory;
  riskLevel?: ConsultationRiskLevel;
  commentRedacted?: string;
  userAgent?: string | null;
  ipAddress?: string | null;
}

function redactSensitiveText(value: string): string {
  return value
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[redacted-email]')
    .replace(/(?:\+?\d[\d\s\-()]{7,}\d)/g, '[redacted-phone]')
    .replace(/(?<!\d)\d{6,}(?!\d)/g, '[redacted-number]')
    .replace(/\d{6}-\d{7}/g, '[redacted-rrn]')
    .trim();
}

export function clipFeedbackComment(value: string, limit = 400): string {
  const normalized = redactSensitiveText(value).replace(/\s+/g, ' ').trim();
  if (normalized.length <= limit) return normalized;
  return `${normalized.slice(0, limit - 3)}...`;
}

function maskIpAddress(raw: string | null): string | null {
  if (!raw) return null;
  const first = raw.split(',')[0]?.trim() || null;
  if (!first) return null;
  return first.replace(/(\d+)$/, 'x');
}

// In-memory dedup: same (sessionId + messageId) cannot be rated more than
// once per 10 minutes. This prevents accidental double-click floods and
// limited abuse from a single session. Cleared by a background sweep.
const DEDUP_WINDOW_MS = 10 * 60 * 1000;
const dedupStore = new Map<string, number>();

function sweepDedupStore(now: number): void {
  const cutoff = now - DEDUP_WINDOW_MS;
  for (const [key, ts] of dedupStore.entries()) {
    if (ts < cutoff) dedupStore.delete(key);
  }
}

export interface RecordFeedbackResult {
  accepted: boolean;
  reason?: 'duplicate' | 'write_failed';
}

/**
 * Append a feedback record to the daily JSONL log and update the in-memory
 * dedup map. Returns accepted=false with reason='duplicate' when the same
 * (sessionId, messageId) has been recorded inside the dedup window.
 */
export async function recordConsultationFeedback(
  input: ConsultationFeedbackInput,
): Promise<RecordFeedbackResult> {
  const now = Date.now();
  sweepDedupStore(now);

  const key = `${input.sessionId}::${input.messageId}`;
  if (dedupStore.has(key)) {
    return { accepted: false, reason: 'duplicate' };
  }

  const record: ConsultationFeedbackRecord = {
    timestamp: new Date(now).toISOString(),
    sessionId: input.sessionId,
    messageId: input.messageId,
    rating: input.rating,
    locale: input.locale,
    classification: input.classification,
    riskLevel: input.riskLevel,
    commentRedacted: input.comment ? clipFeedbackComment(input.comment) : undefined,
    userAgent: input.userAgent || null,
    ipAddress: maskIpAddress(input.ipAddress || null),
  };

  const dateKey = record.timestamp.slice(0, 10);

  try {
    await appendConsultationLogLine('feedback', dateKey, JSON.stringify(record));
  } catch (error) {
    console.error('[consultation] feedback write failed:', error);
    return { accepted: false, reason: 'write_failed' };
  }

  dedupStore.set(key, now);
  return { accepted: true };
}
