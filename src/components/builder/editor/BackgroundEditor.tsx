'use client';

import { useEffect, useMemo, useState } from 'react';
import type {
  BuilderBackgroundValue,
  BuilderColorValue,
  BuilderGradientBackground,
  BuilderImageBackground,
  ThemeColorToken,
} from '@/lib/builder/site/theme';
import type { Locale } from '@/lib/locales';
import {
  isGradientBackgroundValue,
  isImageBackgroundValue,
  resolveBackgroundStyle,
} from '@/lib/builder/site/theme';
import { useBuilderTheme } from '@/components/builder/editor/BuilderThemeContext';
import ColorPicker from '@/components/builder/editor/ColorPicker';
import { getBackgroundEditorCopy, type BackgroundMode } from '@/components/builder/editor/background-editor-copy';

interface ThemeSwatch {
  token: ThemeColorToken;
  label: string;
  color: string;
}

interface BuilderAssetListItem {
  filename: string;
  url: string;
  size?: number;
  uploadedAt?: string;
}

const DEFAULT_GRADIENT: BuilderGradientBackground = {
  kind: 'gradient',
  type: 'linear',
  angle: 180,
  stops: [
    { color: { kind: 'token', token: 'primary' }, position: 0 },
    { color: { kind: 'token', token: 'secondary' }, position: 100 },
  ],
};

const DEFAULT_IMAGE: BuilderImageBackground = {
  kind: 'image',
  src: '',
  size: 'cover',
  position: 'center',
  repeat: 'no-repeat',
};

const modeRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: 4,
};

function modeButtonStyle(active: boolean): React.CSSProperties {
  return {
    minHeight: 30,
    border: active ? '1px solid #116dff' : '1px solid #cbd5e1',
    borderRadius: 6,
    background: active ? '#eff6ff' : '#fff',
    color: active ? '#0b5cdb' : '#334155',
    fontSize: '0.74rem',
    fontWeight: 700,
    cursor: 'pointer',
  };
}

const panelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  padding: 10,
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  background: '#f8fafc',
};

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.72rem',
  fontWeight: 700,
  color: '#475569',
};

const inlineRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '88px 1fr',
  gap: 8,
  alignItems: 'center',
};

const inputStyle: React.CSSProperties = {
  minHeight: 30,
  border: '1px solid #cbd5e1',
  borderRadius: 6,
  background: '#fff',
  color: '#0f172a',
  fontSize: '0.78rem',
  padding: '4px 8px',
  boxSizing: 'border-box',
};

const assetGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: 6,
};

function isColorValue(value: BuilderBackgroundValue | undefined): value is BuilderColorValue {
  return !isGradientBackgroundValue(value) && !isImageBackgroundValue(value);
}

function normalizeMode(value: BuilderBackgroundValue | undefined): BackgroundMode {
  if (!value || value === 'transparent') return 'none';
  if (isGradientBackgroundValue(value)) return 'gradient';
  if (isImageBackgroundValue(value)) return 'image';
  if (typeof value === 'string' && (value.startsWith('linear-gradient') || value.startsWith('radial-gradient'))) {
    return 'gradient';
  }
  if (typeof value === 'string' && (value.startsWith('url(') || value.startsWith('http'))) {
    return 'image';
  }
  return 'solid';
}

function parseLegacyGradient(value: string): BuilderGradientBackground {
  const angleMatch = value.match(/(\d+)deg/);
  const colors = value.match(/#[0-9a-fA-F]{6}|rgba?\([^)]+\)/g) ?? ['#123b63', '#1e5a96'];
  return {
    kind: 'gradient',
    type: value.startsWith('radial-gradient') ? 'radial' : 'linear',
    angle: angleMatch ? Number(angleMatch[1]) : 180,
    stops: [
      { color: colors[0] ?? '#123b63', position: 0 },
      { color: colors[1] ?? '#1e5a96', position: 100 },
    ],
  };
}

function parseLegacyImage(value: string): BuilderImageBackground {
  const urlMatch = value.match(/url\(["']?([^"')]+)["']?\)/);
  return {
    ...DEFAULT_IMAGE,
    src: urlMatch?.[1] ?? (value.startsWith('http') ? value : ''),
    size: value.includes('contain') ? 'contain' : 'cover',
  };
}

function getGradient(value: BuilderBackgroundValue | undefined): BuilderGradientBackground {
  if (isGradientBackgroundValue(value)) return value;
  if (typeof value === 'string' && value.includes('gradient')) return parseLegacyGradient(value);
  return DEFAULT_GRADIENT;
}

function getImage(value: BuilderBackgroundValue | undefined): BuilderImageBackground {
  if (isImageBackgroundValue(value)) return value;
  if (typeof value === 'string' && (value.startsWith('url(') || value.startsWith('http'))) {
    return parseLegacyImage(value);
  }
  return DEFAULT_IMAGE;
}

function getSolid(value: BuilderBackgroundValue | undefined): BuilderColorValue {
  if (isColorValue(value)) return value ?? { kind: 'token', token: 'background' };
  return { kind: 'token', token: 'background' };
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export default function BackgroundEditor({
  value,
  disabled = false,
  locale = 'ko',
  paletteTokens,
  onChange,
}: {
  value: BuilderBackgroundValue;
  disabled?: boolean;
  locale?: Locale;
  paletteTokens: ThemeSwatch[];
  onChange: (value: BuilderBackgroundValue) => void;
}) {
  const theme = useBuilderTheme();
  const copy = getBackgroundEditorCopy(locale);
  const [mode, setMode] = useState<BackgroundMode>(() => normalizeMode(value));
  const [assetOpen, setAssetOpen] = useState(false);
  const [assets, setAssets] = useState<BuilderAssetListItem[]>([]);
  const [assetError, setAssetError] = useState<string | null>(null);
  const [loadingAssets, setLoadingAssets] = useState(false);

  useEffect(() => {
    setMode(normalizeMode(value));
  }, [value]);

  useEffect(() => {
    if (!assetOpen) return;
    let cancelled = false;
    async function loadAssets() {
      setLoadingAssets(true);
      setAssetError(null);
      try {
        const response = await fetch(`/api/builder/assets?locale=${encodeURIComponent(locale)}&limit=18`, {
          credentials: 'same-origin',
        });
        const payload = (await response.json().catch(() => ({}))) as {
          ok?: boolean;
          assets?: BuilderAssetListItem[];
          error?: string;
        };
        if (cancelled) return;
        if (!response.ok || payload.ok === false) {
          setAssetError(payload.error ?? copy.assetLoadError);
          return;
        }
        setAssets(payload.assets ?? []);
      } catch {
        if (!cancelled) setAssetError(copy.assetLoadError);
      } finally {
        if (!cancelled) setLoadingAssets(false);
      }
    }
    void loadAssets();
    return () => {
      cancelled = true;
    };
  }, [assetOpen, copy.assetLoadError, locale]);

  const gradient = useMemo(() => getGradient(value), [value]);
  const image = useMemo(() => getImage(value), [value]);
  const previewStyle = resolveBackgroundStyle(mode === 'none' ? 'transparent' : value, theme);

  const selectMode = (nextMode: BackgroundMode) => {
    setMode(nextMode);
    if (nextMode === 'none') onChange('transparent');
    if (nextMode === 'solid') onChange(getSolid(value));
    if (nextMode === 'gradient') onChange(getGradient(value));
    if (nextMode === 'image') onChange(getImage(value));
  };

  const updateGradient = (patch: Partial<BuilderGradientBackground>) => {
    onChange({
      ...gradient,
      ...patch,
      stops: patch.stops ?? gradient.stops,
    });
  };

  const updateImage = (patch: Partial<BuilderImageBackground>) => {
    onChange({
      ...image,
      ...patch,
    });
  };

  const updateStop = (index: number, patch: Partial<BuilderGradientBackground['stops'][number]>) => {
    updateGradient({
      stops: gradient.stops.map((stop, stopIndex) => (
        stopIndex === index ? { ...stop, ...patch } : stop
      )),
    });
  };

  return (
    <div style={panelStyle}>
      <div style={modeRowStyle}>
        {([
          'solid',
          'gradient',
          'image',
          'none',
        ] as const).map((key) => (
          <button
            key={key}
            type="button"
            style={modeButtonStyle(mode === key)}
            disabled={disabled}
            onClick={() => selectMode(key)}
          >
            {copy.modeLabels[key]}
          </button>
        ))}
      </div>

      {mode === 'solid' ? (
        <div style={fieldStyle}>
          <span style={labelStyle}>{copy.fillColorLabel}</span>
          <ColorPicker
            value={getSolid(value)}
            paletteTokens={paletteTokens}
            disabled={disabled}
            locale={locale}
            onChange={onChange}
          />
        </div>
      ) : null}

      {mode === 'gradient' ? (
        <>
          <div style={inlineRowStyle}>
            <span style={labelStyle}>{copy.gradientTypeLabel}</span>
            <select
              style={inputStyle}
              value={gradient.type}
              disabled={disabled}
              onChange={(event) => updateGradient({ type: event.target.value === 'radial' ? 'radial' : 'linear' })}
            >
              <option value="linear">{copy.gradientTypeOptions.linear}</option>
              <option value="radial">{copy.gradientTypeOptions.radial}</option>
            </select>
          </div>
          {gradient.type === 'linear' ? (
            <div style={inlineRowStyle}>
              <span style={labelStyle}>{copy.angleLabel}</span>
              <input
                style={inputStyle}
                type="number"
                min={0}
                max={360}
                value={gradient.angle}
                disabled={disabled}
                onChange={(event) => updateGradient({ angle: clampNumber(Number(event.target.value), 0, 360) })}
              />
            </div>
          ) : null}
          {gradient.stops.map((stop, index) => (
            <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 68px 28px', gap: 6, alignItems: 'end' }}>
              <div style={fieldStyle}>
                <span style={labelStyle}>{copy.stopLabel(index + 1)}</span>
                <ColorPicker
                  value={stop.color}
                  paletteTokens={paletteTokens}
                  disabled={disabled}
                  locale={locale}
                  onChange={(color) => updateStop(index, { color })}
                />
              </div>
              <input
                style={inputStyle}
                type="number"
                min={0}
                max={100}
                value={stop.position}
                disabled={disabled}
                aria-label={copy.stopPositionAriaLabel(index + 1)}
                onChange={(event) => updateStop(index, { position: clampNumber(Number(event.target.value), 0, 100) })}
              />
              <button
                type="button"
                style={modeButtonStyle(false)}
                disabled={disabled || gradient.stops.length <= 2}
                aria-label={copy.removeStopAriaLabel(index + 1)}
                onClick={() => updateGradient({ stops: gradient.stops.filter((_, stopIndex) => stopIndex !== index) })}
              >
                -
              </button>
            </div>
          ))}
          <button
            type="button"
            style={modeButtonStyle(false)}
            disabled={disabled || gradient.stops.length >= 5}
            onClick={() => updateGradient({
              stops: [
                ...gradient.stops,
                { color: { kind: 'token', token: 'accent' }, position: 50 },
              ],
            })}
          >
            {copy.addStopLabel}
          </button>
        </>
      ) : null}

      {mode === 'image' ? (
        <>
          <div style={fieldStyle}>
            <span style={labelStyle}>{copy.imageUrlLabel}</span>
            <input
              style={inputStyle}
              type="url"
              value={image.src}
              placeholder={copy.imageUrlPlaceholder}
              disabled={disabled}
              onChange={(event) => updateImage({ src: event.target.value })}
            />
          </div>
          <button
            type="button"
            style={modeButtonStyle(assetOpen)}
            disabled={disabled}
            onClick={() => setAssetOpen((open) => !open)}
          >
            {copy.chooseAssetsLabel}
          </button>
          {assetOpen ? (
            <div style={fieldStyle}>
              {loadingAssets ? <span style={labelStyle}>{copy.loadingAssetsLabel}</span> : null}
              {assetError ? <span style={{ ...labelStyle, color: '#dc2626' }}>{assetError}</span> : null}
              {!loadingAssets && assets.length === 0 && !assetError ? (
                <span style={labelStyle}>{copy.noAssetsLabel}</span>
              ) : null}
              <div style={assetGridStyle}>
                {assets.map((asset) => (
                  <button
                    key={asset.filename}
                    type="button"
                    title={asset.filename}
                    style={{
                      height: 58,
                      border: image.src === asset.url ? '2px solid #116dff' : '1px solid #cbd5e1',
                      borderRadius: 6,
                      background: `url("${asset.url.replace(/"/g, '%22')}") center/cover no-repeat`,
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      updateImage({ src: asset.url });
                      setAssetOpen(false);
                    }}
                  />
                ))}
              </div>
            </div>
          ) : null}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={fieldStyle}>
              <span style={labelStyle}>{copy.imageSizeLabel}</span>
              <select
                style={inputStyle}
                value={image.size}
                disabled={disabled}
                onChange={(event) => updateImage({ size: event.target.value as BuilderImageBackground['size'] })}
              >
                <option value="cover">{copy.imageSizeOptions.cover}</option>
                <option value="contain">{copy.imageSizeOptions.contain}</option>
                <option value="auto">{copy.imageSizeOptions.auto}</option>
              </select>
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>{copy.imageRepeatLabel}</span>
              <select
                style={inputStyle}
                value={image.repeat}
                disabled={disabled}
                onChange={(event) => updateImage({ repeat: event.target.value as BuilderImageBackground['repeat'] })}
              >
                <option value="no-repeat">{copy.imageRepeatOptions['no-repeat']}</option>
                <option value="repeat">{copy.imageRepeatOptions.repeat}</option>
                <option value="repeat-x">{copy.imageRepeatOptions['repeat-x']}</option>
                <option value="repeat-y">{copy.imageRepeatOptions['repeat-y']}</option>
              </select>
            </div>
          </div>
          <div style={fieldStyle}>
            <span style={labelStyle}>{copy.imagePositionLabel}</span>
            <select
              style={inputStyle}
              value={image.position}
              disabled={disabled}
              onChange={(event) => updateImage({ position: event.target.value as BuilderImageBackground['position'] })}
            >
              <option value="center">{copy.imagePositionOptions.center}</option>
              <option value="top">{copy.imagePositionOptions.top}</option>
              <option value="bottom">{copy.imagePositionOptions.bottom}</option>
              <option value="left">{copy.imagePositionOptions.left}</option>
              <option value="right">{copy.imagePositionOptions.right}</option>
              <option value="top-left">{copy.imagePositionOptions['top-left']}</option>
              <option value="top-right">{copy.imagePositionOptions['top-right']}</option>
              <option value="bottom-left">{copy.imagePositionOptions['bottom-left']}</option>
              <option value="bottom-right">{copy.imagePositionOptions['bottom-right']}</option>
            </select>
          </div>
          <div style={fieldStyle}>
            <span style={labelStyle}>{copy.overlayLabel}</span>
            <ColorPicker
              value={image.overlayColor ?? 'transparent'}
              paletteTokens={paletteTokens}
              disabled={disabled}
              locale={locale}
              onChange={(color) => updateImage({ overlayColor: color })}
            />
            <input
              style={inputStyle}
              type="number"
              min={0}
              max={100}
              value={image.overlayOpacity ?? 0}
              disabled={disabled}
              aria-label={copy.overlayOpacityAriaLabel}
              onChange={(event) => updateImage({ overlayOpacity: clampNumber(Number(event.target.value), 0, 100) })}
            />
          </div>
        </>
      ) : null}

      <div
        aria-hidden
        style={{
          height: 40,
          borderRadius: 6,
          border: '1px solid #e2e8f0',
          ...previewStyle,
        }}
      />
    </div>
  );
}
