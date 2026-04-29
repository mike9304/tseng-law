'use client';

import { useRef } from 'react';
import FontPicker from '@/components/builder/editor/FontPicker';
import {
  THEME_COLOR_LABELS,
  type BrandKit,
} from '@/lib/builder/site/theme';

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.78rem',
  fontWeight: 700,
  color: '#334155',
};

const inputStyle: React.CSSProperties = {
  padding: '8px 12px',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  fontSize: '0.85rem',
  color: '#0f172a',
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
  borderRadius: 8,
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

type BrandColorKey = keyof BrandKit['colors'];

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

export default function BrandKitPanel({
  value,
  onChange,
  onApply,
  onExport,
  onImport,
}: {
  value: BrandKit;
  onChange: (value: BrandKit) => void;
  onApply: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
}) {
  const importInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: 14, alignItems: 'stretch' }}>
        <div
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            padding: 12,
            background: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
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
            {value.logoLight ? (
              <img src={value.logoLight} alt="" style={{ maxWidth: '100%', maxHeight: 76, objectFit: 'contain' }} />
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
          <div style={fieldStyle}>
            <label style={labelStyle}>Light logo URL</label>
            <input
              type="url"
              value={value.logoLight ?? ''}
              placeholder="https://example.com/logo.png"
              style={inputStyle}
              onChange={(event) => onChange({ ...value, logoLight: event.target.value })}
            />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Dark logo URL</label>
            <input
              type="url"
              value={value.logoDark ?? ''}
              placeholder="https://example.com/logo-dark.png"
              style={inputStyle}
              onChange={(event) => onChange({ ...value, logoDark: event.target.value })}
            />
          </div>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12 }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
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

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
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
    </div>
  );
}
