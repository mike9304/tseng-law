import type { BuilderCmsSlugConflictRule } from '@/lib/builder/cms-slug-conflict-rule';

export type CmsDynamicItemRouteMutationKind =
  | 'publish-held-back'
  | 'archive-held-back'
  | 'restore-archived'
  | 'delete-archived'
  | 'restore-deleted'
  | 'generate-missing-slugs'
  | 'repair-slug-conflicts';

export type CmsDynamicItemRouteMutationCopy = {
  readonly confirm: string;
  readonly idleLabel: string;
  readonly busyLabel: string;
  readonly error: string;
};

type CmsDynamicItemRouteMutationBodyInput = {
  readonly kind: CmsDynamicItemRouteMutationKind;
  readonly recordIds: readonly string[];
  readonly slugField: string;
  readonly sourceFieldKey: string;
  readonly slugPattern: string;
  readonly slugConflictRule: BuilderCmsSlugConflictRule;
};

export function buildCmsDynamicItemRouteMutationBody({
  kind,
  recordIds,
  slugField,
  sourceFieldKey,
  slugPattern,
  slugConflictRule,
}: CmsDynamicItemRouteMutationBodyInput): Record<string, unknown> {
  const sourceFieldPayload = sourceFieldKey ? { sourceFieldKey } : {};
  const trimmedSlugPattern = slugPattern.trim();
  const slugPatternPayload = trimmedSlugPattern ? { slugPattern: trimmedSlugPattern } : {};
  const slugConflictRulePayload = slugConflictRule === 'next-available' ? {} : { slugConflictRule };
  switch (kind) {
    case 'publish-held-back':
      return { action: 'publish', recordIds };
    case 'archive-held-back':
      return { action: 'archive', recordIds };
    case 'restore-archived':
      return { action: 'draft', recordIds };
    case 'delete-archived':
      return { action: 'delete', recordIds };
    case 'restore-deleted':
      return { action: 'restore-deleted', recordIds };
    case 'generate-missing-slugs':
      return { action: 'generate-slugs', recordIds, slugField, ...sourceFieldPayload, ...slugPatternPayload };
    case 'repair-slug-conflicts':
      return {
        action: 'repair-slug-conflicts',
        recordIds,
        slugField,
        ...sourceFieldPayload,
        ...slugPatternPayload,
        ...slugConflictRulePayload,
      };
    default:
      return assertNever(kind);
  }
}

export function cmsDynamicItemRouteMutationSupportsSlugOptions(
  kind: CmsDynamicItemRouteMutationKind,
): boolean {
  switch (kind) {
    case 'publish-held-back':
    case 'archive-held-back':
    case 'restore-archived':
    case 'delete-archived':
    case 'restore-deleted':
      return false;
    case 'generate-missing-slugs':
    case 'repair-slug-conflicts':
      return true;
    default:
      return assertNever(kind);
  }
}

export function getCmsDynamicItemRouteMutationCopy(
  kind: CmsDynamicItemRouteMutationKind,
  count: number,
  slugField: string,
): CmsDynamicItemRouteMutationCopy {
  switch (kind) {
    case 'publish-held-back':
      return {
        confirm: `Publish ${count} held-back records that already have ${slugField} values?`,
        idleLabel: `Publish held-back routes (${count})`,
        busyLabel: 'Publishing held-back records...',
        error: 'Failed to publish held-back records.',
      };
    case 'archive-held-back':
      return {
        confirm: `Archive ${count} held-back records so they stay out of public item routes?`,
        idleLabel: `Archive held-back routes (${count})`,
        busyLabel: 'Archiving held-back records...',
        error: 'Failed to archive held-back records.',
      };
    case 'restore-archived':
      return {
        confirm: `Restore ${count} archived records as drafts so they can be reviewed or published again?`,
        idleLabel: `Restore (${count})`,
        busyLabel: 'Restoring archived records...',
        error: 'Failed to restore archived records.',
      };
    case 'delete-archived':
      return {
        confirm: `Move ${count} archived records to trash so they stay recoverable?`,
        idleLabel: `Trash archived (${count})`,
        busyLabel: 'Moving archived records to trash...',
        error: 'Failed to move archived records to trash.',
      };
    case 'restore-deleted':
      return {
        confirm: `Restore ${count} deleted records as archived records?`,
        idleLabel: `Restore deleted (${count})`,
        busyLabel: 'Restoring deleted records...',
        error: 'Failed to restore deleted records.',
      };
    case 'generate-missing-slugs':
      return {
        confirm: `Generate ${slugField} values for ${count} records missing item route slugs?`,
        idleLabel: `Generate missing slugs (${count})`,
        busyLabel: 'Generating missing slugs...',
        error: 'Failed to generate missing slugs.',
      };
    case 'repair-slug-conflicts':
      return {
        confirm: `Generate unique ${slugField} values for ${count} records with duplicate item route slugs?`,
        idleLabel: `Repair slug conflicts (${count})`,
        busyLabel: 'Repairing slug conflicts...',
        error: 'Failed to repair slug conflicts.',
      };
    default:
      return assertNever(kind);
  }
}

export function getCmsDynamicItemRouteMutationDataAttributes(
  kind: CmsDynamicItemRouteMutationKind,
  pageId: string,
): Record<string, string> {
  switch (kind) {
    case 'publish-held-back':
      return { 'data-cms-dynamic-item-publish-held-back': pageId };
    case 'archive-held-back':
      return { 'data-cms-dynamic-item-archive-held-back': pageId };
    case 'restore-archived':
      return { 'data-cms-dynamic-item-restore-archived': pageId };
    case 'delete-archived':
      return { 'data-cms-dynamic-item-delete-archived': pageId };
    case 'restore-deleted':
      return { 'data-cms-dynamic-item-restore-deleted': pageId };
    case 'generate-missing-slugs':
      return { 'data-cms-dynamic-item-generate-missing-slugs': pageId };
    case 'repair-slug-conflicts':
      return { 'data-cms-dynamic-item-repair-slug-conflicts': pageId };
    default:
      return assertNever(kind);
  }
}

function assertNever(value: never): never {
  throw new Error(`Unhandled dynamic item route mutation kind: ${value}`);
}
