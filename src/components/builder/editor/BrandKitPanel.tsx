'use client';

import React from 'react';
import { useRef, useState } from 'react';
import type { BuilderAssetListItem } from '@/lib/builder/assets';
import type { Locale } from '@/lib/locales';
import AssetLibraryModal from '@/components/builder/editor/AssetLibraryModal';
import BrandKitPaletteEditor, { BRAND_COLOR_KEYS } from '@/components/builder/editor/BrandKitPaletteEditor';
import { getTextControlsCopy } from './text-controls-copy';
import {
  resolveBuilderBrandAssetUrl,
  type BrandKit,
} from '@/lib/builder/site/theme';

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.78rem',
  fontWeight: 700,
  color: '#334155',
};

const inputStyle: React.CSSProperties = {
  minHeight: 36,
  padding: '8px 12px',
  border: '1px solid #dbe3ef',
  borderRadius: 10,
  fontSize: '0.85rem',
  color: '#0f172a',
  background: '#fff',
  outline: 'none',
  boxSizing: 'border-box',
};

const sectionHeadingStyle: React.CSSProperties = {
  fontSize: '0.76rem',
  fontWeight: 700,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: '#64748b',
};

const actionButtonStyle: React.CSSProperties = {
  padding: '8px 12px',
  border: '1px solid #cbd5e1',
  borderRadius: 10,
  background: '#fff',
  color: '#334155',
  fontSize: '0.8rem',
  fontWeight: 700,
  cursor: 'pointer',
};

const primaryButtonStyle: React.CSSProperties = {
  ...actionButtonStyle,
  border: 'none',
  background: '#116dff',
  color: '#fff',
};

const panelShellStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 18,
  padding: 18,
  borderRadius: 18,
  border: '1px solid #dde7f3',
  background: 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.96))',
  boxShadow: '0 18px 44px rgba(15, 23, 42, 0.08)',
};

const siteWideWarningStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  gap: 10,
  padding: '10px 12px',
  borderRadius: 12,
  border: '1px solid #fde68a',
  background: '#fffbeb',
  color: '#92400e',
  fontSize: '0.78rem',
  fontWeight: 700,
  lineHeight: 1.45,
};

const logoCardStyle: React.CSSProperties = {
  border: '1px solid #dbe3ef',
  borderRadius: 16,
  padding: 14,
  background: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: 12,
  boxShadow: '0 12px 30px rgba(15, 23, 42, 0.06)',
};

const brandAssetLibraryStyle: React.CSSProperties = {
  border: '1px solid #dbe3ef',
  borderRadius: 16,
  padding: 14,
  background: '#fff',
  display: 'grid',
  gap: 12,
};

const brandAssetChipStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  minHeight: 34,
  padding: '7px 9px',
  border: '1px solid #dbe3ef',
  borderRadius: 10,
  background: '#fff',
  color: '#334155',
  fontSize: '0.74rem',
  fontWeight: 800,
};

const assetRowStyle: React.CSSProperties = {
  ...fieldStyle,
  padding: 12,
  border: '1px solid #e2e8f0',
  borderRadius: 14,
  background: '#fff',
};

const footerActionsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 8,
  paddingTop: 4,
};

type BrandAssetKey = 'logoLightAssetId' | 'logoDarkAssetId' | 'faviconAssetId' | 'ogImageAssetId';
type BrandUrlKey = 'logoLight' | 'logoDark' | 'favicon' | 'ogImage';

const BRAND_ASSET_FIELDS: Array<{
  urlKey: BrandUrlKey;
  assetKey: BrandAssetKey;
  placeholder: string;
}> = [
  {
    urlKey: 'logoLight',
    assetKey: 'logoLightAssetId',
    placeholder: 'https://example.com/logo.png',
  },
  {
    urlKey: 'logoDark',
    assetKey: 'logoDarkAssetId',
    placeholder: 'https://example.com/logo-dark.png',
  },
  {
    urlKey: 'favicon',
    assetKey: 'faviconAssetId',
    placeholder: 'https://example.com/favicon.ico',
  },
  {
    urlKey: 'ogImage',
    assetKey: 'ogImageAssetId',
    placeholder: 'https://example.com/social-card.png',
  },
];

function resolveBrandAssetPreview(value: BrandKit, urlKey: BrandUrlKey, assetKey: BrandAssetKey): string | null {
  const assetUrl = resolveBuilderBrandAssetUrl(value.assets?.[assetKey]);
  return assetUrl ?? value[urlKey] ?? null;
}

function assetIdFromLibraryItem(asset: BuilderAssetListItem): string {
  return asset.pathname || asset.url;
}

function updateBrandAsset(value: BrandKit, assetKey: BrandAssetKey, asset: BuilderAssetListItem): BrandKit {
  return {
    ...value,
    assets: {
      ...(value.assets ?? {}),
      [assetKey]: assetIdFromLibraryItem(asset),
    },
  };
}

function clearBrandAsset(value: BrandKit, assetKey: BrandAssetKey): BrandKit {
  const nextAssets = { ...(value.assets ?? {}) };
  delete nextAssets[assetKey];
  return {
    ...value,
    assets: nextAssets,
  };
}

export default function BrandKitPanel({
  value,
  locale,
  onChange,
  onApply,
  onExport,
  onImport,
}: {
  value: BrandKit;
  locale: Locale;
  onChange: (value: BrandKit) => void;
  onApply: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
}) {
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const [assetPickerKey, setAssetPickerKey] = useState<BrandAssetKey | null>(null);
  const logoPreview = resolveBrandAssetPreview(value, 'logoLight', 'logoLightAssetId');
  const activePickerField = BRAND_ASSET_FIELDS.find((field) => field.assetKey === assetPickerKey);
  const selectedAssetCount = BRAND_ASSET_FIELDS.filter((field) => Boolean(value.assets?.[field.assetKey])).length;
  const copy = getTextControlsCopy(locale);

  return (
    <div style={panelShellStyle}>
      <div style={siteWideWarningStyle}>
        <span aria-hidden="true">!</span>
        <span>{copy.brandKit.warning}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: 14, alignItems: 'stretch' }}>
        <div style={logoCardStyle}>
          <div style={sectionHeadingStyle}>{copy.brandKit.logoHeading}</div>
          <div
            style={{
              minHeight: 92,
              border: '1px dashed #cbd5e1',
              borderRadius: 10,
              background: value.colors.background,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {logoPreview ? (
              <span
                aria-label={copy.brandKit.logoPreview}
                role="img"
                style={{
                  width: '100%',
                  height: 76,
                  background: `url("${logoPreview.replace(/"/g, '%22')}") center/contain no-repeat`,
                }}
              />
            ) : (
              <span style={{ color: '#94a3b8', fontSize: '0.76rem', fontWeight: 700 }}>{copy.brandKit.logoPreview}</span>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            <span style={{ height: 26, borderRadius: 999, background: value.colors.primary }} />
            <span style={{ height: 26, borderRadius: 999, background: value.colors.accent }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {BRAND_ASSET_FIELDS.map((field) => {
            const previewUrl = resolveBrandAssetPreview(value, field.urlKey, field.assetKey);
            const hasAsset = Boolean(value.assets?.[field.assetKey]);
            return (
              <div key={field.assetKey} style={assetRowStyle}>
                <label style={labelStyle}>{copy.brandKit.assetLabels[field.assetKey]}</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'center' }}>
                  <input
                    type="url"
                    value={value[field.urlKey] ?? ''}
                    placeholder={field.placeholder}
                    style={inputStyle}
                    onChange={(event) => onChange({ ...value, [field.urlKey]: event.target.value })}
                  />
                  <button type="button" style={actionButtonStyle} onClick={() => setAssetPickerKey(field.assetKey)}>
                    {copy.brandKit.selectFromAssets}
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 28 }}>
                  {previewUrl ? (
                    <span
                      aria-hidden="true"
                      style={{
                        width: 34,
                        height: 24,
                        border: '1px solid #e2e8f0',
                        borderRadius: 6,
                        background: `#f8fafc url("${previewUrl.replace(/"/g, '%22')}") center/contain no-repeat`,
                        flex: '0 0 auto',
                      }}
                    />
                  ) : null}
                  <span style={{ color: hasAsset ? '#0f766e' : '#94a3b8', fontSize: '0.74rem', fontWeight: 700 }}>
                    {hasAsset ? copy.brandKit.assetSelected : copy.brandKit.rawUrlFallback}
                  </span>
                  {hasAsset ? (
                    <button
                      type="button"
                      style={{ ...actionButtonStyle, padding: '5px 8px', fontSize: '0.72rem' }}
                      onClick={() => onChange(clearBrandAsset(value, field.assetKey))}
                    >
                      {copy.brandKit.clearAsset}
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
          <div style={fieldStyle}>
            <label style={labelStyle}>{copy.brandKit.radiusScaleLabel}</label>
            <input
              type="number"
              min={0}
              max={64}
              value={value.radiusScale}
              style={inputStyle}
              onChange={(event) => onChange({ ...value, radiusScale: Number(event.target.value) })}
            />
          </div>
        </div>
      </div>

      <section style={brandAssetLibraryStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div>
            <div style={sectionHeadingStyle}>{copy.brandKit.assetLibraryHeading}</div>
            <strong style={{ color: '#0f172a', fontSize: '0.94rem' }}>
              {copy.brandKit.selectedAssetCount(selectedAssetCount, 4)}
            </strong>
          </div>
          <button type="button" style={actionButtonStyle} onClick={() => setAssetPickerKey('logoLightAssetId')}>
            {copy.brandKit.openAssetLibrary}
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8 }}>
          {BRAND_ASSET_FIELDS.map((field) => {
            const selected = Boolean(value.assets?.[field.assetKey]);
            return (
              <button
                key={field.assetKey}
                type="button"
                style={{
                  ...brandAssetChipStyle,
                  borderColor: selected ? '#116dff' : '#dbe3ef',
                  color: selected ? '#116dff' : '#64748b',
                }}
                onClick={() => setAssetPickerKey(field.assetKey)}
              >
                <span>{copy.brandKit.assetLabels[field.assetKey]}</span>
                <span>{selected ? copy.brandKit.linked : copy.brandKit.pick}</span>
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {BRAND_COLOR_KEYS.map((key) => (
            <span
              key={key}
              title={copy.brandKit.colorLabels[key]}
              aria-label={copy.brandKit.colorAriaLabel(copy.brandKit.colorLabels[key])}
              style={{
                width: 24,
                height: 24,
                borderRadius: 999,
                border: '1px solid rgba(15,23,42,0.14)',
                background: value.colors[key],
              }}
            />
          ))}
          {(value.customColors ?? []).map((entry, index) => (
            <span
              key={`custom-swatch-${index}`}
              title={entry.name || entry.color}
              aria-label={copy.brandKit.colorAriaLabel(entry.name || entry.color)}
              style={{
                width: 24,
                height: 24,
                borderRadius: 999,
                border: '1px solid rgba(15,23,42,0.14)',
                background: entry.color,
              }}
            />
          ))}
        </div>
      </section>

      <BrandKitPaletteEditor value={value} locale={locale} onChange={onChange} />

      <input
        ref={importInputRef}
        type="file"
        accept="application/json,.json"
        style={{ display: 'none' }}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onImport(file);
          event.currentTarget.value = '';
        }}
      />

      <div style={footerActionsStyle}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" style={actionButtonStyle} onClick={onExport}>
            {copy.brandKit.exportJson}
          </button>
          <button type="button" style={actionButtonStyle} onClick={() => importInputRef.current?.click()}>
            {copy.brandKit.importJson}
          </button>
        </div>
        <button type="button" style={primaryButtonStyle} onClick={onApply}>
          {copy.brandKit.applyBrandKit}
        </button>
      </div>
      {activePickerField ? (
        <AssetLibraryModal
          open
          locale={locale}
          selectedUrl={resolveBuilderBrandAssetUrl(value.assets?.[activePickerField.assetKey])}
          initialFolder="brand"
          autoFolderOnSelect="brand"
          autoTagOnSelect="brand"
          onClose={() => setAssetPickerKey(null)}
          onSelect={(asset) => {
            onChange(updateBrandAsset(value, activePickerField.assetKey, asset));
            setAssetPickerKey(null);
          }}
        />
      ) : null}
    </div>
  );
}
