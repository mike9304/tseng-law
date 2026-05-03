'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import type { BuilderColorValue, ThemeColorToken } from '@/lib/builder/site/theme';
import { THEME_COLOR_LABELS, isThemeColorReference } from '@/lib/builder/site/theme';
import {
  getColorBindingIndicator,
  getThemeBindingBadgeStyle,
  type ThemeBindingIndicator,
} from '@/lib/builder/site/theme-bindings';
import { contrastRatio, normalizeHexColor, wcagLevel } from '@/lib/builder/site/theme/contrast';
import { pushRecentColor, readRecentColors, writeRecentColors } from '@/lib/builder/site/theme/recent-colors';

export interface ThemeSwatch {
  token: ThemeColorToken;
  label?: string;
  color: string;
}

export interface ColorPickerProps {
  value?: BuilderColorValue;
  onChange: (value: BuilderColorValue) => void;
  palette?: string[];
  paletteTokens?: ThemeSwatch[];
  disabled?: boolean;
  enableContrast?: boolean;
}

type EyeDropperConstructor = new () => {
  open: () => Promise<{ sRGBHex: string }>;
};

function normalizeCustomValue(value: string): string {
  const trimmed = value.trim();
  const hex = normalizeHexColor(trimmed);
  return hex ?? trimmed;
}

function isSupportedColorText(value: string): boolean {
  const trimmed = value.trim();
  return (
    Boolean(normalizeHexColor(trimmed)) ||
    /^hsla?\([\d\s.,%+-]+\)$/i.test(trimmed) ||
    /^rgba?\([\d\s.,%+-]+\)$/i.test(trimmed) ||
    trimmed === 'transparent'
  );
}

function colorToText(value: BuilderColorValue | undefined): string {
  if (isThemeColorReference(value)) return `token:${value.token}`;
  return typeof value === 'string' ? value : '';
}

function resolveCurrentColor(value: BuilderColorValue | undefined, paletteTokens: ThemeSwatch[]): string {
  if (isThemeColorReference(value)) {
    return paletteTokens.find((item) => item.token === value.token)?.color ?? '#0f172a';
  }
  return typeof value === 'string' && value.trim() ? value : '#0f172a';
}

function normalizeFallbackPalette(palette: string[] | undefined): string[] {
  return [...new Set((palette ?? []).map((color) => normalizeHexColor(color) ?? color.trim()).filter(Boolean))];
}

function getEyeDropper(): EyeDropperConstructor | null {
  if (typeof window === 'undefined') return null;
  const candidate = (window as unknown as { EyeDropper?: EyeDropperConstructor }).EyeDropper;
  return candidate ?? null;
}

const wrapperStyle: CSSProperties = {
  position: 'relative',
  display: 'inline-flex',
  width: '100%',
  minWidth: 0,
};

const triggerStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '24px minmax(0, 1fr) auto',
  alignItems: 'center',
  gap: 8,
  width: '100%',
  minHeight: 36,
  padding: '6px 9px',
  border: '1px solid #cbd5e1',
  borderRadius: 10,
  background: '#fff',
  color: '#0f172a',
  cursor: 'pointer',
};

const panelStyle: CSSProperties = {
  position: 'absolute',
  top: 'calc(100% + 8px)',
  left: 0,
  zIndex: 70,
  display: 'grid',
  gap: 12,
  width: 320,
  maxWidth: 'min(320px, calc(100vw - 32px))',
  padding: 14,
  border: '1px solid rgba(15, 23, 42, 0.12)',
  borderRadius: 16,
  background: '#fff',
  boxShadow: '0 24px 60px rgba(15, 23, 42, 0.22)',
};

const labelStyle: CSSProperties = {
  color: '#64748b',
  fontSize: 11,
  fontWeight: 850,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
};

const textInputStyle: CSSProperties = {
  width: '100%',
  minHeight: 34,
  padding: '7px 10px',
  border: '1px solid #cbd5e1',
  borderRadius: 9,
  color: '#0f172a',
  fontFamily: 'JetBrains Mono, SFMono-Regular, Consolas, monospace',
  fontSize: 12,
  outline: 'none',
  boxSizing: 'border-box',
};

function ThemeBindingBadge({ indicator }: { indicator: ThemeBindingIndicator }) {
  return (
    <span title={indicator.title} style={getThemeBindingBadgeStyle(indicator.tone)}>
      {indicator.label}
    </span>
  );
}

function swatchButtonStyle(color: string, active: boolean): CSSProperties {
  return {
    width: 26,
    height: 26,
    border: active ? '2px solid #116dff' : '1px solid rgba(15, 23, 42, 0.18)',
    borderRadius: 8,
    outline: active ? '2px solid rgba(17, 109, 255, 0.18)' : 'none',
    outlineOffset: 2,
    background: color,
    cursor: 'pointer',
    padding: 0,
  };
}

export default function ColorPickerAdvanced({
  value,
  onChange,
  palette,
  paletteTokens,
  disabled = false,
  enableContrast = true,
}: ColorPickerProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [textValue, setTextValue] = useState(colorToText(value));
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [eyeDropperError, setEyeDropperError] = useState<string | null>(null);
  const normalizedTokens = useMemo(() => paletteTokens ?? [], [paletteTokens]);
  const fallbackPaletteColors = useMemo(() => normalizeFallbackPalette(palette), [palette]);
  const currentColor = resolveCurrentColor(value, normalizedTokens);
  const currentHex = normalizeHexColor(currentColor) ?? '#0f172a';
  const backgroundHex =
    normalizedTokens.find((item) => item.token === 'background')?.color ??
    fallbackPaletteColors[0] ??
    '#ffffff';
  const ratio = enableContrast ? contrastRatio(currentHex, backgroundHex) : null;
  const level = wcagLevel(ratio);
  const activeToken = isThemeColorReference(value) ? value.token : null;
  const bindingIndicator = getColorBindingIndicator(value);
  const EyeDropper = getEyeDropper();

  useEffect(() => {
    setTextValue(colorToText(value));
  }, [value]);

  useEffect(() => {
    setRecentColors(readRecentColors());
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const handleWindowClick = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener('click', handleWindowClick, true);
    return () => window.removeEventListener('click', handleWindowClick, true);
  }, [open]);

  const pushRecent = (nextColor: string) => {
    setRecentColors((current) => {
      const next = pushRecentColor(current, nextColor);
      writeRecentColors(next);
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

  const pickEyeDropper = async () => {
    if (!EyeDropper || disabled) return;
    try {
      const result = await new EyeDropper().open();
      commitCustomColor(result.sRGBHex);
      setEyeDropperError(null);
    } catch {
      setEyeDropperError('EyeDropper cancelled or unavailable.');
    }
  };

  const renderSwatches = (items: Array<{ key: string; label: string; color: string; token?: ThemeColorToken }>) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 26px)', gap: 8 }}>
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          title={`${item.label} · ${item.color}`}
          disabled={disabled}
          style={swatchButtonStyle(item.color, item.token ? activeToken === item.token : item.color === currentHex)}
          onClick={() => {
            if (item.token) {
              onChange({ kind: 'token', token: item.token });
              return;
            }
            commitCustomColor(item.color);
          }}
        />
      ))}
    </div>
  );

  return (
    <div ref={wrapperRef} style={wrapperStyle} data-color-picker-advanced>
      <button
        type="button"
        disabled={disabled}
        style={{ ...triggerStyle, opacity: disabled ? 0.6 : 1 }}
        onClick={() => setOpen((current) => !current)}
      >
        <span style={{ width: 24, height: 24, borderRadius: 7, border: '1px solid #cbd5e1', background: currentColor }} />
        <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12, fontWeight: 800 }}>
          {colorToText(value) || currentColor}
        </span>
        <ThemeBindingBadge indicator={bindingIndicator} />
      </button>

      {open ? (
        <div style={panelStyle} role="dialog" aria-label="Advanced color picker">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
            <div style={{ display: 'grid', gap: 4 }}>
              <strong style={{ color: '#0f172a', fontSize: 13 }}>Color</strong>
              <span style={{ color: '#64748b', fontSize: 11 }}>Theme-linked, detached, recent, and WCAG checks</span>
            </div>
            <ThemeBindingBadge indicator={bindingIndicator} />
          </div>

          {normalizedTokens.length > 0 ? (
            <div style={{ display: 'grid', gap: 7 }}>
              <span style={labelStyle}>Theme palette</span>
              {renderSwatches(normalizedTokens.map((item) => ({
                key: item.token,
                token: item.token,
                color: item.color,
                label: item.label ?? THEME_COLOR_LABELS[item.token],
              })))}
            </div>
          ) : fallbackPaletteColors.length > 0 ? (
            <div style={{ display: 'grid', gap: 7 }}>
              <span style={labelStyle}>Palette</span>
              {renderSwatches(fallbackPaletteColors.map((color) => ({ key: color, color, label: color })))}
            </div>
          ) : null}

          {recentColors.length > 0 ? (
            <div style={{ display: 'grid', gap: 7 }}>
              <span style={labelStyle}>Recent</span>
              {renderSwatches(recentColors.map((color) => ({ key: color, color, label: color })))}
            </div>
          ) : null}

          <div style={{ display: 'grid', gridTemplateColumns: '44px minmax(0, 1fr)', gap: 8 }}>
            <input
              type="color"
              value={currentHex}
              disabled={disabled}
              style={{ width: 44, height: 34, padding: 2, border: '1px solid #cbd5e1', borderRadius: 9, background: '#fff' }}
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
                if (isSupportedColorText(nextValue)) onChange(normalizeCustomValue(nextValue));
              }}
              onBlur={() => {
                if (isSupportedColorText(textValue)) {
                  commitCustomColor(textValue);
                } else {
                  setTextValue(colorToText(value));
                }
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <button
              type="button"
              disabled={!EyeDropper || disabled}
              title={EyeDropper ? 'Pick a color from the screen' : 'EyeDropper is unavailable in this browser'}
              style={{
                minHeight: 30,
                padding: '0 10px',
                border: '1px solid #cbd5e1',
                borderRadius: 9,
                background: EyeDropper ? '#f8fafc' : '#f1f5f9',
                color: EyeDropper ? '#0f172a' : '#94a3b8',
                fontSize: 12,
                fontWeight: 800,
                cursor: EyeDropper ? 'pointer' : 'not-allowed',
              }}
              onClick={pickEyeDropper}
            >
              EyeDropper
            </button>
            {enableContrast ? (
              <span
                title={`Against ${backgroundHex}`}
                style={{
                  ...getThemeBindingBadgeStyle(level === 'fail' ? 'custom' : 'linked'),
                  textTransform: 'none',
                }}
              >
                {ratio ? `${ratio.toFixed(2)}:1 ${level}` : 'Contrast n/a'}
              </span>
            ) : null}
          </div>
          {eyeDropperError ? <span style={{ color: '#92400e', fontSize: 11 }}>{eyeDropperError}</span> : null}
        </div>
      ) : null}
    </div>
  );
}
