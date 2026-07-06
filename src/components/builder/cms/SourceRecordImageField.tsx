'use client';

import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { BuilderAssetListItem } from '@/lib/builder/assets';
import type { Locale } from '@/lib/locales';
import AssetLibraryModal from '@/components/builder/editor/AssetLibraryModal';

type SourceRecordImageFieldProps = {
  readonly disabled: boolean;
  readonly image: string;
  readonly imageAltText: string;
  readonly imageFocalX: string;
  readonly imageFocalY: string;
  readonly locale: Locale;
  readonly recordId: string;
  readonly onImageAltTextChange: (imageAltText: string) => void;
  readonly onImageChange: (image: string) => void;
  readonly onImageFocalXChange: (imageFocalX: string) => void;
  readonly onImageFocalYChange: (imageFocalY: string) => void;
};

const labelStyle = { color: 'var(--editor-fg-primary, #0f172a)', display: 'grid', fontSize: 12, fontWeight: 800, gap: 4, letterSpacing: 0, minWidth: 0 } satisfies CSSProperties;
const inputStyle = { border: '1px solid rgba(148, 163, 184, 0.35)', borderRadius: 8, color: 'var(--editor-fg-primary, #0f172a)', font: 'inherit', fontSize: 13, minWidth: 0, padding: '8px 10px' } satisfies CSSProperties;
const helperTextStyle = { color: 'var(--editor-fg-muted, #64748b)', fontSize: 12, fontWeight: 700, letterSpacing: 0, overflowWrap: 'anywhere' } satisfies CSSProperties;
const imagePreviewStyle = { aspectRatio: '1 / 1', backgroundColor: '#e2e8f0', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', border: '1px solid rgba(148, 163, 184, 0.35)', borderRadius: 8, width: 56 } satisfies CSSProperties;

export function SourceRecordImageField({
  disabled,
  image,
  imageAltText,
  imageFocalX,
  imageFocalY,
  locale,
  onImageAltTextChange,
  onImageChange,
  onImageFocalXChange,
  onImageFocalYChange,
  recordId,
}: SourceRecordImageFieldProps) {
  const [assetLibraryOpen, setAssetLibraryOpen] = useState(false);
  const imagePreviewUrl = image.trim();
  const focalX = readFocalPreviewValue(imageFocalX);
  const focalY = readFocalPreviewValue(imageFocalY);

  function handleAssetSelect(asset: BuilderAssetListItem) {
    onImageChange(asset.url);
    setAssetLibraryOpen(false);
  }

  return (
    <>
      <label style={labelStyle}>
        Image URL
        <input
          data-cms-source-record-inline-input="image"
          aria-label="Source record image URL"
          style={inputStyle}
          value={image}
          disabled={disabled}
          onChange={(event) => onImageChange(event.target.value)}
        />
      </label>
      <div className="builder-dashboard-page-actions">
        <button
          type="button"
          className="builder-action-btn"
          data-cms-source-record-inline-asset-library={recordId}
          disabled={disabled}
          onClick={() => setAssetLibraryOpen(true)}
        >
          Asset Library
        </button>
      </div>
      <label style={labelStyle}>
        Image alt text
        <input
          data-cms-source-record-inline-input="imageAltText"
          aria-label="Source record image alt text"
          style={inputStyle}
          value={imageAltText}
          disabled={disabled}
          onChange={(event) => onImageAltTextChange(event.target.value)}
        />
      </label>
      <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)' }}>
        <label style={labelStyle}>
          Focal X
          <input
            data-cms-source-record-inline-input="imageFocalX"
            aria-label="Source record image focal X"
            style={inputStyle}
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={imageFocalX}
            disabled={disabled}
            onChange={(event) => onImageFocalXChange(event.target.value)}
          />
        </label>
        <label style={labelStyle}>
          Focal Y
          <input
            data-cms-source-record-inline-input="imageFocalY"
            aria-label="Source record image focal Y"
            style={inputStyle}
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={imageFocalY}
            disabled={disabled}
            onChange={(event) => onImageFocalYChange(event.target.value)}
          />
        </label>
      </div>
      <span style={{ ...helperTextStyle, display: 'grid', gap: 4 }} data-cms-source-record-inline-image-preview={recordId}>
        <span>Image preview</span>
        <span
          aria-hidden="true"
          style={{
            ...imagePreviewStyle,
            backgroundImage: imagePreviewUrl ? `url("${encodeURI(imagePreviewUrl)}")` : undefined,
            backgroundPosition: `${focalX * 100}% ${focalY * 100}%`,
          }}
        />
        <span>{imagePreviewUrl || '{image}'}</span>
        <span>Alt: {imageAltText || '{alt}'}</span>
        <span>Focal: {imageFocalX || '{x}'}, {imageFocalY || '{y}'}</span>
      </span>
      {assetLibraryOpen ? (
        <AssetLibraryModal
          open
          locale={locale}
          selectedUrl={imagePreviewUrl || null}
          initialFolder="uploads"
          autoFolderOnSelect="uploads"
          autoTagOnSelect="cms"
          onClose={() => setAssetLibraryOpen(false)}
          onSelect={handleAssetSelect}
        />
      ) : null}
    </>
  );
}

function readFocalPreviewValue(value: string): number {
  const focal = Number(value);
  if (!Number.isFinite(focal)) return 0.5;
  if (focal < 0) return 0;
  if (focal > 1) return 1;
  return focal;
}
