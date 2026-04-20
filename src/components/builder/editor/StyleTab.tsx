'use client';

import { useState, useEffect } from 'react';
import type { BuilderCanvasNode, BuilderCanvasNodeStyle } from '@/lib/builder/canvas/types';
import { gradientToCSS, type GradientConfig } from '@/lib/builder/canvas/palette';
import ColorPicker from '@/components/builder/editor/ColorPicker';
import { useBuilderTheme } from '@/components/builder/editor/BuilderThemeContext';
import styles from '@/components/builder/canvas/SandboxPage.module.css';

function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function normalizeHex(value: string): string {
  if (/^#[0-9a-f]{6}$/i.test(value)) return value;
  return '#0f172a';
}

function NumberField({
  label,
  value,
  min,
  max,
  onCommit,
  disabled,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onCommit: (value: number) => void;
  disabled?: boolean;
}) {
  return (
    <label className={styles.inspectorField}>
      <span className={styles.inspectorFieldLabel}>{label}</span>
      <input
        className={styles.inspectorInput}
        type="number"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(event) => onCommit(clampNumber(Math.round(Number(event.target.value)), min, max))}
      />
    </label>
  );
}

/* ── Background mode helpers ────────────────────────────────────── */

type BgMode = 'solid' | 'gradient' | 'image';

function detectBgMode(bg: string): BgMode {
  if (bg.startsWith('linear-gradient') || bg.startsWith('radial-gradient')) return 'gradient';
  if (bg.startsWith('url(') || bg.startsWith('http')) return 'image';
  return 'solid';
}

function parseGradientFromCSS(bg: string): { angle: number; startColor: string; endColor: string } {
  const angleMatch = bg.match(/(\d+)deg/);
  const colorMatches = bg.match(/#[0-9a-fA-F]{6}/g);
  return {
    angle: angleMatch ? parseInt(angleMatch[1], 10) : 180,
    startColor: colorMatches?.[0] ?? '#123b63',
    endColor: colorMatches?.[1] ?? '#1e5a96',
  };
}

function parseImageFromCSS(bg: string): { url: string; sizing: 'cover' | 'contain' } {
  const urlMatch = bg.match(/url\(['"]?([^'")\s]+)['"]?\)/);
  const sizing = bg.includes('contain') ? 'contain' as const : 'cover' as const;
  return {
    url: urlMatch?.[1] ?? '',
    sizing,
  };
}

/* ── Inline styles for background section ───────────────────────── */

const bgSectionStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: '8px 0',
  borderTop: '1px solid #e2e8f0',
  marginTop: 8,
};

const bgHeaderStyle: React.CSSProperties = {
  fontSize: '0.72rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#64748b',
  marginBottom: 4,
};

const bgModeRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 4,
};

function bgModeBtnStyle(active: boolean): React.CSSProperties {
  return {
    flex: 1,
    padding: '4px 8px',
    fontSize: '0.75rem',
    fontWeight: 600,
    border: active ? '1px solid #116dff' : '1px solid #cbd5e1',
    borderRadius: 6,
    background: active ? '#eff6ff' : '#fff',
    color: active ? '#116dff' : '#334155',
    cursor: 'pointer',
  };
}

const bgFieldRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

const bgFieldLabelStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: '#64748b',
  minWidth: 48,
};

const bgPreviewStyle = (bg: string): React.CSSProperties => ({
  width: '100%',
  height: 32,
  borderRadius: 6,
  border: '1px solid #e2e8f0',
  background: bg || '#fff',
  marginTop: 4,
});

/* ── Component ──────────────────────────────────────────────────── */

export default function StyleTab({
  node,
  disabled = false,
  onUpdateStyle,
}: {
  node: BuilderCanvasNode;
  disabled?: boolean;
  onUpdateStyle: (style: Partial<BuilderCanvasNodeStyle>) => void;
}) {
  const theme = useBuilderTheme();
  const palette = [
    theme.colors.primary,
    theme.colors.secondary,
    theme.colors.accent,
    theme.colors.text,
    theme.colors.background,
    theme.colors.muted,
  ];
  const currentBg = node.style.backgroundColor;
  const [bgMode, setBgMode] = useState<BgMode>(() => detectBgMode(currentBg));

  // Gradient state
  const initialGrad = bgMode === 'gradient' ? parseGradientFromCSS(currentBg) : null;
  const [gradAngle, setGradAngle] = useState(initialGrad?.angle ?? 180);
  const [gradStart, setGradStart] = useState(initialGrad?.startColor ?? '#123b63');
  const [gradEnd, setGradEnd] = useState(initialGrad?.endColor ?? '#1e5a96');

  // Image state
  const initialImg = bgMode === 'image' ? parseImageFromCSS(currentBg) : null;
  const [imgUrl, setImgUrl] = useState(initialImg?.url ?? '');
  const [imgSizing, setImgSizing] = useState<'cover' | 'contain'>(initialImg?.sizing ?? 'cover');

  // Sync when node changes externally
  useEffect(() => {
    const mode = detectBgMode(currentBg);
    setBgMode(mode);
    if (mode === 'gradient') {
      const parsed = parseGradientFromCSS(currentBg);
      setGradAngle(parsed.angle);
      setGradStart(parsed.startColor);
      setGradEnd(parsed.endColor);
    } else if (mode === 'image') {
      const parsed = parseImageFromCSS(currentBg);
      setImgUrl(parsed.url);
      setImgSizing(parsed.sizing);
    }
  }, [currentBg]);

  const applyGradient = (angle: number, start: string, end: string) => {
    const config: GradientConfig = {
      type: 'linear',
      angle,
      stops: [
        { color: start, position: 0 },
        { color: end, position: 100 },
      ],
    };
    onUpdateStyle({ backgroundColor: gradientToCSS(config) });
  };

  const applyImage = (url: string, sizing: 'cover' | 'contain') => {
    if (!url) {
      onUpdateStyle({ backgroundColor: 'transparent' });
      return;
    }
    onUpdateStyle({ backgroundColor: `url(${url}) center/${sizing} no-repeat` });
  };

  const handleModeChange = (mode: BgMode) => {
    setBgMode(mode);
    if (mode === 'solid') {
      onUpdateStyle({ backgroundColor: normalizeHex(gradStart) });
    } else if (mode === 'gradient') {
      applyGradient(gradAngle, gradStart, gradEnd);
    } else {
      applyImage(imgUrl, imgSizing);
    }
  };

  // Compute preview string
  let bgPreview = currentBg;
  if (bgMode === 'gradient') {
    bgPreview = gradientToCSS({ type: 'linear', angle: gradAngle, stops: [{ color: gradStart, position: 0 }, { color: gradEnd, position: 100 }] });
  } else if (bgMode === 'image' && imgUrl) {
    bgPreview = `url(${imgUrl}) center/${imgSizing} no-repeat`;
  }

  return (
    <div className={styles.inspectorFormStack}>
      {/* ── Background section ────────────────────────────────── */}
      <div style={bgSectionStyle}>
        <div style={bgHeaderStyle}>배경</div>

        <div style={bgModeRowStyle}>
          <button type="button" style={bgModeBtnStyle(bgMode === 'solid')} disabled={disabled} onClick={() => handleModeChange('solid')}>
            단색
          </button>
          <button type="button" style={bgModeBtnStyle(bgMode === 'gradient')} disabled={disabled} onClick={() => handleModeChange('gradient')}>
            그라디언트
          </button>
          <button type="button" style={bgModeBtnStyle(bgMode === 'image')} disabled={disabled} onClick={() => handleModeChange('image')}>
            이미지
          </button>
        </div>

        {bgMode === 'solid' ? (
          <label className={styles.inspectorField}>
            <span className={styles.inspectorFieldLabel}>배경색</span>
            <ColorPicker
              value={normalizeHex(currentBg)}
              palette={palette}
              disabled={disabled}
              onChange={(hex) => onUpdateStyle({ backgroundColor: hex })}
            />
          </label>
        ) : null}

        {bgMode === 'gradient' ? (
          <>
            <div style={bgFieldRowStyle}>
              <span style={bgFieldLabelStyle}>방향</span>
              <input
                type="range"
                min={0}
                max={360}
                step={1}
                value={gradAngle}
                disabled={disabled}
                style={{ flex: 1 }}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setGradAngle(v);
                  applyGradient(v, gradStart, gradEnd);
                }}
              />
              <input
                type="number"
                min={0}
                max={360}
                value={gradAngle}
                disabled={disabled}
                style={{ width: 52, fontSize: '0.78rem', padding: '2px 4px', border: '1px solid #cbd5e1', borderRadius: 4 }}
                onChange={(e) => {
                  const v = clampNumber(Number(e.target.value), 0, 360);
                  setGradAngle(v);
                  applyGradient(v, gradStart, gradEnd);
                }}
              />
            </div>
            <div style={bgFieldRowStyle}>
              <span style={bgFieldLabelStyle}>시작색</span>
              <input
                type="color"
                value={normalizeHex(gradStart)}
                disabled={disabled}
                onChange={(e) => {
                  setGradStart(e.target.value);
                  applyGradient(gradAngle, e.target.value, gradEnd);
                }}
              />
            </div>
            <div style={bgFieldRowStyle}>
              <span style={bgFieldLabelStyle}>끝색</span>
              <input
                type="color"
                value={normalizeHex(gradEnd)}
                disabled={disabled}
                onChange={(e) => {
                  setGradEnd(e.target.value);
                  applyGradient(gradAngle, gradStart, e.target.value);
                }}
              />
            </div>
          </>
        ) : null}

        {bgMode === 'image' ? (
          <>
            <div style={bgFieldRowStyle}>
              <span style={bgFieldLabelStyle}>URL</span>
              <input
                type="text"
                placeholder="https://..."
                value={imgUrl}
                disabled={disabled}
                style={{ flex: 1, fontSize: '0.78rem', padding: '4px 6px', border: '1px solid #cbd5e1', borderRadius: 4 }}
                onChange={(e) => {
                  setImgUrl(e.target.value);
                  applyImage(e.target.value, imgSizing);
                }}
              />
            </div>
            <div style={bgFieldRowStyle}>
              <span style={bgFieldLabelStyle}>크기</span>
              <select
                value={imgSizing}
                disabled={disabled}
                style={{ fontSize: '0.78rem', padding: '2px 4px', border: '1px solid #cbd5e1', borderRadius: 4 }}
                onChange={(e) => {
                  const v = e.target.value as 'cover' | 'contain';
                  setImgSizing(v);
                  applyImage(imgUrl, v);
                }}
              >
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
              </select>
            </div>
          </>
        ) : null}

        {/* Preview */}
        <div style={bgPreviewStyle(bgPreview)} />
      </div>

      {/* ── Border ────────────────────────────────────────────── */}
      <div className={styles.inspectorFieldGrid}>
        <label className={styles.inspectorField}>
          <span className={styles.inspectorFieldLabel}>Border color</span>
          <ColorPicker
            value={normalizeHex(node.style.borderColor)}
            palette={palette}
            disabled={disabled}
            onChange={(hex) => onUpdateStyle({ borderColor: hex })}
          />
        </label>
      </div>

      <div className={styles.inspectorFieldGrid}>
        <NumberField
          label="Border width"
          value={node.style.borderWidth}
          min={0}
          max={12}
          disabled={disabled}
          onCommit={(value) => onUpdateStyle({ borderWidth: value })}
        />
        <label className={styles.inspectorField}>
          <span className={styles.inspectorFieldLabel}>Border style</span>
          <select
            className={styles.inspectorSelect}
            value={node.style.borderStyle}
            disabled={disabled}
            onChange={(event) => onUpdateStyle({ borderStyle: event.target.value as BuilderCanvasNodeStyle['borderStyle'] })}
          >
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
          </select>
        </label>
      </div>

      <div className={styles.inspectorFieldGrid}>
        <NumberField
          label="Radius"
          value={node.style.borderRadius}
          min={0}
          max={64}
          disabled={disabled}
          onCommit={(value) => onUpdateStyle({ borderRadius: value })}
        />
        <label className={styles.inspectorField}>
          <span className={styles.inspectorFieldLabel}>Opacity</span>
          <div className={styles.inspectorRangeRow}>
            <input
              className={styles.inspectorRange}
              type="range"
              min={0}
              max={100}
              value={node.style.opacity}
              disabled={disabled}
              onChange={(event) => onUpdateStyle({ opacity: clampNumber(Number(event.target.value), 0, 100) })}
            />
            <input
              className={styles.inspectorInput}
              type="number"
              min={0}
              max={100}
              value={node.style.opacity}
              disabled={disabled}
              onChange={(event) => onUpdateStyle({ opacity: clampNumber(Number(event.target.value), 0, 100) })}
            />
          </div>
        </label>
      </div>

      <div className={styles.inspectorFieldGrid}>
        <NumberField
          label="Shadow X"
          value={node.style.shadowX}
          min={-96}
          max={96}
          disabled={disabled}
          onCommit={(value) => onUpdateStyle({ shadowX: value })}
        />
        <NumberField
          label="Shadow Y"
          value={node.style.shadowY}
          min={-96}
          max={96}
          disabled={disabled}
          onCommit={(value) => onUpdateStyle({ shadowY: value })}
        />
        <NumberField
          label="Blur"
          value={node.style.shadowBlur}
          min={0}
          max={160}
          disabled={disabled}
          onCommit={(value) => onUpdateStyle({ shadowBlur: value })}
        />
        <NumberField
          label="Spread"
          value={node.style.shadowSpread}
          min={-96}
          max={96}
          disabled={disabled}
          onCommit={(value) => onUpdateStyle({ shadowSpread: value })}
        />
      </div>

      <label className={styles.inspectorField}>
        <span className={styles.inspectorFieldLabel}>Shadow color</span>
        <ColorPicker
          value={normalizeHex(node.style.shadowColor)}
          palette={palette}
          disabled={disabled}
          onChange={(hex) => onUpdateStyle({ shadowColor: hex })}
        />
      </label>
    </div>
  );
}
