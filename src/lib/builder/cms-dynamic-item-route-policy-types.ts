import type { BuilderCmsSlugConflictRule } from '@/lib/builder/cms-slug-conflict-rule';

export interface BuilderCmsDynamicItemRoutePolicy {
  readonly collectionId: string;
  readonly pageId: string;
  readonly policyName: string;
  readonly sourceFieldKey: string;
  readonly slugPattern: string;
  readonly slugConflictRule: BuilderCmsSlugConflictRule;
  readonly updatedAt: string;
  readonly updatedBy: string;
}

declare module '@/lib/builder/cms-types' {
  interface BuilderCmsCollectionDetail {
    dynamicItemRoutePolicies?: BuilderCmsDynamicItemRoutePolicy[];
  }
}

declare module '@/lib/builder/site/types' {
  interface BuilderSiteDocument {
    dynamicItemRoutePolicies?: BuilderCmsDynamicItemRoutePolicy[];
  }
}

const emptyTimestamp = '1970-01-01T00:00:00.000Z';

export function normalizeBuilderCmsDynamicItemRoutePolicies(
  input: unknown,
): BuilderCmsDynamicItemRoutePolicy[] {
  if (!Array.isArray(input)) return [];
  return input.flatMap((item) => {
    const policy = normalizeBuilderCmsDynamicItemRoutePolicy(item);
    return policy ? [policy] : [];
  });
}

function normalizeBuilderCmsDynamicItemRoutePolicy(
  input: unknown,
): BuilderCmsDynamicItemRoutePolicy | null {
  if (!isRecord(input)) return null;
  const collectionId = normalizePolicyId(input['collectionId']);
  const pageId = normalizePolicyId(input['pageId']);
  if (!collectionId || !pageId) return null;
  return {
    collectionId,
    pageId,
    policyName: normalizeStoredPolicyName(input['policyName']),
    sourceFieldKey: normalizeStoredSourceFieldKey(input['sourceFieldKey']),
    slugPattern: normalizeStoredSlugPattern(input['slugPattern']),
    slugConflictRule: normalizeStoredSlugConflictRule(input['slugConflictRule']),
    updatedAt: normalizeStoredTimestamp(input['updatedAt']),
    updatedBy: normalizeStoredActorLabel(input['updatedBy']),
  };
}

function isRecord(input: unknown): input is Readonly<Record<string, unknown>> {
  return Boolean(input) && typeof input === 'object' && !Array.isArray(input);
}

function normalizePolicyId(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const value = input.trim();
  return /^[a-z][a-z0-9-]{1,127}$/.test(value) ? value : null;
}

function normalizeStoredSourceFieldKey(input: unknown): string {
  if (typeof input !== 'string') return '';
  const value = input.trim();
  return /^[A-Za-z][A-Za-z0-9_]{0,62}$/.test(value) ? value : '';
}

function normalizeStoredPolicyName(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, 80);
}

function normalizeStoredSlugPattern(input: unknown): string {
  if (typeof input !== 'string') return '';
  const value = input.trim();
  return value.length <= 160 ? value : '';
}

function normalizeStoredSlugConflictRule(input: unknown): BuilderCmsSlugConflictRule {
  return input === 'record-id-suffix' ? 'record-id-suffix' : 'next-available';
}

function normalizeStoredTimestamp(input: unknown): string {
  if (typeof input !== 'string') return emptyTimestamp;
  const time = Date.parse(input);
  return Number.isFinite(time) ? input : emptyTimestamp;
}

function normalizeStoredActorLabel(input: unknown): string {
  if (typeof input !== 'string') return 'admin';
  return input.trim().slice(0, 120) || 'admin';
}
