'use client';

import { useRef, useState } from 'react';
import type { BuilderAssetListItem } from '@/lib/builder/assets';
import type { Locale } from '@/lib/locales';
import AssetLibraryModal from '@/components/builder/editor/AssetLibraryModal';
import FontPicker from '@/components/builder/editor/FontPicker';
import {
  THEME_COLOR_LABELS,
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

const assetRowStyle: React.CSSProperties = {
  ...fieldStyle,
  padding: 12,
  border: '1px solid #e2e8f0',
  borderRadius: 14,
  background: '#fff',
};

const colorGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 12,
};

const footerActionsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 8,
  paddingTop: 4,
};

type BrandColorKey = keyof BrandKit['colors'];
type BrandAssetKey = 'logoLightAssetId' | 'logoDarkAssetId' | 'faviconAssetId' | 'ogImageAssetId';
type BrandUrlKey = 'logoLight' | 'logoDark' | 'favicon' | 'ogImage';

const BRAND_COLOR_KEYS: BrandColorKey[] = [
  'primary',
  'secondary',
  'accent',
  'background',
  'text',
];

function updateBrandColor(kit: BrandKit, key: BrandColorKey, value: string): BrandKit {
  return {
    ...kit,
    colors: {
      ...kit.colors,
      [key]: value,
    },
  };
}

const BRAND_ASSET_FIELDS: Array<{
  label: string;
  urlKey: BrandUrlKey;
  assetKey: BrandAssetKey;
  placeholder: string;
}> = [
  {
    label: 'Light logo',
    urlKey: 'logoLight',
    assetKey: 'logoLightAssetId',
    placeholder: 'https://example.com/logo.png',
  },
  {
    label: 'Dark logo',
    urlKey: 'logoDark',
    assetKey: 'logoDarkAssetId',
    placeholder: 'https://example.com/logo-dark.png',
  },
  {
    label: 'Favicon',
    urlKey: 'favicon',
    assetKey: 'faviconAssetId',
    placeholder: 'https://example.com/favicon.ico',
  },
  {
    label: 'OG image',
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

  return (
    <div style={panelShellStyle}>
      <div style={siteWideWarningStyle}>
        <span aria-hidden="true">!</span>
        <span>Brand kit changes are site-wide. Apply updates here, then save Site Settings to publish the new visual system.</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: 14, alignItems: 'stretch' }}>
        <div style={logoCardStyle}>
          <div style={sectionHeadingStyle}>Logo</div>
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
                aria-label="Logo preview"
                role="img"
                style={{
                  width: '100%',
                  height: 76,
                  background: `url("${logoPreview.replace(/"/g, '%22')}") center/contain no-repeat`,
                }}
              />
            ) : (
              <span style={{ color: '#94a3b8', fontSize: '0.76rem', fontWeight: 700 }}>Logo preview</span>
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
                <label style={labelStyle}>{field.label} URL</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'center' }}>
                  <input
                    type="url"
                    value={value[field.urlKey] ?? ''}
                    placeholder={field.placeholder}
                    style={inputStyle}
                    onChange={(event) => onChange({ ...value, [field.urlKey]: event.target.value })}
                  />
                  <button type="button" style={actionButtonStyle} onClick={() => setAssetPickerKey(field.assetKey)}>
                    Select from assets
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
                    {hasAsset ? 'Asset selected' : 'Raw URL fallback'}
                  </span>
                  {hasAsset ? (
                    <button
                      type="button"
                      style={{ ...actionButtonStyle, padding: '5px 8px', fontSize: '0.72rem' }}
                      onClick={() => onChange(clearBrandAsset(value, field.assetKey))}
                    >
                      Clear asset
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
          <div style={fieldStyle}>
            <label style={labelStyle}>Radius scale</label>
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

      <div style={colorGridStyle}>
        {BRAND_COLOR_KEYS.map((key) => (
          <div key={key} style={fieldStyle}>
            <label style={labelStyle}>{THEME_COLOR_LABELS[key]}</label>
            <div style={{ display: 'grid', gridTemplateColumns: '46px 1fr', gap: 8, alignItems: 'center' }}>
              <input
                type="color"
                value={/^#[0-9a-fA-F]{6}$/.test(value.colors[key]) ? value.colors[key] : '#000000'}
                style={{ width: 46, height: 36, padding: 4, border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff' }}
                onChange={(event) => onChange(updateBrandColor(value, key, event.target.value))}
              />
              <input
                type="text"
                value={value.colors[key]}
                placeholder="#123B63"
                style={inputStyle}
                onChange={(event) => onChange(updateBrandColor(value, key, event.target.value))}
              />
            </div>
          </div>
        ))}
      </div>

      <div style={colorGridStyle}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Title font</label>
          <FontPicker
            value={value.fonts.title}
            onChange={(fontFamily) => onChange({ ...value, fonts: { ...value.fonts, title: fontFamily } })}
          />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Body font</label>
          <FontPicker
            value={value.fonts.body}
            onChange={(fontFamily) => onChange({ ...value, fonts: { ...value.fonts, body: fontFamily } })}
          />
        </div>
      </div>

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
            Export JSON
          </button>
          <button type="button" style={actionButtonStyle} onClick={() => importInputRef.current?.click()}>
            Import JSON
          </button>
        </div>
        <button type="button" style={primaryButtonStyle} onClick={onApply}>
          Apply brand kit
        </button>
      </div>
      {activePickerField ? (
        <AssetLibraryModal
          open
          locale={locale}
          selectedUrl={resolveBuilderBrandAssetUrl(value.assets?.[activePickerField.assetKey])}
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
