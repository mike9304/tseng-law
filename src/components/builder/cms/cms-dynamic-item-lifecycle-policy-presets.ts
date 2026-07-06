import {
  buildCmsDynamicItemRouteMutationBody,
  type CmsDynamicItemRouteMutationKind,
} from '@/components/builder/cms/cms-dynamic-item-route-mutation-config';
import type { LinkedDynamicItemRouteCoverage } from '@/components/builder/cms/cms-dynamic-linked-pages-model';
import type { BuilderCmsSlugConflictRule } from '@/lib/builder/cms-slug-conflict-rule';

export type CmsDynamicItemLifecyclePolicyPresetKind =
  | 'prepare-public-routes'
  | 'quarantine-held-back'
  | 'recover-archived';

export type CmsDynamicItemLifecyclePolicyStep = {
  readonly kind: CmsDynamicItemRouteMutationKind;
  readonly recordIds: readonly string[];
};

export type CmsDynamicItemLifecyclePolicySlugOptions = {
  readonly sourceFieldKey: string;
  readonly slugPattern: string;
  readonly slugConflictRule: BuilderCmsSlugConflictRule;
};

export type CmsDynamicItemLifecyclePolicySavedStatus = Partial<CmsDynamicItemLifecyclePolicySlugOptions> & {
  readonly policyName?: string;
  readonly pageId?: string;
  readonly updatedAt?: string;
  readonly updatedBy?: string;
};

export type CmsDynamicItemLifecyclePolicyTemplate = CmsDynamicItemLifecyclePolicySlugOptions & {
  readonly pageId: string;
  readonly policyName: string;
};

export type CmsDynamicItemLifecyclePolicyTemplateSource = CmsDynamicItemLifecyclePolicySavedStatus & {
  readonly collectionId?: string;
};

export type CmsDynamicItemLifecyclePolicyStepBodyInput = CmsDynamicItemLifecyclePolicySlugOptions & {
  readonly step: CmsDynamicItemLifecyclePolicyStep;
  readonly slugField: string;
};

export type CmsDynamicItemLifecyclePolicyPreset = {
  readonly kind: CmsDynamicItemLifecyclePolicyPresetKind;
  readonly confirm: string;
  readonly idleLabel: string;
  readonly busyLabel: string;
  readonly error: string;
  readonly steps: readonly CmsDynamicItemLifecyclePolicyStep[];
};

export type CmsDynamicItemLifecyclePolicyToolbarVisibilityInput = {
  readonly presets: readonly CmsDynamicItemLifecyclePolicyPreset[];
  readonly savedPolicy?: CmsDynamicItemLifecyclePolicySavedStatus;
  readonly reusablePolicyTemplates?: readonly CmsDynamicItemLifecyclePolicyTemplate[];
};

export function resolveCmsDynamicItemLifecyclePolicyPresets(
  coverage: LinkedDynamicItemRouteCoverage,
): readonly CmsDynamicItemLifecyclePolicyPreset[] {
  return [
    buildPreparePublicRoutesPreset(coverage),
    buildQuarantineHeldBackPreset(coverage),
    buildRecoverArchivedPreset(coverage),
  ].filter((preset): preset is CmsDynamicItemLifecyclePolicyPreset => preset !== null);
}

export function shouldShowCmsDynamicItemLifecyclePolicyToolbar({
  presets,
  savedPolicy,
  reusablePolicyTemplates = [],
}: CmsDynamicItemLifecyclePolicyToolbarVisibilityInput): boolean {
  return presets.length > 0 || Boolean(savedPolicy) || reusablePolicyTemplates.length > 0;
}

export function resolveCmsDynamicItemReusablePolicyTemplates(
  policies: readonly CmsDynamicItemLifecyclePolicyTemplateSource[],
  currentPageId: string,
): readonly CmsDynamicItemLifecyclePolicyTemplate[] {
  return policies.flatMap((policy) => {
    const pageId = policy.pageId?.trim();
    const policyName = policy.policyName?.trim();
    const sourceFieldKey = policy.sourceFieldKey?.trim();
    const slugPattern = policy.slugPattern?.trim();
    const slugConflictRule = policy.slugConflictRule;
    if (!pageId || pageId === currentPageId || !policyName) return [];
    if (!sourceFieldKey || !slugPattern || !slugConflictRule) return [];
    return [{
      pageId,
      policyName,
      sourceFieldKey,
      slugPattern,
      slugConflictRule,
    }];
  });
}

export function getCmsDynamicItemLifecyclePolicyDataAttributes(
  kind: CmsDynamicItemLifecyclePolicyPresetKind,
  pageId: string,
): Record<string, string> {
  switch (kind) {
    case 'prepare-public-routes':
      return { 'data-cms-dynamic-item-policy-prepare-public-routes': pageId };
    case 'quarantine-held-back':
      return { 'data-cms-dynamic-item-policy-quarantine-held-back': pageId };
    case 'recover-archived':
      return { 'data-cms-dynamic-item-policy-recover-archived': pageId };
    default:
      return assertNever(kind);
  }
}

export function buildCmsDynamicItemLifecyclePolicyStepBody({
  step,
  slugField,
  sourceFieldKey,
  slugPattern,
  slugConflictRule,
}: CmsDynamicItemLifecyclePolicyStepBodyInput): Record<string, unknown> {
  return buildCmsDynamicItemRouteMutationBody({
    kind: step.kind,
    recordIds: step.recordIds,
    slugField,
    sourceFieldKey,
    slugPattern,
    slugConflictRule,
  });
}

export function formatCmsDynamicItemLifecyclePolicySavedStatus(
  policy: CmsDynamicItemLifecyclePolicySavedStatus | null | undefined,
): string | null {
  if (!policy?.updatedAt) return null;
  const savedAt = new Date(policy.updatedAt);
  if (!Number.isFinite(savedAt.getTime())) return null;
  const actor = policy.updatedBy?.trim() || 'admin';
  const savedAtUtc = savedAt.toISOString().slice(0, 16).replace('T', ' ');
  return `Last saved by ${actor} on ${savedAtUtc} UTC`;
}

function buildPreparePublicRoutesPreset(
  coverage: LinkedDynamicItemRouteCoverage,
): CmsDynamicItemLifecyclePolicyPreset | null {
  const steps = [
    ...buildPolicyStep('generate-missing-slugs', coverage.missingSlugRecordIds),
    ...buildPolicyStep('repair-slug-conflicts', coverage.slugConflictRecordIds),
    ...buildPolicyStep('publish-held-back', coverage.publishableHeldBackRecordIds),
  ] satisfies readonly CmsDynamicItemLifecyclePolicyStep[];
  if (!steps.length) return null;
  const recordCount = countPolicyRecords(steps);
  return {
    kind: 'prepare-public-routes',
    confirm: `Run ${describePolicySteps(steps, coverage.slugField)} for ${recordCount} route records?`,
    idleLabel: `Prepare public routes (${recordCount})`,
    busyLabel: 'Preparing public routes...',
    error: 'Failed to prepare public item routes.',
    steps,
  };
}

function buildQuarantineHeldBackPreset(
  coverage: LinkedDynamicItemRouteCoverage,
): CmsDynamicItemLifecyclePolicyPreset | null {
  const steps = buildPolicyStep('archive-held-back', coverage.archivableHeldBackRecordIds);
  if (!steps.length) return null;
  const recordCount = countPolicyRecords(steps);
  return {
    kind: 'quarantine-held-back',
    confirm: `Archive ${recordCount} held-back records so they stay out of public item routes?`,
    idleLabel: `Quarantine held-back (${recordCount})`,
    busyLabel: 'Quarantining held-back records...',
    error: 'Failed to quarantine held-back records.',
    steps,
  };
}

function buildRecoverArchivedPreset(
  coverage: LinkedDynamicItemRouteCoverage,
): CmsDynamicItemLifecyclePolicyPreset | null {
  const steps = buildPolicyStep('restore-archived', coverage.restorableArchivedRecordIds);
  if (!steps.length) return null;
  const recordCount = countPolicyRecords(steps);
  return {
    kind: 'recover-archived',
    confirm: `Restore ${recordCount} archived records as drafts for review or republish?`,
    idleLabel: `Recover archived (${recordCount})`,
    busyLabel: 'Recovering archived records...',
    error: 'Failed to recover archived records.',
    steps,
  };
}

function buildPolicyStep(
  kind: CmsDynamicItemRouteMutationKind,
  recordIds: readonly string[],
): readonly CmsDynamicItemLifecyclePolicyStep[] {
  return recordIds.length ? [{ kind, recordIds }] : [];
}

function countPolicyRecords(steps: readonly CmsDynamicItemLifecyclePolicyStep[]): number {
  return steps.reduce((total, step) => total + step.recordIds.length, 0);
}

function describePolicySteps(
  steps: readonly CmsDynamicItemLifecyclePolicyStep[],
  slugField: string,
): string {
  return steps.map((step) => describePolicyStep(step.kind, slugField)).join(', then ');
}

function describePolicyStep(kind: CmsDynamicItemRouteMutationKind, slugField: string): string {
  switch (kind) {
    case 'generate-missing-slugs':
      return `generate missing ${slugField} values`;
    case 'repair-slug-conflicts':
      return `repair duplicate ${slugField} values`;
    case 'publish-held-back':
      return 'publish held-back records';
    case 'archive-held-back':
      return 'archive held-back records';
    case 'restore-archived':
      return 'restore archived records';
    case 'delete-archived':
      return 'move archived records to trash';
    case 'restore-deleted':
      return 'restore deleted records';
    default:
      return assertNever(kind);
  }
}

function assertNever(value: never): never {
  throw new Error(`Unhandled dynamic item lifecycle policy value: ${value}`);
}
