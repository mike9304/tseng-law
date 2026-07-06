'use client';

import { useCallback, type CSSProperties } from 'react';
import {
  DEFAULT_FILTERS,
  FILTER_PRESETS,
  type ImageFilters,
} from '@/lib/builder/canvas/filters';
import {
  getImageEditCopy,
  type ImageEditCopy,
} from '@/lib/builder/components/image/image-edit-copy';
import type { Locale } from '@/lib/locales';

const panelStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  padding: 12,
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  marginTop: 8,
  animation: 'fadeIn 150ms ease',
};

const sliderRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

const labelStyle: CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 600,
  color: '#334155',
  minWidth: 64,
  flexShrink: 0,
};

const sliderStyle: CSSProperties = {
  flex: 1,
  height: 4,
  accentColor: '#116dff',
  cursor: 'pointer',
};

const valueStyle: CSSProperties = {
  fontSize: '0.72rem',
  color: '#64748b',
  minWidth: 32,
  textAlign: 'right',
};

const presetRowStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
  borderTop: '1px solid #e2e8f0',
  paddingTop: 10,
};

const presetBtnStyle: CSSProperties = {
  padding: '4px 10px',
  fontSize: '0.72rem',
  fontWeight: 600,
  border: '1px solid #cbd5e1',
  borderRadius: 6,
  background: '#fff',
  color: '#334155',
  cursor: 'pointer',
  transition: 'background 120ms ease, border-color 120ms ease',
};

const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const titleStyle: CSSProperties = {
  fontSize: '0.78rem',
  fontWeight: 700,
  color: '#0f172a',
};

const closeBtnStyle: CSSProperties = {
  padding: '2px 8px',
  fontSize: '0.72rem',
  fontWeight: 600,
  border: '1px solid #cbd5e1',
  borderRadius: 6,
  background: '#fff',
  color: '#64748b',
  cursor: 'pointer',
};

interface SliderDef {
  key: keyof ImageFilters;
  labelKey: keyof ImageEditCopy['dialog']['filterPresets'];
  min: number;
  max: number;
  unit: string;
}

const SLIDERS: SliderDef[] = [
  { key: 'brightness', labelKey: 'brightness', min: 0, max: 200, unit: '%' },
  { key: 'contrast', labelKey: 'contrast', min: 0, max: 200, unit: '%' },
  { key: 'saturation', labelKey: 'saturation', min: 0, max: 200, unit: '%' },
  { key: 'blur', labelKey: 'blur', min: 0, max: 20, unit: 'px' },
  { key: 'grayscale', labelKey: 'bw', min: 0, max: 100, unit: '%' },
  { key: 'sepia', labelKey: 'sepia', min: 0, max: 100, unit: '%' },
];

export default function FilterPanel({
  locale,
  filters,
  onChangeFilters,
  onClose,
}: {
  locale?: Locale | string;
  filters: ImageFilters;
  onChangeFilters: (filters: ImageFilters) => void;
  onClose: () => void;
}) {
  const copy = getImageEditCopy(locale);
  const handleSlider = useCallback(
    (key: keyof ImageFilters, value: number) => {
      onChangeFilters({ ...filters, [key]: value });
    },
    [filters, onChangeFilters],
  );

  const applyPreset = useCallback(
    (partial: Partial<ImageFilters>) => {
      onChangeFilters({ ...DEFAULT_FILTERS, ...partial });
    },
    [onChangeFilters],
  );

  return (
    <div style={panelStyle}>
      <div style={headerStyle}>
        <span style={titleStyle}>{copy.dialog.filterPanelTitle}</span>
        <button type="button" style={closeBtnStyle} onClick={onClose}>
          {copy.dialog.close}
        </button>
      </div>

      {SLIDERS.map((s) => (
        <div key={s.key} style={sliderRowStyle}>
          <span style={labelStyle}>{copy.dialog.filterPresets[s.labelKey]}</span>
          <input
            type="range"
            min={s.min}
            max={s.max}
            step={s.key === 'blur' ? 0.5 : 1}
            value={filters[s.key]}
            style={sliderStyle}
            onChange={(e) => handleSlider(s.key, Number(e.target.value))}
          />
          <span style={valueStyle}>
            {filters[s.key]}
            {s.unit}
          </span>
        </div>
      ))}

      <div style={presetRowStyle}>
        {FILTER_PRESETS.map((p) => (
          <button
            key={p.key}
            type="button"
            style={presetBtnStyle}
            onClick={() => applyPreset(p.filters)}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#eff6ff';
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#116dff';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#fff';
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#cbd5e1';
            }}
          >
            {copy.dialog.filterPresetLabels[p.key]}
          </button>
        ))}
      </div>
    </div>
  );
}
