import { appendFile, mkdir } from 'fs/promises';
import path from 'path';
import type { Locale } from '@/lib/locales';
import type {
  ConsultationCategory,
  ConsultationNextField,
  ConsultationRiskLevel,
  ConsultationSourceConfidence,
  ConsultationSourceFreshness,
} from '@/lib/consultation/types';

type ConsultationLogEventType = 'chat' | 'submit_success' | 'submit_failed';

type ConsultationLogRecord = {
  timestamp: string;
  eventType: ConsultationLogEventType;
  sessionId: string;
  locale: Locale;
  classification?: ConsultationCategory;
  riskLevel?: ConsultationRiskLevel;
  shouldEscalate?: boolean;
  nextRequiredField?: ConsultationNextField;
  suggestedHandoffChannel?: 'line' | 'kakao' | 'email' | 'phone' | 'none';
  sourceFreshness?: ConsultationSourceFreshness;
  sourceConfidence?: ConsultationSourceConfidence;
  referencedColumns?: string[];
  topicKey?: string;
  messageRedacted?: string;
  summaryRedacted?: string;
  preferredContact?: string;
  urgency?: string;
  contactPresent?: boolean;
  intakeId?: string;
  success?: boolean;
  failureReason?: string;
  userAgent?: string | null;
  ipAddress?: string | null;
};

function getConsultationLogDir(): string {
  return process.env.CONSULTATION_LOG_DIR || path.join(process.cwd(), 'runtime-data', 'consultation-logs');
}

function redactSensitiveText(value: string): string {
  return value
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[redacted-email]')
    .replace(/(?:\+?\d[\d\s\-()]{7,}\d)/g, '[redacted-phone]')
    .replace(/(?<!\d)\d{6,}(?!\d)/g, '[redacted-number]')
    .trim();
}

function clipText(value: string, limit = 600): string {
  const normalized = redactSensitiveText(value).replace(/\s+/g, ' ').trim();
  if (normalized.length <= limit) {
    return normalized;
  }

  return `${normalized.slice(0, limit - 3)}...`;
}

function resolveIpAddress(rawValue: string | null): string | null {
  if (!rawValue) return null;
  // Take only the first IP (client IP before proxies)
  const first = rawValue.split(',')[0]?.trim() || null;
  if (!first) return null;
  // Mask last octet for privacy: 1.2.3.4 → 1.2.3.x
  return first.replace(/(\d+)$/, 'x');
}

async function appendConsultationLog(record: ConsultationLogRecord): Promise<void> {
  const logDir = getConsultationLogDir();
  const dateKey = record.timestamp.slice(0, 10);
  const filename = `consultation-events-${dateKey}.jsonl`;

  await mkdir(logDir, { recursive: true, mode: 0o700 });
  await appendFile(path.join(logDir, filename), `${JSON.stringify(record)}\n`, { encoding: 'utf8', mode: 0o600 });
}

export async function logConsultationChatEvent(input: {
  sessionId: string;
  locale: Locale;
  message: string;
  classification: ConsultationCategory;
  riskLevel: ConsultationRiskLevel;
  shouldEscalate: boolean;
  nextRequiredField: ConsultationNextField;
  suggestedHandoffChannel: 'line' | 'kakao' | 'email' | 'phone' | 'none';
  referencedColumns: string[];
  sourceFreshness: ConsultationSourceFreshness;
  sourceConfidence: ConsultationSourceConfidence;
  userAgent?: string | null;
  ipAddress?: string | null;
}): Promise<void> {
  await appendConsultationLog({
    timestamp: new Date().toISOString(),
    eventType: 'chat',
    sessionId: input.sessionId,
    locale: input.locale,
    classification: input.classification,
    riskLevel: input.riskLevel,
    shouldEscalate: input.shouldEscalate,
    nextRequiredField: input.nextRequiredField,
    suggestedHandoffChannel: input.suggestedHandoffChannel,
    referencedColumns: input.referencedColumns,
    sourceFreshness: input.sourceFreshness,
    sourceConfidence: input.sourceConfidence,
    topicKey: `${input.locale}:${input.classification}:${input.riskLevel}`,
    messageRedacted: clipText(input.message),
    userAgent: input.userAgent || null,
    ipAddress: resolveIpAddress(input.ipAddress || null),
  });
}

export async function logConsultationSubmitEvent(input: {
  eventType: 'submit_success' | 'submit_failed';
  sessionId: string;
  locale: Locale;
  classification: ConsultationCategory;
  riskLevel: ConsultationRiskLevel;
  referencedColumns: string[];
  summary?: string;
  preferredContact?: string;
  urgency?: string;
  contactPresent: boolean;
  intakeId?: string;
  success: boolean;
  failureReason?: string;
  userAgent?: string | null;
  ipAddress?: string | null;
}): Promise<void> {
  await appendConsultationLog({
    timestamp: new Date().toISOString(),
    eventType: input.eventType,
    sessionId: input.sessionId,
    locale: input.locale,
    classification: input.classification,
    riskLevel: input.riskLevel,
    referencedColumns: input.referencedColumns,
    topicKey: `${input.locale}:${input.classification}:${input.riskLevel}`,
    summaryRedacted: clipText(input.summary || ''),
    preferredContact: input.preferredContact,
    urgency: input.urgency,
    contactPresent: input.contactPresent,
    intakeId: input.intakeId,
    success: input.success,
    failureReason: input.failureReason,
    userAgent: input.userAgent || null,
    ipAddress: resolveIpAddress(input.ipAddress || null),
  });
}
