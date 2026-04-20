'use client';

import { useEffect, useMemo, useState } from 'react';
import { FONT_CATALOG, fontFamilyCSS } from '@/lib/builder/canvas/fonts';
import { useBuilderTheme } from './BuilderThemeContext';

const POPULAR_FONT_FAMILIES = [
  'system-ui',
  'Noto Sans KR',
  'Noto Sans TC',
  'Noto Sans',
  'Pretendard',
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Poppins',
  'Montserrat',
  'DM Sans',
  'Noto Serif KR',
  'Noto Serif TC',
  'Playfair Display',
  'Merriweather',
  'Lora',
  'PT Serif',
  'Source Serif 4',
  'JetBrains Mono',
] as const;

const wrapperStyle: React.CSSProperties = {
  position: 'relative',
};

const triggerStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  background: '#fff',
  color: '#0f172a',
  fontSize: '0.82rem',
  textAlign: 'left',
  cursor: 'pointer',
};

const popoverStyle: React.CSSProperties = {
  position: 'absolute',
  top: 'calc(100% + 6px)',
  left: 0,
  right: 0,
  zIndex: 40,
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  boxShadow: '0 16px 40px rgba(15, 23, 42, 0.18)',
  padding: 10,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};

const searchInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  fontSize: '0.82rem',
  color: '#0f172a',
  outline: 'none',
  boxSizing: 'border-box',
};

const sectionLabelStyle: React.CSSProperties = {
  fontSize: '0.72rem',
  fontWeight: 700,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: '#64748b',
};

const listStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  maxHeight: 280,
  overflowY: 'auto',
};

function optionStyle(active: boolean): React.CSSProperties {
  return {
    width: '100%',
    padding: '8px 10px',
    border: active ? '1px solid #123b63' : '1px solid transparent',
    borderRadius: 10,
    background: active ? '#eff6ff' : 'transparent',
    color: '#0f172a',
    cursor: 'pointer',
    textAlign: 'left',
  };
}

interface FontItem {
  family: string;
  note?: string;
}

export default function FontPicker({
  value,
  onChange,
  disabled = false,
}: {
  value: string;
  onChange: (fontFamily: string) => void;
  disabled?: boolean;
}) {
  const theme = useBuilderTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const siteFonts = useMemo<FontItem[]>(() => {
    const deduped = new Set<string>();
    const fonts: FontItem[] = [];
    const heading = theme.fonts.heading;
    const body = theme.fonts.body;

    if (heading && !deduped.has(heading)) {
      deduped.add(heading);
      fonts.push({ family: heading, note: 'Heading' });
    }
    if (body && !deduped.has(body)) {
      deduped.add(body);
      fonts.push({ family: body, note: 'Body' });
    }
    return fonts;
  }, [theme.fonts.body, theme.fonts.heading]);

  const presetFonts = useMemo<FontItem[]>(() => {
    const presetMap = new Map(FONT_CATALOG.map((font) => [font.family, font]));
    return POPULAR_FONT_FAMILIES
      .map((family) => presetMap.get(family))
      .filter((font): font is (typeof FONT_CATALOG)[number] => Boolean(font))
      .map((font) => ({
        family: font.family,
        note: font.cjk ? 'CJK' : undefined,
      }));
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredSiteFonts = siteFonts.filter((font) =>
    font.family.toLowerCase().includes(normalizedQuery));
  const filteredPresetFonts = presetFonts.filter((font) =>
    font.family.toLowerCase().includes(normalizedQuery));

  const currentFont = value || 'system-ui';
  const currentShownInLists = [...filteredSiteFonts, ...filteredPresetFonts]
    .some((font) => font.family === currentFont);
  const customCurrent = !currentShownInLists && currentFont.trim().length > 0
    ? [{ family: currentFont, note: 'Current' }]
    : [];

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const handleWindowClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-font-picker]')) {
        setOpen(false);
      }
    };
    window.addEventListener('click', handleWindowClick, true);
    return () => window.removeEventListener('click', handleWindowClick, true);
  }, [open]);

  const renderOption = (font: FontItem) => (
    <button
      key={`${font.family}-${font.note ?? 'preset'}`}
      type="button"
      style={{ ...optionStyle(font.family === currentFont), fontFamily: fontFamilyCSS(font.family) }}
      onClick={() => {
        onChange(font.family);
        setOpen(false);
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span>{font.family}</span>
        {font.note ? (
          <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.7rem', color: '#64748b' }}>
            {font.note}
          </span>
        ) : null}
      </div>
    </button>
  );

  return (
    <div style={wrapperStyle} data-font-picker>
      <button
        type="button"
        disabled={disabled}
        style={{ ...triggerStyle, fontFamily: fontFamilyCSS(currentFont), opacity: disabled ? 0.6 : 1 }}
        onClick={() => setOpen((current) => !current)}
      >
        {currentFont}
      </button>

      {open ? (
        <div style={popoverStyle}>
          <input
            type="text"
            value={query}
            placeholder="폰트 검색"
            autoFocus
            style={searchInputStyle}
            onChange={(event) => setQuery(event.target.value)}
          />

          {siteFonts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={sectionLabelStyle}>사이트 폰트</span>
              <div style={listStyle}>
                {filteredSiteFonts.map(renderOption)}
              </div>
            </div>
          ) : null}

          {customCurrent.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={sectionLabelStyle}>현재 폰트</span>
              <div style={listStyle}>
                {customCurrent.map(renderOption)}
              </div>
            </div>
          ) : null}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={sectionLabelStyle}>Google Fonts</span>
            <div style={listStyle}>
              {filteredPresetFonts.length > 0 ? (
                filteredPresetFonts.map(renderOption)
              ) : (
                <div style={{ padding: '6px 4px', fontSize: '0.78rem', color: '#94a3b8' }}>
                  검색 결과가 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
