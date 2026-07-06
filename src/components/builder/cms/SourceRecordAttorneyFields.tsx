'use client';

import type { CSSProperties } from 'react';
import type { Locale } from '@/lib/locales';
import { SourceRecordImageField } from './SourceRecordImageField';
import type { SourceRecordDraft } from './sourceRecordInlineEditorUtils';

type SourceRecordAttorneyFieldsProps = {
  readonly disabled: boolean;
  readonly draft: SourceRecordDraft;
  readonly locale: Locale;
  readonly recordId: string;
  readonly onDraftChange: (patch: Partial<SourceRecordDraft>) => void;
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

export function SourceRecordAttorneyFields({
  disabled,
  draft,
  locale,
  onDraftChange,
  recordId,
}: SourceRecordAttorneyFieldsProps) {
  return (
    <>
      <label style={labelStyle}>
        Email
        <input
          data-cms-source-record-inline-input="email"
          aria-label="Source record email"
          style={inputStyle}
          type="email"
          value={draft.email}
          disabled={disabled}
          onChange={(event) => onDraftChange({ email: event.target.value })}
        />
      </label>
      <label style={labelStyle}>
        Description
        <textarea
          data-cms-source-record-inline-input="description"
          aria-label="Source record description"
          style={{ ...inputStyle, minHeight: 82, resize: 'vertical' }}
          value={draft.description}
          disabled={disabled}
          onChange={(event) => onDraftChange({ description: event.target.value })}
        />
      </label>
      <label style={labelStyle}>
        Summary
        <textarea
          data-cms-source-record-inline-input="summary"
          aria-label="Source record summary"
          style={{ ...inputStyle, minHeight: 112, resize: 'vertical' }}
          value={draft.summaryText}
          disabled={disabled}
          onChange={(event) => onDraftChange({ summaryText: event.target.value })}
        />
        <span style={helperTextStyle}>One summary item per line.</span>
      </label>
      <label style={labelStyle}>
        Languages
        <textarea
          data-cms-source-record-inline-input="languages"
          aria-label="Source record languages"
          style={{ ...inputStyle, minHeight: 78, resize: 'vertical' }}
          value={draft.languagesText}
          disabled={disabled}
          onChange={(event) => onDraftChange({ languagesText: event.target.value })}
        />
        <span style={helperTextStyle}>One language per line.</span>
      </label>
      <label style={labelStyle}>
        Practice areas
        <textarea
          data-cms-source-record-inline-input="practiceAreas"
          aria-label="Source record practice areas"
          style={{ ...inputStyle, minHeight: 112, resize: 'vertical' }}
          value={draft.practiceAreasText}
          disabled={disabled}
          onChange={(event) => onDraftChange({ practiceAreasText: event.target.value })}
        />
        <span style={helperTextStyle}>One practice area per line.</span>
      </label>
      <label style={labelStyle}>
        Internal links
        <textarea
          data-cms-source-record-inline-input="internalLinks"
          aria-label="Source record internal links"
          style={{ ...inputStyle, minHeight: 128, resize: 'vertical' }}
          value={draft.internalLinksText}
          disabled={disabled}
          onChange={(event) => onDraftChange({ internalLinksText: event.target.value })}
        />
        <span style={helperTextStyle}>One link per line: Label | /path.</span>
      </label>
      <SourceRecordImageField
        disabled={disabled}
        image={draft.image}
        imageAltText={draft.imageAltText}
        imageFocalX={draft.imageFocalX}
        imageFocalY={draft.imageFocalY}
        locale={locale}
        recordId={recordId}
        onImageChange={(image) => onDraftChange({ image })}
        onImageAltTextChange={(imageAltText) => onDraftChange({ imageAltText })}
        onImageFocalXChange={(imageFocalX) => onDraftChange({ imageFocalX })}
        onImageFocalYChange={(imageFocalY) => onDraftChange({ imageFocalY })}
      />
    </>
  );
}
