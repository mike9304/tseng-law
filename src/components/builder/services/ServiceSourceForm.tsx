'use client';

import type { KeyboardEvent } from 'react';
import type { BuilderCollectionRecordRelationOption } from '@/lib/builder/cms';
import type { ServiceSourceDraft } from './serviceSourceDraft';
import { ServiceSourceRelationPicker } from './ServiceSourceRelationPicker';
import { formGridStyle, helperStyle, inputStyle, labelStyle, textareaStyle } from './serviceSourceStyles';

type ServiceSourceFormProps = {
  readonly columnOptions: readonly BuilderCollectionRecordRelationOption[];
  readonly draft: ServiceSourceDraft;
  readonly error: string;
  readonly publicPath: string;
  readonly redirectReview: string;
  readonly resetting: boolean;
  readonly saving: boolean;
  readonly status: string;
  readonly onDraftChange: (patch: Partial<ServiceSourceDraft>) => void;
  readonly onDraftKeyDown: (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  readonly onReset: () => void;
  readonly onSave: () => void;
};

export function ServiceSourceForm({
  columnOptions,
  draft,
  error,
  onDraftChange,
  onDraftKeyDown,
  onReset,
  onSave,
  publicPath,
  redirectReview,
  resetting,
  saving,
  status,
}: ServiceSourceFormProps) {
  return (
    <>
      <div style={formGridStyle}>
        <label style={labelStyle}>
          URL slug
          <input
            data-service-source-slug-input
            style={inputStyle}
            value={draft.slug}
            onChange={(event) => onDraftChange({ slug: event.target.value })}
            onKeyDown={onDraftKeyDown}
          />
          <span style={helperStyle} data-service-source-public-url>
            Public URL: {publicPath}
          </span>
        </label>
        <TextInput
          label="Title"
          value={draft.title}
          dataAttribute="data-service-source-title-input"
          onChange={(title) => onDraftChange({ title })}
          onKeyDown={onDraftKeyDown}
        />
        <TextInput
          label="Subtitle"
          value={draft.subtitle}
          onChange={(subtitle) => onDraftChange({ subtitle })}
          onKeyDown={onDraftKeyDown}
        />
        <TextareaInput
          label="Intro"
          value={draft.intro}
          dataAttribute="data-service-source-intro-input"
          onChange={(intro) => onDraftChange({ intro })}
          onKeyDown={onDraftKeyDown}
        />
        <TextareaInput
          label="Key points"
          value={draft.keyPoints}
          dataAttribute="data-service-source-key-points-input"
          helper="One key point per line."
          onChange={(keyPoints) => onDraftChange({ keyPoints })}
          onKeyDown={onDraftKeyDown}
        />
        <ServiceSourceRelationPicker
          columnOptions={columnOptions}
          columnSlugs={draft.columnSlugs}
          disabled={saving || resetting}
          onColumnSlugsChange={(columnSlugs) => onDraftChange({ columnSlugs })}
        />
      </div>

      <div className="builder-dashboard-page-actions">
        <button type="button" className="builder-action-btn" data-service-source-save disabled={saving || resetting} onClick={onSave}>
          {saving ? 'Saving...' : 'Save service record'}
        </button>
        <button type="button" className="builder-action-btn builder-action-btn--ghost" data-service-source-reset disabled={saving || resetting} onClick={onReset}>
          {resetting ? 'Resetting...' : 'Reset override'}
        </button>
        <a className="builder-action-btn builder-action-btn--ghost" href={publicPath} target="_blank" rel="noreferrer">
          Open public URL
        </a>
      </div>
      {status ? <p style={helperStyle} data-service-source-status>{status}</p> : null}
      {redirectReview ? <p style={helperStyle} data-service-source-redirect-review>{redirectReview}</p> : null}
      {error ? <p style={{ ...helperStyle, color: '#b45309' }} data-service-source-error role="alert">{error}</p> : null}
    </>
  );
}

type TextInputProps = {
  readonly label: string;
  readonly value: string;
  readonly dataAttribute?: string;
  readonly onChange: (value: string) => void;
  readonly onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
};

function TextInput({ dataAttribute, label, onChange, onKeyDown, value }: TextInputProps) {
  return (
    <label style={labelStyle}>
      {label}
      <input
        {...(dataAttribute ? { [dataAttribute]: true } : {})}
        style={inputStyle}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
      />
    </label>
  );
}

type TextareaInputProps = {
  readonly label: string;
  readonly value: string;
  readonly dataAttribute: string;
  readonly helper?: string;
  readonly onChange: (value: string) => void;
  readonly onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
};

function TextareaInput({ dataAttribute, helper, label, onChange, onKeyDown, value }: TextareaInputProps) {
  return (
    <label style={labelStyle}>
      {label}
      <textarea
        {...{ [dataAttribute]: true }}
        style={textareaStyle}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
      />
      {helper ? <span style={helperStyle}>{helper}</span> : null}
    </label>
  );
}
