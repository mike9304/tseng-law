'use client';

import { useEffect, useMemo, useState } from 'react';
import type { BuilderColorValue, ThemeColorToken } from '@/lib/builder/site/theme';
import {
  THEME_COLOR_LABELS,
  isThemeColorReference,
} from '@/lib/builder/site/theme';

const RECENT_COLORS_KEY = 'builder-color-picker-recent-v1';

interface ThemeSwatch {
  token: ThemeColorToken;
  label?: string;
  color: string;
}

function normalizeHex(value: string): string {
  if (/^#[0-9a-f]{6}$/i.test(value)) return value.toLowerCase();
  return '#0f172a';
}

function normalizeCustomValue(value: string): string {
  const trimmed = value.trim();
  return /^#[0-9a-f]{6}$/i.test(trimmed) ? trimmed.toLowerCase() : trimmed;
}

function isSupportedColorText(value: string): boolean {
  const trimmed = value.trim();
  return (
    /^#[0-9a-f]{6}$/i.test(trimmed)
    || /^hsla?\([\d\s.,%+-]+\)$/i.test(trimmed)
    || /^rgba?\([\d\s.,%+-]+\)$/i.test(trimmed)
    || trimmed === 'transparent'
  );
}

function colorToText(value: BuilderColorValue | undefined): string {
  if (isThemeColorReference(value)) return `token:${value.token}`;
  return typeof value === 'string' ? value : '';
}

function resolveCurrentColor(
  value: BuilderColorValue | undefined,
  paletteTokens: ThemeSwatch[],
): string {
  if (isThemeColorReference(value)) {
    return paletteTokens.find((item) => item.token === value.token)?.color ?? '#0f172a';
  }
  return typeof value === 'string' && value.trim().length > 0 ? value : '#0f172a';
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

const colorInputStyle: React.CSSProperties = {
  width: 42,
  height: 34,
  padding: 2,
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  background: '#fff',
  cursor: 'pointer',
};

const textInputStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  padding: '7px 10px',
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  fontSize: '0.82rem',
  color: '#0f172a',
  outline: 'none',
  boxSizing: 'border-box',
};

const sectionStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

const sectionLabelStyle: React.CSSProperties = {
  fontSize: '0.72rem',
  fontWeight: 700,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: '#64748b',
};

const swatchGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(8, 12px)',
  gap: 8,
  alignItems: 'center',
};

function swatchStyle(color: string, active: boolean): React.CSSProperties {
  return {
    width: 12,
    height: 12,
    borderRadius: 4,
    border: active ? '2px solid #116dff' : '1px solid rgba(15, 23, 42, 0.18)',
    outline: active ? '2px solid rgba(17, 109, 255, 0.18)' : 'none',
    outlineOffset: 2,
    background: color,
    cursor: 'pointer',
    padding: 0,
  };
}

export default function ColorPicker({
  value,
  onChange,
  palette,
  paletteTokens,
  disabled = false,
}: {
  value?: BuilderColorValue;
  onChange: (value: BuilderColorValue) => void;
  palette?: string[];
  paletteTokens?: ThemeSwatch[];
  disabled?: boolean;
}) {
  const normalizedTokens = useMemo<ThemeSwatch[]>(
    () => paletteTokens ?? [],
    [paletteTokens],
  );
  const fallbackPaletteColors = useMemo(
    () => [...new Set((palette ?? []).map(normalizeHex))],
    [palette],
  );
  const currentColor = resolveCurrentColor(value, normalizedTokens);
  const currentHex = normalizeHex(currentColor);
  const activeToken = isThemeColorReference(value) ? value.token : null;
  const [textValue, setTextValue] = useState(colorToText(value));
  const [recentColors, setRecentColors] = useState<string[]>([]);

  useEffect(() => {
    setTextValue(colorToText(value));
  }, [value]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(RECENT_COLORS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return;
      setRecentColors(
        parsed
          .filter((color): color is string => typeof color === 'string' && isSupportedColorText(color))
          .slice(0, 5),
      );
    } catch {
      setRecentColors([]);
    }
  }, []);

  const pushRecent = (nextColor: string) => {
    const normalized = normalizeCustomValue(nextColor);
    if (!isSupportedColorText(normalized) || normalized === 'transparent') return;
    setRecentColors((current) => {
      const next = [
        normalized,
        ...current.filter((color) => color !== normalized),
      ].slice(0, 5);
      try {
        window.localStorage.setItem(RECENT_COLORS_KEY, JSON.stringify(next));
      } catch {
        // Storage is optional; keep the in-memory recent list.
      }
      return next;
    });
  };

  const commitCustomColor = (nextValue: string) => {
    if (!isSupportedColorText(nextValue)) return;
    const normalized = normalizeCustomValue(nextValue);
    setTextValue(normalized);
    pushRecent(normalized);
    onChange(normalized);
  };

  return (
    <div style={containerStyle}>
      {normalizedTokens.length > 0 ? (
        <div style={sectionStyle}>
          <span style={sectionLabelStyle}>Theme palette</span>
          <div style={swatchGridStyle}>
            {normalizedTokens.map((item) => (
              <button
                key={item.token}
                type="button"
                title={`${item.label ?? THEME_COLOR_LABELS[item.token]} · ${item.color}`}
                disabled={disabled}
                style={swatchStyle(item.color, activeToken === item.token)}
                onClick={() => onChange({ kind: 'token', token: item.token })}
              />
            ))}
          </div>
        </div>
      ) : fallbackPaletteColors.length > 0 ? (
        <div style={sectionStyle}>
          <span style={sectionLabelStyle}>Theme palette</span>
          <div style={swatchGridStyle}>
            {fallbackPaletteColors.map((color) => (
              <button
                key={color}
                type="button"
                title={color}
                disabled={disabled}
                style={swatchStyle(color, !activeToken && color === currentHex)}
                onClick={() => commitCustomColor(color)}
              />
            ))}
          </div>
        </div>
      ) : null}

      {recentColors.length > 0 ? (
        <div style={sectionStyle}>
          <span style={sectionLabelStyle}>Recent</span>
          <div style={swatchGridStyle}>
            {recentColors.map((color) => (
              <button
                key={color}
                type="button"
                title={color}
                disabled={disabled}
                style={swatchStyle(color, !activeToken && color === currentColor)}
                onClick={() => commitCustomColor(color)}
              />
            ))}
          </div>
        </div>
      ) : null}

      <div style={rowStyle}>
        <input
          type="color"
          value={currentHex}
          disabled={disabled}
          style={colorInputStyle}
          onChange={(event) => commitCustomColor(event.target.value)}
        />
        <input
          type="text"
          value={textValue}
          disabled={disabled}
          placeholder="#123b63 or hsl(211 70% 40%)"
          style={textInputStyle}
          onChange={(event) => {
            const nextValue = event.target.value;
            setTextValue(nextValue);
            if (isSupportedColorText(nextValue)) {
              onChange(normalizeCustomValue(nextValue));
            }
          }}
          onBlur={() => {
            if (isSupportedColorText(textValue)) {
              commitCustomColor(textValue);
              return;
            }
            setTextValue(colorToText(value));
          }}
        />
      </div>
    </div>
  );
}
