import { appendConsultationLogLine } from '@/lib/consultation/log-storage';
import { AI_INTAKE_AUDIT_TIMEOUT_MS, AI_INTAKE_DIGEST_LOG_PREFIX_LENGTH } from '@/lib/ai-intake/constants';
import { AI_INTAKE_CATEGORIES, type AiIntakeCategory, type AiIntakeLocale } from '@/lib/ai-intake/schemas';

const AI_INTAKE_CATEGORY_SET: ReadonlySet<string> = new Set(AI_INTAKE_CATEGORIES);

function allowlistedAiIntakeCategory(value: unknown): AiIntakeCategory | undefined {
  return typeof value === 'string' && AI_INTAKE_CATEGORY_SET.has(value)
    ? value as AiIntakeCategory
    : undefined;
}

export type AiIntakeLogStage =
  | 'ai_intake_submit_sent'
  | 'ai_intake_submit_duplicate'
  | 'ai_intake_submit_failed_unknown'
  | 'ai_intake_submit_rejected';

async function awaitAiIntakeAuditBound(task: Promise<void>): Promise<void> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<void>((resolve) => {
    timer = setTimeout(() => {
      resolve();
    }, AI_INTAKE_AUDIT_TIMEOUT_MS);
  });
  const guarded = task.then(
    () => {
      if (timer !== undefined) clearTimeout(timer);
    },
    () => {
      if (timer !== undefined) clearTimeout(timer);
    },
  );
  await Promise.race([guarded, timeout]);
}

export async function logAiIntakeEvent(input: {
  stage: AiIntakeLogStage;
  clientId?: string;
  intakeId?: string;
  digest?: string;
  status?: string;
  durationMs?: number;
  locale?: AiIntakeLocale;
  aiIntakeCategory?: AiIntakeCategory;
}): Promise<void> {
  const aiIntakeCategory = allowlistedAiIntakeCategory(input.aiIntakeCategory);
  const record = {
    timestamp: new Date().toISOString(),
    eventType: 'funnel',
    funnelStage: input.stage,
    sessionId: input.clientId ?? 'ai-intake',
    locale: input.locale ?? 'en',
    intakeId: input.intakeId,
    ...(aiIntakeCategory ? { aiIntakeCategory } : {}),
    metadataRedacted: JSON.stringify({
      clientId: input.clientId,
      digestPrefix: input.digest ? input.digest.slice(0, AI_INTAKE_DIGEST_LOG_PREFIX_LENGTH) : undefined,
      status: input.status,
      durationMs: input.durationMs,
    }),
  };

  const write = appendConsultationLogLine('events', record.timestamp.slice(0, 10), JSON.stringify(record)).catch(
    () => {
      // Contained: never change caller outcome, never log the underlying error text.
    },
  );
  await awaitAiIntakeAuditBound(write);
}
