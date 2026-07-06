'use client';

import type { CSSProperties } from 'react';
import type { Locale } from '@/lib/locales';
import type { BrandKit } from '@/lib/builder/site/theme';
import FontPicker from '@/components/builder/editor/FontPicker';
import { getTextControlsCopy } from './text-controls-copy';

export type BrandColorKey = keyof BrandKit['colors'];

export const BRAND_COLOR_KEYS: readonly BrandColorKey[] = [
  'primary',
  'secondary',
  'accent',
  'background',
  'text',
];

const DEFAULT_PALETTE_COLOR = '#ff0000';

const MAX_CUSTOM_COLORS = 16;

function newCustomColor(): { name: string; color: string } {
  return { name: '', color: DEFAULT_PALETTE_COLOR };
}

function addCustomColor(kit: BrandKit): BrandKit {
  return {
    ...kit,
    customColors: [...(kit.customColors ?? []), newCustomColor()],
  };
}

function updateCustomColor(
  kit: BrandKit,
  index: number,
  patch: Partial<{ name: string; color: string }>,
): BrandKit {
  return {
    ...kit,
    customColors: (kit.customColors ?? []).map((item, itemIndex) =>
      itemIndex === index ? { ...item, ...patch } : item,
    ),
  };
}

function removeCustomColor(kit: BrandKit, index: number): BrandKit {
  const next = (kit.customColors ?? []).filter((_, itemIndex) => itemIndex !== index);
  return {
    ...kit,
    customColors: next.length > 0 ? next : undefined,
  };
}

const fieldStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

const labelStyle: CSSProperties = {
  fontSize: '0.78rem',
  fontWeight: 700,
  color: '#334155',
};

const inputStyle: CSSProperties = {
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

const colorGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 12,
};

const paletteShellStyle: CSSProperties = {
  display: 'grid',
  gap: 10,
  padding: 12,
  border: '1px solid #dbe3ef',
  borderRadius: 14,
  background: '#fff',
};

const actionButtonStyle: CSSProperties = {
  padding: '8px 12px',
  border: '1px solid #cbd5e1',
  borderRadius: 10,
  background: '#fff',
  color: '#334155',
  fontSize: '0.8rem',
  fontWeight: 700,
  cursor: 'pointer',
};

function updateBrandColor(kit: BrandKit, key: BrandColorKey, value: string): BrandKit {
  return {
    ...kit,
    colors: {
      ...kit.colors,
      [key]: value,
    },
  };
}

export default function BrandKitPaletteEditor({
  value,
  locale,
  onChange,
}: {
  value: BrandKit;
  locale: Locale;
  onChange: (value: BrandKit) => void;
}) {
  const copy = getTextControlsCopy(locale);
  const customColors = value.customColors ?? [];

  return (
    <>
      <div style={colorGridStyle}>
        {BRAND_COLOR_KEYS.map((key) => (
          <div key={key} style={fieldStyle}>
            <label style={labelStyle}>{copy.brandKit.colorLabels[key]}</label>
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

      <section style={paletteShellStyle} data-brand-kit-custom-palette="true">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
          <div>
            <div style={labelStyle}>{copy.brandKit.customPaletteLabel}</div>
            <span style={{ color: '#64748b', fontSize: '0.74rem', fontWeight: 700 }}>
              {customColors.length > 0
                ? copy.brandKit.customPaletteCount(customColors.length)
                : copy.brandKit.customPaletteEmpty}
            </span>
          </div>
          <button
            type="button"
            style={actionButtonStyle}
            disabled={customColors.length >= MAX_CUSTOM_COLORS}
            onClick={() => onChange(addCustomColor(value))}
          >
            {copy.brandKit.addColor}
          </button>
        </div>
        {customColors.length > 0 ? (
          <div style={{ display: 'grid', gap: 8 }}>
            {customColors.map((entry, index) => (
              <div
                key={`custom-color-${index}`}
                style={{ display: 'grid', gridTemplateColumns: '46px 1fr 1fr auto', gap: 8, alignItems: 'center' }}
              >
                <input
                  type="color"
                  value={/^#[0-9a-fA-F]{6}$/.test(entry.color) ? entry.color : DEFAULT_PALETTE_COLOR}
                  style={{ width: 46, height: 36, padding: 4, border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff' }}
                  aria-label={copy.brandKit.customPaletteColorAriaLabel(index + 1)}
                  onChange={(event) => onChange(updateCustomColor(value, index, { color: event.target.value }))}
                />
                <input
                  type="text"
                  value={entry.name}
                  placeholder={copy.brandKit.customColorNamePlaceholder}
                  aria-label={copy.brandKit.customColorNameLabel}
                  style={inputStyle}
                  onChange={(event) => onChange(updateCustomColor(value, index, { name: event.target.value }))}
                />
                <input
                  type="text"
                  value={entry.color}
                  placeholder="#ff0000"
                  aria-label={copy.brandKit.customColorHexLabel}
                  style={inputStyle}
                  onChange={(event) => onChange(updateCustomColor(value, index, { color: event.target.value }))}
                />
                <button type="button" style={actionButtonStyle} onClick={() => onChange(removeCustomColor(value, index))}>
                  {copy.brandKit.removeColor}
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <div style={colorGridStyle}>
        <div style={fieldStyle}>
          <label style={labelStyle}>{copy.brandKit.titleFontLabel}</label>
          <FontPicker
            value={value.fonts.title}
            locale={locale}
            onChange={(fontFamily) => onChange({ ...value, fonts: { ...value.fonts, title: fontFamily } })}
          />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>{copy.brandKit.bodyFontLabel}</label>
          <FontPicker
            value={value.fonts.body}
            locale={locale}
            onChange={(fontFamily) => onChange({ ...value, fonts: { ...value.fonts, body: fontFamily } })}
          />
        </div>
      </div>
    </>
  );
}
