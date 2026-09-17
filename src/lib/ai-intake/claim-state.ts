import {
  AI_INTAKE_CLAIM_RECORD_VERSION,
  AI_INTAKE_CLAIM_TTL_MS,
  AI_INTAKE_SENDING_LEASE_MS,
} from '@/lib/ai-intake/constants';
import { safeEqualStrings } from '@/lib/builder/security/timing-safe';
import type { AiIntakeDeliveryStatus } from '@/lib/ai-intake/schemas';

export type AiIntakeFailureClass = 'delivery_unknown' | 'state_update_unknown';

export type AiIntakeClaimRecord = {
  v: typeof AI_INTAKE_CLAIM_RECORD_VERSION;
  intakeId: string;
  digest: string;
  status: AiIntakeDeliveryStatus;
  createdAt: string;
  updatedAt: string;
  failureClass?: AiIntakeFailureClass;
};

export function isAiIntakeClaimExpired(record: Pick<AiIntakeClaimRecord, 'createdAt'>, now: number): boolean {
  const created = Date.parse(record.createdAt);
  if (!Number.isFinite(created)) return true;
  return now - created > AI_INTAKE_CLAIM_TTL_MS;
}

export function isAiIntakeSendingFresh(
  record: Pick<AiIntakeClaimRecord, 'status' | 'updatedAt'>,
  now: number,
): boolean {
  if (record.status !== 'sending') return false;
  const updated = Date.parse(record.updatedAt);
  if (!Number.isFinite(updated)) return false;
  if (updated > now) return true;
  return now - updated <= AI_INTAKE_SENDING_LEASE_MS;
}

export function compareAiIntakeDigest(left: string, right: string): boolean {
  return safeEqualStrings(left, right);
}

export function applyAiIntakeClaimUpdate(
  existing: AiIntakeClaimRecord,
  input: {
    digest: string;
    status: Exclude<AiIntakeDeliveryStatus, 'sending'>;
    failureClass?: AiIntakeFailureClass;
  },
  now: number,
): { type: 'updated'; record: AiIntakeClaimRecord } | { type: 'conflict' } | { type: 'missing' } {
  if (isAiIntakeClaimExpired(existing, now)) return { type: 'missing' };
  if (!compareAiIntakeDigest(existing.digest, input.digest)) return { type: 'conflict' };
  if (existing.status === 'sent' || existing.status === 'failed_unknown') return { type: 'conflict' };
  if (existing.status !== 'sending') return { type: 'conflict' };
  const record: AiIntakeClaimRecord = {
    v: existing.v,
    intakeId: existing.intakeId,
    digest: existing.digest,
    status: input.status,
    createdAt: existing.createdAt,
    updatedAt: new Date(now).toISOString(),
  };
  if (input.status === 'failed_unknown' && input.failureClass) {
    record.failureClass = input.failureClass;
  }
  return { type: 'updated', record };
}
