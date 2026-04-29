'use client';

import { useEffect, useMemo, useState } from 'react';
import { FONT_CATALOG, buildGoogleFontsUrl, fontFamilyCSS } from '@/lib/builder/canvas/fonts';
import { useBuilderTheme } from './BuilderThemeContext';

const SYSTEM_FONTS: FontItem[] = [
  { family: 'system-ui', note: 'System' },
  { family: 'sans-serif', note: 'Generic' },
  { family: 'serif', note: 'Generic' },
  { family: 'monospace', note: 'Generic' },
];

const wrapperStyle: React.CSSProperties = {
  position: 'relative',
  width: 220,
  maxWidth: '100%',
};

const triggerStyle: React.CSSProperties = {
  width: '100%',
  height: 36,
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
  width: 220,
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
  maxHeight: 320,
  overflowY: 'auto',
};

function optionStyle(active: boolean): React.CSSProperties {
  return {
    width: '100%',
    minHeight: 36,
    padding: '6px 10px',
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
    return FONT_CATALOG
      .filter((font) => font.family !== 'system-ui')
      .map((font) => ({
        family: font.family,
        note: font.cjk ? 'CJK' : font.category,
      }));
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredSystemFonts = SYSTEM_FONTS.filter((font) =>
    font.family.toLowerCase().includes(normalizedQuery));
  const filteredSiteFonts = siteFonts.filter((font) =>
    font.family.toLowerCase().includes(normalizedQuery));
  const filteredPresetFonts = presetFonts.filter((font) =>
    font.family.toLowerCase().includes(normalizedQuery));

  const currentFont = value || 'system-ui';
  const currentShownInLists = [...filteredSystemFonts, ...filteredSiteFonts, ...filteredPresetFonts]
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

  useEffect(() => {
    if (!open) return undefined;
    const visibleGoogleFonts = filteredPresetFonts.slice(0, 30).map((font) => font.family);
    const url = buildGoogleFontsUrl(visibleGoogleFonts);
    if (!url) return undefined;
    const link = window.document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.dataset.builderFontPreview = 'true';
    window.document.head.appendChild(link);
    return () => {
      link.remove();
    };
  }, [filteredPresetFonts, open]);

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
      <div style={{ marginTop: 2, fontSize: '0.78rem', lineHeight: 1.1, color: '#334155' }}>
        Aa 안녕하세요 你好 Hello
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={sectionLabelStyle}>System</span>
            <div style={listStyle}>
              {filteredSystemFonts.length > 0 ? (
                filteredSystemFonts.map(renderOption)
              ) : (
                <div style={{ padding: '6px 4px', fontSize: '0.78rem', color: '#94a3b8' }}>
                  검색 결과가 없습니다.
                </div>
              )}
            </div>
          </div>

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
