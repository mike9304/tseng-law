'use client';

import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { BuilderAssetListItem } from '@/lib/builder/assets';
import type { Locale } from '@/lib/locales';
import AssetLibraryModal from '@/components/builder/editor/AssetLibraryModal';
import type { LawyerSourceDraft } from './lawyerSourceDraft';
import { formGridStyle, helperStyle, inputStyle, labelStyle, textareaStyle } from './lawyerSourceStyles';

type LawyerSourceFormProps = {
  readonly draft: LawyerSourceDraft;
  readonly error: string;
  readonly locale: Locale;
  readonly publicPath: string;
  readonly redirectReview: string;
  readonly resetting: boolean;
  readonly saving: boolean;
  readonly sourceSlug: string;
  readonly status: string;
  readonly onDraftChange: (patch: Partial<LawyerSourceDraft>) => void;
  readonly onDraftKeyDown: (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  readonly onReset: () => void;
  readonly onSave: () => void;
};

export function LawyerSourceForm({
  draft,
  error,
  locale,
  onDraftChange,
  onDraftKeyDown,
  onReset,
  onSave,
  publicPath,
  redirectReview,
  resetting,
  saving,
  sourceSlug,
  status,
}: LawyerSourceFormProps) {
  const [assetLibraryOpen, setAssetLibraryOpen] = useState(false);
  const disabled = saving || resetting;

  function handleAssetSelect(asset: BuilderAssetListItem) {
    onDraftChange({ image: asset.url });
    setAssetLibraryOpen(false);
  }

  return (
    <>
      <div style={formGridStyle}>
        <TextInput label="URL slug" value={draft.slug} dataAttribute="data-lawyer-source-slug-input" onChange={(slug) => onDraftChange({ slug })} />
        <TextInput label="Name" value={draft.name} onChange={(name) => onDraftChange({ name })} />
        <TextInput label="Role" value={draft.role} dataAttribute="data-lawyer-source-role-input" onChange={(role) => onDraftChange({ role })} onKeyDown={onDraftKeyDown} />
        <TextInput label="SEO title" value={draft.title} onChange={(title) => onDraftChange({ title })} onKeyDown={onDraftKeyDown} />
        <TextInput label="Email" value={draft.email} onChange={(email) => onDraftChange({ email })} onKeyDown={onDraftKeyDown} />
        <TextInput label="Image path" value={draft.image} onChange={(image) => onDraftChange({ image })} onKeyDown={onDraftKeyDown} />
        <div className="builder-dashboard-page-actions">
          <button
            type="button"
            className="builder-action-btn"
            data-lawyer-source-asset-library={sourceSlug}
            disabled={disabled}
            onClick={() => setAssetLibraryOpen(true)}
          >
            Asset Library
          </button>
        </div>
        <TextInput label="Image alt text" value={draft.imageAltText} onChange={(imageAltText) => onDraftChange({ imageAltText })} onKeyDown={onDraftKeyDown} />
        <NumberInput label="Image focal X" value={draft.imageFocalX} onChange={(imageFocalX) => onDraftChange({ imageFocalX })} onKeyDown={onDraftKeyDown} />
        <NumberInput label="Image focal Y" value={draft.imageFocalY} onChange={(imageFocalY) => onDraftChange({ imageFocalY })} onKeyDown={onDraftKeyDown} />
        <TextareaInput label="Description" value={draft.description} dataAttribute="data-lawyer-source-description-input" onChange={(description) => onDraftChange({ description })} onKeyDown={onDraftKeyDown} />
        <TextareaInput label="Summary bullets" value={draft.summary} dataAttribute="data-lawyer-source-summary-input" helper="One bullet per line. The public profile keeps the existing detailed lists and links." onChange={(summary) => onDraftChange({ summary })} onKeyDown={onDraftKeyDown} />
        <TextareaInput label="Languages" value={draft.languages} dataAttribute="data-lawyer-source-languages-input" helper="One language per line." onChange={(languages) => onDraftChange({ languages })} onKeyDown={onDraftKeyDown} />
        <TextareaInput label="Practice areas" value={draft.practiceAreas} dataAttribute="data-lawyer-source-practice-areas-input" helper="One practice area per line." onChange={(practiceAreas) => onDraftChange({ practiceAreas })} onKeyDown={onDraftKeyDown} />
        <TextareaInput label="Internal links" value={draft.internalLinks} dataAttribute="data-lawyer-source-internal-links-input" helper="One link per line: Label | /path." onChange={(internalLinks) => onDraftChange({ internalLinks })} onKeyDown={onDraftKeyDown} />
      </div>

      <div className="builder-dashboard-page-actions">
        <button type="button" className="builder-action-btn" data-lawyer-source-save disabled={disabled} onClick={onSave}>
          {saving ? 'Saving...' : 'Save lawyer record'}
        </button>
        <button type="button" className="builder-action-btn builder-action-btn--ghost" data-lawyer-source-reset disabled={disabled} onClick={onReset}>
          {resetting ? 'Resetting...' : 'Reset override'}
        </button>
        <a className="builder-action-btn builder-action-btn--ghost" href={publicPath} target="_blank" rel="noreferrer">
          Open public URL
        </a>
      </div>
      {status ? <p style={helperStyle} data-lawyer-source-status>{status}</p> : null}
      {redirectReview ? <p style={helperStyle} data-lawyer-source-redirect-review>{redirectReview}</p> : null}
      {error ? <p style={{ ...helperStyle, color: '#b45309' }} data-lawyer-source-error role="alert">{error}</p> : null}
      {assetLibraryOpen ? (
        <AssetLibraryModal
          open
          locale={locale}
          selectedUrl={draft.image.trim() || null}
          initialFolder="uploads"
          autoFolderOnSelect="uploads"
          autoTagOnSelect="lawyer"
          onClose={() => setAssetLibraryOpen(false)}
          onSelect={handleAssetSelect}
        />
      ) : null}
    </>
  );
}

type TextInputProps = {
  readonly label: string;
  readonly value: string;
  readonly dataAttribute?: string;
  readonly onChange: (value: string) => void;
  readonly onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
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

type NumberInputProps = {
  readonly label: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
};

function NumberInput({ label, onChange, onKeyDown, value }: NumberInputProps) {
  return (
    <label style={labelStyle}>
      {label}
      <input
        style={inputStyle}
        type="number"
        min="0"
        max="1"
        step="0.01"
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
