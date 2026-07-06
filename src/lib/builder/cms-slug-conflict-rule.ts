import { BuilderCmsValidationError } from '@/lib/builder/cms-validation-error';
import {
  isValidCmsRouteSlug,
  slugifyCmsSlugBase,
} from '@/lib/builder/cms-slug-pattern';

export const BUILDER_CMS_SLUG_CONFLICT_RULE_VALUES = [
  'next-available',
  'record-id-suffix',
] as const;

export type BuilderCmsSlugConflictRule = typeof BUILDER_CMS_SLUG_CONFLICT_RULE_VALUES[number];

export function normalizeOptionalSlugConflictRule(input: unknown): BuilderCmsSlugConflictRule | undefined {
  if (input === undefined || input === null || input === '') return undefined;
  if (input === 'next-available' || input === 'record-id-suffix') return input;
  throw new BuilderCmsValidationError('slugConflictRule must be next-available or record-id-suffix.');
}

export function resolveSlugConflictRepairBase(
  baseInput: string,
  recordId: string,
  ruleInput?: BuilderCmsSlugConflictRule,
): string {
  const rule = ruleInput ?? 'next-available';
  switch (rule) {
    case 'next-available':
      return baseInput;
    case 'record-id-suffix':
      return appendRecordIdSuffix(baseInput, recordId);
    default:
      return assertNever(rule);
  }
}

function appendRecordIdSuffix(baseInput: string, recordId: string): string {
  const base = isValidCmsRouteSlug(baseInput) ? baseInput : 'record';
  const suffix = slugifyCmsSlugBase(recordId).slice(-30).replace(/^-+|-+$/g, '') || 'record';
  const maxBaseLength = Math.max(2, 63 - suffix.length - 1);
  const candidateBase = base.slice(0, maxBaseLength).replace(/-+$/g, '') || 'record';
  const candidate = `${candidateBase}-${suffix}`;
  return isValidCmsRouteSlug(candidate) ? candidate : base;
}

function assertNever(value: never): never {
  throw new BuilderCmsValidationError(`Unhandled slug conflict rule: ${value}`);
}
