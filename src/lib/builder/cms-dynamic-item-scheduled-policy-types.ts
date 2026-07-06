import type { BuilderCmsSlugConflictRule } from '@/lib/builder/cms-slug-conflict-rule';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const CMS_DYNAMIC_ITEM_SCHEDULED_POLICY_KINDS = ['prepare-public-routes'] as const;

export type CmsDynamicItemScheduledPolicyKind = typeof CMS_DYNAMIC_ITEM_SCHEDULED_POLICY_KINDS[number];

export type CmsDynamicItemScheduledPolicyStatus =
  | 'scheduled'
  | 'running'
  | 'applied'
  | 'failed'
  | 'cancelled';

export type CmsDynamicItemScheduledPolicyOptions = {
  readonly policyName: string;
  readonly sourceFieldKey: string;
  readonly slugPattern: string;
  readonly slugConflictRule: BuilderCmsSlugConflictRule;
};

export type CmsDynamicItemScheduledPolicyJob = {
  readonly jobId: string;
  readonly siteId: string;
  readonly locale: Locale;
  readonly collectionId: string;
  readonly pageId: string;
  readonly kind: CmsDynamicItemScheduledPolicyKind;
  readonly scheduledAt: string;
  readonly status: CmsDynamicItemScheduledPolicyStatus;
  readonly attempts: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly requestedBy?: string;
  readonly lastError?: string;
  readonly policy: CmsDynamicItemScheduledPolicyOptions;
  readonly generated?: number;
  readonly repaired?: number;
  readonly published?: number;
};

export type ScheduleCmsDynamicItemPolicyInput = {
  readonly siteId: string;
  readonly locale: Locale;
  readonly collectionId: string;
  readonly pageId: string;
  readonly kind: CmsDynamicItemScheduledPolicyKind;
  readonly scheduledAt: string;
  readonly requestedBy?: string;
  readonly policy: CmsDynamicItemScheduledPolicyOptions;
};

export type CmsDynamicItemScheduledPolicyRunResult = {
  readonly checked: number;
  readonly due: number;
  readonly applied: number;
  readonly failed: number;
  readonly skipped: number;
  readonly jobs: readonly CmsDynamicItemScheduledPolicyJob[];
};

export function normalizeCmsDynamicItemScheduledPolicyJob(
  input: unknown,
): CmsDynamicItemScheduledPolicyJob | null {
  if (!isRecord(input)) return null;
  const jobId = normalizeJobId(input['jobId']);
  const siteId = normalizeId(input['siteId']);
  const collectionId = normalizeId(input['collectionId']);
  const pageId = normalizeId(input['pageId']);
  const kind = normalizeKind(input['kind']);
  const status = normalizeStatus(input['status']);
  const scheduledAt = normalizeTimestamp(input['scheduledAt']);
  const createdAt = normalizeTimestamp(input['createdAt']);
  const updatedAt = normalizeTimestamp(input['updatedAt']);
  const policy = normalizePolicyOptions(input['policy']);
  if (!jobId || !siteId || !collectionId || !pageId || !kind || !status || !scheduledAt || !policy) return null;
  return {
    jobId,
    siteId,
    locale: normalizeLocale(typeof input['locale'] === 'string' ? input['locale'] : undefined),
    collectionId,
    pageId,
    kind,
    scheduledAt,
    status,
    attempts: normalizeCount(input['attempts']),
    createdAt: createdAt ?? scheduledAt,
    updatedAt: updatedAt ?? scheduledAt,
    ...(typeof input['requestedBy'] === 'string' ? { requestedBy: input['requestedBy'].trim().slice(0, 120) } : {}),
    ...(typeof input['lastError'] === 'string' ? { lastError: input['lastError'].trim().slice(0, 240) } : {}),
    policy,
    ...optionalCount('generated', input['generated']),
    ...optionalCount('repaired', input['repaired']),
    ...optionalCount('published', input['published']),
  };
}

function normalizePolicyOptions(input: unknown): CmsDynamicItemScheduledPolicyOptions | null {
  if (!isRecord(input)) return null;
  return {
    policyName: typeof input['policyName'] === 'string' ? input['policyName'].trim().slice(0, 80) : '',
    sourceFieldKey: normalizeSourceField(input['sourceFieldKey']),
    slugPattern: typeof input['slugPattern'] === 'string' ? input['slugPattern'].trim().slice(0, 160) : '',
    slugConflictRule: input['slugConflictRule'] === 'record-id-suffix' ? 'record-id-suffix' : 'next-available',
  };
}

function isRecord(input: unknown): input is Readonly<Record<string, unknown>> {
  return Boolean(input) && typeof input === 'object' && !Array.isArray(input);
}

function normalizeId(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const value = input.trim();
  return /^[a-z][a-z0-9-]{1,127}$/.test(value) ? value : null;
}

function normalizeJobId(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const value = input.trim();
  return /^[A-Za-z0-9_.-]{1,160}$/.test(value) ? value : null;
}

function normalizeSourceField(input: unknown): string {
  if (typeof input !== 'string') return '';
  const value = input.trim();
  return /^[A-Za-z][A-Za-z0-9_]{0,62}$/.test(value) ? value : '';
}

function normalizeKind(input: unknown): CmsDynamicItemScheduledPolicyKind | null {
  return input === 'prepare-public-routes' ? input : null;
}

function normalizeStatus(input: unknown): CmsDynamicItemScheduledPolicyStatus | null {
  switch (input) {
    case 'scheduled':
    case 'running':
    case 'applied':
    case 'failed':
    case 'cancelled':
      return input;
    default:
      return null;
  }
}

function normalizeTimestamp(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const timestamp = Date.parse(input);
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : null;
}

function normalizeCount(input: unknown): number {
  return typeof input === 'number' && Number.isFinite(input) ? Math.max(0, Math.floor(input)) : 0;
}

function optionalCount(key: 'generated' | 'repaired' | 'published', input: unknown): Partial<Record<typeof key, number>> {
  return typeof input === 'number' && Number.isFinite(input) ? { [key]: Math.max(0, Math.floor(input)) } : {};
}
