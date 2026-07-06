'use client';

import { useState, type CSSProperties } from 'react';
import { z } from 'zod';
import { CmsDynamicItemLifecyclePolicyTemplateSelect } from '@/components/builder/cms/CmsDynamicItemLifecyclePolicyTemplateSelect';
import { CmsDynamicItemSlugMutationOptions } from '@/components/builder/cms/CmsDynamicItemSlugMutationOptions';
import {
  formatCmsDynamicItemLifecyclePolicySavedStatus,
  type CmsDynamicItemLifecyclePolicyTemplate,
} from '@/components/builder/cms/cms-dynamic-item-lifecycle-policy-presets';
import type { BuilderCmsSlugConflictRule } from '@/lib/builder/cms-slug-conflict-rule';
import type { BuilderCmsSlugSourceField } from '@/lib/builder/cms-slug-source-fields';
import type { Locale } from '@/lib/locales';

type CmsDynamicItemLifecyclePolicyOptionsProps = {
  readonly busy: boolean;
  readonly locale: Locale;
  readonly siteId: string;
  readonly collectionId: string;
  readonly pageId: string;
  readonly sourceFields: readonly BuilderCmsSlugSourceField[];
  readonly policyName: string;
  readonly sourceFieldKey: string;
  readonly slugPattern: string;
  readonly slugConflictRule: BuilderCmsSlugConflictRule;
  readonly savedStatusText?: string;
  readonly reusablePolicyTemplates?: readonly CmsDynamicItemLifecyclePolicyTemplate[];
  readonly previewRecordId?: string;
  readonly previewFields?: Readonly<Record<string, unknown>>;
  readonly onPolicyTemplateApply: (template: CmsDynamicItemLifecyclePolicyTemplate) => void;
  readonly onPolicyNameChange: (nextValue: string) => void;
  readonly onSourceFieldKeyChange: (nextValue: string) => void;
  readonly onSlugPatternChange: (nextValue: string) => void;
  readonly onSlugConflictRuleChange: (nextValue: BuilderCmsSlugConflictRule) => void;
};

const routePolicySavedStatusSchema = z.object({
  policyName: z.string().optional(),
  updatedAt: z.string(),
  updatedBy: z.string(),
});

const routePolicySaveResponseSchema = z.object({
  ok: z.boolean().optional(),
  error: z.string().optional(),
  issues: z.array(z.string()).optional(),
  policy: routePolicySavedStatusSchema.optional(),
});

export function CmsDynamicItemLifecyclePolicyOptions({
  busy,
  locale,
  siteId,
  collectionId,
  pageId,
  sourceFields,
  policyName,
  sourceFieldKey,
  slugPattern,
  slugConflictRule,
  savedStatusText,
  reusablePolicyTemplates = [],
  previewRecordId,
  previewFields,
  onPolicyTemplateApply,
  onPolicyNameChange,
  onSourceFieldKeyChange,
  onSlugPatternChange,
  onSlugConflictRuleChange,
}: CmsDynamicItemLifecyclePolicyOptionsProps) {
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [lastSavedStatusText, setLastSavedStatusText] = useState<string | null>(savedStatusText ?? null);
  if (!sourceFields.length) return null;

  async function savePolicyOptions() {
    setSaving(true);
    setSaveMessage(null);
    setSaveError(null);
    try {
      const params = new URLSearchParams({ locale });
      const response = await fetch(
        `/api/builder/sites/${encodeURIComponent(siteId)}/collections/${encodeURIComponent(collectionId)}/dynamic-item-route-policies/${encodeURIComponent(pageId)}?${params.toString()}`,
        {
          method: 'PUT',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            policyName,
            sourceFieldKey,
            slugPattern,
            slugConflictRule,
          }),
        },
      );
      const parsed = routePolicySaveResponseSchema.safeParse(await response.json());
      if (!parsed.success) {
        throw new Error('Unexpected dynamic item route policy response.');
      }
      if (!response.ok || !parsed.data.ok) {
        throw new Error(parsed.data.issues?.join('\n') ?? parsed.data.error ?? 'Failed to save route policy.');
      }
      setSaveMessage('Policy saved');
      setLastSavedStatusText(
        formatCmsDynamicItemLifecyclePolicySavedStatus(parsed.data.policy) ?? lastSavedStatusText,
      );
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save route policy.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <span style={optionsStyle} data-cms-dynamic-item-policy-options={pageId}>
      <CmsDynamicItemLifecyclePolicyTemplateSelect
        busy={busy || saving}
        pageId={pageId}
        templates={reusablePolicyTemplates}
        onPolicyTemplateApply={onPolicyTemplateApply}
      />
      <label style={fieldStyle}>
        <span style={labelStyle}>Policy name</span>
        <input
          data-cms-dynamic-item-policy-name={pageId}
          disabled={busy || saving}
          maxLength={80}
          placeholder="Public route policy"
          spellCheck={false}
          type="text"
          value={policyName}
          onChange={(event) => onPolicyNameChange(event.currentTarget.value)}
        />
      </label>
      <CmsDynamicItemSlugMutationOptions
        busy={busy || saving}
        pageId={pageId}
        previewFields={previewFields}
        previewRecordId={previewRecordId}
        showConflictRule
        slugConflictRule={slugConflictRule}
        slugPattern={slugPattern}
        sourceFieldKey={sourceFieldKey}
        sourceFields={sourceFields}
        onSlugConflictRuleChange={onSlugConflictRuleChange}
        onSlugPatternChange={onSlugPatternChange}
        onSourceFieldKeyChange={onSourceFieldKeyChange}
      />
      <button
        type="button"
        className="builder-action-btn"
        data-cms-dynamic-item-policy-save={pageId}
        disabled={busy || saving}
        onClick={() => { void savePolicyOptions(); }}
        style={saveButtonStyle}
      >
        {saving ? 'Saving policy...' : 'Save policy'}
      </button>
      {saveMessage ? (
        <span style={statusStyle} data-cms-dynamic-item-policy-save-status={pageId}>
          {saveMessage}
        </span>
      ) : null}
      {lastSavedStatusText ? (
        <span style={savedStatusStyle} data-cms-dynamic-item-policy-saved-summary={pageId}>
          {lastSavedStatusText}
        </span>
      ) : null}
      {saveError ? (
        <span role="alert" style={errorStyle} data-cms-dynamic-item-policy-save-error={pageId}>
          {saveError}
        </span>
      ) : null}
    </span>
  );
}

const optionsStyle = {
  display: 'inline-flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 6,
  maxWidth: '100%',
} satisfies CSSProperties;

const fieldStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
} satisfies CSSProperties;

const labelStyle = {
  color: '#64748b',
  fontSize: 12,
  fontWeight: 700,
} satisfies CSSProperties;

const saveButtonStyle = {
  maxWidth: '100%',
  lineHeight: 1.2,
  textAlign: 'center',
  whiteSpace: 'normal',
} satisfies CSSProperties;

const statusStyle = {
  color: '#047857',
  fontSize: 12,
  fontWeight: 800,
} satisfies CSSProperties;

const savedStatusStyle = {
  color: '#64748b',
  fontSize: 12,
  fontWeight: 700,
} satisfies CSSProperties;

const errorStyle = {
  color: '#b91c1c',
  fontSize: 12,
  fontWeight: 800,
} satisfies CSSProperties;
