'use client';

import { useState, type ChangeEvent, type CSSProperties } from 'react';
import { z } from 'zod';
import type {
  CmsDynamicItemLifecyclePolicyTemplate,
} from '@/components/builder/cms/cms-dynamic-item-lifecycle-policy-presets';
import type { CmsDynamicItemPolicyRolloutTarget } from '@/components/builder/cms/cms-dynamic-item-policy-rollout';
import type { Locale } from '@/lib/locales';

type CmsDynamicItemPolicyRolloutPanelProps = {
  readonly locale: Locale;
  readonly siteId: string;
  readonly collectionId: string;
  readonly templates: readonly CmsDynamicItemLifecyclePolicyTemplate[];
  readonly targets: readonly CmsDynamicItemPolicyRolloutTarget[];
};

const routePolicySaveResponseSchema = z.object({
  ok: z.boolean().optional(),
  error: z.string().optional(),
  issues: z.array(z.string()).optional(),
});

export function CmsDynamicItemPolicyRolloutPanel({
  locale,
  siteId,
  collectionId,
  templates,
  targets,
}: CmsDynamicItemPolicyRolloutPanelProps) {
  const [selectedTemplatePageId, setSelectedTemplatePageId] = useState('');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  if (!templates.length || !targets.length) return null;

  const selectedTemplate = templates.find((template) => template.pageId === selectedTemplatePageId);

  function handleTemplateChange(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedTemplatePageId(event.currentTarget.value);
    setStatus(null);
    setError(null);
  }

  async function applyPolicyToTargets() {
    if (!selectedTemplate) {
      setError('Choose a saved policy before applying it.');
      return;
    }
    setSaving(true);
    setStatus(null);
    setError(null);
    try {
      for (const target of targets) {
        await saveRoutePolicy({
          locale,
          siteId,
          collectionId,
          targetPageId: target.pageId,
          template: selectedTemplate,
        });
      }
      setStatus(`Applied ${selectedTemplate.policyName} to ${targets.length} clean page(s).`);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to apply saved policy.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={panelStyle} data-cms-dynamic-item-policy-rollout={collectionId}>
      <div style={summaryStyle}>
        <strong>Saved route policy rollout</strong>
        <span style={hintStyle}>
          {targets.length} clean linked item page(s) do not have a saved policy yet.
        </span>
      </div>
      <label style={fieldStyle}>
        <span style={labelStyle}>Saved policy</span>
        <select
          data-cms-dynamic-item-policy-rollout-template={collectionId}
          disabled={saving}
          value={selectedTemplatePageId}
          onChange={handleTemplateChange}
        >
          <option value="">Choose policy</option>
          {templates.map((template) => (
            <option key={template.pageId} value={template.pageId}>
              {template.policyName}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        className="builder-action-btn"
        data-cms-dynamic-item-policy-rollout-apply={collectionId}
        disabled={saving || !selectedTemplate}
        onClick={() => { void applyPolicyToTargets(); }}
        style={buttonStyle}
      >
        {saving ? 'Applying policy...' : `Apply to ${targets.length} clean page(s)`}
      </button>
      {status ? (
        <span style={statusStyle} data-cms-dynamic-item-policy-rollout-status={collectionId}>
          {status}
        </span>
      ) : null}
      {error ? (
        <span role="alert" style={errorStyle} data-cms-dynamic-item-policy-rollout-error={collectionId}>
          {error}
        </span>
      ) : null}
    </div>
  );
}

type SaveRoutePolicyInput = {
  readonly locale: Locale;
  readonly siteId: string;
  readonly collectionId: string;
  readonly targetPageId: string;
  readonly template: CmsDynamicItemLifecyclePolicyTemplate;
};

async function saveRoutePolicy({
  locale,
  siteId,
  collectionId,
  targetPageId,
  template,
}: SaveRoutePolicyInput): Promise<void> {
  const params = new URLSearchParams({ locale });
  const response = await fetch(
    `/api/builder/sites/${encodeURIComponent(siteId)}/collections/${encodeURIComponent(collectionId)}/dynamic-item-route-policies/${encodeURIComponent(targetPageId)}?${params.toString()}`,
    {
      method: 'PUT',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        policyName: template.policyName,
        sourceFieldKey: template.sourceFieldKey,
        slugPattern: template.slugPattern,
        slugConflictRule: template.slugConflictRule,
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
}

const panelStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 8,
  border: '1px solid #dbe4f0',
  borderRadius: 8,
  minWidth: 0,
  padding: 12,
  width: '100%',
} satisfies CSSProperties;

const summaryStyle = {
  display: 'grid',
  gap: 2,
  minWidth: 0,
} satisfies CSSProperties;

const hintStyle = {
  color: '#64748b',
  fontSize: 13,
} satisfies CSSProperties;

const fieldStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  maxWidth: '100%',
} satisfies CSSProperties;

const labelStyle = {
  color: '#64748b',
  fontSize: 12,
  fontWeight: 700,
} satisfies CSSProperties;

const buttonStyle = {
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

const errorStyle = {
  color: '#b91c1c',
  fontSize: 12,
  fontWeight: 800,
} satisfies CSSProperties;
