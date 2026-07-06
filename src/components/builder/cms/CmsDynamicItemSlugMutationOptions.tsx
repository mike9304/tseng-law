'use client';

import type { CSSProperties } from 'react';
import {
  appendSlugPatternToken,
  resolveSlugPatternPreview,
} from '@/lib/builder/cms-slug-pattern';
import type { BuilderCmsSlugConflictRule } from '@/lib/builder/cms-slug-conflict-rule';
import type { BuilderCmsSlugSourceField } from '@/lib/builder/cms-slug-source-fields';

type CmsDynamicItemSlugMutationOptionsProps = {
  readonly busy: boolean;
  readonly pageId: string;
  readonly sourceFields: readonly BuilderCmsSlugSourceField[];
  readonly sourceFieldKey: string;
  readonly slugPattern: string;
  readonly showConflictRule: boolean;
  readonly slugConflictRule: BuilderCmsSlugConflictRule;
  readonly previewRecordId?: string;
  readonly previewFields?: Readonly<Record<string, unknown>>;
  readonly onSourceFieldKeyChange: (nextValue: string) => void;
  readonly onSlugPatternChange: (nextValue: string) => void;
  readonly onSlugConflictRuleChange: (nextValue: BuilderCmsSlugConflictRule) => void;
};

export function CmsDynamicItemSlugMutationOptions({
  busy,
  pageId,
  sourceFields,
  sourceFieldKey,
  slugPattern,
  showConflictRule,
  slugConflictRule,
  previewRecordId,
  previewFields,
  onSourceFieldKeyChange,
  onSlugPatternChange,
  onSlugConflictRuleChange,
}: CmsDynamicItemSlugMutationOptionsProps) {
  if (!sourceFields.length) return null;
  const previewSlug = previewFields ? resolveSlugPatternPreview(previewFields, slugPattern) : null;

  return (
    <span style={optionsStyle}>
      <label style={fieldStyle}>
        <span style={labelStyle}>Slug source</span>
        <select
          data-cms-dynamic-item-slug-source-field={pageId}
          disabled={busy}
          value={sourceFieldKey}
          onChange={(event) => onSourceFieldKeyChange(event.currentTarget.value)}
        >
          <option value="">Auto</option>
          {sourceFields.map((field) => (
            <option key={field.key} value={field.key}>
              {field.label}
            </option>
          ))}
        </select>
      </label>
      <label style={fieldStyle}>
        <span style={labelStyle}>Slug pattern</span>
        <input
          data-cms-dynamic-item-slug-pattern={pageId}
          disabled={busy}
          placeholder="슬러그 패턴 · {{필드키}} 토큰 포함(최대 160자) · 예: {{code}}-{{title}}"
          spellCheck={false}
          type="text"
          value={slugPattern}
          onChange={(event) => onSlugPatternChange(event.currentTarget.value)}
        />
      </label>
      <span style={presetStyle}>
        {sourceFields.slice(0, 4).map((field) => (
          <button
            key={field.key}
            type="button"
            className="builder-link-inline"
            data-cms-dynamic-item-slug-pattern-token={field.key}
            disabled={busy}
            onClick={() => onSlugPatternChange(appendSlugPatternToken(slugPattern, field.key))}
          >
            {`{{${field.label}}}`}
          </button>
        ))}
      </span>
      {previewSlug ? (
        <span
          style={previewStyle}
          data-cms-dynamic-item-slug-pattern-preview={pageId}
        >
          Pattern preview: {previewSlug}
          {previewRecordId ? ` from ${previewRecordId}` : ''}
        </span>
      ) : null}
      {showConflictRule ? (
        <label style={fieldStyle}>
          <span style={labelStyle}>Conflict rule</span>
          <select
            data-cms-dynamic-item-slug-conflict-rule={pageId}
            disabled={busy}
            value={slugConflictRule}
            onChange={(event) => onSlugConflictRuleChange(normalizeSlugConflictRuleSelection(event.currentTarget.value))}
          >
            <option value="next-available">Next available suffix</option>
            <option value="record-id-suffix">Append record ID</option>
          </select>
        </label>
      ) : null}
    </span>
  );
}

function normalizeSlugConflictRuleSelection(value: string): BuilderCmsSlugConflictRule {
  return value === 'record-id-suffix' ? 'record-id-suffix' : 'next-available';
}

const optionsStyle = {
  display: 'inline-flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 6,
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

const presetStyle = {
  display: 'inline-flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 4,
} satisfies CSSProperties;

const previewStyle = {
  color: '#475569',
  fontSize: 12,
  fontWeight: 700,
} satisfies CSSProperties;
