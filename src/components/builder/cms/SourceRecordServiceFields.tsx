'use client';

import type { CSSProperties } from 'react';
import type { BuilderCollectionRecordRelationOption } from '@/lib/builder/cms';
import { SourceRecordRelationPicker } from './SourceRecordRelationPicker';

type SourceRecordServiceFieldsProps = {
  readonly columnOptions: readonly BuilderCollectionRecordRelationOption[];
  readonly columnSlugs: readonly string[];
  readonly disabled: boolean;
  readonly intro: string;
  readonly keyPointsText: string;
  readonly onColumnSlugsChange: (columnSlugs: readonly string[]) => void;
  readonly onIntroChange: (intro: string) => void;
  readonly onKeyPointsTextChange: (keyPointsText: string) => void;
};

const labelStyle = {
  color: 'var(--editor-fg-primary, #0f172a)',
  display: 'grid',
  fontSize: 12,
  fontWeight: 800,
  gap: 4,
  letterSpacing: 0,
  minWidth: 0,
} satisfies CSSProperties;

const inputStyle = {
  border: '1px solid rgba(148, 163, 184, 0.35)',
  borderRadius: 8,
  color: 'var(--editor-fg-primary, #0f172a)',
  font: 'inherit',
  fontSize: 13,
  minWidth: 0,
  padding: '8px 10px',
} satisfies CSSProperties;

const helperTextStyle = {
  color: 'var(--editor-fg-muted, #64748b)',
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 0,
  overflowWrap: 'anywhere',
} satisfies CSSProperties;

export function SourceRecordServiceFields({
  columnOptions,
  columnSlugs,
  disabled,
  intro,
  keyPointsText,
  onColumnSlugsChange,
  onIntroChange,
  onKeyPointsTextChange,
}: SourceRecordServiceFieldsProps) {
  return (
    <>
      <label style={labelStyle}>
        Intro
        <textarea
          data-cms-source-record-inline-input="intro"
          aria-label="Source record intro"
          style={{ ...inputStyle, minHeight: 92, resize: 'vertical' }}
          value={intro}
          disabled={disabled}
          onChange={(event) => onIntroChange(event.target.value)}
        />
      </label>
      <label style={labelStyle}>
        Key points
        <textarea
          data-cms-source-record-inline-input="keyPoints"
          aria-label="Source record key points"
          style={{ ...inputStyle, minHeight: 118, resize: 'vertical' }}
          value={keyPointsText}
          disabled={disabled}
          onChange={(event) => onKeyPointsTextChange(event.target.value)}
        />
        <span style={helperTextStyle}>One key point per line.</span>
      </label>
      <SourceRecordRelationPicker
        columnOptions={columnOptions}
        columnSlugs={columnSlugs}
        disabled={disabled}
        onColumnSlugsChange={onColumnSlugsChange}
      />
    </>
  );
}
