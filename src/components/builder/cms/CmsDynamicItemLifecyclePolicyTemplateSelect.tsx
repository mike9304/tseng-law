'use client';

import type { ChangeEvent, CSSProperties } from 'react';
import type {
  CmsDynamicItemLifecyclePolicyTemplate,
} from '@/components/builder/cms/cms-dynamic-item-lifecycle-policy-presets';

type CmsDynamicItemLifecyclePolicyTemplateSelectProps = {
  readonly busy: boolean;
  readonly pageId: string;
  readonly templates: readonly CmsDynamicItemLifecyclePolicyTemplate[];
  readonly onPolicyTemplateApply: (template: CmsDynamicItemLifecyclePolicyTemplate) => void;
};

export function CmsDynamicItemLifecyclePolicyTemplateSelect({
  busy,
  pageId,
  templates,
  onPolicyTemplateApply,
}: CmsDynamicItemLifecyclePolicyTemplateSelectProps) {
  if (!templates.length) return null;

  function handleTemplateChange(event: ChangeEvent<HTMLSelectElement>) {
    const selectedPageId = event.currentTarget.value;
    const selectedTemplate = templates.find((template) => template.pageId === selectedPageId);
    if (!selectedTemplate) return;
    onPolicyTemplateApply(selectedTemplate);
  }

  return (
    <label style={fieldStyle}>
      <span style={labelStyle}>Apply saved policy</span>
      <select
        data-cms-dynamic-item-policy-template={pageId}
        defaultValue=""
        disabled={busy}
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
  );
}

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
