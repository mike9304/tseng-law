'use client';

import { useState, type CSSProperties } from 'react';
import { z } from 'zod';
import { CmsDynamicItemLifecyclePolicyOptions } from '@/components/builder/cms/CmsDynamicItemLifecyclePolicyOptions';
import { CmsDynamicItemScheduledPolicyControls } from '@/components/builder/cms/CmsDynamicItemScheduledPolicyControls';
import {
  buildCmsDynamicItemLifecyclePolicyStepBody,
  formatCmsDynamicItemLifecyclePolicySavedStatus,
  getCmsDynamicItemLifecyclePolicyDataAttributes,
  resolveCmsDynamicItemLifecyclePolicyPresets,
  shouldShowCmsDynamicItemLifecyclePolicyToolbar,
  type CmsDynamicItemLifecyclePolicyPreset,
  type CmsDynamicItemLifecyclePolicyPresetKind,
  type CmsDynamicItemLifecyclePolicySavedStatus,
  type CmsDynamicItemLifecyclePolicySlugOptions,
  type CmsDynamicItemLifecyclePolicyStep,
  type CmsDynamicItemLifecyclePolicyTemplate,
} from '@/components/builder/cms/cms-dynamic-item-lifecycle-policy-presets';
import type { LinkedDynamicItemRouteCoverage } from '@/components/builder/cms/cms-dynamic-linked-pages-model';
import type { BuilderCmsSlugConflictRule } from '@/lib/builder/cms-slug-conflict-rule';
import type { BuilderCmsSlugSourceField } from '@/lib/builder/cms-slug-source-fields';
import type { Locale } from '@/lib/locales';

type CmsDynamicItemLifecyclePolicyPresetsProps = {
  readonly locale: Locale;
  readonly siteId: string;
  readonly collectionId: string;
  readonly pageId: string;
  readonly coverage: LinkedDynamicItemRouteCoverage;
  readonly sourceFields: readonly BuilderCmsSlugSourceField[];
  readonly initialPolicyOptions?: CmsDynamicItemLifecyclePolicySavedStatus;
  readonly reusablePolicyTemplates?: readonly CmsDynamicItemLifecyclePolicyTemplate[];
  readonly previewRecordId?: string;
  readonly previewFields?: Readonly<Record<string, unknown>>;
};

type PostLifecyclePolicyStepInput = CmsDynamicItemLifecyclePolicySlugOptions & {
  readonly locale: Locale;
  readonly siteId: string;
  readonly collectionId: string;
  readonly slugField: string;
  readonly step: CmsDynamicItemLifecyclePolicyStep;
  readonly errorMessage: string;
};

const bulkMutationResponseSchema = z.object({
  ok: z.boolean().optional(),
  updated: z.number().optional(),
  deleted: z.number().optional(),
  generated: z.number().optional(),
  repaired: z.number().optional(),
  error: z.string().optional(),
  issues: z.array(z.string()).optional(),
  missingRecordIds: z.array(z.string()).optional(),
  skippedRecordIds: z.array(z.string()).optional(),
});

export function CmsDynamicItemLifecyclePolicyPresets({
  locale,
  siteId,
  collectionId,
  pageId,
  coverage,
  sourceFields,
  initialPolicyOptions,
  reusablePolicyTemplates = [],
  previewRecordId,
  previewFields,
}: CmsDynamicItemLifecyclePolicyPresetsProps) {
  const presets = resolveCmsDynamicItemLifecyclePolicyPresets(coverage);
  const [busyPolicy, setBusyPolicy] = useState<CmsDynamicItemLifecyclePolicyPresetKind | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [policyName, setPolicyName] = useState(initialPolicyOptions?.policyName ?? '');
  const [sourceFieldKey, setSourceFieldKey] = useState(initialPolicyOptions?.sourceFieldKey ?? '');
  const [slugPattern, setSlugPattern] = useState(initialPolicyOptions?.slugPattern ?? '');
  const [slugConflictRule, setSlugConflictRule] = useState<BuilderCmsSlugConflictRule>(
    initialPolicyOptions?.slugConflictRule ?? 'next-available',
  );
  if (!shouldShowCmsDynamicItemLifecyclePolicyToolbar({
    presets,
    savedPolicy: initialPolicyOptions,
    reusablePolicyTemplates,
  })) return null;
  const hasPreparePolicy = presets.some((preset) => preset.kind === 'prepare-public-routes');
  const hasPolicyOptions = hasPreparePolicy || Boolean(initialPolicyOptions) || reusablePolicyTemplates.length > 0;
  const savedStatusText = formatCmsDynamicItemLifecyclePolicySavedStatus(initialPolicyOptions);

  function applyPolicyTemplate(template: CmsDynamicItemLifecyclePolicyTemplate) {
    setPolicyName(template.policyName);
    setSourceFieldKey(template.sourceFieldKey);
    setSlugPattern(template.slugPattern);
    setSlugConflictRule(template.slugConflictRule);
  }

  async function runPolicyPreset(preset: CmsDynamicItemLifecyclePolicyPreset) {
    if (!window.confirm(preset.confirm)) return;
    setBusyPolicy(preset.kind);
    setError(null);
    try {
      for (const step of preset.steps) {
        await postLifecyclePolicyStep({
          locale,
          siteId,
          collectionId,
          slugField: coverage.slugField,
          step,
          errorMessage: preset.error,
          sourceFieldKey,
          slugPattern,
          slugConflictRule,
        });
      }
      window.location.reload();
    } catch (policyError) {
      setError(policyError instanceof Error ? policyError.message : preset.error);
      setBusyPolicy(null);
    }
  }

  return (
    <div style={policyToolbarStyle} data-cms-dynamic-item-lifecycle-policies={pageId}>
      <span style={policyLabelStyle}>{presets.length ? 'Lifecycle presets' : 'Lifecycle policy'}</span>
      {hasPolicyOptions ? (
        <CmsDynamicItemLifecyclePolicyOptions
          busy={busyPolicy !== null}
          collectionId={collectionId}
          locale={locale}
          pageId={pageId}
          previewFields={previewFields}
          previewRecordId={previewRecordId}
          policyName={policyName}
          reusablePolicyTemplates={reusablePolicyTemplates}
          savedStatusText={savedStatusText ?? undefined}
          siteId={siteId}
          slugConflictRule={slugConflictRule}
          slugPattern={slugPattern}
          sourceFieldKey={sourceFieldKey}
          sourceFields={sourceFields}
          onPolicyNameChange={setPolicyName}
          onPolicyTemplateApply={applyPolicyTemplate}
          onSlugConflictRuleChange={setSlugConflictRule}
          onSlugPatternChange={setSlugPattern}
          onSourceFieldKeyChange={setSourceFieldKey}
        />
      ) : null}
      {hasPolicyOptions ? (
        <CmsDynamicItemScheduledPolicyControls
          busy={busyPolicy !== null}
          collectionId={collectionId}
          locale={locale}
          pageId={pageId}
          policyName={policyName}
          siteId={siteId}
          slugConflictRule={slugConflictRule}
          slugPattern={slugPattern}
          sourceFieldKey={sourceFieldKey}
        />
      ) : null}
      {presets.map((preset) => {
        const isBusy = busyPolicy === preset.kind;
        return (
          <button
            key={preset.kind}
            type="button"
            className="builder-action-btn"
            disabled={busyPolicy !== null}
            onClick={() => { void runPolicyPreset(preset); }}
            style={policyButtonStyle}
            {...getCmsDynamicItemLifecyclePolicyDataAttributes(preset.kind, pageId)}
          >
            {isBusy ? preset.busyLabel : preset.idleLabel}
          </button>
        );
      })}
      {error ? <span role="alert" style={errorStyle}>{error}</span> : null}
    </div>
  );
}

async function postLifecyclePolicyStep({
  locale,
  siteId,
  collectionId,
  slugField,
  step,
  errorMessage,
  sourceFieldKey,
  slugPattern,
  slugConflictRule,
}: PostLifecyclePolicyStepInput): Promise<void> {
  const response = await fetch(
    `/api/builder/sites/${encodeURIComponent(siteId)}/collections/${encodeURIComponent(collectionId)}/records/bulk?locale=${locale}`,
    {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildCmsDynamicItemLifecyclePolicyStepBody({
        step,
        slugField,
        sourceFieldKey,
        slugPattern,
        slugConflictRule,
      })),
    },
  );
  const parsed = bulkMutationResponseSchema.safeParse(await response.json());
  if (!parsed.success) {
    throw new Error('Unexpected CMS bulk lifecycle policy response.');
  }
  const result = parsed.data;
  if (!response.ok || !result.ok) {
    throw new Error(result.issues?.join('\n') ?? result.error ?? errorMessage);
  }
}

const policyToolbarStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 6,
  marginTop: 6,
  maxWidth: '100%',
} satisfies CSSProperties;

const policyLabelStyle = {
  color: '#475569',
  fontSize: 12,
  fontWeight: 700,
  textTransform: 'uppercase',
} satisfies CSSProperties;

const policyButtonStyle = {
  maxWidth: '100%',
  lineHeight: 1.2,
  textAlign: 'center',
  whiteSpace: 'normal',
} satisfies CSSProperties;

const errorStyle = {
  display: 'block',
  color: '#b91c1c',
  fontSize: 13,
  fontWeight: 700,
} satisfies CSSProperties;
