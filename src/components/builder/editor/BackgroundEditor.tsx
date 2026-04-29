'use client';

import { useEffect, useMemo, useState } from 'react';
import type {
  BuilderBackgroundValue,
  BuilderColorValue,
  BuilderGradientBackground,
  BuilderImageBackground,
  ThemeColorToken,
} from '@/lib/builder/site/theme';
import {
  isGradientBackgroundValue,
  isImageBackgroundValue,
  resolveBackgroundStyle,
} from '@/lib/builder/site/theme';
import { useBuilderTheme } from '@/components/builder/editor/BuilderThemeContext';
import ColorPicker from '@/components/builder/editor/ColorPicker';

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

type BackgroundMode = 'solid' | 'gradient' | 'image' | 'none';

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

function inferLocale(): string {
  if (typeof window === 'undefined') return 'ko';
  const segment = window.location.pathname.split('/').filter(Boolean)[0];
  return segment || 'ko';
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
  paletteTokens,
  onChange,
}: {
  value: BuilderBackgroundValue;
  disabled?: boolean;
  paletteTokens: ThemeSwatch[];
  onChange: (value: BuilderBackgroundValue) => void;
}) {
  const theme = useBuilderTheme();
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
        const response = await fetch(`/api/builder/assets?locale=${encodeURIComponent(inferLocale())}&limit=18`, {
          credentials: 'same-origin',
        });
        const payload = (await response.json().catch(() => ({}))) as {
          ok?: boolean;
          assets?: BuilderAssetListItem[];
          error?: string;
        };
        if (cancelled) return;
        if (!response.ok || payload.ok === false) {
          setAssetError(payload.error ?? 'Failed to load assets.');
          return;
        }
        setAssets(payload.assets ?? []);
      } catch {
        if (!cancelled) setAssetError('Failed to load assets.');
      } finally {
        if (!cancelled) setLoadingAssets(false);
      }
    }
    void loadAssets();
    return () => {
      cancelled = true;
    };
  }, [assetOpen]);

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
          ['solid', 'Solid'],
          ['gradient', 'Gradient'],
          ['image', 'Image'],
          ['none', 'None'],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            type="button"
            style={modeButtonStyle(mode === key)}
            disabled={disabled}
            onClick={() => selectMode(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === 'solid' ? (
        <div style={fieldStyle}>
          <span style={labelStyle}>Fill color</span>
          <ColorPicker
            value={getSolid(value)}
            paletteTokens={paletteTokens}
            disabled={disabled}
            onChange={onChange}
          />
        </div>
      ) : null}

      {mode === 'gradient' ? (
        <>
          <div style={inlineRowStyle}>
            <span style={labelStyle}>Type</span>
            <select
              style={inputStyle}
              value={gradient.type}
              disabled={disabled}
              onChange={(event) => updateGradient({ type: event.target.value === 'radial' ? 'radial' : 'linear' })}
            >
              <option value="linear">Linear</option>
              <option value="radial">Radial</option>
            </select>
          </div>
          {gradient.type === 'linear' ? (
            <div style={inlineRowStyle}>
              <span style={labelStyle}>Angle</span>
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
                <span style={labelStyle}>Stop {index + 1}</span>
                <ColorPicker
                  value={stop.color}
                  paletteTokens={paletteTokens}
                  disabled={disabled}
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
                aria-label={`Stop ${index + 1} position`}
                onChange={(event) => updateStop(index, { position: clampNumber(Number(event.target.value), 0, 100) })}
              />
              <button
                type="button"
                style={modeButtonStyle(false)}
                disabled={disabled || gradient.stops.length <= 2}
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
            Add stop
          </button>
        </>
      ) : null}

      {mode === 'image' ? (
        <>
          <div style={fieldStyle}>
            <span style={labelStyle}>Image URL</span>
            <input
              style={inputStyle}
              type="url"
              value={image.src}
              placeholder="https://example.com/image.jpg"
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
            Choose from assets
          </button>
          {assetOpen ? (
            <div style={fieldStyle}>
              {loadingAssets ? <span style={labelStyle}>Loading assets...</span> : null}
              {assetError ? <span style={{ ...labelStyle, color: '#dc2626' }}>{assetError}</span> : null}
              {!loadingAssets && assets.length === 0 && !assetError ? (
                <span style={labelStyle}>No assets found.</span>
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
              <span style={labelStyle}>Size</span>
              <select
                style={inputStyle}
                value={image.size}
                disabled={disabled}
                onChange={(event) => updateImage({ size: event.target.value as BuilderImageBackground['size'] })}
              >
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
                <option value="auto">Auto</option>
              </select>
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>Repeat</span>
              <select
                style={inputStyle}
                value={image.repeat}
                disabled={disabled}
                onChange={(event) => updateImage({ repeat: event.target.value as BuilderImageBackground['repeat'] })}
              >
                <option value="no-repeat">No repeat</option>
                <option value="repeat">Repeat</option>
                <option value="repeat-x">Repeat X</option>
                <option value="repeat-y">Repeat Y</option>
              </select>
            </div>
          </div>
          <div style={fieldStyle}>
            <span style={labelStyle}>Position</span>
            <select
              style={inputStyle}
              value={image.position}
              disabled={disabled}
              onChange={(event) => updateImage({ position: event.target.value as BuilderImageBackground['position'] })}
            >
              <option value="center">Center</option>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
              <option value="top-left">Top left</option>
              <option value="top-right">Top right</option>
              <option value="bottom-left">Bottom left</option>
              <option value="bottom-right">Bottom right</option>
            </select>
          </div>
          <div style={fieldStyle}>
            <span style={labelStyle}>Overlay</span>
            <ColorPicker
              value={image.overlayColor ?? 'transparent'}
              paletteTokens={paletteTokens}
              disabled={disabled}
              onChange={(color) => updateImage({ overlayColor: color })}
            />
            <input
              style={inputStyle}
              type="number"
              min={0}
              max={100}
              value={image.overlayOpacity ?? 0}
              disabled={disabled}
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
